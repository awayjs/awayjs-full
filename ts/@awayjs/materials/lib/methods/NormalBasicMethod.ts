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
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
export class NormalBasicMethod extends ShadingMethodBase
{
	private _texture:TextureBase;

	/**
	 * Creates a new NormalBasicMethod object.
	 */
	constructor(texture:TextureBase = null)
	{
		super();

		this._texture = texture;

		if (this._texture)
			this.iAddTexture(this._texture);
	}

	public iIsUsed(shader:ShaderBase):boolean
	{
		if (this._texture && shader.normalDependencies)
			return true;

		return false;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		if (this._texture) {
			methodVO.textureGL = shader.getAbstraction(this._texture);
			shader.uvDependencies++;
		}
	}

	/**
	 * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
	 */
	public iOutputsTangentNormals():boolean
	{
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
		var s:any = method;
		var bnm:NormalBasicMethod = <NormalBasicMethod> method;

		if (bnm.texture != null)
			this.texture = bnm.texture;
	}

	/**
	 * A texture to modulate the direction of the surface for each texel (normal map). The default normal method expects
	 * tangent-space normal maps, but others could expect object-space maps.
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
		if (this._texture)
			this._texture = null;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		if (this._texture)
			methodVO.textureGL.activate(methodVO.pass._render);
	}

	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		if (this._texture)
			methodVO.textureGL._setRenderState(renderable);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._texture)
			code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);


		code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + "\n";

		return code;
	}
}