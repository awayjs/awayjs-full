import * as attributes				from "./lib/attributes";
import * as base					from "./lib/base";
import * as controllers				from "./lib/controllers";
import * as display					from "./lib/display";
import * as draw					from "./lib/draw";
import * as errors					from "./lib/errors";
import * as events					from "./lib/events";
import * as geom					from "./lib/geom";
import * as graphics				from "./lib/graphics";
import * as image					from "./lib/image";
import * as library					from "./lib/library";
import * as materials				from "./lib/materials";
import * as net						from "./lib/net";
import * as parsers					from "./lib/parsers";
import * as partition				from "./lib/partition";
import * as prefabs					from "./lib/prefabs";
import * as projections				from "./lib/projections";
import * as textures				from "./lib/textures";
import * as ui						from "./lib/ui";
import * as utils					from "./lib/utils";

import {GL_AttributesBuffer}		from "awayjs-stagegl/lib/attributes/GL_AttributesBuffer";
import {Stage}						from "awayjs-stagegl/lib/base/Stage";
import {GL_BitmapImage2D}			from "awayjs-stagegl/lib/image/GL_BitmapImage2D";
import {GL_BitmapImageCube}			from "awayjs-stagegl/lib/image/GL_BitmapImageCube";
import {GL_RenderImage2D}			from "awayjs-stagegl/lib/image/GL_RenderImage2D";
import {GL_RenderImageCube}			from "awayjs-stagegl/lib/image/GL_RenderImageCube";
import {GL_Sampler2D}				from "awayjs-stagegl/lib/image/GL_Sampler2D";
import {GL_SamplerCube}				from "awayjs-stagegl/lib/image/GL_SamplerCube";

import {View}						from "awayjs-display/lib/View";

import {GL_LineElements}			from "awayjs-renderergl/lib/elements/GL_LineElements";
import {GL_TriangleElements}		from "awayjs-renderergl/lib/elements/GL_TriangleElements";

import {GL_BillboardRenderable}		from "awayjs-renderergl/lib/renderables/GL_BillboardRenderable";
import {GL_GraphicRenderable}		from "awayjs-renderergl/lib/renderables/GL_GraphicRenderable";
import {GL_LineSegmentRenderable}	from "awayjs-renderergl/lib/renderables/GL_LineSegmentRenderable";
import {GL_SkyboxRenderable}		from "awayjs-renderergl/lib/renderables/GL_SkyboxRenderable";

import {ShaderBase}					from "awayjs-renderergl/lib/shaders/ShaderBase";

import {GL_BasicMaterialSurface}	from "awayjs-renderergl/lib/surfaces/GL_BasicMaterialSurface";
import {GL_SkyboxSurface}			from "awayjs-renderergl/lib/surfaces/GL_SkyboxSurface";
import {SurfacePool}				from "awayjs-renderergl/lib/surfaces/SurfacePool";

import {GL_Single2DTexture}			from "awayjs-renderergl/lib/textures/GL_Single2DTexture";
import {GL_SingleCubeTexture}		from "awayjs-renderergl/lib/textures/GL_SingleCubeTexture";

import {DefaultRenderer}			from "awayjs-renderergl/lib/DefaultRenderer";
import {RendererBase}				from "awayjs-renderergl/lib/RendererBase";

import {GL_MethodMaterialSurface}	from "awayjs-methodmaterials/lib/surfaces/GL_MethodMaterialSurface";

library.Loader.enableParser(parsers.AWDParser);
library.Loader.enableParser(parsers.Max3DSParser);
library.Loader.enableParser(parsers.MD2Parser);
library.Loader.enableParser(parsers.OBJParser);
library.Loader.enableParser(parsers.FNTParser);
library.Loader.enableParser(parsers.MD5AnimParser);
library.Loader.enableParser(parsers.MD5MeshParser);
library.Loader.enableParser(parsers.Image2DParser);
library.Loader.enableParser(parsers.ImageCubeParser);

partition.PartitionBase.registerAbstraction(partition.CameraNode, display.Camera);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Sprite);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Shape);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.MovieClip);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Billboard);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.LineSegment);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextField);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextFieldMultiRender);
partition.PartitionBase.registerAbstraction(partition.LightProbeNode, display.LightProbe);
partition.PartitionBase.registerAbstraction(partition.PointLightNode, display.PointLight);
partition.PartitionBase.registerAbstraction(partition.DirectionalLightNode, display.DirectionalLight);
partition.PartitionBase.registerAbstraction(partition.SkyboxNode, display.Skybox);

base.Stage.registerAbstraction(GL_AttributesBuffer, attributes.AttributesBuffer);
base.Stage.registerAbstraction(GL_RenderImage2D, image.Image2D);
base.Stage.registerAbstraction(GL_RenderImageCube, image.ImageCube);
base.Stage.registerAbstraction(GL_BitmapImage2D, image.BitmapImage2D);
base.Stage.registerAbstraction(GL_BitmapImageCube, image.BitmapImageCube);
base.Stage.registerAbstraction(GL_BitmapImage2D, image.SpecularImage2D);
base.Stage.registerAbstraction(GL_Sampler2D, image.Sampler2D);
base.Stage.registerAbstraction(GL_SamplerCube, image.SamplerCube);

SurfacePool.registerAbstraction(GL_BasicMaterialSurface, materials.BasicMaterial);
SurfacePool.registerAbstraction(GL_MethodMaterialSurface, materials.MethodMaterial);
SurfacePool.registerAbstraction(GL_SkyboxSurface, display.Skybox);

Stage.registerAbstraction(GL_LineElements, graphics.LineElements);
Stage.registerAbstraction(GL_TriangleElements, graphics.TriangleElements);

ShaderBase.registerAbstraction(GL_Single2DTexture, textures.Single2DTexture);
ShaderBase.registerAbstraction(GL_SingleCubeTexture, textures.SingleCubeTexture);

RendererBase.registerAbstraction(GL_BillboardRenderable, display.Billboard);
RendererBase.registerAbstraction(GL_LineSegmentRenderable, display.LineSegment);
RendererBase.registerAbstraction(GL_GraphicRenderable, graphics.Graphic);
RendererBase.registerAbstraction(GL_SkyboxRenderable, display.Skybox);

export {
	attributes,
	base,
	controllers,
	display,
	draw,
	errors,
	events,
	geom,
	graphics,
	image,
	library,
	materials,
	net,
	parsers,
	partition,
	prefabs,
	projections,
	textures,
	ui,
	utils,
	DefaultRenderer,
	View
}