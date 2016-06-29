﻿import {Sampler2D}				from "@awayjs/core/lib/image/Sampler2D";
import {Image2D}					from "@awayjs/core/lib/image/Image2D";
import {ErrorBase}				from "@awayjs/core/lib/errors/ErrorBase";
import {ImageUtils}				from "@awayjs/core/lib/utils/ImageUtils";

import {MappingMode}				from "../textures/MappingMode";
import {TextureBase}				from "../textures/TextureBase";

export class Single2DTexture extends TextureBase
{
	private _mappingMode:string;

	public static assetType:string = "[texture Single2DTexture]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return Single2DTexture.assetType;
	}

	public get mappingMode():string
	{
		return this._mappingMode;
	}

	public set mappingMode(value:string)
	{
		if (this._mappingMode == value)
			return;

		this._mappingMode = value;


	}

	/**
	 *
	 * @returns {Image2D}
	 */
	public get sampler2D():Sampler2D
	{
		return <Sampler2D> this._samplers[0];
	}

	public set sampler2D(value:Sampler2D)
	{
		if (this._samplers[0] == value)
			return;

		this.setSamplerAt(value, 0);
	}

	/**
	 *
	 * @returns {Image2D}
	 */
	public get image2D():Image2D
	{
		return <Image2D> this._images[0];
	}

	public set image2D(value:Image2D)
	{
		if (this._images[0] == value)
			return;

		if (!ImageUtils.isImage2DValid(value))
			throw new ErrorBase("Invalid image2DData: Width and height must be power of 2 and cannot exceed 2048");

		this.setImageAt(value, 0);
	}

	constructor(image2D:Image2D = null)
	{
		super();

		this.setNumImages(1);

		this.image2D = image2D;

		this._mappingMode = MappingMode.NORMAL;
	}
}