import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";
import {ISurface}							from "@awayjs/display/lib/base/ISurface";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {ShadingMethodEvent}				from "@awayjs/renderer/lib/events/ShadingMethodEvent";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {SpecularBasicMethod}				from "../methods/SpecularBasicMethod";

/**
 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
 * calculated specular reflection strength.
 */
export class SpecularCompositeMethod extends SpecularBasicMethod
{
	private _baseMethod:SpecularBasicMethod;

	private _onShaderInvalidatedDelegate:(event:ShadingMethodEvent) => void;

	/**
	 * Creates a new <code>SpecularCompositeMethod</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
	 * @param baseMethod The base specular method on which this method's shading is based.
	 */
	constructor(modulateMethod:(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string, baseMethod:SpecularBasicMethod = null)
	{
		super();

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this._baseMethod = baseMethod || new SpecularBasicMethod();
		this._baseMethod._iModulateMethod = modulateMethod;
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		this._baseMethod.iInitVO(shader, methodVO);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		this._baseMethod.iInitConstants(shader, methodVO);
	}


	public iAddOwner(owner:ISurface):void
	{
		super.iAddOwner(owner);

		this._baseMethod.iAddOwner(owner);
	}

	public iRemoveOwner(owner:ISurface):void
	{
		super.iRemoveOwner(owner);

		this._baseMethod.iRemoveOwner(owner);
	}

	/**
	 * The base specular method on which this method's shading is based.
	 */
	public get baseMethod():SpecularBasicMethod
	{
		return this._baseMethod;
	}

	public set baseMethod(value:SpecularBasicMethod)
	{
		if (this._baseMethod == value)
			return;

		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this._baseMethod = value;

		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public get gloss():number
	{
		return this._baseMethod.gloss;
	}

	public set gloss(value:number)
	{
		this._baseMethod.gloss = value;
	}

	/**
	 * @inheritDoc
	 */
	public get strength():number
	{
		return this._baseMethod.strength;
	}

	public set strength(value:number)
	{
		this._baseMethod.strength = value;
	}

	/**
	 * @inheritDoc
	 */
	public get color():number
	{
		return this._baseMethod.color;
	}

	/**
	 * @inheritDoc
	 */
	public set color(value:number)
	{
		this._baseMethod.color = value;
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this._baseMethod.dispose();
	}

	/**
	 * @inheritDoc
	 */
	public get texture():TextureBase
	{
		return this._baseMethod.texture;
	}

	public set texture(value:TextureBase)
	{
		this._baseMethod.texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		this._baseMethod.iActivate(shader, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		this._baseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
	}

	/**
	 * @inheritDoc
	 */
	public iDeactivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		this._baseMethod.iDeactivate(shader, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shader:ShaderBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shader:LightingShader, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 * @return
	 */
	public iGetFragmentCodePerProbe(shader:LightingShader, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iReset():void
	{
		this._baseMethod.iReset();
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData():void
	{
		super.iCleanCompilationData();
		this._baseMethod.iCleanCompilationData();
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent):void
	{
		this.iInvalidateShaderProgram();
	}
}