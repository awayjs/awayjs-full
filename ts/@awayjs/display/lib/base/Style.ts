import {ImageBase}					from "@awayjs/core/lib/image/ImageBase";
import {SamplerBase}					from "@awayjs/core/lib/image/SamplerBase";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";

import {EventDispatcher}				from "@awayjs/core/lib/events/EventDispatcher";
import {StyleEvent}					from "../events/StyleEvent";
import {TextureBase}					from "../textures/TextureBase";

/**
 *
 */
export class Style extends EventDispatcher
{
	private _sampler:SamplerBase;
	private _samplers:Object = new Object();
	private _image:ImageBase;
	private _images:Object = new Object();
	private _uvMatrix:Matrix;
	private _color:number = 0xFFFFFF;

	public get sampler():SamplerBase
	{
		return this._sampler;
	}

	public set sampler(value:SamplerBase)
	{
		if (this._sampler == value)
			return;

		this._sampler = value;

		this._invalidateProperties();
	}

	public get image():ImageBase
	{
		return this._image;
	}

	public set image(value:ImageBase)
	{
		if (this._image == value)
			return;

		this._image = value;

		this._invalidateProperties();
	}

	public get uvMatrix():Matrix
	{
		return this._uvMatrix;
	}

	public set uvMatrix(value:Matrix)
	{
		if (this._uvMatrix == value)
			return;

		this._uvMatrix = value;

		this._invalidateProperties();
	}
	
	/**
	 * The diffuse reflectivity color of the surface.
	 */
	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		if (this._color == value)
			return;

		this._color = value;

		this._invalidateProperties();
	}

	constructor()
	{
		super();
	}

	public getImageAt(texture:TextureBase, index:number = 0):ImageBase
	{
		return (this._images[texture.id]? this._images[texture.id][index] : null) || this._image;
	}

	public getSamplerAt(texture:TextureBase, index:number = 0):SamplerBase
	{
		return (this._samplers[texture.id]? this._samplers[texture.id][index] : null) || this._sampler;
	}

	public addImageAt(image:ImageBase, texture:TextureBase, index:number = 0):void
	{
		if (!this._images[texture.id])
			this._images[texture.id] = new Array<ImageBase>();

		this._images[texture.id][index] = image;
	}

	public addSamplerAt(sampler:SamplerBase, texture:TextureBase, index:number = 0):void
	{
		if (!this._samplers[texture.id])
			this._samplers[texture.id] = new Array<SamplerBase>();

		this._samplers[texture.id][index] = sampler;

		this._invalidateProperties();
	}


	public removeImageAt(texture:TextureBase, index:number = 0):void
	{
		if (!this._images[texture.id])
			return;

		this._images[texture.id][index] = null;

		this._invalidateProperties();
	}

	public removeSamplerAt(texture:TextureBase, index:number = 0):void
	{
		if (!this._samplers[texture.id])
			return;

		this._samplers[texture.id][index] = null;

		this._invalidateProperties();
	}

	private _invalidateProperties():void
	{
		this.dispatchEvent(new StyleEvent(StyleEvent.INVALIDATE_PROPERTIES, this));
	}
}
