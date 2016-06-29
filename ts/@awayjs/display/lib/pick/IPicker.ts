import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {Scene}						from "../display/Scene";
import {View}							from "../View";
import {PickingCollision}				from "../pick/PickingCollision";

/**
 * Provides an interface for picking objects that can pick 3d objects from a view or scene.
 *
 * @interface away.pick.IPicker
 */
export interface IPicker
{
	/**
	 * Gets the collision object from the screen coordinates of the picking ray.
	 *
	 * @param x The x coordinate of the picking ray in screen-space.
	 * @param y The y coordinate of the picking ray in screen-space.
	 * @param view The view on which the picking object acts.
	 */
	getViewCollision(x:number, y:number, view:View):PickingCollision;

	/**
	 * Gets the collision object from the scene position and direction of the picking ray.
	 *
	 * @param position The position of the picking ray in scene-space.
	 * @param direction The direction of the picking ray in scene-space.
	 * @param scene The scene on which the picking object acts.
	 */
	getSceneCollision(position:Vector3D, direction:Vector3D, scene:Scene):PickingCollision;

	/**
	 * Determines whether the picker takes account of the mouseEnabled properties of entities. Defaults to true.
	 */
	onlyMouseEnabled:boolean; // GET / SET

	/**
	 * Disposes memory used by the IPicker object
	 */
	dispose();
}