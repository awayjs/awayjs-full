import {ColorTransform}				from "@awayjs/core/lib/geom/ColorTransform";

import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {ShaderBase}					from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}			from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}						from "../data/MethodVO";
import {EffectMethodBase}				from "../methods/EffectMethodBase";

/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
export class EffectColorTransformMethod extends EffectMethodBase
{
	private _colorTransform:ColorTransform;

	/**
	 * Creates a new EffectColorTransformMethod.
	 */
	constructor()
	{
		super();
	}

	/**
	 * The ColorTransform object to transform the colour of the material with.
	 */
	public get colorTransform():ColorTransform
	{
		return this._colorTransform;
	}

	public set colorTransform(value:ColorTransform)
	{
		this._colorTransform = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var colorMultReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var colorOffsReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = colorMultReg.index*4;

		//TODO: AGAL <> GLSL

		code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		var inv:number = 1/0xff;
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;

		data[index] = this._colorTransform.redMultiplier;
		data[index + 1] = this._colorTransform.greenMultiplier;
		data[index + 2] = this._colorTransform.blueMultiplier;
		data[index + 3] = this._colorTransform.alphaMultiplier;
		data[index + 4] = this._colorTransform.redOffset*inv;
		data[index + 5] = this._colorTransform.greenOffset*inv;
		data[index + 6] = this._colorTransform.blueOffset*inv;
		data[index + 7] = this._colorTransform.alphaOffset*inv;

	}
}