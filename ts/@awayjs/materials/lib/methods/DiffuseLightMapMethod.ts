import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {DiffuseBasicMethod}				from "../methods/DiffuseBasicMethod";
import {DiffuseCompositeMethod}			from "../methods/DiffuseCompositeMethod";

/**
 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
export class DiffuseLightMapMethod extends DiffuseCompositeMethod
{
	/**
	 * Indicates the light map should be multiplied with the calculated shading result.
	 * This can be used to add pre-calculated shadows or occlusion.
	 */
	public static MULTIPLY:string = "multiply";

	/**
	 * Indicates the light map should be added into the calculated shading result.
	 * This can be used to add pre-calculated lighting or global illumination.
	 */
	public static ADD:string = "add";

	private _lightMap:TextureBase;
	private _blendMode:string;
	private _useSecondaryUV:boolean;

	/**
	 * Creates a new DiffuseLightMapMethod method.
	 *
	 * @param lightMap The texture containing the light map.
	 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	 * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
	 */
	constructor(lightMap:TextureBase, blendMode:string = "multiply", useSecondaryUV:boolean = false, baseMethod:DiffuseBasicMethod = null)
	{
		super(null, baseMethod);

		this._useSecondaryUV = useSecondaryUV;
		this._lightMap = lightMap;
		this.blendMode = blendMode;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		methodVO.secondaryTextureGL = shader.getAbstraction(this._lightMap);

		if (this._useSecondaryUV)
			shader.secondaryUVDependencies++;
		else
			shader.uvDependencies++;
	}

	/**
	 * The blend mode with which the light map should be applied to the lighting result.
	 *
	 * @see DiffuseLightMapMethod.ADD
	 * @see DiffuseLightMapMethod.MULTIPLY
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The texture containing the light map data.
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
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		code = methodVO.secondaryTextureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

		switch (this._blendMode) {
			case DiffuseLightMapMethod.MULTIPLY:
				code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
				break;
			case DiffuseLightMapMethod.ADD:
				code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
				break;
		}

		code += super.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);

		methodVO.secondaryTextureGL.activate(methodVO.pass._render);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		super.iSetRenderState(shader, methodVO, renderable, stage, camera);

		methodVO.secondaryTextureGL._setRenderState(renderable);
	}
}