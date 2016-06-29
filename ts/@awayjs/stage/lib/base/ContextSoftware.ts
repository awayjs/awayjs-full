import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";
import {Point}						from "@awayjs/core/lib/geom/Point";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {ColorUtils}					from "@awayjs/core/lib/utils/ColorUtils";

import {ContextGLBlendFactor}			from "../base/ContextGLBlendFactor";
import {ContextGLClearMask}			from "../base/ContextGLClearMask";
import {ContextGLCompareMode}			from "../base/ContextGLCompareMode";
import {ContextGLProgramType}			from "../base/ContextGLProgramType";
import {ContextGLTriangleFace}		from "../base/ContextGLTriangleFace";
import {IContextGL}					from "../base/IContextGL";
import {IIndexBuffer}					from "../base/IIndexBuffer";
import {ICubeTexture}					from "../base/ICubeTexture";
import {ITextureBase}					from "../base/ITextureBase";
import {IndexBufferSoftware}			from "../base/IndexBufferSoftware";
import {VertexBufferSoftware}			from "../base/VertexBufferSoftware";
import {TextureSoftware}				from "../base/TextureSoftware";
import {ProgramSoftware}				from "../base/ProgramSoftware";
import {ProgramVOSoftware}			from "../base/ProgramVOSoftware";
import {SoftwareSamplerState}			from "../base/SoftwareSamplerState";

export class ContextSoftware implements IContextGL
{
	private _canvas:HTMLCanvasElement;

	public static MAX_SAMPLERS:number = 8;

	private _backBufferRect:Rectangle = new Rectangle();
	private _backBufferWidth:number = 100;
	private _backBufferHeight:number = 100;
	private _backBufferColor:BitmapImage2D;
	private _frontBuffer:BitmapImage2D;

	private _zbuffer:Float32Array;
	private _zbufferClear:Float32Array;
	private _colorClearUint8:Uint8ClampedArray;
	private _colorClearUint32:Uint32Array;
	private _cullingMode:string = ContextGLTriangleFace.BACK;
	private _blendSource:string = ContextGLBlendFactor.ONE;
	private _blendDestination:string = ContextGLBlendFactor.ZERO;
	private _colorMaskR:boolean = true;
	private _colorMaskG:boolean = true;
	private _colorMaskB:boolean = true;
	private _colorMaskA:boolean = true;
	private _writeDepth:boolean = true;
	private _depthCompareMode:string = ContextGLCompareMode.LESS;
	private _program:ProgramSoftware;

	private _screenMatrix:Matrix3D = new Matrix3D();
	private _frontBufferMatrix:Matrix = new Matrix();

	private _bboxMin:Point = new Point();
	private _bboxMax:Point = new Point();
	private _clamp:Point = new Point();

	public _samplerStates:SoftwareSamplerState[] = [];
	public _textures:Array<TextureSoftware> = [];
	public _vertexBuffers:Array<VertexBufferSoftware> = [];
	public _vertexBufferOffsets:Array<number> = [];
	public _vertexBufferFormats:Array<number> = [];

	public _fragmentConstants:Float32Array;
	public _vertexConstants:Float32Array;

	//public static _drawCallback:Function = null;

	private _antialias:number = 0;

	constructor(canvas:HTMLCanvasElement)
	{
		this._canvas = canvas;

		this._backBufferColor = new BitmapImage2D(this._backBufferWidth, this._backBufferHeight, false, 0, false);
		this._frontBuffer = new BitmapImage2D(this._backBufferWidth, this._backBufferHeight, true, 0, false);

		if (document && document.body) 
			document.body.appendChild(this._frontBuffer.getCanvas());
	}

	public get frontBuffer():BitmapImage2D
	{
		return this._frontBuffer;
	}

	public get container():HTMLElement
	{
		return this._canvas;
	}

	public clear(red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1, depth:number = 1, stencil:number = 0, mask:number = ContextGLClearMask.ALL):void
	{
		this._backBufferColor.lock();

		if (mask & ContextGLClearMask.COLOR) {
			this._colorClearUint32.fill(((alpha*0xFF << 24) | (red*0xFF << 16) | (green*0xFF << 8) | blue*0xFF));
			this._backBufferColor.setPixels(this._backBufferRect, this._colorClearUint8);
		}

		//TODO: mask & ContextGLClearMask.STENCIL

		if (mask & ContextGLClearMask.DEPTH)
			this._zbuffer.set(this._zbufferClear); //fast memcpy
	}

