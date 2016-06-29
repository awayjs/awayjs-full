import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {PickingCollision}				from "../pick/PickingCollision";
import {Billboard}					from "../display/Billboard";
import {TriangleElements}				from "../graphics/TriangleElements";
import {LineElements}					from "../graphics/LineElements";
import {MaterialBase}					from "../materials/MaterialBase";

/**
 * Provides an interface for picking colliders that can be assigned to individual entities in a scene for specific picking behaviour.
 * Used with the <code>RaycastPicker</code> picking object.
 *
 * @see away.entities.Entity#pickingCollider
 * @see away.pick.RaycastPicker
 *
 * @interface away.pick.IPickingCollider
 */
export interface IPickingCollider
{

	/**
	 * Tests a <code>Billboard</code> object for a collision with the picking ray.
	 *
	 * @param billboard
	 * @param material
	 * @param pickingCollision
	 * @param shortestCollisionDistance
	 */
	testBillboardCollision(billboard:Billboard, material:MaterialBase, pickingCollision:PickingCollision):boolean

	/**
	 * Tests a <code>TriangleElements</code> object for a collision with the picking ray.
	 *
	 * @param triangleElements
	 * @param material
	 * @param pickingCollision
	 * @param shortestCollisionDistance
	 */
	testTriangleCollision(triangleElements:TriangleElements, material:MaterialBase, pickingCollision:PickingCollision, count:number, offset?:number):boolean

	/**
	 * Tests a <code>LineElements</code> object for a collision with the picking ray.
	 *
	 * @param lineElements
	 * @param material
	 * @param pickingCollision
	 * @param shortestCollisionDistance
	 */
	testLineCollision(lineElements:LineElements, material:MaterialBase, pickingCollision:PickingCollision, count:number, offset?:number):boolean

}