import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";


import {ITraverser}					from "../ITraverser";
import {DisplayObject}				from "../display/DisplayObject";
import {Scene}						from "../display/Scene";
import {View}							from "../View";
import {IPicker}						from "../pick/IPicker";
import {PickingCollision}				from "../pick/PickingCollision";
import {IEntity}						from "../display/IEntity";
import {IRenderable}					from "../base/IRenderable";
import {INode}						from "../partition/INode";
import {IPickingCollider}				from "../pick/IPickingCollider";

/**
 * Picks a 3d object from a view or scene by 3D raycast calculations.
 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
 * then triggers an optional picking collider on individual renderable objects to further determine the precise values of the picking ray collision.
 *
 * @class away.pick.RaycastPicker
 */
export class RaycastPicker implements IPicker, ITraverser
{
	private _rayPosition:Vector3D;
	private _rayDirection:Vector3D;
	private _x:number;
	private _y:number;
	private _view:View;
	private _findClosestCollision:boolean;
	private _bestCollision:PickingCollision;
	private _testCollision:PickingCollision;
	private _testCollider:IPickingCollider;
	private _ignoredEntities:Array<IEntity>;

	private _entities:Array<IEntity> = new Array<IEntity>();
	private _hasCollisions:boolean;

	/**
	 * @inheritDoc
	 */
	public onlyMouseEnabled:boolean = true;

	/**
	 * Creates a new <code>RaycastPicker</code> object.
	 *
	 * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
	 * or simply returns the first collision encountered. Defaults to false.
	 */
	constructor(findClosestCollision:boolean = false)
	{
		this._findClosestCollision = findClosestCollision;
	}

	/**
	 * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
	 *
	 * @param node The Partition3DNode object to frustum-test.
	 */
	public enterNode(node:INode):boolean
	{
		return node.isIntersectingRay(this._rayPosition, this._rayDirection) && !node.isMask();
	}

	/**
	 * @inheritDoc
	 */
	public getViewCollision(x:number, y:number, view:View):PickingCollision
	{
		this._x = x;
		this._y = y;
		this._view = view;

		//update ray
		var rayPosition:Vector3D = view.unproject(x, y, 0);
		var rayDirection:Vector3D = view.unproject(x, y, 1).subtract(rayPosition);

		return this.getSceneCollision(rayPosition, rayDirection, view.scene);
	}

	/**
	 * @inheritDoc
	 */
	public getSceneCollision(rayPosition:Vector3D, rayDirection:Vector3D, scene:Scene):PickingCollision
	{
		this._rayPosition = rayPosition;
		this._rayDirection = rayDirection;

		// collect entities to test
		scene.traversePartitions(this);

		//early out if no collisions detected
		if (!this._entities.length)
			return null;

		var collision:PickingCollision = this.getPickingCollision();

		//discard entities
		this._entities.length = 0;

		return collision;
	}

//		public getEntityCollision(position:Vector3D, direction:Vector3D, entities:Array<IEntity>):PickingCollision
//		{
//			this._numRenderables = 0;
//
//			var renderable:IEntity;
//			var l:number = entities.length;
//
//			for (var c:number = 0; c < l; c++) {
//				renderable = entities[c];
//
//				if (renderable.isIntersectingRay(position, direction))
//					this._renderables[this._numRenderables++] = renderable;
//			}
//
//			return this.getPickingCollision(this._raycastCollector);
//		}

	public setIgnoreList(entities:Array<IEntity>):void
	{
		this._ignoredEntities = entities;
	}
	
	private isIgnored(entity:IEntity):boolean
	{
		if (this.onlyMouseEnabled && !entity._iIsMouseEnabled())
			return true;

		if (this._ignoredEntities) {
			var len:number = this._ignoredEntities.length;
			for (var i:number = 0; i < len; i++)
				if (this._ignoredEntities[i] == entity)
					return true;
		}
		
		return false;
	}

	private sortOnNearT(entity1:IEntity, entity2:IEntity):number
	{
		return entity2._iPickingCollision.rayEntryDistance - entity1._iPickingCollision.rayEntryDistance;
	}

	private getPickingCollision():PickingCollision
	{
		// Sort entities from closest to furthest to reduce tests.
		this._entities = this._entities.sort(this.sortOnNearT); // TODO - test sort filter in JS

		// ---------------------------------------------------------------------
		// Evaluate triangle collisions when needed.
		// Replaces collision data provided by bounds collider with more precise data.
		// ---------------------------------------------------------------------

		this._bestCollision = null;
		
		var entity:IEntity;
		var len:number = this._entities.length;
		for (var i:number = len - 1; i >=0; i--) {
			entity = this._entities[i];
			this._testCollision = entity._iPickingCollision;
			if (this._bestCollision == null || this._testCollision.rayEntryDistance < this._bestCollision.rayEntryDistance) {
				this._testCollider = entity.pickingCollider;
				if (this._testCollider) {
					this._testCollision.rayEntryDistance = Number.MAX_VALUE;
					entity._acceptTraverser(this);
					// If a collision exists, update the collision data and stop all checks.
					if (this._bestCollision && !this._findClosestCollision)
						break;
				} else if (!this._testCollision.rayOriginIsInsideBounds) {
					// A bounds collision with no picking collider stops all checks.
					// Note: a bounds collision with a ray origin inside its bounds is ONLY ever used
					// to enable the detection of a corresponsding triangle collision.
					// Therefore, bounds collisions with a ray origin inside its bounds can be ignored
					// if it has been established that there is NO triangle collider to test
					this._bestCollision = this._testCollision;
					break;
				}
			}
		}

		if (this._bestCollision)
			this.updatePosition(this._bestCollision);

		return this._bestCollision;
	}

	private updatePosition(pickingCollision:PickingCollision):void
	{
		var collisionPos:Vector3D = pickingCollision.position || (pickingCollision.position = new Vector3D());

		var rayDir:Vector3D = pickingCollision.rayDirection;
		var rayPos:Vector3D = pickingCollision.rayPosition;
		var t:number = pickingCollision.rayEntryDistance;
		collisionPos.x = rayPos.x + t*rayDir.x;
		collisionPos.y = rayPos.y + t*rayDir.y;
		collisionPos.z = rayPos.z + t*rayDir.z;
	}

	public dispose():void
	{
		//TODO
	}

	/**
	 *
	 * @param entity
	 */
	public applyEntity(entity:IEntity):void
	{
		if (!this.isIgnored(entity))
			this._entities.push(entity);
	}

	/**
	 *
	 * @param entity
	 */
	public applyRenderable(renderable:IRenderable):void
	{
		if (renderable._iTestCollision(this._testCollision, this._testCollider))
			this._bestCollision = this._testCollision;
	}
	
	/**
	 *
	 * @param entity
	 */
	public applyDirectionalLight(entity:IEntity):void
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applyLightProbe(entity:IEntity):void
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applyPointLight(entity:IEntity):void
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applySkybox(entity:IEntity):void
	{
		//don't do anything here
	}
}