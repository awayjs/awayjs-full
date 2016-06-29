import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {ByteArray}					from "@awayjs/core/lib/utils/ByteArray";

import {ContextGLBlendFactor}			from "../base/ContextGLBlendFactor";
import {ContextGLDrawMode}			from "../base/ContextGLDrawMode";
import {ContextGLClearMask}			from "../base/ContextGLClearMask";
import {ContextGLCompareMode}			from "../base/ContextGLCompareMode";
import {ContextGLMipFilter}			from "../base/ContextGLMipFilter";
import {ContextGLProgramType}			from "../base/ContextGLProgramType";
import {ContextGLStencilAction}		from "../base/ContextGLStencilAction";
import {ContextGLTextureFilter}		from "../base/ContextGLTextureFilter";
import {ContextGLTriangleFace}		from "../base/ContextGLTriangleFace";
import {ContextGLVertexBufferFormat}	from "../base/ContextGLVertexBufferFormat";
import {ContextGLWrapMode}			from "../base/ContextGLWrapMode";
import {CubeTextureWebGL}				from "../base/CubeTextureWebGL";
import {IContextGL}				    from "../base/IContextGL";
import {IndexBufferWebGL}				from "../base/IndexBufferWebGL";
import {ProgramWebGL}					from "../base/ProgramWebGL";
import {TextureBaseWebGL}				from "../base/TextureBaseWebGL";
import {TextureWebGL}					from "../base/TextureWebGL";
import {SamplerState}					from "../base/SamplerState";
import {VertexBufferWebGL}			from "../base/VertexBufferWebGL";

export class ContextWebGL implements IContextGL
{
	private _blendFactorDictionary:Object = new Object();
	private _drawModeDictionary:Object = new Object();
	private _compareModeDictionary:Object = new Object();
	private _stencilActionDictionary:Object = new Object();
	private _textureIndexDictionary:Array<number> = new Array<number>(8);
	private _textureTypeDictionary:Object = new Object();
	private _wrapDictionary:Object = new Object();
	private _filterDictionary:Object = new Object();
	private _mipmapFilterDictionary:Object = new Object();
	private _vertexBufferPropertiesDictionary:Array<VertexBufferProperties> = [];

	private _container:HTMLElement;
	private _width:number;
	private _height:number;
	private _drawing:boolean;
	private _blendEnabled:boolean;
	private _blendSourceFactor:number;
	private _blendDestinationFactor:number;

	private _standardDerivatives:boolean;

	private _samplerStates:Array<SamplerState> = new Array<SamplerState>(8);

	public static MAX_SAMPLERS:number = 8;

	//@protected
	public _gl:WebGLRenderingContext;

	//@protected
	public _currentProgram:ProgramWebGL;
	private _currentArrayBuffer:VertexBufferWebGL;
	private _activeTexture:number;

    private _stencilCompareMode:number;
    private _stencilCompareModeBack:number;
    private _stencilCompareModeFront:number;
    private _stencilReferenceValue : number = 0;
    private _stencilReadMask : number = 0xff;
    private _separateStencil : boolean = false;


