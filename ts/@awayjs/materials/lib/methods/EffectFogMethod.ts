import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {EffectMethodBase}					from "../methods/EffectMethodBase";

/**
 * EffectFogMethod provides a method to add distance-based fog to a material.
 */
export class EffectFogMethod extends EffectMethodBase
{
	private _minDistance:number = 0;
	private _maxDistance:number = 1000;
	private _fogColor:number /*uint*/;
	private _fogR:number;
	private _fogG:number;
	private _fogB:number;

	/**
	 * Creates a new EffectFogMethod object.
	 * @param minDistance The distance from which the fog starts appearing.
	 * @param maxDistance The distance at which the fog is densest.
	 * @param fogColor The colour of the fog.
	 */
	constructor(minDistance:number, maxDistance:number, fogColor:number /*uint*/ = 0x808080)
	{
		super();
		this.minDistance = minDistance;
		this.maxDistance = maxDistance;
		this.fogColor = fogColor;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		methodVO.needsProjection = true;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index + 3] = 1;
		data[index + 6] = 0;
		data[index + 7] = 0;
	}

	/**
	 * The distance from which the fog starts appearing.
	 */
	public get minDistance():number
	{
		return this._minDistance;
	}

	public set minDistance(value:number)
	{
		this._minDistance = value;
	}

	/**
	 * The distance at which the fog is densest.
	 */
	public get maxDistance():number
	{
		return this._maxDistance;
	}

	public set maxDistance(value:number)
	{
		this._maxDistance = value;
	}

	/**
	 * The colour of the fog.
	 */
	public get fogColor():number /*uint*/
	{
		return this._fogColor;
	}

	public set fogColor(value:number/*uint*/)
	{
		this._fogColor = value;
		this._fogR = ((value >> 16) & 0xff)/0xff;
		this._fogG = ((value >> 8) & 0xff)/0xff;
		this._fogB = (value & 0xff)/0xff;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index] = this._fogR;
		data[index + 1] = this._fogG;
		data[index + 2] = this._fogB;
		data[index + 4] = this._minDistance;
		data[index + 5] = 1/(this._maxDistance - this._minDistance);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var fogColor:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var fogData:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		var code:string = "";
		methodVO.fragmentConstantsIndex = fogColor.index*4;

		code += "sub " + temp2 + ".w, " + sharedRegisters.projectionFragment + ".z, " + fogData + ".x\n" +
				"mul " + temp2 + ".w, " + temp2 + ".w, " + fogData + ".y\n" +
				"sat " + temp2 + ".w, " + temp2 + ".w\n" +
				"sub " + temp + ", " + fogColor + ", " + targetReg + "\n" + // (fogColor- col)
				"mul " + temp + ", " + temp + ", " + temp2 + ".w\n" + // (fogColor- col)*fogRatio
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n"; // fogRatio*(fogColor- col) + col

		registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}