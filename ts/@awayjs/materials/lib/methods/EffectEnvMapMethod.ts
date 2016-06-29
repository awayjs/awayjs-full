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
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
export class EffectEnvMapMethod extends EffectMethodBase
{
	private _envMap:TextureBase;
	private _alpha:number;
	private _mask:TextureBase;

	/**
	 * Creates an EffectEnvMapMethod object.
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the surface.
	 */
	constructor(envMap:TextureBase, alpha:number = 1)
	{
		super();
		this._envMap = envMap;
		this._alpha = alpha;

		if (this._envMap)
			this.iAddTexture(this._envMap);
	}

	/**
	 * An optional texture to modulate the reflectivity of the surface.
	 */
	public get mask():TextureBase
	{
		return this._mask;
	}

	public set mask(value:TextureBase)
	{
		if (value == this._mask)
			return;

		if (this._mask)
			this.iRemoveTexture(this._mask);

		this._mask = value;

		if (this._mask)
			this.iAddTexture(this._mask);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;

		if (this._envMap)
			methodVO.textureGL = shader.getAbstraction(this._envMap);

		if (this._mask) {
			methodVO.secondaryTextureGL = shader.getAbstraction(this._mask);
			shader.uvDependencies++;
		}
	}

	/**
	 * The cubic environment map containing the reflected scene.
	 */
	public get envMap():TextureBase
	{
		return this._envMap;
	}

	public set envMap(value:TextureBase)
	{
		if (this._envMap == value)
			return;

		if (this._envMap)
			this.iRemoveTexture(this._envMap);

		this._envMap = value;

		if (this._envMap)
			this.iAddTexture(this._envMap);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
	}

	/**
	 * The reflectivity of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		this._alpha = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;

		methodVO.textureGL.activate(methodVO.pass._render);

		if (this._mask)
			methodVO.secondaryTextureGL.activate(methodVO.pass._render);
	}

	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		methodVO.textureGL._setRenderState(renderable);

		if (this._mask)
			methodVO.secondaryTextureGL._setRenderState(renderable);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";

		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// r = I - 2(I.N)*N
		code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
			"mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
			"sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
			methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +
			"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
			"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
			"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		if (this._mask) {
			code += methodVO.secondaryTextureGL._iGetFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
				"mul " + temp + ", " + temp2 + ", " + temp + "\n";
		}

		code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}
}