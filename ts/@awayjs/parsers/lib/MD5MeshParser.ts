import {AttributesBuffer}					from "@awayjs/core/lib/attributes/AttributesBuffer";
import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";
import {Quaternion}						from "@awayjs/core/lib/geom/Quaternion";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";
import {URLLoaderDataFormat}				from "@awayjs/core/lib/net/URLLoaderDataFormat";
import {ParserBase}						from "@awayjs/core/lib/parsers/ParserBase";

import {Graphics}							from "@awayjs/display/lib/graphics/Graphics";
import {TriangleElements}					from "@awayjs/display/lib/graphics/TriangleElements";
import {DisplayObjectContainer}			from "@awayjs/display/lib/display/DisplayObjectContainer";
import {Sprite}							from "@awayjs/display/lib/display/Sprite";

import {SkeletonAnimationSet}				from "@awayjs/renderer/lib/animators/SkeletonAnimationSet";
import {Skeleton}							from "@awayjs/renderer/lib/animators/data/Skeleton";
import {SkeletonJoint}					from "@awayjs/renderer/lib/animators/data/SkeletonJoint";

// todo: create animation system, parse skeleton

/**
 * MD5MeshParser provides a parser for the md5mesh data type, providing the graphics of the md5 format.
 *
 * todo: optimize
 */
export class MD5MeshParser extends ParserBase
{
	private _textData:string;
	private _startedParsing:boolean;
	public static VERSION_TOKEN:string = "MD5Version";
	public static COMMAND_LINE_TOKEN:string = "commandline";
	public static NUM_JOINTS_TOKEN:string = "numJoints";
	public static NUM_MESHES_TOKEN:string = "numMeshes";
	public static COMMENT_TOKEN:string = "//";
	public static JOINTS_TOKEN:string = "joints";
	public static MESH_TOKEN:string = "mesh";

	public static MESH_SHADER_TOKEN:string = "shader";
	public static MESH_NUM_VERTS_TOKEN:string = "numverts";
	public static MESH_VERT_TOKEN:string = "vert";
	public static MESH_NUM_TRIS_TOKEN:string = "numtris";
	public static MESH_TRI_TOKEN:string = "tri";
	public static MESH_NUM_WEIGHTS_TOKEN:string = "numweights";
	public static MESH_WEIGHT_TOKEN:string = "weight";

	private _parseIndex:number /*int*/ = 0;
	private _reachedEOF:boolean;
	private _line:number /*int*/ = 0;
	private _charLineIndex:number /*int*/ = 0;
	private _version:number /*int*/;
	private _numJoints:number /*int*/;
	private _numMeshes:number /*int*/;

	private _sprite:Sprite;
	private _shaders:Array<string>;

	private _maxJointCount:number /*int*/;
	private _elementsData:Array<ElementsData>;
	private _bindPoses:Array<Matrix3D>;
	private _graphics:Graphics;

	private _skeleton:Skeleton;
	private _animationSet:SkeletonAnimationSet;

	private _rotationQuat:Quaternion;

	/**
	 * Creates a new MD5MeshParser object.
	 */
	constructor(additionalRotationAxis:Vector3D = null, additionalRotationRadians:number = 0)
	{
		super(URLLoaderDataFormat.TEXT);
		this._rotationQuat = new Quaternion();

		this._rotationQuat.fromAxisAngle(Vector3D.X_AXIS, -Math.PI*.5);

		if (additionalRotationAxis) {
			var quat:Quaternion = new Quaternion();
			quat.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
			this._rotationQuat.multiply(this._rotationQuat, quat);
		}
	}

	/**
	 * Indicates whether or not a given file extension is supported by the parser.
	 * @param extension The file extension of a potential file to be parsed.
	 * @return Whether or not the given file type is supported.
	 */
	public static supportsType(extension:string):boolean
	{
		extension = extension.toLowerCase();
		return extension == "md5sprite";
	}

	/**
	 * Tests whether a data block can be parsed by the parser.
	 * @param data The data block to potentially be parsed.
	 * @return Whether or not the given data is supported.
	 */
	public static supportsData(data:any):boolean
	{
		return false;
	}

