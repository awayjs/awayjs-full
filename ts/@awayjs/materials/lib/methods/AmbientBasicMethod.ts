import {AssetEvent}						from "@awayjs/core/lib/events/AssetEvent";
import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {ShadingMethodBase}				from "../methods/ShadingMethodBase";

/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
export class AmbientBasicMethod extends ShadingMethodBase
{
	private _color:number;
	private _alpha:number = 1;

	public _texture:TextureBase;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	private _strength:number = 1;

	/**
	 * Creates a new AmbientBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		if (this._texture) {
			methodVO.textureGL = shader.getAbstraction(this._texture);
			shader.uvDependencies++;
		} else if (methodVO.textureGL) {
			methodVO.textureGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._texture));
			methodVO.textureGL = null;
		}
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		if (!methodVO.textureGL) {
			this._color = shader.numLights? 0xFFFFFF : methodVO.pass._surface.style.color;
			this.updateColor();
		}
	}

	/**
	 * The strength of the ambient reflection of the surface.
	 */
	public get strength():number
	{
		return this._strength;
	}

	public set strength(value:number)
	{
		if (this._strength == value)
			return;

		this._strength = value;

		this.updateColor();
	}

	/**
	 * The alpha component of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		if (this._alpha == value)
			return;

		this._alpha = value;

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
	public copyFrom(method:ShadingMethodBase):void
	{
		var m:any = method;
		var b:AmbientBasicMethod = <AmbientBasicMethod> m;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (methodVO.textureGL) {
			code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			if (shader.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
				methodVO.fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
					"kil " + targetReg + ".w\n" +
					"add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}

		} else {
			var ambientInputRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			methodVO.fragmentConstantsIndex = ambientInputRegister.index*4;

			code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		if (methodVO.textureGL) {
			methodVO.textureGL.activate(methodVO.pass._render);

			if (shader.alphaThreshold > 0)
				shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = shader.alphaThreshold;
		} else {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Float32Array = shader.fragmentConstantData;
			data[index] = this._colorR;
			data[index + 1] = this._colorG;
			data[index + 2] = this._colorB;
			data[index + 3] = this._alpha;
		}
	}

	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		if (methodVO.textureGL)
			methodVO.textureGL._setRenderState(renderable);
	}

	/**
	 * Updates the ambient color data used by the render state.
	 */
	private updateColor():void
	{
		this._colorR = ((this._color >> 16) & 0xff)/0xff*this._strength;
		this._colorG = ((this._color >> 8) & 0xff)/0xff*this._strength;
		this._colorB = (this._color & 0xff)/0xff*this._strength;
	}
}