import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";
import {Matrix}							from "@awayjs/core/lib/geom/Matrix";
import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix3DUtils}					from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";
import {AbstractMethodError}				from "@awayjs/core/lib/errors/AbstractMethodError";
import {AssetEvent}						from "@awayjs/core/lib/events/AssetEvent";
import {MaterialBase}						from "@awayjs/display/lib/materials/MaterialBase";

import {Camera}							from "@awayjs/display/lib/display/Camera";
import {ISurface}							from "@awayjs/display/lib/base/ISurface";
import {LightPickerBase}					from "@awayjs/display/lib/materials/lightpickers/LightPickerBase";
import {LightSources}						from "@awayjs/display/lib/materials/LightSources";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {RendererBase}						from "@awayjs/renderer/lib/RendererBase";
import {LightingShader}					from "@awayjs/renderer/lib/shaders/LightingShader";
import {ShadingMethodEvent}				from "@awayjs/renderer/lib/events/ShadingMethodEvent";
import {ShaderBase}						from "@awayjs/renderer/lib/shaders/ShaderBase";
import {ShaderRegisterCache}				from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import {ShaderRegisterElement}			from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import {GL_RenderableBase}				from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import {PassBase}							from "@awayjs/renderer/lib/surfaces/passes/PassBase";
import {ILightingPass}					from "@awayjs/renderer/lib/surfaces/passes/ILightingPass";
import {IElementsClassGL}					from "@awayjs/renderer/lib/elements/IElementsClassGL";

import {MethodVO}							from "../../data/MethodVO";
import {AmbientBasicMethod}				from "../../methods/AmbientBasicMethod";
import {DiffuseBasicMethod}				from "../../methods/DiffuseBasicMethod";
import {EffectColorTransformMethod}		from "../../methods/EffectColorTransformMethod";
import {EffectMethodBase}					from "../../methods/EffectMethodBase";
import {LightingMethodBase}				from "../../methods/LightingMethodBase";
import {NormalBasicMethod}				from "../../methods/NormalBasicMethod";
import {ShadowMapMethodBase}				from "../../methods/ShadowMapMethodBase";
import {SpecularBasicMethod}				from "../../methods/SpecularBasicMethod";
import {MethodPassMode}					from "../../surfaces/passes/MethodPassMode";
import {GL_MethodMaterialSurface}			from "../../surfaces/GL_MethodMaterialSurface";

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
export class MethodPass extends PassBase implements ILightingPass
{
	private _maxLights:number = 3;

	private _mode:number = 0x03;
	private _material:MaterialBase;
	private _lightPicker:LightPickerBase;

	private _includeCasters:boolean = true;

	public _iColorTransformMethodVO:MethodVO;
	public _iNormalMethodVO:MethodVO;
	public _iAmbientMethodVO:MethodVO;
	public _iShadowMethodVO:MethodVO;
	public _iDiffuseMethodVO:MethodVO;
	public _iSpecularMethodVO:MethodVO;
	public _iMethodVOs:Array<MethodVO> = new Array<MethodVO>();

	public _numEffectDependencies:number = 0;

	private _onLightsChangeDelegate:(event:AssetEvent) => void;
	private _onMethodInvalidatedDelegate:(event:ShadingMethodEvent) => void;

	public numDirectionalLights:number = 0;

	public numPointLights:number = 0;

	public numLightProbes:number = 0;

	public pointLightsOffset:number = 0;
	
	public directionalLightsOffset:number= 0;
	
	public lightProbesOffset:number = 0;
	
	/**
	 *
	 */
	public get mode():number
	{
		return this._mode;
	}

	public set mode(value:number)
	{
		if (this._mode == value)
			return;
		
		this._mode = value;

		this._updateLights();
	}

	/**
	 * Indicates whether or not shadow casting lights need to be included.
	 */
	public get includeCasters():boolean
	{
		return this._includeCasters;
	}

