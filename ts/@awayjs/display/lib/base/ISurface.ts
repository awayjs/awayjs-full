import {IAsset}						from "@awayjs/core/lib/library/IAsset";
import {ImageBase}					from "@awayjs/core/lib/image/ImageBase";
import {SamplerBase}					from "@awayjs/core/lib/image/SamplerBase";

import {IAnimationSet}				from "../animators/IAnimationSet";
import {IRenderable}					from "../base/IRenderable";
import {LightPickerBase}				from "../materials/lightpickers/LightPickerBase";
import {TextureBase}					from "../textures/TextureBase";
import {Style}						from "../base/Style";

/**
 * ISurface provides an interface for objects that define the properties of a renderable's surface.
 *
 * @interface away.base.ISurface
 */
export interface ISurface extends IAsset
{
	alphaThreshold:number;

	style:Style;

	curves:boolean;

	imageRect:boolean;

	blendMode:string;

	lightPicker:LightPickerBase;

	animationSet:IAnimationSet;

	iOwners:Array<IRenderable>;

	getNumTextures():number;

	getTextureAt(index:number):TextureBase;

	addTexture(texture:TextureBase);

	removeTexture(texture:TextureBase);
}