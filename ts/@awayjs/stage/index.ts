import * as aglsl					from "./lib/aglsl";
import * as attributes				from "./lib/attributes";
import * as base					from "./lib/base";
import * as events					from "./lib/events";
import * as image					from "./lib/image";
import * as library					from "./lib/library";
import * as managers				from "./lib/managers";

import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";
import {BitmapImageCube}				from "@awayjs/core/lib/image/BitmapImageCube";
import {Image2D}						from "@awayjs/core/lib/image/Image2D";
import {ImageCube}					from "@awayjs/core/lib/image/ImageCube";
import {SpecularImage2D}				from "@awayjs/core/lib/image/SpecularImage2D";
import {Sampler2D}					from "@awayjs/core/lib/image/Sampler2D";
import {SamplerCube}					from "@awayjs/core/lib/image/SamplerCube";

base.Stage.registerAbstraction(attributes.GL_AttributesBuffer, AttributesBuffer);
base.Stage.registerAbstraction(image.GL_RenderImage2D, Image2D);
base.Stage.registerAbstraction(image.GL_RenderImageCube, ImageCube);
base.Stage.registerAbstraction(image.GL_BitmapImage2D, BitmapImage2D);
base.Stage.registerAbstraction(image.GL_BitmapImageCube, BitmapImageCube);
base.Stage.registerAbstraction(image.GL_BitmapImage2D, SpecularImage2D);
base.Stage.registerAbstraction(image.GL_Sampler2D, Sampler2D);
base.Stage.registerAbstraction(image.GL_SamplerCube, SamplerCube);

export {
	aglsl,
	attributes,
	base,
	events,
	image,
	library,
	managers
}