	public configureBackBuffer(width:number, height:number, antiAlias:number, enableDepthAndStencil:boolean):void
	{
		this._antialias = antiAlias;

		if (this._antialias % 2 != 0)
			this._antialias = Math.floor(this._antialias - 0.5);

		if (this._antialias == 0)
			this._antialias = 1;

		this._frontBuffer._setSize(width, height);

		this._backBufferWidth = width*this._antialias;
		this._backBufferHeight = height*this._antialias;

		//double buffer for fast clearing
		var len:number = this._backBufferWidth*this._backBufferHeight;
		var zbufferBytes:ArrayBuffer = new ArrayBuffer(len*8);
		this._zbuffer = new Float32Array(zbufferBytes, 0, len);
		this._zbufferClear = new Float32Array(zbufferBytes, len*4, len);
		for (var i:number = 0; i < len; i++)
			this._zbufferClear[i] = 10000000;

		var colorClearBuffer:ArrayBuffer = new ArrayBuffer(len*4);

		this._colorClearUint8 = new Uint8ClampedArray(colorClearBuffer);
		this._colorClearUint32 = new Uint32Array(colorClearBuffer);
		this._backBufferRect.width = this._backBufferWidth;
		this._backBufferRect.height = this._backBufferHeight;

		this._backBufferColor._setSize(this._backBufferWidth, this._backBufferHeight);

		var raw:Float32Array = this._screenMatrix.rawData;

		raw[0] = this._backBufferWidth /2;
		raw[1] = 0;
		raw[2] = 0;
		raw[3] = this._backBufferWidth/2;

		raw[4] = 0;
		raw[5] = -this._backBufferHeight/2;
		raw[6] = 0;
		raw[7] = this._backBufferHeight/2;

		raw[8] = 0;
		raw[9] = 0;
		raw[10] = 1;
		raw[11] = 0;

		raw[12] = 0;
		raw[13] = 0;
		raw[14] = 0;
		raw[15] = 0;

		this._screenMatrix.transpose();

		this._frontBufferMatrix = new Matrix();
		this._frontBufferMatrix.scale(1/this._antialias, 1/this._antialias);
	}

	public createCubeTexture(size:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number):ICubeTexture
	{
		//TODO: impl
		return undefined;
	}

	public createIndexBuffer(numIndices:number):IIndexBuffer {
		return new IndexBufferSoftware(numIndices);
	}

	public createProgram():ProgramSoftware {
		return new ProgramSoftware();
	}

	public createTexture(width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number):TextureSoftware
	{
		return new TextureSoftware(width, height);
	}

	public createVertexBuffer(numVertices:number, dataPerVertex:number):VertexBufferSoftware
	{
		return new VertexBufferSoftware(numVertices, dataPerVertex);
	}

	public dispose():void
	{
	}

	public setBlendFactors(sourceFactor:string, destinationFactor:string):void
	{
		this._blendSource = sourceFactor;
		this._blendDestination = destinationFactor;
	}

	public setColorMask(red:boolean, green:boolean, blue:boolean, alpha:boolean):void
	{
		this._colorMaskR = red;
		this._colorMaskG = green;
		this._colorMaskB = blue;
		this._colorMaskA = alpha;
	}

	public setStencilActions(triangleFace:string, compareMode:string, actionOnBothPass:string, actionOnDepthFail:string, actionOnDepthPassStencilFail:string, coordinateSystem:string):void
	{
		//TODO:
	}

	public setStencilReferenceValue(referenceValue:number, readMask:number, writeMask:number):void
	{
		//TODO:
	}

	public setCulling(triangleFaceToCull:string, coordinateSystem:string):void
	{
		//TODO: CoordinateSystem.RIGHT_HAND
		this._cullingMode = triangleFaceToCull;
	}

	public setDepthTest(depthMask:boolean, passCompareMode:string):void
	{
		this._writeDepth = depthMask;
		this._depthCompareMode = passCompareMode;
	}

	public setProgram(program:ProgramSoftware):void
	{
		this._program = program;
	}

	public setProgramConstantsFromArray(programType:number, data:Float32Array):void
	{
		var target:Float32Array;
		if (programType == ContextGLProgramType.VERTEX)
			target = this._vertexConstants = new Float32Array(data.length);
		else if (programType == ContextGLProgramType.FRAGMENT)
			target = this._fragmentConstants = new Float32Array(data.length);

		target.set(data);
	}

	public setTextureAt(sampler:number, texture:TextureSoftware):void
	{
		this._textures[sampler] = texture;
	}

	public setVertexBufferAt(index:number, buffer:VertexBufferSoftware, bufferOffset:number, format:number):void
	{
		this._vertexBuffers[index] = buffer;
		this._vertexBufferOffsets[index] = bufferOffset;
		this._vertexBufferFormats[index] = format;
	}

