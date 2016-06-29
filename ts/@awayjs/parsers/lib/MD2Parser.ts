import {AttributesBuffer}					from "@awayjs/core/lib/attributes/AttributesBuffer";
import {BitmapImage2D}					from "@awayjs/core/lib/image/BitmapImage2D";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";
import {URLLoaderDataFormat}				from "@awayjs/core/lib/net/URLLoaderDataFormat";
import {URLRequest}						from "@awayjs/core/lib/net/URLRequest";
import {ParserBase}						from "@awayjs/core/lib/parsers/ParserBase";
import {ParserUtils}						from "@awayjs/core/lib/parsers/ParserUtils";
import {ResourceDependency}				from "@awayjs/core/lib/parsers/ResourceDependency";
import {ByteArray}						from "@awayjs/core/lib/utils/ByteArray";

import {Graphics}							from "@awayjs/display/lib/graphics/Graphics";
import {TriangleElements}					from "@awayjs/display/lib/graphics/TriangleElements";
import {DisplayObjectContainer}			from "@awayjs/display/lib/display/DisplayObjectContainer";
import {DisplayObject}					from "@awayjs/display/lib/display/DisplayObject";
import {Camera}							from "@awayjs/display/lib/display/Camera";
import {Sprite}							from "@awayjs/display/lib/display/Sprite";
import {DefaultMaterialManager}			from "@awayjs/display/lib/managers/DefaultMaterialManager";
import {Single2DTexture}					from "@awayjs/display/lib/textures/Single2DTexture";

import {VertexClipNode}					from "@awayjs/renderer/lib/animators/nodes/VertexClipNode";
import {VertexAnimationSet}				from "@awayjs/renderer/lib/animators/VertexAnimationSet";

import {MethodMaterial}					from "@awayjs/materials/lib/MethodMaterial";
import {MethodMaterialMode}				from "@awayjs/materials/lib/MethodMaterialMode";

/**
 * MD2Parser provides a parser for the MD2 data type.
 */
export class MD2Parser extends ParserBase
{
	public static FPS:number /*int*/ = 6;

	private _clipNodes:Object = new Object();
	private _byteData:ByteArray;
	private _startedParsing:boolean;
	private _parsedHeader:boolean;
	private _parsedUV:boolean;
	private _parsedFaces:boolean;
	private _parsedFrames:boolean;

	private _ident:number /*uint*/;
	private _version:number /*uint*/;
	private _skinWidth:number /*uint*/;
	private _skinHeight:number /*uint*/;
	//private _frameSize : number /*uint*/;
	private _numSkins:number /*uint*/;
	private _numVertices:number /*uint*/;
	private _numST:number /*uint*/;
	private _numTris:number /*uint*/;
	//private _numGlCmds : number /*uint*/;
	private _numFrames:number /*uint*/;
	private _offsetSkins:number /*uint*/;
	private _offsetST:number /*uint*/;
	private _offsetTris:number /*uint*/;
	private _offsetFrames:number /*uint*/;
	//private _offsetGlCmds : number /*uint*/;
	private _offsetEnd:number /*uint*/;

	private _uvIndices:Array<number>;
	private _indices:Array<number> /*uint*/;
	private _vertIndices:Array<number>;

	// the current elements being built
	private _animationSet:VertexAnimationSet = new VertexAnimationSet();
	private _firstElements:TriangleElements;
	private _uvs:Array<number>;
	private _finalUV:Array<number>;

	private _materialNames:Array<string>;
	private _textureType:string;
	private _ignoreTexturePath:boolean;
	private _sprite:Sprite;
	private _graphics:Graphics;

	private materialFinal:boolean = false;
	private graphicsCreated:boolean = false;

	/**
	 * Creates a new MD2Parser object.
	 * @param textureType The extension of the texture (e.g. jpg/png/...)
	 * @param ignoreTexturePath If true, the path of the texture is ignored
	 */
	constructor(textureType:string = "jpg", ignoreTexturePath:boolean = true)
	{
		super(URLLoaderDataFormat.ARRAY_BUFFER);
		this._textureType = textureType;
		this._ignoreTexturePath = ignoreTexturePath;
	}

	/**
	 * Indicates whether or not a given file extension is supported by the parser.
	 * @param extension The file extension of a potential file to be parsed.
	 * @return Whether or not the given file type is supported.
	 */
	public static supportsType(extension:string):boolean
	{
		extension = extension.toLowerCase();
		return extension == "md2";
	}

