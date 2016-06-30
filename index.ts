import * as attributes				from "./lib/attributes";
import * as base					from "./lib/base";
import * as display					from "./lib/display";
import * as graphics				from "./lib/graphics";
import * as image					from "./lib/image";
import * as library					from "./lib/library";
import * as materials				from "./lib/materials";
import * as parsers					from "./lib/parsers";
import * as partition				from "./lib/partition";
import * as textures				from "./lib/textures";

import {GL_AttributesBuffer}		from "@awayjs/stage/lib/attributes/GL_AttributesBuffer";
import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {GL_BitmapImage2D}			from "@awayjs/stage/lib/image/GL_BitmapImage2D";
import {GL_BitmapImageCube}			from "@awayjs/stage/lib/image/GL_BitmapImageCube";
import {GL_RenderImage2D}			from "@awayjs/stage/lib/image/GL_RenderImage2D";
import {GL_RenderImageCube}			from "@awayjs/stage/lib/image/GL_RenderImageCube";
import {GL_Sampler2D}				from "@awayjs/stage/lib/image/GL_Sampler2D";
import {GL_SamplerCube}				from "@awayjs/stage/lib/image/GL_SamplerCube";

import {GL_LineElements}			from "@awayjs/renderer/lib/elements/GL_LineElements";
import {GL_TriangleElements}		from "@awayjs/renderer/lib/elements/GL_TriangleElements";

import {GL_BillboardRenderable}		from "@awayjs/renderer/lib/renderables/GL_BillboardRenderable";
import {GL_GraphicRenderable}		from "@awayjs/renderer/lib/renderables/GL_GraphicRenderable";
import {GL_LineSegmentRenderable}	from "@awayjs/renderer/lib/renderables/GL_LineSegmentRenderable";
import {GL_SkyboxRenderable}		from "@awayjs/renderer/lib/renderables/GL_SkyboxRenderable";

import {ShaderBase}					from "@awayjs/renderer/lib/shaders/ShaderBase";

import {GL_BasicMaterialSurface}	from "@awayjs/renderer/lib/surfaces/GL_BasicMaterialSurface";
import {GL_SkyboxSurface}			from "@awayjs/renderer/lib/surfaces/GL_SkyboxSurface";
import {SurfacePool}				from "@awayjs/renderer/lib/surfaces/SurfacePool";

import {GL_Single2DTexture}			from "@awayjs/renderer/lib/textures/GL_Single2DTexture";
import {GL_SingleCubeTexture}		from "@awayjs/renderer/lib/textures/GL_SingleCubeTexture";

import {RendererBase}				from "@awayjs/renderer/lib/RendererBase";

import {GL_MethodMaterialSurface}	from "@awayjs/materials/lib/surfaces/GL_MethodMaterialSurface";

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

export * from "./lib/adapters";
export * from "./lib/animators";
export * from "./lib/attributes";
export * from "./lib/base";
export * from "./lib/bounds";
export * from "./lib/controllers";
export * from "./lib/display";
export * from "./lib/draw";
export * from "./lib/errors";
export * from "./lib/events";
export * from "./lib/filters";
export * from "./lib/geom";
export * from "./lib/graphics";
export * from "./lib/image";
export * from "./lib/library";
export * from "./lib/managers";
export * from "./lib/materials";
export * from "./lib/net";
export * from "./lib/parsers";
export * from "./lib/partition";
export * from "./lib/pick";
export * from "./lib/prefabs";
export * from "./lib/projections";
export * from "./lib/shaders";
export * from "./lib/text";
export * from "./lib/textures";
export * from "./lib/tools";
export * from "./lib/ui";
export * from "./lib/utils";
export {View} from "@awayjs/display/lib/View";
export {DefaultRenderer} from "@awayjs/renderer/lib/DefaultRenderer";