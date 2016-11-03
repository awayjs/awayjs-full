export * from "@awayjs/view/index";

import * as core from "@awayjs/core/index";
import * as graphics from "@awayjs/graphics/index";
import * as stage from "@awayjs/stage/index";
import * as display from "@awayjs/display/index";
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
renderer.MaterialPool.registerAbstraction(renderer.GL_SkyboxMaterial, display.Skybox);
renderer.RendererBase.registerAbstraction(renderer.GL_BillboardRenderable, display.Billboard);
renderer.RendererBase.registerAbstraction(renderer.GL_LineSegmentRenderable, display.LineSegment);
renderer.RendererBase.registerAbstraction(renderer.GL_GraphicRenderable, graphics.Graphic);
renderer.RendererBase.registerAbstraction(renderer.GL_SkyboxRenderable, display.Skybox);

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
view.PartitionBase.registerAbstraction(view.CameraNode, display.Camera);
view.PartitionBase.registerAbstraction(view.EntityNode, display.DirectionalLight);
view.PartitionBase.registerAbstraction(view.EntityNode, display.Sprite);
view.PartitionBase.registerAbstraction(view.EntityNode, display.Shape);
view.PartitionBase.registerAbstraction(view.EntityNode, display.MovieClip);
view.PartitionBase.registerAbstraction(view.EntityNode, display.Billboard);
view.PartitionBase.registerAbstraction(view.EntityNode, display.LineSegment);
view.PartitionBase.registerAbstraction(view.EntityNode, display.TextField);
view.PartitionBase.registerAbstraction(view.EntityNode, display.LightProbe);
view.PartitionBase.registerAbstraction(view.EntityNode, display.PointLight);
view.PartitionBase.registerAbstraction(view.SkyboxNode, display.Skybox);
