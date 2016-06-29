import {BlendMode}						from "@awayjs/core/lib/image/BlendMode";
import {AssetEvent}						from "@awayjs/core/lib/events/AssetEvent";

import {StaticLightPicker}				from "@awayjs/display/lib/materials/lightpickers/StaticLightPicker";

import {ContextGLCompareMode}				from "@awayjs/stage/lib/base/ContextGLCompareMode";

import {IElementsClassGL}					from "@awayjs/renderer/lib/elements/IElementsClassGL";
import {GL_SurfaceBase}					from "@awayjs/renderer/lib/surfaces/GL_SurfaceBase";
import {SurfacePool}						from "@awayjs/renderer/lib/surfaces/SurfacePool";

import {MethodMaterial}					from "../MethodMaterial";
import {MethodMaterialMode}				from "../MethodMaterialMode";
import {MethodPassMode}					from "../surfaces/passes/MethodPassMode";
import {MethodPass}						from "../surfaces/passes/MethodPass";
import {EffectMethodBase}					from "../methods/EffectMethodBase";

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
export class GL_MethodMaterialSurface extends GL_SurfaceBase
{
	private _material:MethodMaterial;
	private _pass:MethodPass;
	private _casterLightPass:MethodPass;
	private _nonCasterLightPasses:Array<MethodPass>;
	
	/**
	 * The maximum total number of lights provided by the light picker.
	 */
	private get numLights():number
	{
		return this._material.lightPicker? this._material.lightPicker.numLightProbes + this._material.lightPicker.numDirectionalLights + this._material.lightPicker.numPointLights + this._material.lightPicker.numCastingDirectionalLights + this._material.lightPicker.numCastingPointLights : 0;
	}

	/**
	 * The amount of lights that don't cast shadows.
	 */
	private get numNonCasters():number
	{
		return this._material.lightPicker? this._material.lightPicker.numLightProbes + this._material.lightPicker.numDirectionalLights + this._material.lightPicker.numPointLights : 0;
	}

	/**
	 * Creates a new CompiledPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(material:MethodMaterial, elementsClass:IElementsClassGL, pool:SurfacePool)
	{
		super(material, elementsClass, pool);

		this._material = material;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender():void
	{
		super._pUpdateRender();

		this.initPasses();

		this.setBlendAndCompareModes();

		this._pClearPasses();

		if (this._material.mode == MethodMaterialMode.MULTI_PASS) {
			if (this._casterLightPass)
				this._pAddPass(this._casterLightPass);

			if (this._nonCasterLightPasses)
				for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
					this._pAddPass(this._nonCasterLightPasses[i]);
		}

		if (this._pass)
			this._pAddPass(this._pass);
	}

	/**
	 * Initializes all the passes and their dependent passes.
	 */
	private initPasses():void
	{
		// let the effects pass handle everything if there are no lights, when there are effect methods applied
		// after shading, or when the material mode is single pass.
		if (this.numLights == 0 || this._material.numEffectMethods > 0 || this._material.mode == MethodMaterialMode.SINGLE_PASS)
			this.initEffectPass();
		else if (this._pass)
			this.removeEffectPass();

		// only use a caster light pass if shadows need to be rendered
		if (this._material.shadowMethod && this._material.mode == MethodMaterialMode.MULTI_PASS)
			this.initCasterLightPass();
		else if (this._casterLightPass)
			this.removeCasterLightPass();

		// only use non caster light passes if there are lights that don't cast
		if (this.numNonCasters > 0 && this._material.mode == MethodMaterialMode.MULTI_PASS)
			this.initNonCasterLightPasses();
		else if (this._nonCasterLightPasses)
			this.removeNonCasterLightPasses();
	}

