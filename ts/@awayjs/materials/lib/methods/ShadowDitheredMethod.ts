import {BitmapImage2D}					from "@awayjs/core/lib/image/BitmapImage2D";

import {Camera}							from "@awayjs/display/lib/display/Camera";
import {DirectionalLight}					from "@awayjs/display/lib/display/DirectionalLight";
import {Single2DTexture}					from "@awayjs/display/lib/textures/Single2DTexture";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {ShadowMethodBase}					from "../methods/ShadowMethodBase";

/**
 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export class ShadowDitheredMethod extends ShadowMethodBase
{
	private static _grainTexture:Single2DTexture;
	private static _grainUsages:number /*int*/;
	private static _grainBitmapImage2D:BitmapImage2D;
	private _depthMapSize:number /*int*/;
	private _range:number;
	private _numSamples:number /*int*/;

	/**
	 * Creates a new ShadowDitheredMethod object.
	 * @param castingLight The light casting the shadows
	 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
	 */
	constructor(castingLight:DirectionalLight, numSamples:number /*int*/ = 4, range:number = 1)
	{
		super(castingLight);

		this._depthMapSize = this._pCastingLight.shadowMapper.depthMapSize;

		this.numSamples = numSamples;
		this.range = range;

		++ShadowDitheredMethod._grainUsages;

		if (!ShadowDitheredMethod._grainTexture)
			this.initGrainTexture();
	}

	/**
	 * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
	 * complexity of the shader.
	 */
	public get numSamples():number /*int*/
	{
		return this._numSamples;
	}

	public set numSamples(value:number /*int*/)
	{
		if (value < 1)
			value = 1;
		else if (value > 24)
			value = 24;

		if (this._numSamples == value)
			return;

		this._numSamples = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		super.iInitVO(shader, methodVO);

		methodVO.needsProjection = true;

		methodVO.secondaryTextureGL = shader.getAbstraction(ShadowDitheredMethod._grainTexture);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		super.iInitConstants(shader, methodVO);

		var fragmentData:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		fragmentData[index + 8] = 1/this._numSamples;
	}

	/**
	 * The range in the shadow map in which to distribute the samples.
	 */
	public get range():number
	{
		return this._range*2;
	}

	public set range(value:number)
	{
		this._range = value/2;
	}

	/**
	 * Creates a texture containing the dithering noise texture.
	 */
	private initGrainTexture():void
	{
		ShadowDitheredMethod._grainBitmapImage2D = new BitmapImage2D(64, 64, false);
		var vec:Array<number> /*uint*/ = new Array<number>();
		var len:number /*uint*/ = 4096;
		var step:number = 1/(this._depthMapSize*this._range);
		var r:number, g:number;

		for (var i:number /*uint*/ = 0; i < len; ++i) {
			r = 2*(Math.random() - .5);
			g = 2*(Math.random() - .5);
			if (r < 0)
				r -= step; else
				r += step;
			if (g < 0)
				g -= step; else
				g += step;
			if (r > 1)
				r = 1; else if (r < -1)
				r = -1;
			if (g > 1)
				g = 1; else if (g < -1)
				g = -1;
			vec[i] = (Math.floor((r*.5 + .5)*0xff) << 16) | (Math.floor((g*.5 + .5)*0xff) << 8);
		}

		ShadowDitheredMethod._grainBitmapImage2D.setArray(ShadowDitheredMethod._grainBitmapImage2D.rect, vec);
		ShadowDitheredMethod._grainTexture = new Single2DTexture(ShadowDitheredMethod._grainBitmapImage2D);
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (--ShadowDitheredMethod._grainUsages == 0) {
			ShadowDitheredMethod._grainTexture.dispose();
			ShadowDitheredMethod._grainBitmapImage2D.dispose();
			ShadowDitheredMethod._grainTexture = null;
		}
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		super.iActivate(shader, methodVO, stage);

		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*uint*/ = methodVO.fragmentConstantsIndex;
		data[index + 9] = (stage.width - 1)/63;
		data[index + 10] = (stage.height - 1)/63;
		data[index + 11] = 2*this._range/this._depthMapSize;

		methodVO.secondaryTextureGL.activate(methodVO.pass._render);
	}


	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		super.iSetRenderState(shader, methodVO, renderable, stage, camera);

		methodVO.secondaryTextureGL._setRenderState(renderable);
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = decReg.index*4;

		return this.getSampleCode(shader, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters);
	}

	/**
	 * Get the actual shader code for shadow mapping
	 * @param regCache The register cache managing the registers.
	 * @param depthMapRegister The texture register containing the depth map.
	 * @param decReg The register containing the depth map decoding data.
	 * @param targetReg The target register to add the shadow coverage.
	 */
	private getSampleCode(shader:ShaderBase, methodVO:MethodVO, customDataReg:ShaderRegisterElement, decReg:ShaderRegisterElement, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var numSamples:number /*int*/ = this._numSamples;
		var uvReg:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(uvReg, 1);
		var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(temp, 1);

		var projectionReg:ShaderRegisterElement = sharedRegisters.projectionFragment;

		code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" +
			"mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";

		while (numSamples > 0) {
			if (numSamples == this._numSamples) {
				code += methodVO.secondaryTextureGL._iGetFragmentCode(uvReg, regCache, sharedRegisters, uvReg);
			} else {
				code += "mov " + temp + ", " + uvReg + ".zwxy \n" +
					methodVO.secondaryTextureGL._iGetFragmentCode(uvReg, regCache, sharedRegisters, temp);
			}

			// keep grain in uvReg.zw
			code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" + // uv-.5
				"mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)

			if (numSamples == this._numSamples) {
				// first sample
				code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._pDepthMapCoordReg + ".xy\n" +
					methodVO.textureGL._iGetFragmentCode(temp, regCache, sharedRegisters, uvReg) +
					"dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" +
					"slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
			} else {
				code += this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
			}

			if (numSamples > 4)
				code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (numSamples > 1)
				code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (numSamples > 5)
				code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (numSamples > 2) {
				code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz
				code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._pDepthMapCoordReg + ".xy\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
			}

			if (numSamples > 6)
				code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (numSamples > 3)
				code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (numSamples > 7)
				code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);

			numSamples -= 8;
		}

		regCache.removeFragmentTempUsage(temp);
		regCache.removeFragmentTempUsage(uvReg);
		code += "mul " + targetReg + ".w, " + targetReg + ".w, " + customDataReg + ".x\n"; // average
		return code;
	}

	/**
	 * Adds the code for another tap to the shader code.
	 * @param uvReg The uv register for the tap.
	 * @param depthMapRegister The texture register containing the depth map.
	 * @param decReg The register containing the depth map decoding data.
	 * @param targetReg The target register to add the tap comparison result.
	 * @param regCache The register cache managing the registers.
	 * @return
	 */
	private addSample(shader:ShaderBase, methodVO:MethodVO, uvReg:ShaderRegisterElement, decReg:ShaderRegisterElement, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		return methodVO.textureGL._iGetFragmentCode(temp, regCache, sharedRegisters, uvReg) +
			"dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" +
			"slt " + temp + ".z, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
			"add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*uint*/ = methodVO.secondaryFragmentConstantsIndex;
		data[index] = 1/this._numSamples;
		data[index + 1] = (stage.width - 1)/63;
		data[index + 2] = (stage.height - 1)/63;
		data[index + 3] = 2*this._range/this._depthMapSize;

		methodVO.secondaryTextureGL.activate(methodVO.pass._render);
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shader:ShaderBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._pDepthMapCoordReg = depthProjection;

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		return this.getSampleCode(shader, methodVO, dataReg, decodeRegister, targetRegister, registerCache, sharedRegisters);
	}
}