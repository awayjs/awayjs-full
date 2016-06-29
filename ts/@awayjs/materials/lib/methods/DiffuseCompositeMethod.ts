import {Camera}							from "@awayjs/display/lib/display/Camera";
import {TextureBase}						from "@awayjs/display/lib/textures/TextureBase";
import {ISurface}							from "@awayjs/display/lib/base/ISurface";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import {ShadingMethodEvent}				from "@awayjs/renderer/lib/events/ShadingMethodEvent";
import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";

import {MethodVO}							from "../data/MethodVO";
import {DiffuseBasicMethod}				from "../methods/DiffuseBasicMethod";

/**
 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class DiffuseCompositeMethod extends DiffuseBasicMethod
{
	public pBaseMethod:DiffuseBasicMethod;

	private _onShaderInvalidatedDelegate:(event:ShadingMethodEvent) => void;

	/**
	 * Creates a new <code>DiffuseCompositeMethod</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base diffuse method on which this method's shading is based.
	 */
	constructor(modulateMethod:(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string, baseMethod:DiffuseBasicMethod = null)
	{
		super();

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this.pBaseMethod = baseMethod || new DiffuseBasicMethod();
		this.pBaseMethod._iModulateMethod = modulateMethod;
		this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * The base diffuse method on which this method's shading is based.
	 */
	public get baseMethod():DiffuseBasicMethod
	{
		return this.pBaseMethod;
	}

	public set baseMethod(value:DiffuseBasicMethod)
	{
		if (this.pBaseMethod == value)
			return;

		this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this.pBaseMethod = value;
		this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		this.pBaseMethod.iInitVO(shader, methodVO);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:LightingShader, methodVO:MethodVO):void
	{
		this.pBaseMethod.iInitConstants(shader, methodVO);
	}

	public iAddOwner(owner:ISurface):void
	{
		super.iAddOwner(owner);

		this.pBaseMethod.iAddOwner(owner);
	}

	public iRemoveOwner(owner:ISurface):void
	{
		super.iRemoveOwner(owner);

		this.pBaseMethod.iRemoveOwner(owner);
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this.pBaseMethod.dispose();
	}

	/**
	 * @inheritDoc
	 */
	public get texture():TextureBase
	{
		return this.pBaseMethod.texture;
	}

	/**
	 * @inheritDoc
	 */
	public set texture(value:TextureBase)
	{
		this.pBaseMethod.texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public get color():number
	{
		return this.pBaseMethod.color;
	}

	/**
	 * @inheritDoc
	 */
	public set color(value:number)
	{
		this.pBaseMethod.color = value;
	}

	/**
	 * @inheritDoc
	 */
	public get multiply():boolean
	{
		return this.pBaseMethod.multiply;
	}

	/**
	 * @inheritDoc
	 */
	public set multiply(value:boolean)
	{
		this.pBaseMethod.multiply = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this.pBaseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shader:LightingShader, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this.pBaseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
		this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerProbe(shader:LightingShader, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this.pBaseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
		this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		this.pBaseMethod.iActivate(shader, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		this.pBaseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
	}

	/**
	 * @inheritDoc
	 */
	public iDeactivate(shader:LightingShader, methodVO:MethodVO, stage:Stage):void
	{
		this.pBaseMethod.iDeactivate(shader, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shader:ShaderBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this.pBaseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this.pBaseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iReset():void
	{
		this.pBaseMethod.iReset();
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData():void
	{
		super.iCleanCompilationData();
		this.pBaseMethod.iCleanCompilationData();
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent):void
	{
		this.iInvalidateShaderProgram();
	}
}