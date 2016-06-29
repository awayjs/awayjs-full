import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {DiffuseBasicMethod}				from "../methods/DiffuseBasicMethod";
import {DiffuseCompositeMethod}			from "../methods/DiffuseCompositeMethod";

/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
export class DiffuseCelMethod extends DiffuseCompositeMethod
{
	private _levels:number /*uint*/;
	private _dataReg:ShaderRegisterElement;
	private _smoothness:number = .1;

	/**
	 * Creates a new DiffuseCelMethod object.
	 * @param levels The amount of shadow gradations.
	 * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
	 */
	constructor(levels:number /*uint*/ = 3, baseMethod:DiffuseBasicMethod = null)
	{
		super(null, baseMethod);

		this.baseMethod._iModulateMethod = (shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampDiffuse(shader, methodVO, targetReg, registerCache, sharedRegisters);

		this._levels = levels;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:LightingShader, methodVO:MethodVO):void
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		super.iInitConstants(shader, methodVO);
		data[index + 1] = 1;
		data[index + 2] = 0;
	}

	/**
	 * The amount of shadow gradations.
	 */
	public get levels():number /*uint*/
	{
		return this._levels;
	}

	public set levels(value:number /*uint*/)
	{
		this._levels = value;
	}

	/**
	 * The smoothness of the edge between 2 shading levels.
	 */
	public get smoothness():number
	{
		return this._smoothness;
	}

	public set smoothness(value:number)
	{
		this._smoothness = value;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData():void
	{
		super.iCleanCompilationData();
		this._dataReg = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._dataReg = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = this._dataReg.index*4;

		return super.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		data[index] = this._levels;
		data[index + 3] = this._smoothness;
	}

	/**
	 * Snaps the diffuse shading of the wrapped method to one of the levels.
	 * @param vo The MethodVO used to compile the current shader.
	 * @param t The register containing the diffuse strength in the "w" component.
	 * @param regCache The register cache used for the shader compilation.
	 * @param sharedRegisters The shared register data for this shader.
	 * @return The AGAL fragment code for the method.
	 */
	private clampDiffuse(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" +
			"frc " + targetReg + ".z, " + targetReg + ".w\n" +
			"sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" +
			"mov " + targetReg + ".x, " + this._dataReg + ".x\n" +
			"sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" +
			"rcp " + targetReg + ".x," + targetReg + ".x\n" +
			"mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" +

			// previous clamped strength
			"sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" +

			// fract/epsilon (so 0 - epsilon will become 0 - 1)
			"div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" +
			"sat " + targetReg + ".z, " + targetReg + ".z\n" +

			"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" +
			// 1-z
			"sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" +
			"mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" +
			"add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" +
			"sat " + targetReg + ".w, " + targetReg + ".w\n";
	}
}