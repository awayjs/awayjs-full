import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {EffectMethodBase}					from "../methods/EffectMethodBase";

/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
export class EffectAlphaMaskMethod extends EffectMethodBase
{
	private _texture:TextureBase;
	private _useSecondaryUV:boolean;

	/**
	 * Creates a new EffectAlphaMaskMethod object.
	 *
	 * @param texture The texture to use as the alpha mask.
	 * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
	 */
	constructor(texture:TextureBase, useSecondaryUV:boolean = false)
	{
		super();

		this._texture = texture;
		this._useSecondaryUV = useSecondaryUV;

		if (this._texture)
			this.iAddTexture(this._texture);
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		methodVO.textureGL = shader.getAbstraction(this._texture);

		if (this._useSecondaryUV)
			shader.secondaryUVDependencies++;
		else
			shader.uvDependencies++;
	}

	/**
	 * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
	 * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
	 * transparency over a tiled water surface.
	 */
	public get useSecondaryUV():boolean
	{
		return this._useSecondaryUV;
	}

	public set useSecondaryUV(value:boolean)
	{
		if (this._useSecondaryUV == value)
			return;

		this._useSecondaryUV = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The texture to use as the alpha mask.
	 */
	public get texture():TextureBase
	{
		return this._texture;
	}

	public set texture(value:TextureBase)
	{
		if (this._texture == value)
			return;

		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		return methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) +
			"mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
	}


	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);

		methodVO.textureGL.activate(methodVO.pass._render);
	}


	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		methodVO.textureGL._setRenderState(renderable);
	}
}