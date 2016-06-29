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
import {ShadingMethodBase}				from "../methods/ShadingMethodBase";
import {LightingMethodBase}				from "../methods/LightingMethodBase";

/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
export class DiffuseBasicMethod extends LightingMethodBase
{
	private _multiply:boolean = true;

	public _pTotalLightColorReg:ShaderRegisterElement;

	public _texture:TextureBase;
	private _ambientColor:number;
	private _ambientColorR:number = 1;
	private _ambientColorG:number = 1;
	private _ambientColorB:number = 1;
	private _color:number = 0xffffff;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	public _pIsFirstLight:boolean;

	/**
	 * Creates a new DiffuseBasicMethod object.
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
	 * Set internally if diffuse color component multiplies or replaces the ambient color
	 */
	public get multiply():boolean
	{
		return this._multiply;
	}

	public set multiply(value:boolean)
	{
		if (this._multiply == value)
			return;

		this._multiply = value;

		this.iInvalidateShaderProgram();
	}

	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		if (this._texture) {
			methodVO.textureGL = shader.getAbstraction(this._texture);
			shader.uvDependencies++;
		} else if (methodVO.textureGL) {
			methodVO.textureGL.onClear(new AssetEvent(AssetEvent.CLEAR, null));
			methodVO.textureGL = null;
		}

		if (shader.numLights > 0) {
			shader.usesCommonData = true;
			methodVO.needsNormals = true;
		}
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:LightingShader, methodVO:MethodVO):void
	{
		if (shader.numLights > 0) {
			this._ambientColor = methodVO.pass._surface.style.color;
			this.updateAmbientColor();
		} else {
			this._ambientColor = null;
		}
	}

	/**
	 * The color of the diffuse reflection when not using a texture.
	 */
	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		if (this._color == value)
			return;

		this._color = value;

		this.updateColor();
	}

	/**
	 * The texture to use to define the diffuse reflection color per texel.
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
	public dispose():void
	{
		this._texture = null;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
		var diff:DiffuseBasicMethod = <DiffuseBasicMethod> method;

		this.texture = diff.texture;
		this.multiply = diff.multiply;
		this.color = diff.color;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData():void
	{
		super.iCleanCompilationData();

		this._pTotalLightColorReg = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

		registerCache.addFragmentTempUsages(this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp(), 1);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shader:LightingShader, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
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

		code += "dp3 " + t + ".x, " + lightDirReg + ", " + sharedRegisters.normalFragment + "\n" +
				"max " + t + ".w, " + t + ".x, " + sharedRegisters.commons + ".y\n";

		if (shader.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);

		code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";

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

		code += "tex " + t + ", " + sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" +
				"mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";

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

		var diffuseColor:ShaderRegisterElement;
		var cutOffReg:ShaderRegisterElement;

		// incorporate input from ambient
		if (sharedRegisters.shadowTarget)
			code += this.pApplyShadow(shader, methodVO, registerCache, sharedRegisters);

		registerCache.addFragmentTempUsages(diffuseColor = registerCache.getFreeFragmentVectorTemp(), 1);

		var ambientColorRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = ambientColorRegister.index*4;

		if (this._texture) {
			code += methodVO.textureGL._iGetFragmentCode(diffuseColor, registerCache, sharedRegisters, sharedRegisters.uvVarying);
		} else {
			var diffuseInputRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += "mov " + diffuseColor + ", " + diffuseInputRegister + "\n";
		}

		code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n" +
			"mul " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._pTotalLightColorReg + "\n";

		if (this._multiply) {
			code += "add " + diffuseColor + ".xyz, " + diffuseColor + ", " + ambientColorRegister + "\n" +
				"mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n";
		} else if (this._texture) {
			code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" + // multiply target by ambient for total ambient
				"mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
				"sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + // ambient * (1 - totalLightColor)
				"add " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; //add diffuse color and ambient color
		} else {
			code += "mul " + this._pTotalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._pTotalLightColorReg + "\n" +
				"sub " + this._pTotalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._pTotalLightColorReg + "\n" + // ambient * (1 - totalLightColor)
				"add " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._pTotalLightColorReg + "\n" + // add diffuse color and  ambient color
				"mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; // multiply by target which could be texture or white
		}

		registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
		registerCache.removeFragmentTempUsage(diffuseColor);

		return code;
	}

	/**
	 * Generate the code that applies the calculated shadow to the diffuse light
	 * @param methodVO The MethodVO object for which the compilation is currently happening.
	 * @param regCache The register cache the compiler is currently using for the register management.
	 */
	public pApplyShadow(shader:LightingShader, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		if (this._texture) {
			methodVO.textureGL.activate(methodVO.pass._render);
		} else {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Float32Array = shader.fragmentConstantData;
			if (this._multiply) {
				data[index + 4] = this._colorR*this._ambientColorR;
				data[index + 5] = this._colorG*this._ambientColorG;
				data[index + 6] = this._colorB*this._ambientColorB;
			} else {
				data[index + 4] = this._colorR;
				data[index + 5] = this._colorG;
				data[index + 6] = this._colorB;
			}
			data[index + 7] = 1;
		}
	}

	/**
	 * Updates the diffuse color data used by the render state.
	 */
	private updateColor():void
	{
		this._colorR = ((this._color >> 16) & 0xff)/0xff;
		this._colorG = ((this._color >> 8) & 0xff)/0xff;
		this._colorB = (this._color & 0xff)/0xff;
	}


	/**
	 * Updates the ambient color data used by the render state.
	 */
	private updateAmbientColor():void
	{
		this._ambientColorR = ((this._ambientColor >> 16) & 0xff)/0xff;
		this._ambientColorG = ((this._ambientColor >> 8) & 0xff)/0xff;
		this._ambientColorB = (this._ambientColor & 0xff)/0xff;
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		if (this._texture)
			methodVO.textureGL._setRenderState(renderable);

		//TODO move this to Activate (ambientR/G/B currently calc'd in render state)
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = shader.ambientR*this._ambientColorR;
		data[index + 1] = shader.ambientG*this._ambientColorG;
		data[index + 2] = shader.ambientB*this._ambientColorB;
		data[index + 3] = 1;
	}
}