import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {BlendMode}					from "@awayjs/core/lib/image/BlendMode";
import {ImageCube}					from "@awayjs/core/lib/image/ImageCube";

import {ITraverser}					from "../ITraverser";
import {IAnimationSet}				from "../animators/IAnimationSet";
import {IAnimator}					from "../animators/IAnimator";
import {DisplayObject}				from "../display/DisplayObject";
import {IRenderable}					from "../base/IRenderable";
import {ISurface}						from "../base/ISurface";
import {BoundsType}					from "../bounds/BoundsType";
import {IEntity}						from "../display/IEntity";
import {RenderableEvent}				from "../events/RenderableEvent";
import {SurfaceEvent}					from "../events/SurfaceEvent";
import {LightPickerBase}				from "../materials/lightpickers/LightPickerBase";
import {SingleCubeTexture}			from "../textures/SingleCubeTexture";
import {TextureBase}					from "../textures/TextureBase";
import {Style}						from "../base/Style";
import {StyleEvent}					from "../events/StyleEvent";
import {IPickingCollider}				from "../pick/IPickingCollider";
import {PickingCollision}				from "../pick/PickingCollision";

/**
 * A Skybox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
 * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
 * the sky box is always as large as possible without being clipped.
 */
export class Skybox extends DisplayObject implements IEntity, IRenderable, ISurface
{
	private _textures:Array<TextureBase> = new Array<TextureBase>();

	public static assetType:string = "[asset Skybox]";

	private _texture:SingleCubeTexture;
	public _pAlphaThreshold:number = 0;
	private _animationSet:IAnimationSet;
	public _pLightPicker:LightPickerBase;
	public _pBlendMode:string = BlendMode.NORMAL;
	private _owners:Array<IRenderable>;
	private _curves:boolean = false;
	private _imageRect:boolean = false;
	private _onInvalidatePropertiesDelegate:(event:StyleEvent) => void;
	private _style:Style = new Style();

	private _animator:IAnimator;

	private _onTextureInvalidateDelegate:(event:AssetEvent) => void;

	/**
	 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
	 * invisible or entirely opaque, often used with textures for foliage, etc.
	 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
	 */
	public get alphaThreshold():number
	{
		return this._pAlphaThreshold;
	}

	public set alphaThreshold(value:number)
	{
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		if (this._pAlphaThreshold == value)
			return;

		this._pAlphaThreshold = value;

		this.invalidatePasses();
	}

	/**
	 * Indicates whether skybox should use curves. Defaults to false.
	 */
	public get curves():boolean
	{
		return this._curves;
	}

	public set curves(value:boolean)
	{
		if (this._curves == value)
			return;

		this._curves = value;

		this.invalidatePasses();
	}

	/**
	 * Indicates whether or not the Skybox texture should use imageRects. Defaults to false.
	 */
	public get imageRect():boolean
	{
		return this._imageRect;
	}

	public set imageRect(value:boolean)
	{
		if (this._imageRect == value)
			return;

		this._imageRect = value;

		this.invalidatePasses();
	}
	
	/**
	 * The light picker used by the material to provide lights to the material if it supports lighting.
	 *
	 * @see LightPickerBase
	 * @see StaticLightPicker
	 */
	public get lightPicker():LightPickerBase
	{
		return this._pLightPicker;
	}

	/**
	 *
	 */
	public get animationSet():IAnimationSet
	{
		return this._animationSet;
	}

	/**
	 * The blend mode to use when drawing this renderable. The following blend modes are supported:
	 * <ul>
	 * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
	 * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
	 * <li>BlendMode.MULTIPLY</li>
	 * <li>BlendMode.ADD</li>
	 * <li>BlendMode.ALPHA</li>
	 * </ul>
	 */
	public get blendMode():string
	{
		return this._pBlendMode;
	}

	public set blendMode(value:string)
	{
		if (this._pBlendMode == value)
			return;

		this._pBlendMode = value;

		this.invalidate();
	}


	/**
	 * A list of the IRenderables that use this material
	 *
	 * @private
	 */
	public get iOwners():Array<IRenderable>
	{
		return this._owners;
	}

	public get animator():IAnimator
	{
		return this._animator;
	}

	/**
	* The cube texture to use as the skybox.
	*/
	public get texture():SingleCubeTexture
	{
		return this._texture;
	}

	public set texture(value:SingleCubeTexture)
	{
		if (this._texture == value)
			return;

		if (this._texture)
			this.removeTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.addTexture(this._texture);

		this.invalidatePasses();
	}

	public getNumTextures():number
	{
		return this._textures.length;
	}

	public getTextureAt(index:number):TextureBase
	{
		return this._textures[index];
	}

	/**
	 *
	 */
	public get style():Style
	{
		return this._style;
	}

	/**
	 * Create a new Skybox object.
	 *
	 * @param material	The material with which to render the Skybox.
	 */
	constructor(image:ImageCube = null)
	{
		super();

		this._onTextureInvalidateDelegate = (event:AssetEvent) => this.onTextureInvalidate(event);
		this._onInvalidatePropertiesDelegate = (event:StyleEvent) => this._onInvalidateProperties(event);
		this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);

		this._pIsEntity = true;

		this._owners = new Array<IRenderable>(this);

		this._style.image = image;
		this.texture =  new SingleCubeTexture();

		//default bounds type
		this._boundsType = BoundsType.NULL;
	}

	public get assetType():string
	{
		return Skybox.assetType;
	}

	/**
	 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
	 *
	 * @private
	 */
	public invalidatePasses():void
	{
		this.dispatchEvent(new SurfaceEvent(SurfaceEvent.INVALIDATE_PASSES, this));
	}

	public invalidateElements():void
	{
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_ELEMENTS, this));
	}
	
	public invalidateSurface():void
	{
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_SURFACE, this));
	}

	public addTexture(texture:TextureBase):void
	{
		this._textures.push(texture);

		texture.addEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);

		this.onTextureInvalidate();
	}

	public removeTexture(texture:TextureBase):void
	{
		this._textures.splice(this._textures.indexOf(texture), 1);

		texture.removeEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);

		this.onTextureInvalidate();
	}

	private onTextureInvalidate(event:AssetEvent = null):void
	{
		this.invalidate();
	}

	private _onInvalidateProperties(event:StyleEvent):void
	{
		this.invalidatePasses();
	}

	public _acceptTraverser(traverser:ITraverser):void
	{
		traverser.applyRenderable(this);
	}

	/**
	 * //TODO
	 *
	 * @param shortestCollisionDistance
	 * @returns {boolean}
	 *
	 * @internal
	 */
	public _iTestCollision(pickingCollision:PickingCollision, pickingCollider:IPickingCollider):boolean
	{
		return false;
	}
}