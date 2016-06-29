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
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
export class EffectFresnelEnvMapMethod extends EffectMethodBase
{
	private _envMap:TextureBase;
	private _fresnelPower:number = 5;
	private _normalReflectance:number = 0;
	private _alpha:number;
	private _mask:TextureBase;

	/**
	 * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
	 *
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the material.
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
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;

		methodVO.textureGL = shader.getAbstraction(this._envMap);

		if (this._mask != null) {
			methodVO.secondaryTextureGL = shader.getAbstraction(this._mask);
			shader.uvDependencies++;
		}
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
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
		if (this._mask == value)
			return;

		if (this._mask)
			this.iRemoveTexture(this._mask);

		this._mask = value;

		if (this._mask)
			this.iAddTexture(this._mask);

		this.iInvalidateShaderProgram();
	}

	/**
	 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	 */
	public get fresnelPower():number
	{
		return this._fresnelPower;
	}

	public set fresnelPower(value:number)
	{
		this._fresnelPower = value;
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
	 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	 */
	public get normalReflectance():number
	{
		return this._normalReflectance;
	}

	public set normalReflectance(value:number)
	{
		this._normalReflectance = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index] = this._alpha;
		data[index + 1] = this._normalReflectance;
		data[index + 2] = this._fresnelPower;

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
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// r = V - 2(V.N)*N
		code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
				"mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" +
				"sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" +
			methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +
				"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" +               	// -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		// calculate fresnel term
		code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +  // dot(V, H)
				"sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +       // base = 1-dot(V, H)
				"pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" +       // exp = pow(base, 5)
				"sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +        // 1 - exp
				"mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" +         // f0*(1 - exp)
				"add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" +          // exp + f0*(1 - exp)

				// total alpha
				"mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";

		if (this._mask) {
			code += methodVO.secondaryTextureGL._iGetFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
				"mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
		}

		// blend
		code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}
}