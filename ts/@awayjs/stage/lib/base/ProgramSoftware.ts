import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {ByteArray}					from "@awayjs/core/lib/utils/ByteArray";

import {AGALTokenizer}				from "../aglsl/AGALTokenizer";
import {IProgram}						from "../base/IProgram";
import {ProgramVOSoftware}			from "../base/ProgramVOSoftware";
import {ContextSoftware}				from "../base/ContextSoftware";
import {Description}					from "../aglsl/Description";
import {Token}						from "../aglsl/Token";
import {Destination}					from "../aglsl/Destination";
import {VertexBufferSoftware}			from "../base/VertexBufferSoftware";
import {ContextGLVertexBufferFormat}	from "../base/ContextGLVertexBufferFormat";
import {TextureSoftware}				from "../base/TextureSoftware";
import {SoftwareSamplerState}			from "../base/SoftwareSamplerState";
import {ContextGLTextureFilter}		from "../base/ContextGLTextureFilter";
import {ContextGLMipFilter}			from "../base/ContextGLMipFilter";
import {ContextGLWrapMode}			from "../base/ContextGLWrapMode";

export class ProgramSoftware implements IProgram
{
	private static _defaultSamplerState:SoftwareSamplerState = new SoftwareSamplerState();
	private static _tokenizer:AGALTokenizer = new AGALTokenizer();
	private static _opCodeFunc:{(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void}[] = [
		ProgramSoftware.mov,
		ProgramSoftware.add,
		ProgramSoftware.sub,
		ProgramSoftware.mul,
		ProgramSoftware.div,
		ProgramSoftware.rcp,
		ProgramSoftware.min,
		ProgramSoftware.max,
		ProgramSoftware.frc,
		ProgramSoftware.sqt,
		ProgramSoftware.rsq,
		ProgramSoftware.pow,
		ProgramSoftware.log,
		ProgramSoftware.exp,
		ProgramSoftware.nrm,
		ProgramSoftware.sin,
		ProgramSoftware.cos,
		ProgramSoftware.crs,
		ProgramSoftware.dp3,
		ProgramSoftware.dp4,
		ProgramSoftware.abs,
		ProgramSoftware.neg,
		ProgramSoftware.sat,
		ProgramSoftware.m33,
		ProgramSoftware.m44,
		ProgramSoftware.m34,//25
		null,//26
		null,//27
		null,//28
		null,//29
		null,//30
		null,//31
		null,//32
		null,//33
		null,//34
		null,//35
		null,//36
		null,//37
		null,//38
		ProgramSoftware.kil,
		ProgramSoftware.tex,
		ProgramSoftware.sge,
		ProgramSoftware.slt,
		ProgramSoftware.sgn,
		ProgramSoftware.seq,
		ProgramSoftware.sne
	];

	private _vertexDescr:Description;
	private _vertexVO:ProgramVOSoftware;
	private _numVarying:number = 0;

	private _fragmentDescr:Description;
	private _fragmentVO:ProgramVOSoftware;

	public get numVarying():number
	{
		return this._numVarying;
	}

	public upload(vertexProgram:ByteArray, fragmentProgram:ByteArray):void
	{
		this._vertexDescr = ProgramSoftware._tokenizer.decribeAGALByteArray(vertexProgram);
		this._vertexVO = new ProgramVOSoftware();

		this._vertexVO.temp = new Float32Array(this._vertexDescr.regwrite[0x2].length*4);
		this._vertexVO.attributes = new Float32Array(this._vertexDescr.regread[0x0].length*4);
		this._numVarying = this._vertexDescr.regwrite[0x4].length;

		this._fragmentDescr = ProgramSoftware._tokenizer.decribeAGALByteArray(fragmentProgram);
		this._fragmentVO = new ProgramVOSoftware();
		
		this._fragmentVO.temp = new Float32Array(this._fragmentDescr.regwrite[0x2].length*4);
		this._fragmentVO.varying = new Float32Array(this._fragmentDescr.regread[0x4].length*4);
		this._fragmentVO.derivativeX = new Float32Array(this._fragmentVO.varying.length);
		this._fragmentVO.derivativeY = new Float32Array(this._fragmentVO.varying.length);
	}

	public dispose():void
	{
		this._vertexDescr = null;
		this._fragmentDescr = null;
	}

	public vertex(context:ContextSoftware, vertexIndex:number, position:Float32Array, varying:Float32Array):void
	{
		//set attributes
		var i:number;
		var j:number = 0;
		var numAttributes:number = this._vertexDescr.regread[0x0].length;
		var attributes:Float32Array = this._vertexVO.attributes;
		for (i = 0; i < numAttributes; i++) {
			var buffer:VertexBufferSoftware = context._vertexBuffers[i];

			if (!buffer)
				continue;

			var index:number = context._vertexBufferOffsets[i]/4 + vertexIndex*buffer.attributesPerVertex;
			if (context._vertexBufferFormats[i] == ContextGLVertexBufferFormat.UNSIGNED_BYTE_4) {
				attributes[j++] = buffer.uintData[index*4];
				attributes[j++] = buffer.uintData[index*4+1];
				attributes[j++] = buffer.uintData[index*4+2];
				attributes[j++] = buffer.uintData[index*4+3];
			} else if (context._vertexBufferFormats[i] == ContextGLVertexBufferFormat.FLOAT_4) {
				attributes[j++] = buffer.data[index];
				attributes[j++] = buffer.data[index + 1];
				attributes[j++] = buffer.data[index + 2];
				attributes[j++] = buffer.data[index + 3];
			} else if (context._vertexBufferFormats[i] == ContextGLVertexBufferFormat.FLOAT_3) {
				attributes[j++] = buffer.data[index];
				attributes[j++] = buffer.data[index + 1];
				attributes[j++] = buffer.data[index + 2];
				attributes[j++] = 1;
			} else if (context._vertexBufferFormats[i] == ContextGLVertexBufferFormat.FLOAT_2) {
				attributes[j++] = buffer.data[index];
				attributes[j++] = buffer.data[index + 1];
				attributes[j++] = 0;
				attributes[j++] = 1
			} else if (context._vertexBufferFormats[i] == ContextGLVertexBufferFormat.FLOAT_1) {
				attributes[j++] = buffer.data[index];
				attributes[j++] = 0;
				attributes[j++] = 0;
				attributes[j++] = 1;
			}
		}

		//clear temps
		var temp:Float32Array = this._vertexVO.temp;
		var numTemp:number = temp.length;
		for (var i:number = 0; i < numTemp; i+=4) {
			temp[i] = 0;
			temp[i + 1] = 0;
			temp[i + 2] = 0;
			temp[i + 3] = 1;
		}

		this._vertexVO.outputPosition = position;
		
		this._vertexVO.varying = varying;

		var len:number = this._vertexDescr.tokens.length;
		for (var i:number = 0; i < len; i++) {
			var token:Token = this._vertexDescr.tokens[i];
			ProgramSoftware._opCodeFunc[token.opcode](this._vertexVO, this._vertexDescr, token.dest, token.a, token.b, context);
		}
	}

	public fragment(context:ContextSoftware, clip:Vector3D, clipRight:Vector3D, clipBottom:Vector3D, varying0:Float32Array, varying1:Float32Array, varying2:Float32Array, fragDepth:number):ProgramVOSoftware
	{
		this._fragmentVO.outputDepth = fragDepth;

		//clear temps
		var temp:Float32Array = this._fragmentVO.temp;
		var numTemp:number = temp.length;
		for (var i:number = 0; i < numTemp; i+=4) {
			temp[i] = 0;
			temp[i + 1] = 0;
			temp[i + 2] = 0;
			temp[i + 3] = 1;
		}

		//check for requirement of derivatives
		var varyingDerivatives:number[] = [];
		var len:number = this._fragmentDescr.tokens.length;
		for (var i:number = 0; i < len; i++) {
			var token:Token = this._fragmentDescr.tokens[i];
			if (token.opcode == 0x28 && context._samplerStates[token.b.regnum] && context._samplerStates[token.b.regnum].mipfilter == ContextGLMipFilter.MIPLINEAR && context._textures[token.b.regnum].getMipLevelsCount() > 1)
				varyingDerivatives.push(token.a.regnum);
		}

		var derivativeX:Float32Array = this._fragmentVO.derivativeX;
		var derivativeY:Float32Array = this._fragmentVO.derivativeY;

		var varying:Float32Array = this._fragmentVO.varying;
		var numVarying:number = varying.length;
		for (var i:number = 0; i < numVarying; i+=4) {
			
			// if (!varying0 || !varying1 || !varying2) continue;
			
			varying[i] = clip.x*varying0[i] + clip.y*varying1[i] + clip.z*varying2[i];
			varying[i+1] = clip.x*varying0[i+1] + clip.y*varying1[i+1] + clip.z*varying2[i+1];
			varying[i+2] = clip.x*varying0[i+2] + clip.y*varying1[i+2] + clip.z*varying2[i+2];
			varying[i+3] = clip.x*varying0[i+3] + clip.y*varying1[i+3] + clip.z*varying2[i+3];

			if (varyingDerivatives.indexOf(i) == -1)
				continue;
			
			derivativeX[i] = clipRight.x*varying0[i] + clipRight.y*varying1[i] + clipRight.z*varying2[i];
			derivativeX[i+1] = clipRight.x*varying0[i+1] + clipRight.y*varying1[i+1] + clipRight.z*varying2[i+1];
			derivativeX[i+2] = clipRight.x*varying0[i+2] + clipRight.y*varying1[i+2] + clipRight.z*varying2[i+2];
			derivativeX[i+3] = clipRight.x*varying0[i+3] + clipRight.y*varying1[i+3] + clipRight.z*varying2[i+3];
			derivativeX[i] -= varying[i];
			derivativeX[i+1] -= varying[i+1];
			derivativeX[i+2] -= varying[i+2];
			derivativeX[i+3] -= varying[i+3];
			
			derivativeY[i] = clipBottom.x*varying0[i] + clipBottom.y*varying1[i] + clipBottom.z*varying2[i];
			derivativeY[i+1] = clipBottom.x*varying0[i+1] + clipBottom.y*varying1[i+1] + clipBottom.z*varying2[i+1];
			derivativeY[i+2] = clipBottom.x*varying0[i+2] + clipBottom.y*varying1[i+2] + clipBottom.z*varying2[i+2];
			derivativeY[i+3] = clipBottom.x*varying0[i+3] + clipBottom.y*varying1[i+3] + clipBottom.z*varying2[i+3];
			derivativeY[i] -= varying[i];
			derivativeY[i+1] -= varying[i+1];
			derivativeY[i+2] -= varying[i+2];
			derivativeY[i+3] -= varying[i+3];
		}

		for (var i:number = 0; i < len; i++) {
			var token:Token = this._fragmentDescr.tokens[i];
			ProgramSoftware._opCodeFunc[token.opcode](this._fragmentVO, this._fragmentDescr, token.dest, token.a, token.b, context);
		}

		return this._fragmentVO;
	}

	private static getDestTarget(vo:ProgramVOSoftware, desc:Description, dest:Destination):Float32Array
	{
		var target:Float32Array;

		if (dest.regtype == 0x2) {
			target = vo.temp;
		} else if (dest.regtype == 0x3) {

			if (desc.header.type == "vertex") {
				target = vo.outputPosition;
			} else {
				target = vo.outputColor;
			}
		} else if (dest.regtype == 0x4) {
			target = vo.varying;
		}
		
		return target;
	}

	private static getSourceTarget(vo:ProgramVOSoftware, desc:Description, dest:Destination, context:ContextSoftware):Float32Array
	{
		var target:Float32Array;

		if (dest.regtype == 0x0) {
			target = vo.attributes;
		} else if (dest.regtype == 0x1) {
			if (desc.header.type == "vertex") {
				target = context._vertexConstants;
			} else {
				target = context._fragmentConstants;
			}
		} else if (dest.regtype == 0x2) {
			target = vo.temp;
		} else if (dest.regtype == 0x4) {
			target = vo.varying;
		}

		return target;
	}

	public static mov(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		
		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1.swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1.swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1.swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1.swizzle >> 6) & 3)];
	}

	public static m44(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		
		var mask:number = dest.mask;
		
		if (mask & 1)
			target[targetReg] = source1Target[source1Reg]*source2Target[source2Reg] + source1Target[source1Reg + 1]*source2Target[source2Reg + 1] + source1Target[source1Reg + 2]*source2Target[source2Reg + 2] + source2Target[source2Reg + 3];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg]*source2Target[source2Reg + 4] + source1Target[source1Reg + 1]*source2Target[source2Reg + 5] + source1Target[source1Reg + 2]*source2Target[source2Reg + 6] + source2Target[source2Reg + 7];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg]*source2Target[source2Reg + 8] + source1Target[source1Reg + 1]*source2Target[source2Reg + 9] + source1Target[source1Reg + 2]*source2Target[source2Reg + 10] + source2Target[source2Reg + 11];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg]*source2Target[source2Reg + 12] + source1Target[source1Reg + 1]*source2Target[source2Reg + 13] + source1Target[source1Reg + 2]*source2Target[source2Reg + 14] + source2Target[source2Reg + 15];
	}

	private static sample(vo:ProgramVOSoftware, desc:Description, context:ContextSoftware, source1:Destination, textureIndex:number):Float32Array
	{
		var source1Reg:number = 4*source1.regnum;
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		
		var u:number = source1Target[((source1.swizzle >> 0) & 3)];
		var v:number = source1Target[((source1.swizzle >> 2) & 3)];
		
		if (textureIndex >= context._textures.length || context._textures[textureIndex] == null)
			return new Float32Array([1, u, v, 0]);

		var texture:TextureSoftware = context._textures[textureIndex];
		var state:SoftwareSamplerState = context._samplerStates[textureIndex] || this._defaultSamplerState;
		
		var repeat:boolean = state.wrap == ContextGLWrapMode.REPEAT;
		var mipmap:boolean = state.mipfilter == ContextGLMipFilter.MIPLINEAR;
		if (mipmap && texture.getMipLevelsCount() > 1) {
			var dux:number = Math.abs(vo.derivativeX[source1Reg + ((source1.swizzle >> 0) & 3)]);
			var dvx:number = Math.abs(vo.derivativeX[source1Reg + ((source1.swizzle >> 2) & 3)]);
			var duy:number = Math.abs(vo.derivativeY[source1Reg + ((source1.swizzle >> 0) & 3)]);
			var dvy:number = Math.abs(vo.derivativeY[source1Reg + ((source1.swizzle >> 2) & 3)]);

			var lambda:number = Math.log(Math.max(texture.width * Math.sqrt(dux * dux + dvx * dvx), texture.height * Math.sqrt(duy * duy + dvy * dvy))) / Math.LN2;
			if (lambda > 0) {

				var miplevelLow:number = Math.floor(lambda);
				var miplevelHigh:number = Math.ceil(lambda);

				var maxmiplevel:number = Math.log(Math.min(texture.width, texture.height)) / Math.LN2;

				if (miplevelHigh > maxmiplevel)
					miplevelHigh = maxmiplevel;

				if (miplevelLow > maxmiplevel)
					miplevelLow = maxmiplevel;

				var mipblend:number = lambda - Math.floor(lambda);

				var resultLow:Float32Array;
				var resultHigh:Float32Array;


				var dataLow:number[] = texture.getData(miplevelLow);
				var dataLowWidth:number = texture.width / Math.pow(2, miplevelLow);
				var dataLowHeight:number = texture.height / Math.pow(2, miplevelLow);
				var dataHigh:number[] = texture.getData(miplevelHigh);
				var dataHighWidth:number = texture.width / Math.pow(2, miplevelHigh);
				var dataHighHeight:number = texture.height / Math.pow(2, miplevelHigh);

				if (state.filter == ContextGLTextureFilter.LINEAR) {
					resultLow = ProgramSoftware.sampleBilinear(u, v, dataLow, dataLowWidth, dataLowHeight, repeat);
					resultHigh = ProgramSoftware.sampleBilinear(u, v, dataHigh, dataHighWidth, dataHighHeight, repeat);
				} else {
					resultLow = ProgramSoftware.sampleNearest(u, v, dataLow, dataLowWidth, dataLowHeight, repeat);
					resultHigh = ProgramSoftware.sampleNearest(u, v, dataHigh, dataHighWidth, dataHighHeight, repeat);
				}

				return ProgramSoftware.interpolateColor(resultLow, resultHigh, mipblend);
			}
		}

		var result:Float32Array;
		var data:number[] = texture.getData(0);
		if (state.filter == ContextGLTextureFilter.LINEAR) {
			result = ProgramSoftware.sampleBilinear(u, v, data, texture.width, texture.height, repeat);
		} else {
			result = ProgramSoftware.sampleNearest(u, v, data, texture.width, texture.height, repeat);
		}
		return result;
	}

	private static sampleNearest(u:number, v:number, textureData:number[], textureWidth:number, textureHeight:number, repeat:boolean):Float32Array
	{
		u *= textureWidth;
		v *= textureHeight;

		if (repeat) {
			u = Math.abs(u % textureWidth);
			v = Math.abs(v % textureHeight);
		} else {
			if (u < 0)
				u = 0;
			else if (u > textureWidth - 1)
				u = textureWidth - 1;

			if (v < 0)
				v = 0;
			else if (v > textureHeight - 1)
				v = textureHeight - 1;
		}

		u = Math.floor(u);
		v = Math.floor(v);

		var pos:number = (u + v*textureWidth)*4;
		var r:number = textureData[pos]/255;
		var g:number = textureData[pos + 1]/255;
		var b:number = textureData[pos + 2]/255;
		var a:number = textureData[pos + 3]/255;

		return new Float32Array([a, r, g, b]);
	}

	private static sampleBilinear(u:number, v:number, textureData:number[], textureWidth:number, textureHeight:number, repeat:boolean):Float32Array
	{
		var texelSizeX:number = 1/textureWidth;
		var texelSizeY:number = 1/textureHeight;
		u -= texelSizeX/2;
		v -= texelSizeY/2;

		var color00:Float32Array = ProgramSoftware.sampleNearest(u, v, textureData, textureWidth, textureHeight, repeat);
		var color10:Float32Array = ProgramSoftware.sampleNearest(u + texelSizeX, v, textureData, textureWidth, textureHeight, repeat);

		var color01:Float32Array = ProgramSoftware.sampleNearest(u, v + texelSizeY, textureData, textureWidth, textureHeight, repeat);
		var color11:Float32Array = ProgramSoftware.sampleNearest(u + texelSizeX, v + texelSizeY, textureData, textureWidth, textureHeight, repeat);

		var a:number = u*textureWidth;
		a = a - Math.floor(a);

		var interColor0:Float32Array = ProgramSoftware.interpolateColor(color00, color10, a);
		var interColor1:Float32Array = ProgramSoftware.interpolateColor(color01, color11, a);

		var b:number = v*textureHeight;
		b = b - Math.floor(b);
		return ProgramSoftware.interpolateColor(interColor0, interColor1, b);
	}


	private static interpolateColor(source:Float32Array, target:Float32Array, a:number):Float32Array
	{
		var result:Float32Array = new Float32Array(4);
		result[0] = source[0] + (target[0] - source[0])*a;
		result[1] = source[1] + (target[1] - source[1])*a;
		result[2] = source[2] + (target[2] - source[2])*a;
		result[3] = source[3] + (target[3] - source[3])*a;
		return result;
	}

	public static tex(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var color:Float32Array = ProgramSoftware.sample(vo, desc, context, source1, source2.regnum);

		var mask:number = dest.mask;
		
		if (mask & 1)
			target[targetReg] = color[1];

		if (mask & 2)
			target[targetReg + 1] = color[2];
		
		if (mask & 4)
			target[targetReg + 2] = color[3];

		if (mask & 8)
			target[targetReg + 3] = color[0];
	}

	public static add(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;
		
		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)] + source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)] + source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)] + source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)] + source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];
	}

	public static sub(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)] - source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)] - source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)] - source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)] - source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];
	}

	public static mul(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]*source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]*source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]*source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]*source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];
	}

	public static div(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		
		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]/source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]/source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]/source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]/source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];
	}

	public static rcp(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = 1/source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = 1/source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = 1/source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = 1/source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];
	}

	public static min(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		if (mask & 1)
			target[targetReg] = Math.min(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)], source2Target[source2Reg + ((source2Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.min(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)], source2Target[source2Reg + ((source2Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.min(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)], source2Target[source2Reg + ((source2Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.min(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)], source2Target[source2Reg + ((source2Swizzle >> 6) & 3)]);
	}

	public static max(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		if (mask & 1)
			target[targetReg] = Math.max(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)], source2Target[source2Reg + ((source2Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.max(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)], source2Target[source2Reg + ((source2Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.max(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)], source2Target[source2Reg + ((source2Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.max(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)], source2Target[source2Reg + ((source2Swizzle >> 6) & 3)]);
	}

	public static frc(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		
		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)] - Math.floor(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)] - Math.floor(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)] - Math.floor(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)] - Math.floor(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static sqt(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static rsq(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = 1/Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = 1/Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = 1/Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = 1/Math.sqrt(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static pow(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		if (mask & 1)
			target[targetReg] = Math.pow(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)], source2Target[source2Reg + ((source2Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.pow(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)], source2Target[source2Reg + ((source2Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.pow(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)], source2Target[source2Reg + ((source2Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.pow(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)], source2Target[source2Reg + ((source2Swizzle >> 6) & 3)]);
	}

	public static log(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		
		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = Math.log(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)])/Math.LN2;

		if (mask & 2)
			target[targetReg + 1] = Math.log(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)])/Math.LN2;

		if (mask & 4)
			target[targetReg + 2] = Math.log(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)])/Math.LN2;

		if (mask & 8)
			target[targetReg + 3] = Math.log(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)])/Math.LN2;
	}

	public static exp(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = Math.exp(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.exp(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.exp(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.exp(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static nrm(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		
		var x:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var y:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var z:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		var len:number = Math.sqrt(x*x + y*y + z*z);
		x /= len;
		y /= len;
		z /= len;

		if (mask & 1)
			target[targetReg] = x;

		if (mask & 2)
			target[targetReg + 1] = y;

		if (mask & 4)
			target[targetReg + 2] = z;
	}

	public static sin(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = Math.sin(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.sin(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.sin(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.sin(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static cos(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		
		if (mask & 1)
			target[targetReg] = Math.cos(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.cos(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.cos(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.cos(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static crs(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		
		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;
		
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetY*source2TargetZ - source1TargetZ*source2TargetY;

		if (mask & 2)
			target[targetReg + 1] = source1TargetZ*source2TargetX - source1TargetX*source2TargetZ;

		if (mask & 4)
			target[targetReg + 2] = source1TargetX*source2TargetY - source1TargetY*source2TargetX;
	}

	public static dp3(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ;

		if (mask & 2)
			target[targetReg + 1] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ;

		if (mask & 4)
			target[targetReg + 2] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ;

		if (mask & 8)
			target[targetReg + 3] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ;
	}

	public static dp4(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;
		
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];
		var source1TargetW:number = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];
		var source2TargetW:number = source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ + source1TargetW*source2TargetW;

		if (mask & 2)
			target[targetReg + 1] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ + source1TargetW*source2TargetW;

		if (mask & 4)
			target[targetReg + 2] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ + source1TargetW*source2TargetW;

		if (mask & 8)
			target[targetReg + 3] = source1TargetX*source2TargetX + source1TargetY*source2TargetY + source1TargetZ*source2TargetZ + source1TargetW*source2TargetW;
	}

	public static abs(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = Math.abs(source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]);

		if (mask & 2)
			target[targetReg + 1] = Math.abs(source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]);

		if (mask & 4)
			target[targetReg + 2] = Math.abs(source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]);

		if (mask & 8)
			target[targetReg + 3] = Math.abs(source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]);
	}

	public static neg(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = -source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = -source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = -source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = -source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];
	}

	public static sat(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = Math.max(0, Math.min(1, source1Target[source1Reg + ((source1Swizzle >> 0) & 3)]));

		if (mask & 2)
			target[targetReg + 1] = Math.max(0, Math.min(1, source1Target[source1Reg + ((source1Swizzle >> 2) & 3)]));

		if (mask & 4)
			target[targetReg + 2] = Math.max(0, Math.min(1, source1Target[source1Reg + ((source1Swizzle >> 4) & 3)]));

		if (mask & 8)
			target[targetReg + 3] = Math.max(0, Math.min(1, source1Target[source1Reg + ((source1Swizzle >> 6) & 3)]));
	}

	public static m33(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;

		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);

		var mask:number = dest.mask;

		if (mask & 1)
			target[targetReg] = source1Target[source1Reg]*source2Target[source2Reg] + source1Target[source1Reg + 1]*source2Target[source2Reg + 1] + source1Target[source1Reg + 2]*source2Target[source2Reg + 2];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg]*source2Target[source2Reg + 4] + source1Target[source1Reg + 1]*source2Target[source2Reg + 5] + source1Target[source1Reg + 2]*source2Target[source2Reg + 6];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg]*source2Target[source2Reg + 8] + source1Target[source1Reg + 1]*source2Target[source2Reg + 9] + source1Target[source1Reg + 2]*source2Target[source2Reg + 10];
	}

	public static m34(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source2.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		
		var mask:number = dest.mask;
		
		if (mask & 1)
			target[targetReg] = source1Target[source1Reg]*source2Target[source2Reg] + source1Target[source1Reg + 1]*source2Target[source2Reg + 1] + source1Target[source1Reg + 2]*source2Target[source2Reg + 2] + source2Target[source2Reg + 3];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg]*source2Target[source2Reg + 4] + source1Target[source1Reg + 1]*source2Target[source2Reg + 5] + source1Target[source1Reg + 2]*source2Target[source2Reg + 6] + source2Target[source2Reg + 7];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg]*source2Target[source2Reg + 8] + source1Target[source1Reg + 1]*source2Target[source2Reg + 9] + source1Target[source1Reg + 2]*source2Target[source2Reg + 10] + source2Target[source2Reg + 11];
	}

	public static ddx(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = vo.derivativeX;

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		
		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];
	}

	public static ddy(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;

		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		var source1Target:Float32Array = vo.derivativeY;

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		if (mask & 1)
			target[targetReg] = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];

		if (mask & 2)
			target[targetReg + 1] = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];

		if (mask & 4)
			target[targetReg + 2] = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];

		if (mask & 8)
			target[targetReg + 3] = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];
	}

	public static sge(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;
		
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];
		var source1TargetW:number = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];
		var source2TargetW:number = source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetX >= source2TargetX ? 1 : 0;

		if (mask & 2)
			target[targetReg + 1] = source1TargetY >= source2TargetY ? 1 : 0;

		if (mask & 4)
			target[targetReg + 2] = source1TargetZ >= source2TargetZ ? 1 : 0;

		if (mask & 8)
			target[targetReg + 3] = source1TargetW >= source2TargetW ? 1 : 0;
	}

	public static slt(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;
		
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];
		var source1TargetW:number = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];
		var source2TargetW:number = source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetX < source2TargetX ? 1 : 0;

		if (mask & 2)
			target[targetReg + 1] = source1TargetY < source2TargetY ? 1 : 0;

		if (mask & 4)
			target[targetReg + 2] = source1TargetZ < source2TargetZ ? 1 : 0;

		if (mask & 8)
			target[targetReg + 3] = source1TargetW < source2TargetW ? 1 : 0;
	}

	public static seq(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];
		var source1TargetW:number = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];
		var source2TargetW:number = source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetX == source2TargetX ? 1 : 0;

		if (mask & 2)
			target[targetReg + 1] = source1TargetY == source2TargetY ? 1 : 0;

		if (mask & 4)
			target[targetReg + 2] = source1TargetZ == source2TargetZ ? 1 : 0;

		if (mask & 8)
			target[targetReg + 3] = source1TargetW == source2TargetW ? 1 : 0;
	}

	public static sne(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		var source2Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);

		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;
		var source2Swizzle:number = source2.swizzle;

		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];
		var source1TargetW:number = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];

		var source2Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source2, context);
		var source2TargetX:number = source2Target[source2Reg + ((source2Swizzle >> 0) & 3)];
		var source2TargetY:number = source2Target[source2Reg + ((source2Swizzle >> 2) & 3)];
		var source2TargetZ:number = source2Target[source2Reg + ((source2Swizzle >> 4) & 3)];
		var source2TargetW:number = source2Target[source2Reg + ((source2Swizzle >> 6) & 3)];

		if (mask & 1)
			target[targetReg] = source1TargetX != source2TargetX ? 1 : 0;

		if (mask & 2)
			target[targetReg + 1] = source1TargetY != source2TargetY ? 1 : 0;

		if (mask & 4)
			target[targetReg + 2] = source1TargetZ != source2TargetZ ? 1 : 0;

		if (mask & 8)
			target[targetReg + 3] = source1TargetW != source2TargetW ? 1 : 0;
	}

	public static sgn(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var targetReg:number = 4*dest.regnum;
		var source1Reg:number = 4*source1.regnum;
		
		var target:Float32Array = ProgramSoftware.getDestTarget(vo, desc, dest);
		
		var mask:number = dest.mask;
		var source1Swizzle:number = source1.swizzle;

		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];
		var source1TargetY:number = source1Target[source1Reg + ((source1Swizzle >> 2) & 3)];
		var source1TargetZ:number = source1Target[source1Reg + ((source1Swizzle >> 4) & 3)];
		var source1TargetW:number = source1Target[source1Reg + ((source1Swizzle >> 6) & 3)];

		if (mask & 1)
			target[targetReg] = (source1TargetX < 0)? -1 : (source1TargetX > 0)? 1 : 0;

		if (mask & 2)
			target[targetReg + 1] = (source1TargetY < 0)? -1 : (source1TargetY > 0)? 1 : 0;

		if (mask & 4)
			target[targetReg + 2] = (source1TargetZ < 0)? -1 : (source1TargetZ > 0)? 1 : 0;

		if (mask & 8)
			target[targetReg + 3] = (source1TargetW < 0)? -1 : (source1TargetW > 0)? 1 : 0;
	}

	public static kil(vo:ProgramVOSoftware, desc:Description, dest:Destination, source1:Destination, source2:Destination, context:ContextSoftware):void
	{
		var source1Reg:number = 4*source1.regnum;
		var source1Swizzle:number = source1.swizzle;
		
		var source1Target:Float32Array = ProgramSoftware.getSourceTarget(vo, desc, source1, context);
		var source1TargetX:number = source1Target[source1Reg + ((source1Swizzle >> 0) & 3)];

		if(source1TargetX < 0)
			vo.discard = true;
	}
}