	/**
	 * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
	 */
	private setBlendAndCompareModes():void
	{
		var forceSeparateMVP:boolean = Boolean(this._casterLightPass || this._pass);

		// caster light pass is always first if it exists, hence it uses normal blending
		if (this._casterLightPass) {
			this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
			this._casterLightPass.shader.setBlendMode(BlendMode.NORMAL);
			this._casterLightPass.shader.depthCompareMode = this._material.depthCompareMode;
		}

		if (this._nonCasterLightPasses) {
			var firstAdditiveIndex:number = 0;

			// if there's no caster light pass, the first non caster light pass will be the first
			// and should use normal blending
			if (!this._casterLightPass) {
				this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
				this._nonCasterLightPasses[0].shader.setBlendMode(BlendMode.NORMAL);
				this._nonCasterLightPasses[0].shader.depthCompareMode = this._material.depthCompareMode;
				firstAdditiveIndex = 1;
			}

			// all lighting passes following the first light pass should use additive blending
			for (var i:number = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
				this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
				this._nonCasterLightPasses[i].shader.setBlendMode(BlendMode.ADD);
				this._nonCasterLightPasses[i].shader.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
			}
		}

		if (this._casterLightPass || this._nonCasterLightPasses) {
			//cannot be blended by blendmode property if multipass enabled
			this._pRequiresBlending = false;

			// there are light passes, so this should be blended in
			if (this._pass) {
				this._pass.mode = MethodPassMode.EFFECTS;
				this._pass.forceSeparateMVP = forceSeparateMVP;
				this._pass.shader.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
				this._pass.shader.setBlendMode(BlendMode.LAYER);
			}

		} else if (this._pass) {
			this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
			// effects pass is the only pass, so it should just blend normally
			this._pass.mode = MethodPassMode.SUPER_SHADER;
			this._pass.preserveAlpha = this._pRequiresBlending;
			this._pass.forceSeparateMVP = false;
			this._pass.colorTransform = this._material.colorTransform;
			this._pass.shader.setBlendMode((this._material.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._material.blendMode);
			this._pass.shader.depthCompareMode = this._material.depthCompareMode;
		}
	}

	private initCasterLightPass():void
	{

		if (this._casterLightPass == null)
			this._casterLightPass = new MethodPass(MethodPassMode.LIGHTING, this, this._material, this._elementsClass, this._stage);

		this._casterLightPass.lightPicker = new StaticLightPicker([this._material.shadowMethod.castingLight]);
		this._casterLightPass.shadowMethod = this._material.shadowMethod;
		this._casterLightPass.diffuseMethod = this._material.diffuseMethod;
		this._casterLightPass.ambientMethod = this._material.ambientMethod;
		this._casterLightPass.normalMethod = this._material.normalMethod;
		this._casterLightPass.specularMethod = this._material.specularMethod;
	}

	private removeCasterLightPass():void
	{
		this._casterLightPass.dispose();
		this._pRemovePass(this._casterLightPass);
		this._casterLightPass = null;
	}

	private initNonCasterLightPasses():void
	{
		this.removeNonCasterLightPasses();
		var pass:MethodPass;
		var numDirLights:number = this._material.lightPicker.numDirectionalLights;
		var numPointLights:number = this._material.lightPicker.numPointLights;
		var numLightProbes:number = this._material.lightPicker.numLightProbes;
		var dirLightOffset:number = 0;
		var pointLightOffset:number = 0;
		var probeOffset:number = 0;

		if (!this._casterLightPass) {
			numDirLights += this._material.lightPicker.numCastingDirectionalLights;
			numPointLights += this._material.lightPicker.numCastingPointLights;
		}

		this._nonCasterLightPasses = new Array<MethodPass>();

		while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
			pass = new MethodPass(MethodPassMode.LIGHTING, this, this._material, this._elementsClass, this._stage);
			pass.includeCasters = this._material.shadowMethod == null;
			pass.directionalLightsOffset = dirLightOffset;
			pass.pointLightsOffset = pointLightOffset;
			pass.lightProbesOffset = probeOffset;
			pass.lightPicker = this._material.lightPicker;
			pass.diffuseMethod = this._material.diffuseMethod;
			pass.ambientMethod = this._material.ambientMethod;
			pass.normalMethod = this._material.normalMethod;
			pass.specularMethod = this._material.specularMethod;
			this._nonCasterLightPasses.push(pass);

			dirLightOffset += pass.numDirectionalLights;
			pointLightOffset += pass.numPointLights;
			probeOffset += pass.numLightProbes;
		}
	}

	private removeNonCasterLightPasses():void
	{
		if (!this._nonCasterLightPasses)
			return;

		for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
			this._pRemovePass(this._nonCasterLightPasses[i]);

		this._nonCasterLightPasses = null;
	}

	private removeEffectPass():void
	{
		if (this._pass.ambientMethod != this._material.ambientMethod)
			this._pass.ambientMethod.dispose();

		if (this._pass.diffuseMethod != this._material.diffuseMethod)
			this._pass.diffuseMethod.dispose();

		if (this._pass.specularMethod != this._material.specularMethod)
			this._pass.specularMethod.dispose();

		if (this._pass.normalMethod != this._material.normalMethod)
			this._pass.normalMethod.dispose();

		this._pRemovePass(this._pass);
		this._pass = null;
	}

	private initEffectPass():void
	{
		if (this._pass == null)
			this._pass = new MethodPass(MethodPassMode.SUPER_SHADER, this, this._material, this._elementsClass, this._stage);

		if (this._material.mode == MethodMaterialMode.SINGLE_PASS) {
			this._pass.ambientMethod = this._material.ambientMethod;
			this._pass.diffuseMethod = this._material.diffuseMethod;
			this._pass.specularMethod = this._material.specularMethod;
			this._pass.normalMethod = this._material.normalMethod;
			this._pass.shadowMethod = this._material.shadowMethod;
		} else if (this._material.mode == MethodMaterialMode.MULTI_PASS) {
			if (this.numLights == 0) {
				this._pass.ambientMethod = this._material.ambientMethod;
			} else {
				this._pass.ambientMethod = null;
			}

			this._pass.preserveAlpha = false;
			this._pass.normalMethod = this._material.normalMethod;
		}

		//update effect methods
		var i:number = 0;
		var effectMethod:EffectMethodBase;
		var len:number = Math.max(this._material.numEffectMethods, this._pass.numEffectMethods);

		while (i < len) {
			effectMethod = this._material.getEffectMethodAt(i);
			if (effectMethod != this._pass.getEffectMethodAt(i)) {
				this._pass.removeEffectMethodAt(i);

				if (effectMethod != null) {
					if (i < this._pass.numEffectMethods)
						this._pass.addEffectMethodAt(effectMethod, i);
					else
						this._pass.addEffectMethod(effectMethod);
				}
			}

			i++;
		}
	}
	
	/**
	 * @inheritDoc
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		//TODO
	}
}