import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {EffectMethodBase}					from "../methods/EffectMethodBase";

/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
export class EffectLightMapMethod extends EffectMethodBase
{
	/**
	 * Indicates the light map should be multiplied with the calculated shading result.
	 */
	public static MULTIPLY:string = "multiply";

	/**
	 * Indicates the light map should be added into the calculated shading result.
	 */
	public static ADD:string = "add";

	private _lightMap:TextureBase;

	private _blendMode:string;
	private _useSecondaryUV:boolean;

	/**
	 * Creates a new EffectLightMapMethod object.
	 *
	 * @param lightMap The texture containing the light map.
	 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	 */
	constructor(lightMap:TextureBase, blendMode:string = "multiply", useSecondaryUV:boolean = false)
	{
		super();

		if (blendMode != EffectLightMapMethod.ADD && blendMode != EffectLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		this._lightMap = lightMap;
		this._blendMode = blendMode;
		this._useSecondaryUV = useSecondaryUV;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		methodVO.textureGL = shader.getAbstraction(this._lightMap);

		if (this._useSecondaryUV)
			shader.secondaryUVDependencies++;
		else
			shader.uvDependencies++;
	}

	/**
	 * The blend mode with which the light map should be applied to the lighting result.
	 *
	 * @see EffectLightMapMethod.ADD
	 * @see EffectLightMapMethod.MULTIPLY
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (this._blendMode == value)
			return;

		if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		this._blendMode = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The lightMap containing the light map.
	 */
	public get lightMap():TextureBase
	{
		return this._lightMap;
	}

	public set lightMap(value:TextureBase)
	{
		if (this._lightMap == value)
			return;

		if (this._lightMap)
			this.iRemoveTexture(this._lightMap);

		this._lightMap = value;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);

		this.iInvalidateShaderProgram();
	}

	/**
	 * Indicates whether the secondary UV set should be used to map the light map.
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
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		code = methodVO.secondaryTextureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

		switch (this._blendMode) {
			case EffectLightMapMethod.MULTIPLY:
				code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
				break;
			case EffectLightMapMethod.ADD:
				code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
				break;
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		methodVO.textureGL.activate(methodVO.pass._render);
	}


	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		methodVO.textureGL._setRenderState(renderable);
	}
}