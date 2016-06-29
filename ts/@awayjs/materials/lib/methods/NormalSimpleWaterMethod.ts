import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {NormalBasicMethod}				from "../methods/NormalBasicMethod";

/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
export class NormalSimpleWaterMethod extends NormalBasicMethod
{
	private _secondaryNormalMap:TextureBase;
	private _water1OffsetX:number = 0;
	private _water1OffsetY:number = 0;
	private _water2OffsetX:number = 0;
	private _water2OffsetY:number = 0;

	/**
	 * Creates a new NormalSimpleWaterMethod object.
	 * @param waveMap1 A normal map containing one layer of a wave structure.
	 * @param waveMap2 A normal map containing a second layer of a wave structure.
	 */
	constructor(normalMap:TextureBase = null, secondaryNormalMap:TextureBase = null)
	{
		super(normalMap);

		this._secondaryNormalMap = secondaryNormalMap;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = .5;
		data[index + 1] = 0;
		data[index + 2] = 0;
		data[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		super.iInitVO(shader, methodVO);
		
		if (this._secondaryNormalMap) {
			methodVO.secondaryTextureGL = shader.getAbstraction(this._secondaryNormalMap);
			shader.uvDependencies++;
		}
	}

	/**
	 * The translation of the first wave layer along the X-axis.
	 */
	public get water1OffsetX():number
	{
		return this._water1OffsetX;
	}

	public set water1OffsetX(value:number)
	{
		this._water1OffsetX = value;
	}

	/**
	 * The translation of the first wave layer along the Y-axis.
	 */
	public get water1OffsetY():number
	{
		return this._water1OffsetY;
	}

	public set water1OffsetY(value:number)
	{
		this._water1OffsetY = value;
	}

	/**
	 * The translation of the second wave layer along the X-axis.
	 */
	public get water2OffsetX():number
	{
		return this._water2OffsetX;
	}

	public set water2OffsetX(value:number)
	{
		this._water2OffsetX = value;
	}

	/**
	 * The translation of the second wave layer along the Y-axis.
	 */
	public get water2OffsetY():number
	{
		return this._water2OffsetY;
	}

	public set water2OffsetY(value:number)
	{
		this._water2OffsetY = value;
	}

	/**
	 * A second normal map that will be combined with the first to create a wave-like animation pattern.
	 */
	public get secondaryNormalMap():TextureBase
	{
		return this._secondaryNormalMap;
	}

	public set secondaryNormalMap(value:TextureBase)
	{
		if (this._secondaryNormalMap == value)
			return;

		if (this._secondaryNormalMap)
			this.iRemoveTexture(this._secondaryNormalMap);

		this._secondaryNormalMap = value;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		super.dispose();

		this._secondaryNormalMap = null;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);

		var data:Float32Array = shader.fragmentConstantData;
		var index:number = methodVO.fragmentConstantsIndex;

		data[index + 4] = this._water1OffsetX;
		data[index + 5] = this._water1OffsetY;
		data[index + 6] = this._water2OffsetX;
		data[index + 7] = this._water2OffsetY;

		if (this._secondaryNormalMap)
			methodVO.secondaryTextureGL.activate(methodVO.pass._render);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		super.iSetRenderState(shader, methodVO, renderable, stage, camera);

		if (this._secondaryNormalMap)
			methodVO.secondaryTextureGL._setRenderState(renderable);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = dataReg.index*4;

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n";

		if (this.texture)
			code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, temp);

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n";

		if (this._secondaryNormalMap)
			code += methodVO.secondaryTextureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp);

		code +=	"add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
			"mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
			"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";

		return code;
	}
}