	public set includeCasters(value:boolean)
	{
		if (this._includeCasters == value)
			return;

		this._includeCasters = value;

		this._updateLights();
	}

	/**
	 * 
	 * @returns {LightPickerBase}
	 */
	public get lightPicker():LightPickerBase
	{
		return this._lightPicker;
	}

	public set lightPicker(value:LightPickerBase)
	{
		//if (this._lightPicker == value)
		//	return;

		if (this._lightPicker)
			this._lightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);

		this._lightPicker = value;

		if (this._lightPicker)
			this._lightPicker.addEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);

		this._updateLights();
	}
	
	/**
	 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
	 * compatibility for constrained mode.
	 */
	public get enableLightFallOff():boolean
	{
		return this._material.enableLightFallOff;
	}

	/**
	 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
	 * and/or light probes for diffuse reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get diffuseLightSources():number
	{
		return this._material.diffuseLightSources;
	}

	/**
	 * Define which light source types to use for specular reflections. This allows choosing between regular lights
	 * and/or light probes for specular reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get specularLightSources():number
	{
		return this._material.specularLightSources;
	}

	/**
	 * Creates a new CompiledPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(mode:number, render:GL_MethodMaterialSurface, renderOwner:MaterialBase, elementsClass:IElementsClassGL, stage:Stage)
	{
		super(render, renderOwner, elementsClass, stage);

		this._mode = mode;

		this._material = renderOwner;

		this._onLightsChangeDelegate = (event:AssetEvent) => this.onLightsChange(event);
		
		this._onMethodInvalidatedDelegate = (event:ShadingMethodEvent) => this.onMethodInvalidated(event);

		this.lightPicker = renderOwner.lightPicker;

		if (this._shader == null)
			this._updateShader();
	}

	private _updateShader():void
	{
		if ((this.numDirectionalLights || this.numPointLights || this.numLightProbes) && !(this._shader instanceof LightingShader)) {
			if (this._shader != null)
				this._shader.dispose();

			this._shader = new LightingShader(this._elementsClass, this, this._stage);
		} else if (!(this._shader instanceof ShaderBase)) {
			if (this._shader != null)
				this._shader.dispose();

			this._shader = new ShaderBase(this._elementsClass, this, this._stage);
		}
	}

	/**
	 * Initializes the unchanging constant data for this material.
	 */
	public _iInitConstantData(shader:ShaderBase):void
	{
		super._iInitConstantData(shader);

		//Updates method constants if they have changed.
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i)
			this._iMethodVOs[i].method.iInitConstants(shader, this._iMethodVOs[i]);
	}

	/**
	 * The ColorTransform object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransform():ColorTransform
	{
		return this.colorTransformMethod? this.colorTransformMethod.colorTransform : null;
	}

	public set colorTransform(value:ColorTransform)
	{
		if (value) {
			if (this.colorTransformMethod == null)
				this.colorTransformMethod = new EffectColorTransformMethod();

			this.colorTransformMethod.colorTransform = value;

		} else if (!value) {
			if (this.colorTransformMethod)
				this.colorTransformMethod = null;
		}
	}

	/**
	 * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransformMethod():EffectColorTransformMethod
	{
		return this._iColorTransformMethodVO? <EffectColorTransformMethod> this._iColorTransformMethodVO.method : null;
	}

	public set colorTransformMethod(value:EffectColorTransformMethod)
	{
		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.method == value)
			return;

		if (this._iColorTransformMethodVO) {
			this._removeDependency(this._iColorTransformMethodVO);
			this._iColorTransformMethodVO = null;
		}

		if (value) {
			this._iColorTransformMethodVO = new MethodVO(value, this);
			this._addDependency(this._iColorTransformMethodVO);
		}
	}

	private _removeDependency(methodVO:MethodVO, effectsDependency:boolean = false):void
	{
		var index:number = this._iMethodVOs.indexOf(methodVO);

		if (!effectsDependency)
			this._numEffectDependencies--;

		methodVO.method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);
		this._iMethodVOs.splice(index, 1);

		this.invalidate();
	}

	private _addDependency(methodVO:MethodVO, effectsDependency:boolean = false, index:number = -1):void
	{
		methodVO.method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);

		if (effectsDependency) {
			if (index != -1)
				this._iMethodVOs.splice(index + this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
			else
				this._iMethodVOs.push(methodVO);
			this._numEffectDependencies++;
		} else {
			this._iMethodVOs.splice(this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
		}

		this.invalidate();
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:EffectMethodBase):void
	{
		this._addDependency(new MethodVO(method, this), true);
	}

	/**
	 * The number of "effect" methods added to the material.
	 */
	public get numEffectMethods():number
	{
		return this._numEffectDependencies;
	}

	/**
	 * Queries whether a given effects method was added to the material.
	 *
	 * @param method The method to be queried.
	 * @return true if the method was added to the material, false otherwise.
	 */
	public hasEffectMethod(method:EffectMethodBase):boolean
	{
		return this.getDependencyForMethod(method) != null;
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):EffectMethodBase
	{
		if (index < 0 || index > this._numEffectDependencies - 1)
			return null;

		return <EffectMethodBase> this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies].method;
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:EffectMethodBase, index:number):void
	{
		this._addDependency(new MethodVO(method, this), true, index);
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase):void
	{
		var methodVO:MethodVO = this.getDependencyForMethod(method);

		if (methodVO != null)
			this._removeDependency(methodVO, true);
	}


	/**
	 * remove an effect method at the specified index from the material.
	 */
	public removeEffectMethodAt(index:number):void
	{
		if (index < 0 || index > this._numEffectDependencies - 1)
			return;

		var methodVO:MethodVO = this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies];

		if (methodVO != null)
			this._removeDependency(methodVO, true);
	}


	private getDependencyForMethod(method:EffectMethodBase):MethodVO
	{
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i)
			if (this._iMethodVOs[i].method == method)
				return this._iMethodVOs[i];

		return null;
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():NormalBasicMethod
	{
		return this._iNormalMethodVO? <NormalBasicMethod> this._iNormalMethodVO.method : null;
	}

	public set normalMethod(value:NormalBasicMethod)
	{
		if (this._iNormalMethodVO && this._iNormalMethodVO.method == value)
			return;

		if (this._iNormalMethodVO) {
			this._removeDependency(this._iNormalMethodVO);
			this._iNormalMethodVO = null;
		}

		if (value) {
			this._iNormalMethodVO = new MethodVO(value, this);
			this._addDependency(this._iNormalMethodVO);
		}
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():AmbientBasicMethod
	{
		return this._iAmbientMethodVO? <AmbientBasicMethod> this._iAmbientMethodVO.method : null;
	}

	public set ambientMethod(value:AmbientBasicMethod)
	{
		if (this._iAmbientMethodVO && this._iAmbientMethodVO.method == value)
			return;

		if (this._iAmbientMethodVO) {
			this._removeDependency(this._iAmbientMethodVO);
			this._iAmbientMethodVO = null;
		}

		if (value) {
			this._iAmbientMethodVO = new MethodVO(value, this);
			this._addDependency(this._iAmbientMethodVO);
		}
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():ShadowMapMethodBase
	{
		return this._iShadowMethodVO? <ShadowMapMethodBase> this._iShadowMethodVO.method : null;
	}

	public set shadowMethod(value:ShadowMapMethodBase)
	{
		if (this._iShadowMethodVO && this._iShadowMethodVO.method == value)
			return;

		if (this._iShadowMethodVO) {
			this._removeDependency(this._iShadowMethodVO);
			this._iShadowMethodVO = null;
		}

		if (value) {
			this._iShadowMethodVO = new MethodVO(value, this);
			this._addDependency(this._iShadowMethodVO);
		}
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():DiffuseBasicMethod
	{
		return this._iDiffuseMethodVO? <DiffuseBasicMethod> this._iDiffuseMethodVO.method : null;
	}

	public set diffuseMethod(value:DiffuseBasicMethod)
	{
		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.method == value)
			return;

		if (this._iDiffuseMethodVO) {
			this._removeDependency(this._iDiffuseMethodVO);
			this._iDiffuseMethodVO = null;
		}

		if (value) {
			this._iDiffuseMethodVO = new MethodVO(value, this);
			this._addDependency(this._iDiffuseMethodVO);
		}
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():SpecularBasicMethod
	{
		return this._iSpecularMethodVO? <SpecularBasicMethod> this._iSpecularMethodVO.method : null;
	}

	public set specularMethod(value:SpecularBasicMethod)
	{
		if (this._iSpecularMethodVO && this._iSpecularMethodVO.method == value)
			return;

		if (this._iSpecularMethodVO) {
			this._removeDependency(this._iSpecularMethodVO);
			this._iSpecularMethodVO = null;
		}

		if (value) {
			this._iSpecularMethodVO = new MethodVO(value, this);
			this._addDependency(this._iSpecularMethodVO);
		}
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (this._lightPicker)
			this._lightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);

		while (this._iMethodVOs.length)
			this._removeDependency(this._iMethodVOs[0]);

		super.dispose();

		this._iMethodVOs = null;
	}

	/**
	 * Called when any method's shader code is invalidated.
	 */
	private onMethodInvalidated(event:ShadingMethodEvent):void
	{
		this.invalidate();
	}

	// RENDER LOOP

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera):void
	{
		super._iActivate(camera);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iActivate(this._shader, methodVO, this._stage);
		}
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _setRenderState(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D):void
	{
		super._setRenderState(renderable, camera, viewProjection);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iSetRenderState(this._shader, methodVO, renderable, this._stage, camera);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iDeactivate():void
	{
		super._iDeactivate();

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iDeactivate(this._shader, methodVO, this._stage);
		}
	}

	public _iIncludeDependencies(shader:LightingShader):void
	{
		super._iIncludeDependencies(shader);

		//TODO: fragment animtion should be compatible with lighting pass
		shader.usesFragmentAnimation = Boolean(this._mode == MethodPassMode.SUPER_SHADER);

		if (shader.useAlphaPremultiplied && shader.usesBlending)
			shader.usesCommonData = true;

		var i:number;
		var len:number = this._iMethodVOs.length;
		for (i = 0; i < len; ++i)
			this.setupAndCountDependencies(shader, this._iMethodVOs[i]);

		var usesTangentSpace:boolean = true;

		var methodVO:MethodVO;
		for (i = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if ((methodVO.useMethod = methodVO.method.iIsUsed(shader)) && !methodVO.method.iUsesTangentSpace())
				usesTangentSpace = false;
		}

		shader.outputsNormals = this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
		shader.outputsTangentNormals = shader.outputsNormals && (<NormalBasicMethod> this._iNormalMethodVO.method).iOutputsTangentNormals();
		shader.usesTangentSpace = shader.outputsTangentNormals && !shader.usesProbes && usesTangentSpace;

		if (!shader.usesTangentSpace) {
			if (shader.viewDirDependencies > 0) {
				shader.globalPosDependencies++;
			} else if (this.numPointLights > 0 && shader.usesLights) {
				shader.globalPosDependencies++;
				if (Boolean(this._mode & MethodPassMode.EFFECTS))
					shader.usesGlobalPosFragment = true;
			}
		}
	}


	/**
	 * Counts the dependencies for a given method.
	 * @param method The method to count the dependencies for.
	 * @param methodVO The method's data for this material.
	 */
	private setupAndCountDependencies(shader:ShaderBase, methodVO:MethodVO):void
	{
		methodVO.reset();

		methodVO.method.iInitVO(shader, methodVO);

		if (methodVO.needsProjection)
			shader.projectionDependencies++;

		if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos) {

			shader.globalPosDependencies++;

			if (methodVO.needsGlobalFragmentPos)
				shader.usesGlobalPosFragment = true;

		}

		if (methodVO.needsNormals)
			shader.normalDependencies++;

		if (methodVO.needsTangents)
			shader.tangentDependencies++;

		if (methodVO.needsView)
			shader.viewDirDependencies++;
	}

	public _iGetPreLightingVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
			code += this._iAmbientMethodVO.method.iGetVertexCode(shader, this._iAmbientMethodVO, registerCache, sharedRegisters);

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
			code += this._iDiffuseMethodVO.method.iGetVertexCode(shader, this._iDiffuseMethodVO, registerCache, sharedRegisters);

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
			code += this._iSpecularMethodVO.method.iGetVertexCode(shader, this._iSpecularMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPreLightingFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod) {
			code += this._iAmbientMethodVO.method.iGetFragmentCode(shader, this._iAmbientMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			if (this._iAmbientMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._iAmbientMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
			code += (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentPreLightingCode(<LightingShader> shader, this._iDiffuseMethodVO, registerCache, sharedRegisters);

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
			code += (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentPreLightingCode(<LightingShader> shader, this._iSpecularMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPerLightDiffuseFragmentCode(shader:LightingShader, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentCodePerLight(shader, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
	}

	public _iGetPerLightSpecularFragmentCode(shader:LightingShader, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentCodePerLight(shader, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
	}

	public _iGetPerProbeDiffuseFragmentCode(shader:LightingShader, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentCodePerProbe(shader, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
	}

	public _iGetPerProbeSpecularFragmentCode(shader:LightingShader, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentCodePerProbe(shader, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
	}

	public _iGetPostLightingVertexCode(shader:LightingShader, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iShadowMethodVO)
			code += this._iShadowMethodVO.method.iGetVertexCode(shader, this._iShadowMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPostLightingFragmentCode(shader:LightingShader, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (shader.useAlphaPremultiplied && shader.usesBlending) {
			code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
			"div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" +
			"sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
			"sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
		}

		if (this._iShadowMethodVO)
			code += this._iShadowMethodVO.method.iGetFragmentCode(shader, this._iShadowMethodVO, sharedRegisters.shadowTarget, registerCache, sharedRegisters);

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod) {
			code += (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentPostLightingCode(shader, this._iDiffuseMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			// resolve other dependencies as well?
			if (this._iDiffuseMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._iDiffuseMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod) {
			code += (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentPostLightingCode(shader, this._iSpecularMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
			if (this._iSpecularMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
			if (this._iSpecularMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iShadowMethodVO)
			registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);

		return code;
	}


	public _iGetNormalVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._iNormalMethodVO.method.iGetVertexCode(shader, this._iNormalMethodVO, registerCache, sharedRegisters);
	}

	public _iGetNormalFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._iNormalMethodVO.method.iGetFragmentCode(shader, this._iNormalMethodVO, sharedRegisters.normalFragment, registerCache, sharedRegisters);

		if (this._iNormalMethodVO.needsView)
			registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);

		if (this._iNormalMethodVO.needsGlobalFragmentPos || this._iNormalMethodVO.needsGlobalVertexPos)
			registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetVertexCode(shader:ShaderBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod) {
				code += methodVO.method.iGetVertexCode(shader, methodVO, regCache, sharedReg);

				if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos)
					regCache.removeVertexTempUsage(sharedReg.globalPositionVertex);
			}
		}

		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
			code += this._iColorTransformMethodVO.method.iGetVertexCode(shader, this._iColorTransformMethodVO, regCache, sharedReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var alphaReg:ShaderRegisterElement;

		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			alphaReg = regCache.getFreeFragmentSingleTemp();
			regCache.addFragmentTempUsages(alphaReg, 1);
			code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
		}

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod) {
				code += methodVO.method.iGetFragmentCode(shader, methodVO, sharedReg.shadedTarget, regCache, sharedReg);

				if (methodVO.needsNormals)
					regCache.removeFragmentTempUsage(sharedReg.normalFragment);

				if (methodVO.needsView)
					regCache.removeFragmentTempUsage(sharedReg.viewDirFragment);

			}
		}

		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			code += "mov " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
			regCache.removeFragmentTempUsage(alphaReg);
		}

		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
			code += this._iColorTransformMethodVO.method.iGetFragmentCode(shader, this._iColorTransformMethodVO, sharedReg.shadedTarget, regCache, sharedReg);

		return code;
	}
	/**
	 * Indicates whether the shader uses any shadows.
	 */
	public _iUsesShadows(shader:ShaderBase):boolean
	{
		return Boolean(this._iShadowMethodVO && (this._lightPicker.castingDirectionalLights.length > 0 || this._lightPicker.castingPointLights.length > 0));
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesSpecular(shader:ShaderBase):boolean
	{
		return Boolean(this._iSpecularMethodVO);
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesDiffuse(shader:ShaderBase):boolean
	{
		return Boolean(this._iDiffuseMethodVO);
	}


	private onLightsChange(event:AssetEvent):void
	{
		this._updateLights();
	}

	private _updateLights():void
	{
		var numDirectionalLightsOld:number = this.numDirectionalLights;
		var numPointLightsOld:number = this.numPointLights;
		var numLightProbesOld:number = this.numLightProbes;

		if (this._lightPicker && (this._mode & MethodPassMode.LIGHTING)) {
			this.numDirectionalLights = this.calculateNumDirectionalLights(this._lightPicker.numDirectionalLights);
			this.numPointLights = this.calculateNumPointLights(this._lightPicker.numPointLights);
			this.numLightProbes = this.calculateNumProbes(this._lightPicker.numLightProbes);

			if (this._includeCasters) {
				this.numDirectionalLights += this._lightPicker.numCastingDirectionalLights;
				this.numPointLights += this._lightPicker.numCastingPointLights;
			}

		} else {
			this.numDirectionalLights = 0;
			this.numPointLights = 0;
			this.numLightProbes = 0;
		}

		if (numDirectionalLightsOld != this.numDirectionalLights || numPointLightsOld != this.numPointLights || numLightProbesOld != this.numLightProbes) {
			this._updateShader();

			this.invalidate();
		}
	}

	/**
	 * Calculates the amount of directional lights this material will support.
	 * @param numDirectionalLights The maximum amount of directional lights to support.
	 * @return The amount of directional lights this material will support, bounded by the amount necessary.
	 */
	private calculateNumDirectionalLights(numDirectionalLights:number):number
	{
		return Math.min(numDirectionalLights - this.directionalLightsOffset, this._maxLights);
	}

	/**
	 * Calculates the amount of point lights this material will support.
	 * @param numDirectionalLights The maximum amount of point lights to support.
	 * @return The amount of point lights this material will support, bounded by the amount necessary.
	 */
	private calculateNumPointLights(numPointLights:number):number
	{
		var numFree:number = this._maxLights - this.numDirectionalLights;
		return Math.min(numPointLights - this.pointLightsOffset, numFree);
	}

	/**
	 * Calculates the amount of light probes this material will support.
	 * @param numDirectionalLights The maximum amount of light probes to support.
	 * @return The amount of light probes this material will support, bounded by the amount necessary.
	 */
	private calculateNumProbes(numLightProbes:number):number
	{
		var numChannels:number = 0;

		if ((this.specularLightSources & LightSources.PROBES) != 0)
			++numChannels;

		if ((this.diffuseLightSources & LightSources.PROBES) != 0)
			++numChannels;

		// 4 channels available
		return Math.min(numLightProbes - this.lightProbesOffset, (4/numChannels) | 0);
	}
}