	/**
	 * @inheritDoc
	 */
	public _pProceedParsing():boolean
	{
		var token:string;

		if (!this._startedParsing) {
			this._textData = this._pGetTextData();
			this._startedParsing = true;
		}

		while (this._pHasTime()) {
			token = this.getNextToken();
			switch (token) {
				case MD5MeshParser.COMMENT_TOKEN:
					this.ignoreLine();
					break;
				case MD5MeshParser.VERSION_TOKEN:
					this._version = this.getNextInt();
					if (this._version != 10)
						throw new Error("Unknown version number encountered!");
					break;
				case MD5MeshParser.COMMAND_LINE_TOKEN:
					this.parseCMD();
					break;
				case MD5MeshParser.NUM_JOINTS_TOKEN:
					this._numJoints = this.getNextInt();
					this._bindPoses = new Array<Matrix3D>(this._numJoints);
					break;
				case MD5MeshParser.NUM_MESHES_TOKEN:
					this._numMeshes = this.getNextInt();
					break;
				case MD5MeshParser.JOINTS_TOKEN:
					this.parseJoints();
					break;
				case MD5MeshParser.MESH_TOKEN:
					this.parseMesh();
					break;
				default:
					if (!this._reachedEOF)
						this.sendUnknownKeywordError();
			}

			if (this._reachedEOF) {
				this.calculateMaxJointCount();
				this._animationSet = new SkeletonAnimationSet(this._maxJointCount);

				this._sprite = new Sprite();
				this._graphics = this._sprite.graphics;

				for (var i:number /*int*/ = 0; i < this._elementsData.length; ++i)
					this._graphics.addGraphic(this.translateElements(this._elementsData[i].positionData, this._elementsData[i].weightData, this._elementsData[i].indices));

				//_graphics.animation = _animation;
				//					_sprite.animationController = _animationController;

				//add to the content property
				(<DisplayObjectContainer> this._pContent).addChild(this._sprite);

				this._pFinalizeAsset(this._graphics);
				this._pFinalizeAsset(this._sprite);
				this._pFinalizeAsset(this._skeleton);
				this._pFinalizeAsset(this._animationSet);
				return ParserBase.PARSING_DONE;
			}
		}
		return ParserBase.MORE_TO_PARSE;
	}

	public _pStartParsing(frameLimit:number):void
	{
		//create a content object for Loaders
		this._pContent = new DisplayObjectContainer();

		super._pStartParsing(frameLimit);
	}

	private calculateMaxJointCount():void
	{
		this._maxJointCount = 0;

		var numElementsData:number /*int*/ = this._elementsData.length;
		for (var i:number /*int*/ = 0; i < numElementsData; ++i) {
			var elementsData:ElementsData = this._elementsData[i];
			var positionData:Array<PositionData> = elementsData.positionData;
			var numVerts:number /*int*/ = positionData.length;

			for (var j:number /*int*/ = 0; j < numVerts; ++j) {
				var zeroWeights:number /*int*/ = this.countZeroWeightJoints(positionData[j], elementsData.weightData);
				var totalJoints:number /*int*/ = positionData[j].countWeight - zeroWeights;
				if (totalJoints > this._maxJointCount)
					this._maxJointCount = totalJoints;
			}
		}
	}

	private countZeroWeightJoints(position:PositionData, weights:Array<JointData>):number /*int*/
	{
		var start:number /*int*/ = position.startWeight;
		var end:number /*int*/ = position.startWeight + position.countWeight;
		var count:number /*int*/ = 0;
		var weight:number;

		for (var i:number /*int*/ = start; i < end; ++i) {
			weight = weights[i].bias;
			if (weight == 0)
				++count;
		}

		return count;
	}

