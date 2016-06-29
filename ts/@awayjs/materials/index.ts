import * as data					from "./lib/data";
import * as methods					from "./lib/methods";
import * as surfaces				from "./lib/surfaces";
import {MethodMaterial}				from "./lib/MethodMaterial";
import {MethodMaterialMode}			from "./lib/MethodMaterialMode";

import {SurfacePool}				from "@awayjs/renderer/lib/surfaces/SurfacePool";

SurfacePool.registerAbstraction(surfaces.GL_MethodMaterialSurface, MethodMaterial);

export {
	data,
	methods,
	surfaces,
	MethodMaterial,
	MethodMaterialMode
}