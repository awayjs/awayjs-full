import {AssetEvent}						from "@awayjs/core/lib/events/AssetEvent";

import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {LightingMethodBase}				from "../methods/LightingMethodBase";
import {ShadingMethodBase}				from "../methods/ShadingMethodBase";

/**
 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
export class SpecularBasicMethod extends LightingMethodBase
{
	public _pTotalLightColorReg:ShaderRegisterElement;
	public _pSpecularTexData:ShaderRegisterElement;
	public _pSpecularDataRegister:ShaderRegisterElement;

	private _texture:TextureBase;

	private _gloss:number = 50;
	private _strength:number = 1;
	private _color:number = 0xffffff;
	public _iSpecularR:number = 1;
	public _iSpecularG:number = 1;
	public _iSpecularB:number = 1;
	public _pIsFirstLight:boolean;

	/**
	 * Creates a new SpecularBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	public iIsUsed(shader:LightingShader):boolean
	{
		if (!shader.numLights)
			return false;

		return true;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		methodVO.needsNormals = shader.numLights > 0;
		methodVO.needsView = shader.numLights > 0;

		if (this._texture) {
			methodVO.textureGL = shader.getAbstraction(this._texture);
			shader.uvDependencies++;
		} else if (methodVO.textureGL) {
			methodVO.textureGL.onClear(new AssetEvent(AssetEvent.CLEAR, null));
			methodVO.textureGL = null;
		}
	}

	/**
	 * The glossiness of the material (sharpness of the specular highlight).
	 */
	public get gloss():number
	{
		return this._gloss;
	}

	public set gloss(value:number)
	{
		this._gloss = value;
	}

	/**
	 * The overall strength of the specular highlights.
	 */
	public get strength():number
	{
		return this._strength;
	}

	public set strength(value:number)
	{
		if (value == this._strength)
			return;

		this._strength = value;
		this.updateSpecular();
	}

	/**
	 * The colour of the specular reflection of the surface.
	 */
	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		if (this._color == value)
			return;

		// specular is now either enabled or disabled
		if (this._color == 0 || value == 0)
			this.iInvalidateShaderProgram();

		this._color = value;
		this.updateSpecular();
	}

	/**
	 * A texture that defines the strength of specular reflections for each texel in the red channel,
	 * and the gloss factor (sharpness) in the green channel. You can use Specular2DTexture if you want to easily set
	 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
	 */
	public get texture():TextureBase
	{
		return this._texture;
	}

	public set texture(value:TextureBase)
	{
		if (this._texture == value)
			return;

		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{

		var m:any = method;
		var bsm:SpecularBasicMethod = <SpecularBasicMethod> method;

		var spec:SpecularBasicMethod = bsm;//SpecularBasicMethod(method);
		this.texture = spec.texture;
		this.strength = spec.strength;
		this.color = spec.color;
		this.gloss = spec.gloss;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData():void
	{
		super.iCleanCompilationData();
		this._pTotalLightColorReg = null;
		this._pSpecularTexData = null;
		this._pSpecularDataRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

		this._pSpecularDataRegister = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = this._pSpecularDataRegister.index*4;

		if (this._texture) {

			this._pSpecularTexData = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(this._pSpecularTexData, 1);

			code += methodVO.textureGL._iGetFragmentCode(this._pSpecularTexData, registerCache, sharedRegisters, sharedRegisters.uvVarying);
		}

		this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shader:LightingShader, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		// blinn-phong half vector model
		code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" +
				"nrm " + t + ".xyz, " + t + "\n" +
				"dp3 " + t + ".w, " + normalReg + ", " + t + "\n" +
				"sat " + t + ".w, " + t + ".w\n";

		if (this._texture) {
			// apply gloss modulation from texture
			code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" +
					"pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
		} else {
			code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
		}

		// attenuate
		if (shader.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);

		code += "mul " + t + ".xyz, " + lightColReg + ", " + t + ".w\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerProbe(shader:LightingShader, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;

		code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" +
				"add " + t + ".w, " + t + ".w, " + t + ".w\n" +
				"mul " + t + ", " + t + ".w, " + normalReg + "\n" +
				"sub " + t + ", " + t + ", " + viewDirReg + "\n" +
				"tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + "linear" + ",miplinear>\n" +
				"mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (sharedRegisters.shadowTarget)
			code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";

		if (this._texture) {
			// apply strength modulation from texture
			code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularTexData + ".x\n";
			registerCache.removeFragmentTempUsage(this._pSpecularTexData);
		}

		// apply material's specular reflection
		code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularDataRegister + "\n" +
			"add " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n";
		registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		if (this._texture)
			methodVO.textureGL.activate(methodVO.pass._render);

		var index:number = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = this._iSpecularR;
		data[index + 1] = this._iSpecularG;
		data[index + 2] = this._iSpecularB;
		data[index + 3] = this._gloss;
	}

	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		if (this._texture)
			methodVO.textureGL._setRenderState(renderable);
	}

	/**
	 * Updates the specular color data used by the render state.
	 */
	private updateSpecular():void
	{
		this._iSpecularR = (( this._color >> 16) & 0xff)/0xff*this._strength;
		this._iSpecularG = (( this._color >> 8) & 0xff)/0xff*this._strength;
		this._iSpecularB = ( this._color & 0xff)/0xff*this._strength;
	}
}