	/**
	 * Parses the skeleton's joints.
	 */
	private parseJoints():void
	{
		var ch:string;
		var joint:SkeletonJoint;
		var pos:Vector3D;
		var quat:Quaternion;
		var i:number /*int*/ = 0;
		var token:string = this.getNextToken();

		if (token != "{")
			this.sendUnknownKeywordError();

		this._skeleton = new Skeleton();

		do {
			if (this._reachedEOF)
				this.sendEOFError();
			joint = new SkeletonJoint();
			joint.name = this.parseLiteralstring();
			joint.parentIndex = this.getNextInt();
			pos = this.parseVector3D();
			pos = this._rotationQuat.rotatePoint(pos);
			quat = this.parseQuaternion();

			// todo: check if this is correct, or maybe we want to actually store it as quats?
			this._bindPoses[i] = quat.toMatrix3D();
			this._bindPoses[i].appendTranslation(pos.x, pos.y, pos.z);
			var inv:Matrix3D = this._bindPoses[i].clone();
			inv.invert();
			joint.inverseBindPose = inv.rawData;

			this._skeleton.joints[i++] = joint;

			ch = this.getNextChar();

			if (ch == "/") {
				this.putBack();
				ch = this.getNextToken();
				if (ch == MD5MeshParser.COMMENT_TOKEN)
					this.ignoreLine();
				ch = this.getNextChar();

			}

			if (ch != "}")
				this.putBack();
		} while (ch != "}");
	}

	/**
	 * Puts back the last read character into the data stream.
	 */
	private putBack():void
	{
		this._parseIndex--;
		this._charLineIndex--;
		this._reachedEOF = this._parseIndex >= this._textData.length;
	}

	/**
	 * Parses the mesh graphics.
	 */
	private parseMesh():void
	{
		var token:string = this.getNextToken();
		var ch:string;
		var positionData:Array<PositionData>;
		var weights:Array<JointData>;
		var indices:Array<number> /*uint*/;

		if (token != "{")
			this.sendUnknownKeywordError();

		if (this._shaders == null)
			this._shaders = new Array<string>();

		while (ch != "}") {
			ch = this.getNextToken();
			switch (ch) {
				case MD5MeshParser.COMMENT_TOKEN:
					this.ignoreLine();
					break;
				case MD5MeshParser.MESH_SHADER_TOKEN:
					this._shaders.push(this.parseLiteralstring());
					break;
				case MD5MeshParser.MESH_NUM_VERTS_TOKEN:
					positionData = new Array<PositionData>(this.getNextInt());
					break;
				case MD5MeshParser.MESH_NUM_TRIS_TOKEN:
					indices = new Array<number>(this.getNextInt()*3) /*uint*/;
					break;
				case MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN:
					weights = new Array<JointData>(this.getNextInt());
					break;
				case MD5MeshParser.MESH_VERT_TOKEN:
					this.parseVertex(positionData);
					break;
				case MD5MeshParser.MESH_TRI_TOKEN:
					this.parseTri(indices);
					break;
				case MD5MeshParser.MESH_WEIGHT_TOKEN:
					this.parseJoint(weights);
					break;
			}
		}

		if (this._elementsData == null)
			this._elementsData = new Array<ElementsData>();

		var i:number /*uint*/ = this._elementsData.length;
		this._elementsData[i] = new ElementsData();
		this._elementsData[i].positionData = positionData;
		this._elementsData[i].weightData = weights;
		this._elementsData[i].indices = indices;
	}

