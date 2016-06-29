import {PoissonLookup}					from "@awayjs/core/lib/geom/PoissonLookup";

import {DirectionalLight}					from "@awayjs/display/lib/display/DirectionalLight";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {ShadowMethodBase}					from "../methods/ShadowMethodBase";

/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
export class ShadowSoftMethod extends ShadowMethodBase
{
	private _range:number = 1;
	private _numSamples:number /*int*/;
	private _offsets:Array<number>;

	/**
	 * Creates a new DiffuseBasicMethod object.
	 *
	 * @param castingLight The light casting the shadows
	 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
	 */
	constructor(castingLight:DirectionalLight, numSamples:number /*int*/ = 5, range:number = 1)
	{
		super(castingLight);

		this.numSamples = numSamples;
		this.range = range;
	}

	/**
	 * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
	 * complexity of the shader.
	 */
	public get numSamples():number /*int*/
	{
		return this._numSamples;
	}

	public set numSamples(value:number /*int*/)
	{
		this._numSamples = value;
		
		if (this._numSamples < 1)
			this._numSamples = 1;
		else if (this._numSamples > 32)
			this._numSamples = 32;

		this._offsets = PoissonLookup.getDistribution(this._numSamples);
		
		this.iInvalidateShaderProgram();
	}

	/**
	 * The range in the shadow map in which to distribute the samples.
	 */
	public get range():number
	{
		return this._range;
	}

	public set range(value:number)
	{
		this._range = value;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		super.iInitConstants(shader, methodVO);

		shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1/this._numSamples;
		shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);

		var texRange:number = .5*this._range/this._pCastingLight.shadowMapper.depthMapSize;
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*uint*/ = methodVO.fragmentConstantsIndex + 10;
		var len:number /*uint*/ = this._numSamples << 1;

		for (var i:number /*int*/ = 0; i < len; ++i)
			data[index + i] = this._offsets[i]*texRange;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		// todo: move some things to super
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = decReg.index*4;

		return this.getSampleCode(shader, methodVO, decReg, targetReg, regCache, sharedRegisters, dataReg);
	}

	/**
	 * Adds the code for another tap to the shader code.
	 * @param uv The uv register for the tap.
	 * @param texture The texture register containing the depth map.
	 * @param decode The register containing the depth map decoding data.
	 * @param target The target register to add the tap comparison result.
	 * @param regCache The register cache managing the registers.
	 * @return
	 */
	private addSample(shader:ShaderBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, uvReg:ShaderRegisterElement):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		return methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
			"add " + targetRegister + ".w, " + targetRegister + ".w, " + uvReg + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);

		var texRange:number = this._range/this._pCastingLight.shadowMapper.depthMapSize;
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*uint*/ = methodVO.secondaryFragmentConstantsIndex;
		var len:number /*uint*/ = this._numSamples << 1;
		data[index] = 1/this._numSamples;
		data[index + 1] = 0;
		index += 2;

		for (var i:number /*int*/ = 0; i < len; ++i)
			data[index + i] = this._offsets[i]*texRange;

		if (len%4 == 0) {
			data[index + len] = 0;
			data[index + len + 1] = 0;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shader:ShaderBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._pDepthMapCoordReg = depthProjection;

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		return this.getSampleCode(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg);
	}

	/**
	 * Get the actual shader code for shadow mapping
	 * @param regCache The register cache managing the registers.
	 * @param depthTexture The texture register containing the depth map.
	 * @param decodeRegister The register containing the depth map decoding data.
	 * @param targetReg The target register to add the shadow coverage.
	 * @param dataReg The register containing additional data.
	 */
	private getSampleCode(shader:ShaderBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, dataReg:ShaderRegisterElement):string
	{
		var code:string;
		var uvReg:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(uvReg, 1);

		var offsets:Array<string> = new Array<string>(dataReg + ".zw");
		var numRegs:number /*int*/ = this._numSamples >> 1;

		for (var i:number /*int*/ = 0; i < numRegs; ++i) {
			var reg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			offsets.push(reg + ".xy");
			offsets.push(reg + ".zw");
		}

		for (i = 0; i < this._numSamples; ++i) {
			if (i == 0) {
				var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

				code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" +
					methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
					"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
					"slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
			} else {
				code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" +
					this.addSample(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg);
			}
		}

		registerCache.removeFragmentTempUsage(uvReg);

		code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average

		return code;
	}
}