	public present():void
	{
		this._backBufferColor.unlock();

		this._frontBuffer.fillRect(this._frontBuffer.rect, ColorUtils.ARGBtoFloat32(0, 0, 0, 0));
		this._frontBuffer.draw(this._backBufferColor, this._frontBufferMatrix);
	}

	public drawToBitmapImage2D(destination:BitmapImage2D):void
	{
	}

	public drawIndices(mode:string, indexBuffer:IndexBufferSoftware, firstIndex:number, numIndices:number):void
	{
		if (!this._program)
			return;

		var position0:Float32Array = new Float32Array(4);
		var position1:Float32Array = new Float32Array(4);
		var position2:Float32Array = new Float32Array(4);
		
		var varying0:Float32Array = new Float32Array(this._program.numVarying*4);
		var varying1:Float32Array = new Float32Array(this._program.numVarying*4);
		var varying2:Float32Array = new Float32Array(this._program.numVarying*4);

		if (this._cullingMode == ContextGLTriangleFace.BACK) {
			for (var i:number = firstIndex; i < numIndices; i += 3) {
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i], position0, varying0);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 1], position1, varying1);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 2], position2, varying2);

				this._triangle(position0, position1, position2, varying0, varying1, varying2);
			}
		} else if (this._cullingMode == ContextGLTriangleFace.FRONT) {
			for (var i:number = firstIndex; i < numIndices; i += 3) {
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 2], position0, varying0);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 1], position1, varying1);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i], position2, varying2);

				this._triangle(position0, position1, position2, varying0, varying1, varying2);
			}
		} else if (this._cullingMode == ContextGLTriangleFace.FRONT_AND_BACK || this._cullingMode == ContextGLTriangleFace.NONE) {
			for (var i:number = firstIndex; i < numIndices; i += 3) {
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 2], position0, varying0);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 1], position1, varying1);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i], position2, varying2);

				this._triangle(position0, position1, position2, varying0, varying1, varying2);

				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i], position0, varying0);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 1], position1, varying1);
				this._program.vertex(this, indexBuffer.data[indexBuffer.startOffset + i + 2], position2, varying2);

				this._triangle(position0, position1, position2, varying0, varying1, varying2);
			}
		}
	}

	public drawVertices(mode:string, firstVertex:number, numVertices:number):void
	{
		//TODO:
	}

	public setScissorRectangle(rectangle:Rectangle):void
	{
		//TODO:
	}

	public setSamplerStateAt(sampler:number, wrap:string, filter:string, mipfilter:string):void
	{
		var state:SoftwareSamplerState = this._samplerStates[sampler];

		if (!state)
			state = this._samplerStates[sampler] = new SoftwareSamplerState();

		state.wrap = wrap;
		state.filter = filter;
		state.mipfilter = mipfilter;
	}

	public setRenderToTexture(target:ITextureBase, enableDepthAndStencil:boolean, antiAlias:number, surfaceSelector:number) 
	{
		//TODO:
	}

	public setRenderToBackBuffer():void
	{
		//TODO:
	}

	private _putPixel(x:number, y:number, source:Uint8ClampedArray, dest:Uint8ClampedArray):void
	{
		argb[0] = 0;
		argb[1] = 0;
		argb[2] = 0;
		argb[3] = 0;

		BlendModeSoftware[this._blendDestination](dest, dest, source);
		BlendModeSoftware[this._blendSource](source, dest, source);

		this._backBufferColor.setPixelData(x, y, argb);
	}

	public clamp(value:number, min:number = 0, max:number = 1):number
	{
		return Math.max(min, Math.min(value, max));
	}

	public interpolate(min:number, max:number, gradient:number):number
	{
		return min + (max - min)*this.clamp(gradient);
	}

	private _triangle(position0:Float32Array, position1:Float32Array, position2:Float32Array, varying0:Float32Array, varying1:Float32Array, varying2:Float32Array):void
	{
		var p0:Vector3D = new Vector3D(position0[0], position0[1], position0[2], position0[3]);
		if (!p0 || p0.w == 0 || isNaN(p0.w)) {
			console.error("wrong position: " + position0);
			return;
		}
		var p1:Vector3D = new Vector3D(position1[0], position1[1], position1[2], position1[3]);
		var p2:Vector3D = new Vector3D(position2[0], position2[1], position2[2], position2[3]);

		p0.z = p0.z * 2 - p0.w;
		p1.z = p1.z * 2 - p1.w;
		p2.z = p2.z * 2 - p2.w;

		p0.scaleBy(1 / p0.w);
		p1.scaleBy(1 / p1.w);
		p2.scaleBy(1 / p2.w);

		var project:Vector3D = new Vector3D(p0.w, p1.w, p2.w);
		p0 = this._screenMatrix.transformVector(p0);
		p1 = this._screenMatrix.transformVector(p1);
		p2 = this._screenMatrix.transformVector(p2);
		var depth:Vector3D = new Vector3D(p0.z, p1.z, p2.z);

		this._bboxMin.x = 1000000;
		this._bboxMin.y = 1000000;
		this._bboxMax.x = -1000000;
		this._bboxMax.y = -1000000;

		this._clamp.x = this._backBufferWidth - 1;
		this._clamp.y = this._backBufferHeight - 1;

		this._bboxMin.x = Math.max(0, Math.min(this._bboxMin.x, p0.x));
		this._bboxMin.y = Math.max(0, Math.min(this._bboxMin.y, p0.y));

		this._bboxMin.x = Math.max(0, Math.min(this._bboxMin.x, p1.x));
		this._bboxMin.y = Math.max(0, Math.min(this._bboxMin.y, p1.y));

		this._bboxMin.x = Math.max(0, Math.min(this._bboxMin.x, p2.x));
		this._bboxMin.y = Math.max(0, Math.min(this._bboxMin.y, p2.y));

		this._bboxMax.x = Math.min(this._clamp.x, Math.max(this._bboxMax.x, p0.x));
		this._bboxMax.y = Math.min(this._clamp.y, Math.max(this._bboxMax.y, p0.y));

		this._bboxMax.x = Math.min(this._clamp.x, Math.max(this._bboxMax.x, p1.x));
		this._bboxMax.y = Math.min(this._clamp.y, Math.max(this._bboxMax.y, p1.y));

		this._bboxMax.x = Math.min(this._clamp.x, Math.max(this._bboxMax.x, p2.x));
		this._bboxMax.y = Math.min(this._clamp.y, Math.max(this._bboxMax.y, p2.y));

		this._bboxMin.x = Math.floor(this._bboxMin.x);
		this._bboxMin.y = Math.floor(this._bboxMin.y);
		this._bboxMax.x = Math.floor(this._bboxMax.x);
		this._bboxMax.y = Math.floor(this._bboxMax.y);

		for (var x:number = this._bboxMin.x; x <= this._bboxMax.x; x++)
			for (var y:number = this._bboxMin.y; y <= this._bboxMax.y; y++) {
				
				var screen:Vector3D = this._barycentric(p0, p1, p2, x, y);
				if (screen.x < 0 || screen.y < 0 || screen.z < 0)
					continue;

				var screenRight:Vector3D = this._barycentric(p0, p1, p2, x + 1, y);
				var screenBottom:Vector3D = this._barycentric(p0, p1, p2, x, y + 1);

				var clip:Vector3D = new Vector3D(screen.x/project.x, screen.y/project.y, screen.z/project.z);
				clip.scaleBy(1/(clip.x + clip.y + clip.z));

				var clipRight:Vector3D = new Vector3D(screenRight.x/project.x, screenRight.y/project.y, screenRight.z/project.z);
				clipRight.scaleBy(1/(clipRight.x + clipRight.y + clipRight.z));

				var clipBottom:Vector3D = new Vector3D(screenBottom.x/project.x, screenBottom.y/project.y, screenBottom.z/project.z);
				clipBottom.scaleBy(1/(clipBottom.x + clipBottom.y + clipBottom.z));

				var index:number = (x % this._backBufferWidth) + y*this._backBufferWidth;

				var fragDepth:number = depth.x*screen.x + depth.y*screen.y + depth.z*screen.z;
				
				if (!DepthCompareModeSoftware[this._depthCompareMode](fragDepth, this._zbuffer[index]))
					continue;

				var fragmentVO:ProgramVOSoftware = this._program.fragment(this, clip, clipRight, clipBottom, varying0, varying1, varying2, fragDepth);

				if (fragmentVO.discard)
					continue;

				if (this._writeDepth)
					this._zbuffer[index] = fragDepth;//todo: fragmentVO.outputDepth?

				//set source
				source[0] = fragmentVO.outputColor[0]*255;
				source[1] = fragmentVO.outputColor[1]*255;
				source[2] = fragmentVO.outputColor[2]*255;
				source[3] = fragmentVO.outputColor[3]*255;

				//set dest
				this._backBufferColor.getPixelData(x, y, dest);
				
				this._putPixel(x, y, source, dest);
			}
	}

	private _sx:Vector3D = new Vector3D();
	private _sy:Vector3D = new Vector3D();
	private _u:Vector3D = new Vector3D();
	
	private _barycentric(a:Vector3D, b:Vector3D, c:Vector3D, x:number, y:number):Vector3D
	{
		this._sx.x = c.x - a.x;
		this._sx.y = b.x - a.x;
		this._sx.z = a.x - x;
		
		this._sy.x = c.y - a.y;
		this._sy.y = b.y - a.y;
		this._sy.z = a.y - y;

		this._u = this._sx.crossProduct(this._sy, this._u);
		
		if (this._u.z < 0.01)
			return new Vector3D(1 - (this._u.x + this._u.y)/this._u.z, this._u.y/this._u.z, this._u.x/this._u.z);
		
		return new Vector3D(-1, 1, 1);
	}
}

