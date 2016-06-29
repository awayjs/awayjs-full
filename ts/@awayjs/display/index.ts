import * as adapters				from "./lib/adapters";
import * as animators				from "./lib/animators";
import * as base					from "./lib/base";
import * as bounds					from "./lib/bounds";
import * as controllers				from "./lib/controllers";
import * as display					from "./lib/display";
import * as draw					from "./lib/draw";
import * as errors					from "./lib/errors";
import * as events					from "./lib/events";
import * as factories				from "./lib/factories";
import * as graphics				from "./lib/graphics";
import * as managers				from "./lib/managers";
import * as materials				from "./lib/materials";
import * as partition				from "./lib/partition";
import * as pick					from "./lib/pick";
import * as prefabs					from "./lib/prefabs";
import * as text					from "./lib/text";
import * as textures				from "./lib/textures";
import * as utils					from "./lib/utils";
import {IRenderer}					from "./lib/IRenderer";
import {ITraverser}					from "./lib/ITraverser";
import {View}							from "./lib/View";

partition.PartitionBase.registerAbstraction(partition.CameraNode, display.Camera);
partition.PartitionBase.registerAbstraction(partition.DirectionalLightNode, display.DirectionalLight);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Sprite);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Shape);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.MovieClip);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Billboard);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.LineSegment);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextField);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextFieldMultiRender);
partition.PartitionBase.registerAbstraction(partition.LightProbeNode, display.LightProbe);
partition.PartitionBase.registerAbstraction(partition.PointLightNode, display.PointLight);
partition.PartitionBase.registerAbstraction(partition.SkyboxNode, display.Skybox);

export {
	adapters,
	animators,
	base,
	bounds,
	controllers,
	display,
	draw,
	errors,
	events,
	factories,
	graphics,
	managers,
	materials,
	partition,
	pick,
	prefabs,
	text,
	textures,
	utils,
	IRenderer,
	ITraverser,
	View
}

