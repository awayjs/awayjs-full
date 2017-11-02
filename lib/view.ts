export * from "@awayjs/view";

import {Loader, WaveAudioParser, AttributesBuffer} from "@awayjs/core";

import {Image2DParser, ImageCubeParser, TextureAtlasParser, Shape, Image2D, ImageCube, BitmapImage2D, ExternalImage2D, BitmapImageCube, SpecularImage2D, Sampler2D, SamplerCube, LineElements, TriangleElements, Single2DTexture, SingleCubeTexture, BasicMaterial} from "@awayjs/graphics";

import {Stage, GL_AttributesBuffer, GL_RenderImage2D, GL_RenderImageCube, GL_BitmapImage2D, GL_ExternalImage2D, GL_BitmapImageCube, GL_Sampler2D, GL_SamplerCube, RenderablePool, ShaderBase, GL_ShapeRenderable, GL_TriangleElements, GL_Single2DTexture, GL_SingleCubeTexture, GL_BasicMaterial} from "@awayjs/stage";

import {Skybox, DisplayObjectContainer, Scene, Billboard, LineSegment, Camera, Sprite, MorphSprite, MovieClip, TextField} from "@awayjs/scene";

import {GL_SkyboxMaterial, GL_BillboardRenderable, GL_LineSegmentRenderable, GL_SkyboxRenderable, GL_LineElements, DefaultMaterialGroup} from "@awayjs/renderer";

import {MethodMaterial, GL_MethodMaterial} from "@awayjs/materials";

import {PartitionBase, CameraNode, EntityNode, SkyboxNode, ViewImage2D} from "@awayjs/view";

//enable parsers
Loader.enableParser(WaveAudioParser);
Loader.enableParser(Image2DParser);
Loader.enableParser(ImageCubeParser);
Loader.enableParser(TextureAtlasParser);

//register core attributes
Stage.registerAbstraction(GL_AttributesBuffer, AttributesBuffer);

//register scene entities
DefaultMaterialGroup.registerAbstraction(GL_SkyboxMaterial, Skybox);

RenderablePool.registerAbstraction(GL_BillboardRenderable, Billboard);
RenderablePool.registerAbstraction(GL_LineSegmentRenderable, LineSegment);
RenderablePool.registerAbstraction(GL_ShapeRenderable, Shape);
RenderablePool.registerAbstraction(GL_SkyboxRenderable, Skybox);

//register graphics images
Stage.registerAbstraction(GL_RenderImage2D, Image2D);
Stage.registerAbstraction(GL_RenderImageCube, ImageCube);
Stage.registerAbstraction(GL_BitmapImage2D, BitmapImage2D);
Stage.registerAbstraction(GL_ExternalImage2D, ExternalImage2D);
Stage.registerAbstraction(GL_BitmapImageCube, BitmapImageCube);
Stage.registerAbstraction(GL_BitmapImage2D, SpecularImage2D);
Stage.registerAbstraction(GL_BitmapImage2D, ViewImage2D);
Stage.registerAbstraction(GL_Sampler2D, Sampler2D);
Stage.registerAbstraction(GL_SamplerCube, SamplerCube);

//register graphics elements
Stage.registerAbstraction(GL_LineElements, LineElements);
Stage.registerAbstraction(GL_TriangleElements, TriangleElements);

//register graphics textures
ShaderBase.registerAbstraction(GL_Single2DTexture, Single2DTexture);
ShaderBase.registerAbstraction(GL_SingleCubeTexture, SingleCubeTexture);

//register graphics materials
DefaultMaterialGroup.registerAbstraction(GL_BasicMaterial, BasicMaterial);

//regiater material materials
DefaultMaterialGroup.registerAbstraction(GL_MethodMaterial, MethodMaterial);

//register view nodes
PartitionBase.registerAbstraction(CameraNode, Camera);
PartitionBase.registerAbstraction(EntityNode, Sprite);
PartitionBase.registerAbstraction(EntityNode, DisplayObjectContainer);
PartitionBase.registerAbstraction(EntityNode, Scene);
PartitionBase.registerAbstraction(EntityNode, MorphSprite);
PartitionBase.registerAbstraction(EntityNode, MovieClip);
PartitionBase.registerAbstraction(EntityNode, Billboard);
PartitionBase.registerAbstraction(EntityNode, LineSegment);
PartitionBase.registerAbstraction(EntityNode, TextField);
PartitionBase.registerAbstraction(SkyboxNode, Skybox);
