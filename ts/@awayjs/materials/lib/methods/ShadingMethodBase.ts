import {AssetBase}					from "@awayjs/core/lib/library/AssetBase";

import {Camera}						from "@awayjs/display/lib/display/Camera";
import {ISurface}						from "@awayjs/display/lib/base/ISurface";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}			from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {ShadingMethodEvent}			from "@awayjs/renderer/lib/events/ShadingMethodEvent";
import {ShaderBase}					from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}			from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}						from "../data/MethodVO";


/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
export class ShadingMethodBase extends AssetBase
{
	public _textures:Array<TextureBase> = new Array<TextureBase>();

	public _owners:Array<ISurface> = new Array<ISurface>();
	public _counts:Array<number> = new Array<number>();

	public static assetType:string = "[asset ShadingMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadingMethodBase.assetType;
	}

	/**
	 * Create a new ShadingMethodBase object.
	 */
	constructor()
	{
		super();
	}

	public iIsUsed(shader:ShaderBase):boolean
	{
		return true;
	}

	/**
	 * Initializes the properties for a MethodVO, including register and texture indices.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{

	}

	/**
	 * Initializes unchanging shader constants using the data from a MethodVO.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{


	}

	/**
	 * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
	 */
	public iUsesTangentSpace():boolean
	{
		return true;
	}

	/**
	 * Cleans up any resources used by the current object.
	 */
	public dispose():void
	{

	}


	public iAddOwner(owner:ISurface):void
	{
		//a method can be used more than once in the same material, so we check for this
		var index:number = this._owners.indexOf(owner);

		if (index != -1) {
			this._counts[index]++;
		} else {
			this._owners.push(owner);
			this._counts.push(1);

			//add textures
			var len:number = this._textures.length;
			for (var i:number = 0; i< len; i++)
				owner.addTexture(this._textures[i]);
		}
	}

	public iRemoveOwner(owner:ISurface):void
	{
		var index:number = this._owners.indexOf(owner);

		if (this._counts[index] != 1) {
			this._counts[index]--;
		} else {
			this._owners.splice(index, 1);
			this._counts.splice(index, 1);

			//remove textures
			var len:number = this._textures.length;
			for (var i:number = 0; i< len; i++)
				owner.removeTexture(this._textures[i]);
		}
	}


	/**
	 *
	 */
	public iAddTexture(texture:TextureBase):void
	{
		this._textures.push(texture);

		var len:number = this._owners.length;
		for (var i:number = 0; i < len; i++)
			this._owners[i].addTexture(texture);
	}

	/**
	 *
	 */
	public iRemoveTexture(texture:TextureBase):void
	{
		this._textures.splice(this._textures.indexOf(texture), 1);

		var len:number = this._owners.length;
		for (var i:number = 0; i < len; i++)
			this._owners[i].removeTexture(texture);
	}

	/**
	 * Resets the compilation state of the method.
	 *
	 * @internal
	 */
	public iReset():void
	{
		this.iCleanCompilationData();
	}

	/**
	 * Resets the method's state for compilation.
	 *
	 * @internal
	 */
	public iCleanCompilationData():void
	{
	}

	/**
	 * Get the vertex shader code for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 *
	 * @internal
	 */
	public iGetVertexCode(shader:ShaderBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return null;
	}

	/**
	 * Sets the render state for this method.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{

	}

	/**
	 * Sets the render state for a single renderable.
	 *
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param renderable The renderable currently being rendered.
	 * @param stage The Stage object currently used for rendering.
	 * @param camera The camera from which the scene is currently rendered.
	 *
	 * @internal
	 */
	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{

	}

	/**
	 * Clears the render state for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	public iDeactivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{

	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @internal
	 */
	public iInvalidateShaderProgram():void
	{
		this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
	}

	/**
	 * Copies the state from a ShadingMethodBase object into the current object.
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
	}
}