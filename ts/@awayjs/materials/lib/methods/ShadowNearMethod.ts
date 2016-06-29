import {NearDirectionalShadowMapper}		from "@awayjs/display/lib/materials/shadowmappers/NearDirectionalShadowMapper";
import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {ShadingMethodEvent}				from "@awayjs/renderer/lib/events/ShadingMethodEvent";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";

import {MethodVO}							from "../data/MethodVO";
import {ShadowMethodBase}					from "../methods/ShadowMethodBase";

// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
/**
 * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
export class ShadowNearMethod extends ShadowMethodBase
{
	private _baseMethod:ShadowMethodBase;

	private _fadeRatio:number;
	private _nearShadowMapper:NearDirectionalShadowMapper;

	private _onShaderInvalidatedDelegate:(event:ShadingMethodEvent) => void;

	/**
	 * Creates a new ShadowNearMethod object.
	 * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
	 * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	 */
	constructor(baseMethod:ShadowMethodBase, fadeRatio:number = .1)
	{
		super(baseMethod.castingLight);

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this._baseMethod = baseMethod;
		this._fadeRatio = fadeRatio;
		this._nearShadowMapper = <NearDirectionalShadowMapper> this._pCastingLight.shadowMapper;
		if (!this._nearShadowMapper)
			throw new Error("ShadowNearMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * The base shadow map method on which this method's shading is based.
	 */
	public get baseMethod():ShadowMethodBase
	{
		return this._baseMethod;
	}

	public set baseMethod(value:ShadowMethodBase)
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
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		super.iInitConstants(shader, methodVO);
		this._baseMethod.iInitConstants(shader, methodVO);

		var fragmentData:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		fragmentData[index + 2] = 0;
		fragmentData[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO):void
	{
		this._baseMethod.iInitVO(shader, methodVO);

		methodVO.needsProjection = true;
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * @inheritDoc
	 */
	public get alpha():number
	{
		return this._baseMethod.alpha;
	}

	public set alpha(value:number)
	{
		this._baseMethod.alpha = value;
	}

	/**
	 * @inheritDoc
	 */
	public get epsilon():number
	{
		return this._baseMethod.epsilon;
	}

	public set epsilon(value:number)
	{
		this._baseMethod.epsilon = value;
	}

	/**
	 * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	 */
	public get fadeRatio():number
	{
		return this._fadeRatio;
	}

	public set fadeRatio(value:number)
	{
		this._fadeRatio = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._baseMethod.iGetFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentSingleTemp();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" +
			"sub " + temp + ", " + temp + ", " + dataReg + ".x\n" +
			"mul " + temp + ", " + temp + ", " + dataReg + ".y\n" +
			"sat " + temp + ", " + temp + "\n" +
			"sub " + temp + ", " + dataReg + ".w," + temp + "\n" +
			"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" +
			"mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" +
			"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		this._baseMethod.iActivate(shader, methodVO, stage);
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
	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera):void
	{
		// todo: move this to activate (needs camera)
		var near:number = camera.projection.near;
		var d:number = camera.projection.far - near;
		var maxDistance:number = this._nearShadowMapper.coverageRatio;
		var minDistance:number = maxDistance*(1 - this._fadeRatio);

		maxDistance = near + maxDistance*d;
		minDistance = near + minDistance*d;

		var fragmentData:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		fragmentData[index] = minDistance;
		fragmentData[index + 1] = 1/(maxDistance - minDistance);

		this._baseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
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