	/**
	 * Converts the sprite data to a SkinnedSub instance.
	 * @param positionData The sprite's positions.
	 * @param weights The joint weights per position.
	 * @param indices The indices for the faces.
	 * @return A TriangleElements instance containing all elements data for the current sprite.
	 */
	private translateElements(positionData:Array<PositionData>, weights:Array<JointData>, indices:Array<number> /*uint*/):TriangleElements
	{
		var len:number /*int*/ = positionData.length;
		var v1:number /*int*/, v2:number /*int*/, v3:number /*int*/;
		var position:PositionData;
		var weight:JointData;
		var bindPose:Matrix3D;
		var pos:Vector3D;
		var elements:TriangleElements = new TriangleElements(new AttributesBuffer());
		var uvs:Array<number> = new Array<number>(len*2);
		var positions:Array<number> = new Array<number>(len*3);
		var jointIndices:Array<number> = new Array<number>(len*this._maxJointCount);
		var jointWeights:Array<number> = new Array<number>(len*this._maxJointCount);
		var l:number /*int*/ = 0;
		var nonZeroWeights:number /*int*/;

		for (var i:number /*int*/ = 0; i < len; ++i) {
			position = positionData[i];
			v1 = position.index*3;
			v2 = v1 + 1;
			v3 = v1 + 2;
			positions[v1] = positions[v2] = positions[v3] = 0;

			nonZeroWeights = 0;
			for (var j:number /*int*/ = 0; j < position.countWeight; ++j) {
				weight = weights[position.startWeight + j];
				if (weight.bias > 0) {
					bindPose = this._bindPoses[weight.joint];
					pos = bindPose.transformVector(weight.pos);
					positions[v1] += pos.x*weight.bias;
					positions[v2] += pos.y*weight.bias;
					positions[v3] += pos.z*weight.bias;

					// indices need to be multiplied by 3 (amount of matrix registers)
					jointIndices[l] = weight.joint*3;
					jointWeights[l++] = weight.bias;
					++nonZeroWeights;
				}
			}

			for (j = nonZeroWeights; j < this._maxJointCount; ++j) {
				jointIndices[l] = 0;
				jointWeights[l++] = 0;
			}

			v1 = position.index << 1;
			uvs[v1++] = position.s;
			uvs[v1] = position.t;
		}

		elements.jointsPerVertex = this._maxJointCount;
		elements.setIndices(indices);
		elements.setPositions(positions);
		elements.setUVs(uvs);
		elements.setJointIndices(jointIndices);
		elements.setJointWeights(jointWeights);
		// cause explicit updates
		elements.setNormals(null);
		elements.setTangents(null);
		// turn auto updates off because they may be animated and set explicitly
		elements.autoDeriveTangents = false;
		elements.autoDeriveNormals = false;

		return elements;
	}

	/**
	 * Retrieve the next triplet of position indices that form a face.
	 * @param indices The index list in which to store the read data.
	 */
	private parseTri(indices:Array<number> /*uint*/):void
	{
		var index:number /*int*/ = this.getNextInt()*3;
		indices[index] = this.getNextInt();
		indices[index + 1] = this.getNextInt();
		indices[index + 2] = this.getNextInt();
	}

	/**
	 * Reads a new joint data set for a single joint.
	 * @param weights the target list to contain the weight data.
	 */
	private parseJoint(weights:Array<JointData>):void
	{
		var weight:JointData = new JointData();
		weight.index = this.getNextInt();
		weight.joint = this.getNextInt();
		weight.bias = this.getNextNumber();
		weight.pos = this.parseVector3D();
		weights[weight.index] = weight;
	}

	/**
	 * Reads the data for a single position.
	 * @param positionData The list to contain the position data.
	 */
	private parseVertex(positionData:Array<PositionData>):void
	{
		var position:PositionData = new PositionData();
		position.index = this.getNextInt();
		this.parseUV(position);
		position.startWeight = this.getNextInt();
		position.countWeight = this.getNextInt();
		//			if (position.countWeight > _maxJointCount) _maxJointCount = position.countWeight;
		positionData[position.index] = position;
	}

	/**
	 * Reads the next uv coordinate.
	 * @param positionData The positionData to contain the UV coordinates.
	 */
	private parseUV(positionData:PositionData):void
	{
		var ch:string = this.getNextToken();
		if (ch != "(")
			this.sendParseError("(");
		positionData.s = this.getNextNumber();
		positionData.t = this.getNextNumber();

		if (this.getNextToken() != ")")
			this.sendParseError(")");
	}

	/**
	 * Gets the next token in the data stream.
	 */
	private getNextToken():string
	{
		var ch:string;
		var token:string = "";

		while (!this._reachedEOF) {
			ch = this.getNextChar();
			if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
				if (token != MD5MeshParser.COMMENT_TOKEN)
					this.skipWhiteSpace();
				if (token != "")
					return token;
			} else
				token += ch;

			if (token == MD5MeshParser.COMMENT_TOKEN)
				return token;
		}

