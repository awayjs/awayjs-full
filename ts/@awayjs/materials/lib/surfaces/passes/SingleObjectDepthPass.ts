import {Image2D}							from "@awayjs/core/lib/image/Image2D";
import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";

import {LightBase}						from "@awayjs/display/lib/display/LightBase";
import {Camera}							from "@awayjs/display/lib/display/Camera";
import {MaterialBase}						from "@awayjs/display/lib/materials/MaterialBase";
import {ISurface}							from "@awayjs/display/lib/base/ISurface";
import {Single2DTexture}					from "@awayjs/display/lib/textures/Single2DTexture";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";
import {TriangleElements}					from "@awayjs/display/lib/graphics/TriangleElements";

import {ContextGLDrawMode}				from "@awayjs/stage/lib/base/ContextGLDrawMode";
import {ContextGLProgramType}				from "@awayjs/stage/lib/base/ContextGLProgramType";
import {IContextGL}						from "@awayjs/stage/lib/base/IContextGL";
import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {RendererBase}						from "@awayjs/renderer/lib/RendererBase";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {PassBase}							from "@awayjs/renderer/lib/surfaces/passes/PassBase";
import {IElementsClassGL}					from "@awayjs/renderer/lib/elements/IElementsClassGL";
import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {GL_SurfaceBase}					from "@awayjs/renderer/lib/surfaces/GL_SurfaceBase";
import {GL_ElementsBase}					from "@awayjs/renderer/lib/elements/GL_ElementsBase";

/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
export class SingleObjectDepthPass extends PassBase
{
	private _textures:Object;
	private _projections:Object;
	private _textureSize:number /*uint*/ = 512;
	private _polyOffset:Float32Array = new Float32Array([15, 0, 0, 0]);
	private _enc:Float32Array;
	private _projectionTexturesInvalid:Boolean = true;

	/**
	 * The size of the depth map texture to render to.
	 */
	public get textureSize():number
	{
		return this._textureSize;
	}

	public set textureSize(value:number)
	{
		this._textureSize = value;
	}

	/**
	 * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
	 */
	public get polyOffset():number
	{
		return this._polyOffset[0];
	}

	public set polyOffset(value:number)
	{
		this._polyOffset[0] = value;
	}

	/**
	 * Creates a new SingleObjectDepthPass object.
	 */
	constructor(render:GL_SurfaceBase, renderOwner:ISurface, elementsClass:IElementsClassGL, stage:Stage)
	{
		super(render, renderOwner, elementsClass, stage);

		//this._pNumUsedStreams = 2;
		//this._pNumUsedVertexConstants = 7;
		//this._enc = Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
		//
		//this._pAnimatableAttributes = Array<string>("va0", "va1";
		//this._pAnimationTargetRegisters = Array<string>("vt0", "vt1";
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (this._textures) {
			for (var key in this._textures) {
				var texture:TextureBase = this._textures[key];
				texture.dispose();
			}
			this._textures = null;
		}
	}

	/**
	 * Updates the projection textures used to contain the depth renders.
	 */
	private updateProjectionTextures():void
	{
		if (this._textures) {
			for (var key in this._textures) {
				var texture:TextureBase = this._textures[key];
				texture.dispose();
			}
		}

		this._textures = new Object();
		this._projections = new Object();
		this._projectionTexturesInvalid = false;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetVertexCode():string
	{
		var code:string;
		// offset
		code = "mul vt7, vt1, vc4.x	\n" +
				"add vt7, vt7, vt0\n" +
				"mov vt7.w, vt0.w\n";
		// project
		code += "m44 vt2, vt7, vc0\n" +
				"mov op, vt2\n";

		// perspective divide
		code += "div v0, vt2, vt2.w\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		// encode float -> rgba
		code += "mul ft0, fc0, v0.z\n" +
				"frc ft0, ft0\n" +
				"mul ft1, ft0.yzww, fc1\n" +
				"sub ft0, ft0, ft1\n" +
				"mov oc, ft0\n";

		return code;
	}

	/**
	 * Gets the depth maps rendered for this object from all lights.
	 * @param renderableGL The renderableGL for which to retrieve the depth maps.
	 * @param stage3DProxy The Stage3DProxy object currently used for rendering.
	 * @return A list of depth map textures for all supported lights.
	 */
	public _iGetDepthMap(renderableGL:GL_RenderableBase):TextureBase
	{
		return this._textures[renderableGL.renderable.id];
	}

	/**
	 * Retrieves the depth map projection maps for all lights.
	 * @param renderableGL The renderableGL for which to retrieve the projection maps.
	 * @return A list of projection maps for all supported lights.
	 */
	public _iGetProjection(renderableGL:GL_RenderableBase):Matrix3D
	{
		return this._projections[renderableGL.renderable.id];
	}

	/**
	 * @inheritDoc
	 */
	public _iRender(renderableGL:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D):void
	{
		var matrix:Matrix3D;
		var context:IContextGL = this._stage.context;
		var len:number /*uint*/;
		var light:LightBase;
		var lights:Array<LightBase> = this._surface.lightPicker.allPickedLights;
		var rId:number = renderableGL.renderable.id;

		if (!this._textures[rId])
			this._textures[rId] = new Single2DTexture(new Image2D(this._textureSize, this._textureSize));

		if (!this._projections[rId])
			this._projections[rId] = new Matrix3D();

		len = lights.length;

		// local position = enough
		light = lights[0];

		matrix = light.iGetObjectProjectionMatrix(renderableGL.sourceEntity, camera.sceneTransform, this._projections[rId]);

		this._stage.setRenderTarget(this._textures[rId], true);
		context.clear(1.0, 1.0, 1.0);
		//context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
		//context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._enc, 2);
		
		var elementsGL:GL_ElementsBase = renderableGL.elementsGL;

		// elementsGL.activateVertexBufferVO(0, elements.positions);
		// elementsGL.activateVertexBufferVO(1, elements.normals);
		// elementsGL.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, elements.numElements);
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera):void
	{
		if (this._projectionTexturesInvalid)
			this.updateProjectionTextures();

		// never scale
		super._iActivate(camera);

		//this._stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
	}
}