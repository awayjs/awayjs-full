import {Image2D}						from "@awayjs/core/lib/image/Image2D";

import {MaterialBase}					from "@awayjs/display/lib/materials/MaterialBase";
import {Single2DTexture}				from "@awayjs/display/lib/textures/Single2DTexture";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {ContextGLCompareMode}			from "@awayjs/stage/lib/base/ContextGLCompareMode";

import {MethodMaterialMode}			from "./MethodMaterialMode";
import {AmbientBasicMethod}			from "./methods/AmbientBasicMethod";
import {DiffuseBasicMethod}			from "./methods/DiffuseBasicMethod";
import {EffectMethodBase}				from "./methods/EffectMethodBase";
import {NormalBasicMethod}			from "./methods/NormalBasicMethod";
import {ShadowMapMethodBase}			from "./methods/ShadowMapMethodBase";
import {SpecularBasicMethod}			from "./methods/SpecularBasicMethod";

/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class MethodMaterial extends MaterialBase
{
	public static assetType:string = "[materials MethodMaterial]";

	private _effectMethods:Array<EffectMethodBase> = new Array<EffectMethodBase>();
	private _mode:string;

	private _ambientMethod:AmbientBasicMethod = new AmbientBasicMethod();
	private _shadowMethod:ShadowMapMethodBase;
	private _diffuseMethod:DiffuseBasicMethod = new DiffuseBasicMethod();
	private _normalMethod:NormalBasicMethod = new NormalBasicMethod();
	private _specularMethod:SpecularBasicMethod = new SpecularBasicMethod();


	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	/**
	 *
	 */
	public get assetType():string
	{
		return MethodMaterial.assetType;
	}

	/**
	 * Creates a new MethodMaterial object.
	 *
	 * @param texture The texture used for the material's albedo color.
	 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
	 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
	 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
	 */
	constructor(image?:Image2D, alpha?:number);
	constructor(color?:number, alpha?:number);
	constructor(imageColor:any = null, alpha:number = 1)
	{
		super(imageColor, alpha);

		this._mode = MethodMaterialMode.SINGLE_PASS;

		//add default methods owners
		this._ambientMethod.iAddOwner(this);
		this._diffuseMethod.iAddOwner(this);
		this._normalMethod.iAddOwner(this);
		this._specularMethod.iAddOwner(this);

		//set a texture if an image is present
		if (imageColor instanceof Image2D)
			this._ambientMethod.texture = new Single2DTexture();
	}


	public get mode():string
	{
		return this._mode;
	}

	public set mode(value:string)
	{
		if (this._mode == value)
			return;

		this._mode = value;

		this.invalidate();
	}

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stage.ContextGLCompareMode
	 */

	public get depthCompareMode():string
	{
		return this._depthCompareMode;
	}

	public set depthCompareMode(value:string)
	{
		if (this._depthCompareMode == value)
			return;

		this._depthCompareMode = value;

		this.invalidate();
	}

	/**
	 * The texture object to use for the ambient colour.
	 */
	public get diffuseTexture():TextureBase
	{
		return this._diffuseMethod.texture;
	}

	public set diffuseTexture(value:TextureBase)
	{
		this._diffuseMethod.texture = value;
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():AmbientBasicMethod
	{
		return this._ambientMethod;
	}

	public set ambientMethod(value:AmbientBasicMethod)
	{
		if (this._ambientMethod == value)
			return;

		if (this._ambientMethod)
			this._ambientMethod.iRemoveOwner(this);

		this._ambientMethod = value;

		if (this._ambientMethod)
			this._ambientMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():ShadowMapMethodBase
	{
		return this._shadowMethod;
	}

	public set shadowMethod(value:ShadowMapMethodBase)
	{
		if (this._shadowMethod == value)
			return;

		if (this._shadowMethod)
			this._shadowMethod.iRemoveOwner(this);

		this._shadowMethod = value;

		if (this._shadowMethod)
			this._shadowMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():DiffuseBasicMethod
	{
		return this._diffuseMethod;
	}

	public set diffuseMethod(value:DiffuseBasicMethod)
	{
		if (this._diffuseMethod == value)
			return;

		if (this._diffuseMethod)
			this._diffuseMethod.iRemoveOwner(this);

		this._diffuseMethod = value;

		if (this._diffuseMethod)
			this._diffuseMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():SpecularBasicMethod
	{
		return this._specularMethod;
	}

	public set specularMethod(value:SpecularBasicMethod)
	{
		if (this._specularMethod == value)
			return;

		if (this._specularMethod)
			this._specularMethod.iRemoveOwner(this);

		this._specularMethod = value;

		if (this._specularMethod)
			this._specularMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():NormalBasicMethod
	{
		return this._normalMethod;
	}

	public set normalMethod(value:NormalBasicMethod)
	{
		if (this._normalMethod == value)
			return;

		if (this._normalMethod)
			this._normalMethod.iRemoveOwner(this);

		this._normalMethod = value;

		if (this._normalMethod)
			this._normalMethod.iAddOwner(this);

		this.invalidate();
	}

	public get numEffectMethods():number
	{
		return this._effectMethods.length;
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:EffectMethodBase):void
	{
		method.iAddOwner(this);

		this._effectMethods.push(method);

		this.invalidate();
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):EffectMethodBase
	{
		return this._effectMethods[index];
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:EffectMethodBase, index:number):void
	{
		method.iAddOwner(this);

		this._effectMethods.splice(index, 0, method);

		this.invalidate();
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase):void
	{
		method.iRemoveOwner(this);

		this._effectMethods.splice(this._effectMethods.indexOf(method), 1);

		this.invalidate();
	}
}