	/**
	 * Tests whether a data block can be parsed by the parser.
	 * @param data The data block to potentially be parsed.
	 * @return Whether or not the given data is supported.
	 */
	public static supportsData(data:any):boolean
	{
		return (ParserUtils.toString(data, 4) == 'IDP2');
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependency(resourceDependency:ResourceDependency):void
	{
		if (resourceDependency.assets.length != 1)
			return;

		var material:MethodMaterial = new MethodMaterial(<BitmapImage2D> resourceDependency.assets[0]);

		if (this.materialMode >= 2)
			material.mode = MethodMaterialMode.MULTI_PASS;

		//add to the content property
		(<DisplayObjectContainer> this._pContent).addChild(this._sprite);

		material.name = this._sprite.material.name;
		this._sprite.material = material;
		this._pFinalizeAsset(material);
		this._pFinalizeAsset(this._sprite.graphics);
		this._pFinalizeAsset(this._sprite);

		this.materialFinal = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependencyFailure(resourceDependency:ResourceDependency):void
	{
		// apply system default
		if (this.materialMode < 2) {
			this._sprite.material = DefaultMaterialManager.getDefaultMaterial();
		} else {
			this._sprite.material = new MethodMaterial(DefaultMaterialManager.getDefaultImage2D());
			(<MethodMaterial> this._sprite.material).mode = MethodMaterialMode.MULTI_PASS;
		}

		//add to the content property
		(<DisplayObjectContainer> this._pContent).addChild(this._sprite);

		this._pFinalizeAsset(this._sprite.graphics);
		this._pFinalizeAsset(this._sprite);
		this.materialFinal = true;

	}

	/**
	 * @inheritDoc
	 */
	public _pProceedParsing():boolean
	{
		if (!this._startedParsing) {
			this._byteData = this._pGetByteData();
			this._startedParsing = true;

			// Reset bytearray read position (which may have been
			// moved forward by the supportsData() function.)
			this._byteData.position = 0;
		}

		while (this._pHasTime()) {
			if (!this._parsedHeader) {
				//----------------------------------------------------------------------------
				// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
				//----------------------------------------------------------------------------
				//this._byteData.endian = Endian.LITTLE_ENDIAN;

				// TODO: Create a sprite only when encountered (if it makes sense
				// for this file format) and return it using this._pFinalizeAsset()
				this._sprite = new Sprite();
				this._graphics = this._sprite.graphics;
				if (this.materialMode < 2) {
					this._sprite.material = DefaultMaterialManager.getDefaultMaterial();
				} else {
					this._sprite.material = new MethodMaterial(DefaultMaterialManager.getDefaultImage2D());
					(<MethodMaterial> this._sprite.material).mode = MethodMaterialMode.MULTI_PASS;
				}

				//_graphics.animation = new VertexAnimation(2, VertexAnimationMode.ABSOLUTE);
				//_animator = new VertexAnimator(VertexAnimationState(_sprite.animationState));

				// Parse header and decompress body
				this.parseHeader();
				this.parseMaterialNames();
			} else if (!this._parsedUV) {
				this.parseUV();
			} else if (!this._parsedFaces) {
				this.parseFaces();
			} else if (!this._parsedFrames) {
				this.parseFrames();
			} else if ((this.graphicsCreated) && (this.materialFinal)) {
				return ParserBase.PARSING_DONE;
			} else if (!this.graphicsCreated) {
				this.graphicsCreated = true;
				//create default subgraphics
				this._graphics.addGraphic(this._firstElements.clone());
				// Force name to be chosen by this._pFinalizeAsset()
				this._sprite.name = "";
				if (this.materialFinal) {
					//add to the content property
					(<DisplayObjectContainer> this._pContent).addChild(this._sprite);

					this._pFinalizeAsset(this._sprite.graphics);
					this._pFinalizeAsset(this._sprite);
				}

				this._pPauseAndRetrieveDependencies();
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

	/**
	 * Reads in all that MD2 Header data that is declared as private variables.
	 * I know its a lot, and it looks ugly, but only way to do it in Flash
	 */
	private parseHeader():void
	{
		this._ident = this._byteData.readInt();
		this._version = this._byteData.readInt();
		this._skinWidth = this._byteData.readInt();
		this._skinHeight = this._byteData.readInt();
		//skip this._frameSize
		this._byteData.readInt();
		this._numSkins = this._byteData.readInt();
		this._numVertices = this._byteData.readInt();
		this._numST = this._byteData.readInt();
		this._numTris = this._byteData.readInt();
		//skip this._numGlCmds
		this._byteData.readInt();
		this._numFrames = this._byteData.readInt();
		this._offsetSkins = this._byteData.readInt();
		this._offsetST = this._byteData.readInt();
		this._offsetTris = this._byteData.readInt();
		this._offsetFrames = this._byteData.readInt();
		//skip this._offsetGlCmds
		this._byteData.readInt();
		this._offsetEnd = this._byteData.readInt();

		this._parsedHeader = true;
	}

	/**
	 * Parses the file names for the materials.
	 */
	private parseMaterialNames():void
	{
		var url:string;
		var name:string;
		var extIndex:number /*int*/;
		var slashIndex:number /*int*/;
		this._materialNames = new Array<string>();
		this._byteData.position = this._offsetSkins;

		var regExp:RegExp = new RegExp("[^a-zA-Z0-9\\_\/.]", "g");
		for (var i:number /*uint*/ = 0; i < this._numSkins; ++i) {
			name = this._byteData.readUTFBytes(64);
			name = name.replace(regExp, "");
			extIndex = name.lastIndexOf(".");
			if (this._ignoreTexturePath)
				slashIndex = name.lastIndexOf("/");
			if (name.toLowerCase().indexOf(".jpg") == -1 && name.toLowerCase().indexOf(".png") == -1) {
				name = name.substring(slashIndex + 1, extIndex);
				url = name + "." + this._textureType;
			} else {
				url = name;
			}

			this._materialNames[i] = name;

			// only support 1 skin TODO: really?
			if (this.dependencies.length == 0)
				this._pAddDependency(name, new URLRequest(url));
		}

		if (this._materialNames.length > 0)
			this._sprite.material.name = this._materialNames[0];
		else
			this.materialFinal = true;
	}

	/**
	 * Parses the uv data for the sprite.
	 */
	private parseUV():void
	{
		var j:number /*uint*/ = 0;

		this._uvs = new Array<number>(this._numST*2);
		this._byteData.position = this._offsetST;
		for (var i:number /*uint*/ = 0; i < this._numST; i++) {
			this._uvs[j++] = this._byteData.readShort()/this._skinWidth;
			this._uvs[j++] = this._byteData.readShort()/this._skinHeight;
		}

		this._parsedUV = true;
	}

	/**
	 * Parses unique indices for the faces.
	 */
	private parseFaces():void
	{
		var a:number /*uint*/, b:number /*uint*/, c:number /*uint*/, ta:number /*uint*/, tb:number /*uint*/, tc:number /*uint*/;
		var i:number /*uint*/;

		this._vertIndices = new Array<number>();
		this._uvIndices = new Array<number>();
		this._indices = new Array<number>() /*uint*/;

		this._byteData.position = this._offsetTris;

		for (i = 0; i < this._numTris; i++) {
			//collect vertex indices
			a = this._byteData.readUnsignedShort();
			b = this._byteData.readUnsignedShort();
			c = this._byteData.readUnsignedShort();

			//collect uv indices
			ta = this._byteData.readUnsignedShort();
			tb = this._byteData.readUnsignedShort();
			tc = this._byteData.readUnsignedShort();

			this.addIndex(a, ta);
			this.addIndex(b, tb);
			this.addIndex(c, tc);
		}

		var len:number /*uint*/ = this._uvIndices.length;
		this._finalUV = new Array<number>(len*2);

		for (i = 0; i < len; ++i) {
			this._finalUV[i << 1] = this._uvs[this._uvIndices[i] << 1];
			this._finalUV[(i << 1) + 1] = this._uvs[(this._uvIndices[i] << 1) + 1];
		}

		this._parsedFaces = true;
	}

	/**
	 * Adds a face index to the list if it doesn't exist yet, based on vertexIndex and uvIndex, and adds the
	 * corresponding vertex and uv data in the correct location.
	 * @param vertexIndex The original index in the vertex list.
	 * @param uvIndex The original index in the uv list.
	 */
	private addIndex(vertexIndex:number /*uint*/, uvIndex:number /*uint*/):void
	{
		var index:number /*int*/ = this.findIndex(vertexIndex, uvIndex);

		if (index == -1) {
			this._indices.push(this._vertIndices.length);
			this._vertIndices.push(vertexIndex);
			this._uvIndices.push(uvIndex);
		} else
			this._indices.push(index);
	}

	/**
	 * Finds the final index corresponding to the original MD2's vertex and uv indices. Returns -1 if it wasn't added yet.
	 * @param vertexIndex The original index in the vertex list.
	 * @param uvIndex The original index in the uv list.
	 * @return The index of the final sprite corresponding to the original vertex and uv index. -1 if it doesn't exist yet.
	 */
	private findIndex(vertexIndex:number /*uint*/, uvIndex:number /*uint*/):number /*int*/
	{
		var len:number /*uint*/ = this._vertIndices.length;

		for (var i:number /*uint*/ = 0; i < len; ++i) {
			if (this._vertIndices[i] == vertexIndex && this._uvIndices[i] == uvIndex)
				return i;
		}

		return -1;
	}

	/**
	 * Parses all the frame elements.
	 */
	private parseFrames():void
	{
		var sx:number, sy:number, sz:number;
		var tx:number, ty:number, tz:number;
		var graphics:Graphics;
		var elements:TriangleElements;
		var vertLen:number /*uint*/ = this._vertIndices.length;
		var fvertices:Array<number>;
		var tvertices:Array<number>;
		var i:number /*uint*/, j:number /*int*/, k:number /*uint*/;
		//var ch : number /*uint*/;
		var name:string = "";
		var prevClip:VertexClipNode = null;

		this._byteData.position = this._offsetFrames;

		for (i = 0; i < this._numFrames; i++) {

			tvertices = new Array<number>();
			fvertices = new Array<number>(vertLen*3);

			sx = this._byteData.readFloat();
			sy = this._byteData.readFloat();
			sz = this._byteData.readFloat();

			tx = this._byteData.readFloat();
			ty = this._byteData.readFloat();
			tz = this._byteData.readFloat();

			name = this.readFrameName();

			// Note, the extra data.position++ in the for loop is there
			// to skip over a byte that holds the "vertex normal index"
			for (j = 0; j < this._numVertices; j++, this._byteData.position++)
				tvertices.push(sx*this._byteData.readUnsignedByte() + tx, sy*this._byteData.readUnsignedByte() + ty, sz*this._byteData.readUnsignedByte() + tz);

			k = 0;
			for (j = 0; j < vertLen; j++) {
				fvertices[k++] = tvertices[this._vertIndices[j]*3];
				fvertices[k++] = tvertices[this._vertIndices[j]*3 + 2];
				fvertices[k++] = tvertices[this._vertIndices[j]*3 + 1];
			}

			elements = new TriangleElements(new AttributesBuffer());

			if (this._firstElements == null)
				this._firstElements = elements;

			graphics = new Graphics();
			graphics.addGraphic(elements);

			elements.setIndices(this._indices);
			elements.setPositions(fvertices);
			elements.setUVs(this._finalUV);
			// cause explicit updates
			elements.setNormals(null);
			elements.setTangents(null);
			// turn auto updates off because they may be animated and set explicitly
			elements.autoDeriveNormals = false;
			elements.autoDeriveTangents = false;

			var clip:VertexClipNode = this._clipNodes[name];

			if (!clip) {
				// If another sequence was parsed before this one, starting
				// a new state means the previous one is complete and can
				// hence be finalized.
				if (prevClip) {
					this._pFinalizeAsset(prevClip);
					this._animationSet.addAnimation(prevClip);
				}

				clip = new VertexClipNode();
				clip.name = name;
				clip.stitchFinalFrame = true;

				this._clipNodes[name] = clip;

				prevClip = clip;
			}
			clip.addFrame(graphics, 1000/MD2Parser.FPS);
		}

		// Finalize the last state
		if (prevClip) {
			this._pFinalizeAsset(prevClip);
			this._animationSet.addAnimation(prevClip);
		}

		// Force this._pFinalizeAsset() to decide name
		this._pFinalizeAsset(this._animationSet);

		this._parsedFrames = true;
	}

	private readFrameName():string
	{
		var name:string = "";
		var k:number /*uint*/ = 0;
		for (var j:number /*uint*/ = 0; j < 16; j++) {
			var ch:number /*uint*/ = this._byteData.readUnsignedByte();

			if (Math.floor(ch) > 0x39 && Math.floor(ch) <= 0x7A && k == 0)
				name += String.fromCharCode(ch);

			if (Math.floor(ch) >= 0x30 && Math.floor(ch) <= 0x39)
				k++;
		}
		return name;
	}
}