		return token;
	}

	/**
	 * Skips all whitespace in the data stream.
	 */
	private skipWhiteSpace():void
	{
		var ch:string;

		do
			ch = this.getNextChar(); while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

		this.putBack();
	}

	/**
	 * Skips to the next line.
	 */
	private ignoreLine():void
	{
		var ch:string;
		while (!this._reachedEOF && ch != "\n")
			ch = this.getNextChar();
	}

	/**
	 * Retrieves the next single character in the data stream.
	 */
	private getNextChar():string
	{
		var ch:string = this._textData.charAt(this._parseIndex++);

		if (ch == "\n") {
			++this._line;
			this._charLineIndex = 0;
		} else if (ch != "\r")
			++this._charLineIndex;

		if (this._parseIndex >= this._textData.length)
			this._reachedEOF = true;

		return ch;
	}

	/**
	 * Retrieves the next integer in the data stream.
	 */
	private getNextInt():number /*int*/
	{
		var i:number = parseInt(this.getNextToken());
		if (isNaN(i))
			this.sendParseError("int type");
		return i;
	}

	/**
	 * Retrieves the next floating point number in the data stream.
	 */
	private getNextNumber():number
	{
		var f:number = parseFloat(this.getNextToken());
		if (isNaN(f))
			this.sendParseError("float type");
		return f;
	}

	/**
	 * Retrieves the next 3d vector in the data stream.
	 */
	private parseVector3D():Vector3D
	{
		var vec:Vector3D = new Vector3D();
		var ch:string = this.getNextToken();

		if (ch != "(")
			this.sendParseError("(");
		vec.x = -this.getNextNumber();
		vec.y = this.getNextNumber();
		vec.z = this.getNextNumber();

		if (this.getNextToken() != ")")
			this.sendParseError(")");

		return vec;
	}

	/**
	 * Retrieves the next quaternion in the data stream.
	 */
	private parseQuaternion():Quaternion
	{
		var quat:Quaternion = new Quaternion();
		var ch:string = this.getNextToken();

		if (ch != "(")
			this.sendParseError("(");
		quat.x = this.getNextNumber();
		quat.y = -this.getNextNumber();
		quat.z = -this.getNextNumber();

		// quat supposed to be unit length
		var t:number = 1 - quat.x*quat.x - quat.y*quat.y - quat.z*quat.z;
		quat.w = t < 0? 0 : -Math.sqrt(t);

		if (this.getNextToken() != ")")
			this.sendParseError(")");

		var rotQuat:Quaternion = new Quaternion();
		rotQuat.multiply(this._rotationQuat, quat);
		return rotQuat;
	}

	/**
	 * Parses the command line data.
	 */
	private parseCMD():void
	{
		// just ignore the command line property
		this.parseLiteralstring();
	}

	/**
	 * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
	 * by double quotes.
	 */
	private parseLiteralstring():string
	{
		this.skipWhiteSpace();

		var ch:string = this.getNextChar();
		var str:string = "";

		if (ch != "\"")
			this.sendParseError("\"");

		do {
			if (this._reachedEOF)
				this.sendEOFError();
			ch = this.getNextChar();
			if (ch != "\"")
				str += ch;
		} while (ch != "\"");

		return str;
	}

	/**
	 * Throws an end-of-file error when a premature end of file was encountered.
	 */
	private sendEOFError():void
	{
		throw new Error("Unexpected end of file");
	}

	/**
	 * Throws an error when an unexpected token was encountered.
	 * @param expected The token type that was actually expected.
	 */
	private sendParseError(expected:string):void
	{
		throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
	}

	/**
	 * Throws an error when an unknown keyword was encountered.
	 */
	private sendUnknownKeywordError():void
	{
		throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
	}
}


export class PositionData
{
	public index:number /*int*/;
	public s:number;
	public t:number;
	public startWeight:number /*int*/;
	public countWeight:number /*int*/;
}

export class JointData
{
	public index:number /*int*/;
	public joint:number /*int*/;
	public bias:number;
	public pos:Vector3D;
}

export class ElementsData
{
	public positionData:Array<PositionData>;
	public weightData:Array<JointData>;
	public indices:Array<number> /*uint*/;
}