export * from "@awayjs/view/index";

import * as core from "@awayjs/core/index";
import * as graphics from "@awayjs/graphics/index";
import * as stage from "@awayjs/stage/index";
import * as scene from "@awayjs/scene/index";
import * as renderer from "@awayjs/renderer/index";
import * as materials from "@awayjs/materials/index";
import * as view from "@awayjs/view/index";

//enable parsers
core.Loader.enableParser(core.WaveAudioParser);
core.Loader.enableParser(graphics.Image2DParser);
core.Loader.enableParser(graphics.ImageCubeParser);
core.Loader.enableParser(graphics.TextureAtlasParser);

//register core attributes
stage.Stage.registerAbstraction(stage.GL_AttributesBuffer, core.AttributesBuffer);

//register scene entities
renderer.MaterialPool.registerAbstraction(renderer.GL_SkyboxMaterial, scene.Skybox);
renderer.RendererBase.registerAbstraction(renderer.GL_BillboardRenderable, scene.Billboard);
renderer.RendererBase.registerAbstraction(renderer.GL_LineSegmentRenderable, scene.LineSegment);
renderer.RendererBase.registerAbstraction(renderer.GL_GraphicRenderable, graphics.Graphic);
renderer.RendererBase.registerAbstraction(renderer.GL_SkyboxRenderable, scene.Skybox);

//register graphics images
stage.Stage.registerAbstraction(stage.GL_RenderImage2D, graphics.Image2D);
stage.Stage.registerAbstraction(stage.GL_RenderImageCube, graphics.ImageCube);
stage.Stage.registerAbstraction(stage.GL_BitmapImage2D, graphics.BitmapImage2D);
stage.Stage.registerAbstraction(stage.GL_BitmapImageCube, graphics.BitmapImageCube);
stage.Stage.registerAbstraction(stage.GL_BitmapImage2D, graphics.SpecularImage2D);
stage.Stage.registerAbstraction(stage.GL_Sampler2D, graphics.Sampler2D);
stage.Stage.registerAbstraction(stage.GL_SamplerCube, graphics.SamplerCube);

//register graphics elements
stage.Stage.registerAbstraction(renderer.GL_LineElements, graphics.LineElements);
stage.Stage.registerAbstraction(renderer.GL_TriangleElements, graphics.TriangleElements);

//register graphics textures
renderer.ShaderBase.registerAbstraction(renderer.GL_Single2DTexture, graphics.Single2DTexture);
renderer.ShaderBase.registerAbstraction(renderer.GL_SingleCubeTexture, graphics.SingleCubeTexture);

//register graphics materials
renderer.MaterialPool.registerAbstraction(renderer.GL_BasicMaterial, graphics.BasicMaterial);

//regiater material materials
renderer.MaterialPool.registerAbstraction(materials.GL_MethodMaterial, materials.MethodMaterial);

//register view nodes
view.PartitionBase.registerAbstraction(view.CameraNode, scene.Camera);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.DirectionalLight);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.Sprite);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.Shape);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.MovieClip);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.Billboard);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.LineSegment);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.TextField);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.LightProbe);
view.PartitionBase.registerAbstraction(view.EntityNode, scene.PointLight);
view.PartitionBase.registerAbstraction(view.SkyboxNode, scene.Skybox);
