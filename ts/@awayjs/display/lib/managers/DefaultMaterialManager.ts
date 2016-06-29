import {Sampler2D}					from "@awayjs/core/lib/image/Sampler2D";
import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";
import {BitmapImageCube}				from "@awayjs/core/lib/image/BitmapImageCube";

import {IRenderable}					from "../base/IRenderable";
import {LineElements}					from "../graphics/LineElements";
import {Skybox}						from "../display/Skybox";
import {MaterialBase}					from "../materials/MaterialBase";
import {BasicMaterial}				from "../materials/BasicMaterial";
import {Single2DTexture}				from "../textures/Single2DTexture";
import {SingleCubeTexture}			from "../textures/SingleCubeTexture";
import {TextureBase}					from "../textures/TextureBase";
import {Graphic}						from "../graphics/Graphic";

export class DefaultMaterialManager
{
	private static _defaultSampler2D:Sampler2D;
	private static _defaultBitmapImage2D:BitmapImage2D;
	private static _defaultBitmapImageCube:BitmapImageCube;
	private static _defaultCubeTextureMaterial:BasicMaterial;
	private static _defaultTextureMaterial:BasicMaterial;
	private static _defaultColorMaterial:BasicMaterial;
	private static _defaultTexture:Single2DTexture;
	private static _defaultCubeTexture:SingleCubeTexture;

	public static getDefaultMaterial(renderable:IRenderable = null):MaterialBase
	{
		if (renderable != null && renderable.isAsset(Graphic) && (<Graphic> renderable).elements.isAsset(LineElements)) {
			if (!DefaultMaterialManager._defaultColorMaterial)
				DefaultMaterialManager.createDefaultColorMaterial();

			return DefaultMaterialManager._defaultColorMaterial;
		}

		if (renderable != null && renderable.isAsset(Skybox)) {
			if (!DefaultMaterialManager._defaultCubeTextureMaterial)
				DefaultMaterialManager.createDefaultCubeTextureMaterial();

			return DefaultMaterialManager._defaultCubeTextureMaterial;
		}

		if (!DefaultMaterialManager._defaultTextureMaterial)
			DefaultMaterialManager.createDefaultTextureMaterial();

		return DefaultMaterialManager._defaultTextureMaterial;
	}

	public static getDefaultTexture(renderable:IRenderable = null):TextureBase
	{
		if (renderable != null && renderable.isAsset(Skybox)) {
			if (!DefaultMaterialManager._defaultCubeTexture)
				DefaultMaterialManager.createDefaultCubeTexture();

			return DefaultMaterialManager._defaultCubeTexture;
		}

		if (!DefaultMaterialManager._defaultTexture)
			DefaultMaterialManager.createDefaultTexture();

		return DefaultMaterialManager._defaultTexture;
	}

	public static getDefaultImage2D():BitmapImage2D
	{
		if (!DefaultMaterialManager._defaultBitmapImage2D)
			DefaultMaterialManager.createDefaultImage2D();

		return DefaultMaterialManager._defaultBitmapImage2D;
	}

	public static getDefaultImageCube():BitmapImageCube
	{
		if (!DefaultMaterialManager._defaultBitmapImageCube)
			DefaultMaterialManager.createDefaultImageCube();

		return DefaultMaterialManager._defaultBitmapImageCube;
	}

	public static getDefaultSampler():Sampler2D
	{
		if (!DefaultMaterialManager._defaultSampler2D)
			DefaultMaterialManager.createDefaultSampler2D();

		return DefaultMaterialManager._defaultSampler2D;
	}

	private static createDefaultTexture():void
	{
		DefaultMaterialManager._defaultTexture = new Single2DTexture();
		DefaultMaterialManager._defaultTexture.name = "defaultTexture";
	}

	private static createDefaultCubeTexture():void
	{
		DefaultMaterialManager._defaultCubeTexture = new SingleCubeTexture();
		DefaultMaterialManager._defaultCubeTexture.name = "defaultCubeTexture";
	}

	private static createDefaultImageCube():void
	{
		if (!DefaultMaterialManager._defaultBitmapImage2D)
			DefaultMaterialManager.createDefaultImage2D();

		var b = new BitmapImageCube(DefaultMaterialManager._defaultBitmapImage2D.width);

		for (var i:number = 0; i < 6; i++)
			b.draw(i, DefaultMaterialManager._defaultBitmapImage2D);

		DefaultMaterialManager._defaultBitmapImageCube = b;
	}

	private static createDefaultImage2D():void
	{
		var b:BitmapImage2D = new BitmapImage2D(8, 8, false, 0x000000);

		//create chekerboard
		var i:number, j:number;
		for (i = 0; i < 8; i++)
			for (j = 0; j < 8; j++)
				if ((j & 1) ^ (i & 1))
					b.setPixel(i, j, 0XFFFFFF);

		DefaultMaterialManager._defaultBitmapImage2D = b;
	}

	private static createDefaultTextureMaterial():void
	{
		if (!DefaultMaterialManager._defaultTexture)
			DefaultMaterialManager.createDefaultTexture();

		DefaultMaterialManager._defaultTextureMaterial = new BasicMaterial();
		DefaultMaterialManager._defaultTextureMaterial.texture = DefaultMaterialManager._defaultTexture;
		DefaultMaterialManager._defaultTextureMaterial.name = "defaultTextureMaterial";
	}

	private static createDefaultCubeTextureMaterial():void
	{
		if (!DefaultMaterialManager._defaultCubeTexture)
			DefaultMaterialManager.createDefaultCubeTexture();

		DefaultMaterialManager._defaultCubeTextureMaterial = new BasicMaterial();
		DefaultMaterialManager._defaultCubeTextureMaterial.texture = DefaultMaterialManager._defaultCubeTexture;
		DefaultMaterialManager._defaultCubeTextureMaterial.name = "defaultCubeTextureMaterial";
	}

	private static createDefaultColorMaterial():void
	{
		DefaultMaterialManager._defaultColorMaterial = new BasicMaterial(0xFFFFFF);
		DefaultMaterialManager._defaultColorMaterial.name = "defaultColorMaterial";
	}

	private static createDefaultSampler2D():void
	{
		DefaultMaterialManager._defaultSampler2D = new Sampler2D();
	}

}