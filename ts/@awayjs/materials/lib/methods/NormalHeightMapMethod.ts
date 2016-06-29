import {Single2DTexture}					from "@awayjs/display/lib/textures/Single2DTexture";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {NormalBasicMethod}				from "../methods/NormalBasicMethod";
import {ShadingMethodBase}				from "../methods/ShadingMethodBase";

/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
export class NormalHeightMapMethod extends NormalBasicMethod
{
	private _worldXYRatio:number;
	private _worldXZRatio:number;

	/**
	 * Creates a new NormalHeightMapMethod method.
	 *
	 * @param heightMap The texture containing the height data. 0 means low, 1 means high.
	 * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
	 * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
	 * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
	 */
	constructor(heightMap:TextureBase, worldWidth:number, worldHeight:number, worldDepth:number)
	{
		super();

		this.texture = heightMap;
		this._worldXYRatio = worldWidth/worldHeight;
		this._worldXZRatio = worldDepth/worldHeight;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = 1/(<Single2DTexture> this.texture).image2D.width;
		data[index + 1] = 1/(<Single2DTexture> this.texture).image2D.height;
		data[index + 2] = 0;
		data[index + 3] = 1;
		data[index + 4] = this._worldXYRatio;
		data[index + 5] = this._worldXZRatio;
	}

	/**
	 * @inheritDoc
	 */
	public get tangentSpace():boolean
	{
		return false;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
		super.copyFrom(method);

		this._worldXYRatio = (<NormalHeightMapMethod> method)._worldXYRatio;
		this._worldXZRatio = (<NormalHeightMapMethod> method)._worldXZRatio;
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

		code+= methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +

			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" +

		methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +

			"sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" +
			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" +

		methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +

			"sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" +
			"mov " + targetReg + ".y, " + dataReg + ".w\n" +
			"mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";

		registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}