	public get container():HTMLElement
	{
		return this._container;
	}
	public get standardDerivatives():boolean
	{
		return this._standardDerivatives;
	}
	constructor(canvas:HTMLCanvasElement)
	{
		this._container = canvas;

		try {
			this._gl = <WebGLRenderingContext> canvas.getContext("experimental-webgl", { premultipliedAlpha:false, alpha:false, stencil:true });

			if (!this._gl)
				this._gl = <WebGLRenderingContext> canvas.getContext("webgl", { premultipliedAlpha:false, alpha:false, stencil:true });
		} catch (e) {
			//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
		}

		if (this._gl) {
			//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );

			if(this._gl.getExtension("OES_standard_derivatives"))
			{
				this._standardDerivatives = true;
			}else{
				this._standardDerivatives = false;
			}

			//setup shortcut dictionaries
			this._blendFactorDictionary[ContextGLBlendFactor.ONE] = this._gl.ONE;
			this._blendFactorDictionary[ContextGLBlendFactor.DESTINATION_ALPHA] = this._gl.DST_ALPHA;
			this._blendFactorDictionary[ContextGLBlendFactor.DESTINATION_COLOR] = this._gl.DST_COLOR;
			this._blendFactorDictionary[ContextGLBlendFactor.ONE] = this._gl.ONE;
			this._blendFactorDictionary[ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA] = this._gl.ONE_MINUS_DST_ALPHA;
			this._blendFactorDictionary[ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR] = this._gl.ONE_MINUS_DST_COLOR;
			this._blendFactorDictionary[ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA] = this._gl.ONE_MINUS_SRC_ALPHA;
			this._blendFactorDictionary[ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR] = this._gl.ONE_MINUS_SRC_COLOR;
			this._blendFactorDictionary[ContextGLBlendFactor.SOURCE_ALPHA] = this._gl.SRC_ALPHA;
			this._blendFactorDictionary[ContextGLBlendFactor.SOURCE_COLOR] = this._gl.SRC_COLOR;
			this._blendFactorDictionary[ContextGLBlendFactor.ZERO] = this._gl.ZERO;

			this._drawModeDictionary[ContextGLDrawMode.LINES] = this._gl.LINES;
			this._drawModeDictionary[ContextGLDrawMode.TRIANGLES] = this._gl.TRIANGLES;

            this._compareModeDictionary[ContextGLCompareMode.ALWAYS] = this._gl.ALWAYS;
            this._compareModeDictionary[ContextGLCompareMode.EQUAL] = this._gl.EQUAL;
            this._compareModeDictionary[ContextGLCompareMode.GREATER] = this._gl.GREATER;
			this._compareModeDictionary[ContextGLCompareMode.GREATER_EQUAL] = this._gl.GEQUAL;
			this._compareModeDictionary[ContextGLCompareMode.LESS] = this._gl.LESS;
			this._compareModeDictionary[ContextGLCompareMode.LESS_EQUAL] = this._gl.LEQUAL;
			this._compareModeDictionary[ContextGLCompareMode.NEVER] = this._gl.NEVER;
			this._compareModeDictionary[ContextGLCompareMode.NOT_EQUAL] = this._gl.NOTEQUAL;

            this._stencilActionDictionary[ContextGLStencilAction.DECREMENT_SATURATE] = this._gl.DECR;
            this._stencilActionDictionary[ContextGLStencilAction.DECREMENT_WRAP] = this._gl.DECR_WRAP;
            this._stencilActionDictionary[ContextGLStencilAction.INCREMENT_SATURATE] = this._gl.INCR;
            this._stencilActionDictionary[ContextGLStencilAction.INCREMENT_WRAP] = this._gl.INCR_WRAP;
            this._stencilActionDictionary[ContextGLStencilAction.INVERT] = this._gl.INVERT;
            this._stencilActionDictionary[ContextGLStencilAction.KEEP] = this._gl.KEEP;
            this._stencilActionDictionary[ContextGLStencilAction.SET] = this._gl.REPLACE;
            this._stencilActionDictionary[ContextGLStencilAction.ZERO] = this._gl.ZERO;

			this._textureIndexDictionary[0] = this._gl.TEXTURE0;
			this._textureIndexDictionary[1] = this._gl.TEXTURE1;
			this._textureIndexDictionary[2] = this._gl.TEXTURE2;
			this._textureIndexDictionary[3] = this._gl.TEXTURE3;
			this._textureIndexDictionary[4] = this._gl.TEXTURE4;
			this._textureIndexDictionary[5] = this._gl.TEXTURE5;
			this._textureIndexDictionary[6] = this._gl.TEXTURE6;
			this._textureIndexDictionary[7] = this._gl.TEXTURE7;

			this._textureTypeDictionary["texture2d"] = this._gl.TEXTURE_2D;
			this._textureTypeDictionary["textureCube"] = this._gl.TEXTURE_CUBE_MAP;

			this._wrapDictionary[ContextGLWrapMode.REPEAT] = this._gl.REPEAT;
			this._wrapDictionary[ContextGLWrapMode.CLAMP] = this._gl.CLAMP_TO_EDGE;

			this._filterDictionary[ContextGLTextureFilter.LINEAR] = this._gl.LINEAR;
			this._filterDictionary[ContextGLTextureFilter.NEAREST] = this._gl.NEAREST;

			this._mipmapFilterDictionary[ContextGLTextureFilter.LINEAR] = new Object();
			this._mipmapFilterDictionary[ContextGLTextureFilter.LINEAR][ContextGLMipFilter.MIPNEAREST] = this._gl.LINEAR_MIPMAP_NEAREST;
			this._mipmapFilterDictionary[ContextGLTextureFilter.LINEAR][ContextGLMipFilter.MIPLINEAR] = this._gl.LINEAR_MIPMAP_LINEAR;
			this._mipmapFilterDictionary[ContextGLTextureFilter.LINEAR][ContextGLMipFilter.MIPNONE] = this._gl.LINEAR;
			this._mipmapFilterDictionary[ContextGLTextureFilter.NEAREST] = new Object();
			this._mipmapFilterDictionary[ContextGLTextureFilter.NEAREST][ContextGLMipFilter.MIPNEAREST] = this._gl.NEAREST_MIPMAP_NEAREST;
			this._mipmapFilterDictionary[ContextGLTextureFilter.NEAREST][ContextGLMipFilter.MIPLINEAR] = this._gl.NEAREST_MIPMAP_LINEAR;
			this._mipmapFilterDictionary[ContextGLTextureFilter.NEAREST][ContextGLMipFilter.MIPNONE] = this._gl.NEAREST;

			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.FLOAT_1] = new VertexBufferProperties(1, this._gl.FLOAT, false);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.FLOAT_2] = new VertexBufferProperties(2, this._gl.FLOAT, false);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.FLOAT_3] = new VertexBufferProperties(3, this._gl.FLOAT, false);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.FLOAT_4] = new VertexBufferProperties(4, this._gl.FLOAT, false);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.BYTE_1] = new VertexBufferProperties(1, this._gl.BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.BYTE_2] = new VertexBufferProperties(2, this._gl.BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.BYTE_3] = new VertexBufferProperties(3, this._gl.BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.BYTE_4] = new VertexBufferProperties(4, this._gl.BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_BYTE_1] = new VertexBufferProperties(1, this._gl.UNSIGNED_BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_BYTE_2] = new VertexBufferProperties(2, this._gl.UNSIGNED_BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_BYTE_3] = new VertexBufferProperties(3, this._gl.UNSIGNED_BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_BYTE_4] = new VertexBufferProperties(4, this._gl.UNSIGNED_BYTE, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.SHORT_1] = new VertexBufferProperties(1, this._gl.SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.SHORT_2] = new VertexBufferProperties(2, this._gl.SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.SHORT_3] = new VertexBufferProperties(3, this._gl.SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.SHORT_4] = new VertexBufferProperties(4, this._gl.SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_SHORT_1] = new VertexBufferProperties(1, this._gl.UNSIGNED_SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_SHORT_2] = new VertexBufferProperties(2, this._gl.UNSIGNED_SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_SHORT_3] = new VertexBufferProperties(3, this._gl.UNSIGNED_SHORT, true);
			this._vertexBufferPropertiesDictionary[ContextGLVertexBufferFormat.UNSIGNED_SHORT_4] = new VertexBufferProperties(4, this._gl.UNSIGNED_SHORT, true);

            this._stencilCompareMode = this._gl.ALWAYS;
            this._stencilCompareModeBack = this._gl.ALWAYS;
            this._stencilCompareModeFront = this._gl.ALWAYS;
		} else {
			//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
			alert("WebGL is not available.");
		}

		//defaults
		for (var i:number = 0; i < ContextWebGL.MAX_SAMPLERS; ++i) {
			this._samplerStates[i] = new SamplerState();
			this._samplerStates[i].wrap = this._gl.REPEAT;
			this._samplerStates[i].filter = this._gl.LINEAR;
			this._samplerStates[i].mipfilter = this._gl.LINEAR;
		}
	}

	public gl():WebGLRenderingContext
	{
		return this._gl;
	}

	public clear(red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1, depth:number = 1, stencil:number = 0, mask:number = ContextGLClearMask.ALL):void
	{
		if (!this._drawing) {
			this.updateBlendStatus();
			this._drawing = true;
		}

		var glmask:number = 0;
		if (mask & ContextGLClearMask.COLOR) glmask |= this._gl.COLOR_BUFFER_BIT;
		if (mask & ContextGLClearMask.STENCIL) glmask |= this._gl.STENCIL_BUFFER_BIT;
		if (mask & ContextGLClearMask.DEPTH) glmask |= this._gl.DEPTH_BUFFER_BIT;

		this._gl.clearColor(red, green, blue, alpha);
		this._gl.clearDepth(depth);
		this._gl.clearStencil(stencil);
		this._gl.clear(glmask);
	}

	public configureBackBuffer(width:number, height:number, antiAlias:number, enableDepthAndStencil:boolean = true):void
	{
		this._width = width;
		this._height = height;

		if (enableDepthAndStencil) {
			this._gl.enable(this._gl.STENCIL_TEST);
			this._gl.enable(this._gl.DEPTH_TEST);
		}

		this._gl.viewport['width'] = width;
		this._gl.viewport['height'] = height;

		this._gl.viewport(0, 0, width, height);
	}

	public createCubeTexture(size:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0):CubeTextureWebGL
	{
		return new CubeTextureWebGL(this._gl, size);
	}

	public createIndexBuffer(numIndices:number):IndexBufferWebGL
	{
		return new IndexBufferWebGL(this._gl, numIndices);
	}

	public createProgram():ProgramWebGL
	{
		return new ProgramWebGL(this._gl);
	}

	public createTexture(width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0):TextureWebGL
	{
		//TODO streaming
		return new TextureWebGL(this._gl, width, height);
	}

	public createVertexBuffer(numVertices:number, dataPerVertex:number):VertexBufferWebGL
	{
		return new VertexBufferWebGL(this._gl, numVertices, dataPerVertex);
	}

	public dispose():void
	{
		for (var i:number = 0; i < this._samplerStates.length; ++i)
			this._samplerStates[i] = null;
	}

	public drawToBitmapImage2D(destination:BitmapImage2D):void
	{
		var pixels:Uint8ClampedArray = new Uint8ClampedArray(destination.width*destination.height*4);

		this._gl.readPixels(0, 0, destination.width, destination.height, this._gl.RGBA, this._gl.UNSIGNED_BYTE, pixels);

		destination.setPixels(new Rectangle(0, 0, destination.width, destination.height), pixels);
	}

	public drawIndices(mode:string, indexBuffer:IndexBufferWebGL, firstIndex:number = 0, numIndices:number = -1):void
	{
		if (!this._drawing)
			throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";


		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
		this._gl.drawElements(this._drawModeDictionary[mode], (numIndices == -1)? indexBuffer.numIndices : numIndices, this._gl.UNSIGNED_SHORT, firstIndex*2);
	}

	public drawVertices(mode:string, firstVertex:number = 0, numVertices:number = -1):void
	{
		if (!this._drawing)
			throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";

		this._gl.drawArrays(this._drawModeDictionary[mode], firstVertex, numVertices);
	}

	public present():void
	{
		this._drawing = false;
	}

	public setBlendFactors(sourceFactor:string, destinationFactor:string):void
	{
		this._blendEnabled = true;

		this._blendSourceFactor = this._blendFactorDictionary[sourceFactor];

		this._blendDestinationFactor = this._blendFactorDictionary[destinationFactor];

		this.updateBlendStatus();
	}

	public setColorMask(red:boolean, green:boolean, blue:boolean, alpha:boolean):void
	{
		this._gl.colorMask(red, green, blue, alpha);
	}

	public setCulling(triangleFaceToCull:string, coordinateSystem:string = "leftHanded"):void
	{
		if (triangleFaceToCull == ContextGLTriangleFace.NONE) {
			this._gl.disable(this._gl.CULL_FACE);
		} else {
			this._gl.enable(this._gl.CULL_FACE);
            this._gl.cullFace(this.translateTriangleFace(triangleFaceToCull, coordinateSystem));
		}
	}

	// TODO ContextGLCompareMode
	public setDepthTest(depthMask:boolean, passCompareMode:string):void
	{
		this._gl.depthFunc(this._compareModeDictionary[passCompareMode]);

		this._gl.depthMask(depthMask);
	}

    public setStencilActions(triangleFace:string = "frontAndBack", compareMode:string = "always", actionOnBothPass:string = "keep", actionOnDepthFail:string = "keep", actionOnDepthPassStencilFail:string = "keep", coordinateSystem:string = "leftHanded")
    {
        this._separateStencil = triangleFace != "frontAndBack";

        var compareModeGL = this._compareModeDictionary[compareMode];

        var fail = this._stencilActionDictionary[actionOnDepthPassStencilFail];
        var zFail = this._stencilActionDictionary[actionOnDepthFail];
        var pass = this._stencilActionDictionary[actionOnBothPass];

        if (!this._separateStencil) {
            this._stencilCompareMode = compareModeGL;
            this._gl.stencilFunc(compareModeGL, this._stencilReferenceValue, this._stencilReadMask);
            this._gl.stencilOp(fail, zFail, pass);
        }
        else if (triangleFace == "back") {
            this._stencilCompareModeBack = compareModeGL;
            this._gl.stencilFuncSeparate(this._gl.BACK, compareModeGL, this._stencilReferenceValue, this._stencilReadMask);
            this._gl.stencilOpSeparate(this._gl.BACK, fail, zFail, pass);
        }
        else if (triangleFace == "front") {
            this._stencilCompareModeFront = compareModeGL;
            this._gl.stencilFuncSeparate(this._gl.FRONT, compareModeGL, this._stencilReferenceValue, this._stencilReadMask);
            this._gl.stencilOpSeparate(this._gl.FRONT, fail, zFail, pass);
        }
    }

    public setStencilReferenceValue(referenceValue:number, readMask:number, writeMask:number)
    {
        this._stencilReferenceValue = referenceValue;
        this._stencilReadMask = readMask;

        if (this._separateStencil) {
            this._gl.stencilFuncSeparate(this._gl.FRONT, this._stencilCompareModeFront, referenceValue, readMask);
            this._gl.stencilFuncSeparate(this._gl.BACK, this._stencilCompareModeBack, referenceValue, readMask);
        }
        else {
            this._gl.stencilFunc(this._stencilCompareMode, referenceValue, readMask);
        }

        this._gl.stencilMask(writeMask);
    }

	public setProgram(program:ProgramWebGL):void
	{
		//TODO decide on construction/reference resposibilities
		this._currentProgram = program;
		program.focusProgram();
	}

	public static modulo:number = 0;

	public setProgramConstantsFromArray(programType:number, data:Float32Array):void
	{
		if (data.length)
			this._gl.uniform4fv(this._currentProgram.getUniformLocation(programType), data);
	}

	public setScissorRectangle(rectangle:Rectangle):void
	{
		if (!rectangle) {
			this._gl.disable(this._gl.SCISSOR_TEST);
			return;
		}

		this._gl.enable(this._gl.SCISSOR_TEST);
		this._gl.scissor(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	}

	public setTextureAt(sampler:number, texture:TextureBaseWebGL):void
	{
		var samplerState:SamplerState = this._samplerStates[sampler];

		if (this._activeTexture != sampler && (texture || samplerState.type)) {
			this._activeTexture = sampler;
			this._gl.activeTexture(this._textureIndexDictionary[sampler]);
		}

		if (!texture) {
			if (samplerState.type) {
				this._gl.bindTexture(samplerState.type, null);
				samplerState.type = null;
			}

			return;
		}

		var textureType:number = this._textureTypeDictionary[texture.textureType];
		samplerState.type = textureType;

		this._gl.bindTexture(textureType, texture.glTexture);

		this._gl.uniform1i(this._currentProgram.getUniformLocation(ContextGLProgramType.SAMPLER, sampler), sampler);

		this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_S, samplerState.wrap);
		this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_T, samplerState.wrap);

		this._gl.texParameteri(textureType, this._gl.TEXTURE_MAG_FILTER, samplerState.filter);
		this._gl.texParameteri(textureType, this._gl.TEXTURE_MIN_FILTER, samplerState.mipfilter);
	}

	public setSamplerStateAt(sampler:number, wrap:string, filter:string, mipfilter:string):void
	{
		if (0 <= sampler && sampler < ContextWebGL.MAX_SAMPLERS) {
			this._samplerStates[sampler].wrap = this._wrapDictionary[wrap];
			this._samplerStates[sampler].filter = this._filterDictionary[filter];
			this._samplerStates[sampler].mipfilter = this._mipmapFilterDictionary[filter][mipfilter];
		} else {
			throw "Sampler is out of bounds.";
		}
	}

	public setVertexBufferAt(index:number, buffer:VertexBufferWebGL, bufferOffset:number = 0, format:number = 4):void
	{
		var location:number = this._currentProgram? this._currentProgram.getAttribLocation(index) : -1;

		if (!buffer) {
			if (location > -1)
				this._gl.disableVertexAttribArray(location);

			return;
		}

		//buffer may not have changed if concatenated buffers are being used
		if (this._currentArrayBuffer != buffer) {
			this._currentArrayBuffer = buffer;
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer? buffer.glBuffer : null);
		}

		var properties:VertexBufferProperties = this._vertexBufferPropertiesDictionary[format];

		this._gl.enableVertexAttribArray(location);
		this._gl.vertexAttribPointer(location, properties.size, properties.type, properties.normalized, buffer.dataPerVertex, bufferOffset);
	}

	public setRenderToTexture(target:TextureBaseWebGL, enableDepthAndStencil:boolean = false, antiAlias:number = 0, surfaceSelector:number = 0):void
	{
		var texture:TextureWebGL = <TextureWebGL> target;
		var frameBuffer:WebGLFramebuffer = texture.frameBuffer;
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer);

		if (enableDepthAndStencil) {
			this._gl.enable(this._gl.STENCIL_TEST);
			this._gl.enable(this._gl.DEPTH_TEST);
		}

		this._gl.viewport(0, 0, texture.width, texture.height );
	}

	public setRenderToBackBuffer():void
	{
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
	}

	private updateBlendStatus():void
	{
		if (this._blendEnabled) {
			this._gl.enable(this._gl.BLEND);
			this._gl.blendEquation(this._gl.FUNC_ADD);
			this._gl.blendFunc(this._blendSourceFactor, this._blendDestinationFactor);
		} else {
			this._gl.disable(this._gl.BLEND);
		}
	}

    private translateTriangleFace(triangleFace:string, coordinateSystem:string)
    {
        switch (triangleFace) {
            case ContextGLTriangleFace.BACK:
                return (coordinateSystem == "leftHanded")? this._gl.FRONT : this._gl.BACK;
            case ContextGLTriangleFace.FRONT:
                return (coordinateSystem == "leftHanded")? this._gl.BACK : this._gl.FRONT;
            case ContextGLTriangleFace.FRONT_AND_BACK:
                return this._gl.FRONT_AND_BACK;
            default:
                throw "Unknown ContextGLTriangleFace type."; // TODO error
        }
    }
}


export class VertexBufferProperties
{
	public size:number;

	public type:number;

	public normalized:boolean;

	constructor(size:number, type:number, normalized:boolean)
	{
		this.size = size;
		this.type = type;
		this.normalized = normalized;
	}
}