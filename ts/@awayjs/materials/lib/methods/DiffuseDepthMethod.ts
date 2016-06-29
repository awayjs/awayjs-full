import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {DiffuseBasicMethod}				from "../methods/DiffuseBasicMethod";

/**
 * DiffuseDepthMethod provides a debug method to visualise depth maps
 */
export class DiffuseDepthMethod extends DiffuseBasicMethod
{
	/**
	 * Creates a new DiffuseBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index] = 1.0;
		data[index + 1] = 1/255.0;
		data[index + 2] = 1/65025.0;
		data[index + 3] = 1/16581375.0;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement;
		var decReg:ShaderRegisterElement;

		if (!this._texture)
			throw new Error("DiffuseDepthMethod requires texture!");

		// incorporate input from ambient
		if (shader.numLights > 0) {
			if (sharedRegisters.shadowTarget)
				code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
			code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" +
				"sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
			registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
			registerCache.addFragmentTempUsages(temp = registerCache.getFreeFragmentVectorTemp(), 1);
		} else {
			temp = targetReg;
		}

		decReg = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = decReg.index*4;

		code += methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
			"dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" +
			"mov " + temp + ".yz, " + temp + ".xx			\n" +
			"mov " + temp + ".w, " + decReg + ".x\n" +
			"sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";

		if (shader.numLights == 0)
			return code;

		code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" +
			"mov " + targetReg + ".w, " + temp + ".w\n";

		if (shader.numLights > 0)
			registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}