export class BlendModeSoftware
{
	public static destinationAlpha(result:Uint8ClampedArray, dest:Uint8ClampedArray, source:Uint8ClampedArray):void
	{
		argb[0] += result[0]*dest[0]/0xFF;
		argb[1] += result[1]*dest[0]/0xFF;
		argb[2] += result[2]*dest[0]/0xFF;
		argb[3] += result[3]*dest[0]/0xFF;
	}


	public static destinationColor(result:Uint8ClampedArray, dest:Uint8ClampedArray, source:Uint8ClampedArray):void
	{
		argb[0] += result[0]*dest[0]/0xFF;
		argb[1] += result[1]*dest[1]/0xFF;
		argb[2] += result[2]*dest[2]/0xFF;
		argb[3] += result[3]*dest[3]/0xFF;
	}

	public static zero(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
	}

	public static one(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0];
		argb[1] += result[1];
		argb[2] += result[2];
		argb[3] += result[3];
	}

	public static oneMinusDestinationAlpha(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0]*(1 - dest[0]/0xFF);
		argb[1] += result[1]*(1 - dest[0]/0xFF);
		argb[2] += result[2]*(1 - dest[0]/0xFF);
		argb[3] += result[3]*(1 - dest[0]/0xFF);
	}

	public static oneMinusDestinationColor(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0]*(1 - dest[0]/0xFF);
		argb[1] += result[1]*(1 - dest[1]/0xFF);
		argb[2] += result[2]*(1 - dest[2]/0xFF);
		argb[3] += result[3]*(1 - dest[3]/0xFF);
	}

	public static oneMinusSourceAlpha(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0]*(1 - source[0]/0xFF);
		argb[1] += result[1]*(1 - source[0]/0xFF);
		argb[2] += result[2]*(1 - source[0]/0xFF);
		argb[3] += result[3]*(1 - source[0]/0xFF);
	}

	public static oneMinusSourceColor(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0]*(1 - source[0]/0xFF);
		argb[1] += result[1]*(1 - source[1]/0xFF);
		argb[2] += result[2]*(1 - source[2]/0xFF);
		argb[3] += result[3]*(1 - source[3]/0xFF);
	}

	public static sourceAlpha(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0]*source[0]/0xFF;
		argb[1] += result[1]*source[0]/0xFF;
		argb[2] += result[2]*source[0]/0xFF;
		argb[3] += result[3]*source[0]/0xFF;
	}

	public static sourceColor(result: Uint8ClampedArray, dest: Uint8ClampedArray, source: Uint8ClampedArray):void
	{
		argb[0] += result[0]*source[0]/0xFF;
		argb[1] += result[1]*source[1]/0xFF;
		argb[2] += result[2]*source[2]/0xFF;
		argb[3] += result[3]*source[3]/0xFF;
	}
}


export class DepthCompareModeSoftware
{
	public static always(fragDepth:number, currentDepth:number):boolean
	{
		return true;
	}

	public static equal(fragDepth:number, currentDepth:number):boolean
	{
		return fragDepth == currentDepth;
	}

	public static greater(fragDepth:number, currentDepth:number):boolean
	{
		return fragDepth > currentDepth;
	}

	public static greaterEqual(fragDepth:number, currentDepth:number):boolean
	{
		return fragDepth >= currentDepth;
	}

	public static less(fragDepth:number, currentDepth:number):boolean
	{
		return fragDepth < currentDepth;
	}

	public static lessEqual(fragDepth:number, currentDepth:number):boolean
	{
		return fragDepth <= currentDepth;
	}

	public static never(fragDepth:number, currentDepth:number):boolean
	{
		return false;
	}

	public static notEqual(fragDepth:number, currentDepth:number):boolean
	{
		return fragDepth != currentDepth;
	}
}

var argb:Uint8ClampedArray = new Uint8ClampedArray(4);
var source:Uint8ClampedArray = new Uint8ClampedArray(4);
var dest:Uint8ClampedArray = new Uint8ClampedArray(4);
