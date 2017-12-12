export * from "@awayjs/view";

import {Loader, WaveAudioParser} from "@awayjs/core";

import {GL_LineElements, Shape, LineElements, TriangleElements, GL_ShapeRenderable, GL_TriangleElements} from "@awayjs/graphics";

import {Stage, Image2D, ImageCube, BitmapImage2D, ExternalImage2D, BitmapImageCube, SpecularImage2D, Image2DParser, ImageCubeParser, TextureAtlasParser, AttributesBuffer, GL_AttributesBuffer, GL_RenderImage2D, GL_RenderImageCube, GL_BitmapImage2D, GL_ExternalImage2D, GL_BitmapImageCube} from "@awayjs/stage";

import {GL_LineSegmentRenderable, GL_SkyboxRenderable, GL_SkyboxMaterial, GL_BillboardRenderable, Skybox, DisplayObjectContainer, Scene, Billboard, LineSegment, Camera, Sprite, MorphSprite, MovieClip, TextField} from "@awayjs/scene";

import {RenderStatePool, ShaderBase} from "@awayjs/renderer";

import {MethodMaterial, GL_MethodMaterial, BasicMaterial, GL_BasicMaterial, ImageTexture2D, ImageTextureCube, GL_ImageTexture2D, GL_ImageTexture} from "@awayjs/materials";

import {PartitionBase, CameraNode, EntityNode, SkyboxNode, ViewImage2D} from "@awayjs/view";

//enable parsers
Loader.enableParser(WaveAudioParser);
Loader.enableParser(Image2DParser);
Loader.enableParser(ImageCubeParser);
Loader.enableParser(TextureAtlasParser);

//register core attributes
Stage.registerAbstraction(GL_AttributesBuffer, AttributesBuffer);

RenderStatePool.registerAbstraction(GL_BillboardRenderable, Billboard);
RenderStatePool.registerAbstraction(GL_LineSegmentRenderable, LineSegment);
RenderStatePool.registerAbstraction(GL_ShapeRenderable, Shape);
RenderStatePool.registerAbstraction(GL_SkyboxRenderable, Skybox);

//register graphics images
Stage.registerAbstraction(GL_RenderImage2D, Image2D);
Stage.registerAbstraction(GL_RenderImageCube, ImageCube);
Stage.registerAbstraction(GL_BitmapImage2D, BitmapImage2D);
Stage.registerAbstraction(GL_ExternalImage2D, ExternalImage2D);
Stage.registerAbstraction(GL_BitmapImageCube, BitmapImageCube);
Stage.registerAbstraction(GL_BitmapImage2D, SpecularImage2D);
Stage.registerAbstraction(GL_BitmapImage2D, ViewImage2D);

//register graphics elements
Stage.registerAbstraction(GL_LineElements, LineElements);
Stage.registerAbstraction(GL_TriangleElements, TriangleElements);

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
