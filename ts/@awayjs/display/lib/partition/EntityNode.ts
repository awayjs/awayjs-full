import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {DisplayObject}				from "../display/DisplayObject";
import {ITraverser}					from "../ITraverser";
import {DisplayObjectEvent}			from "../events/DisplayObjectEvent";
import {PickingCollision}				from "../pick/PickingCollision";
import {DisplayObjectNode}			from "../partition/DisplayObjectNode";
import {PartitionBase}				from "../partition/PartitionBase";

/**
 * @class away.partition.EntityNode
 */
export class EntityNode extends DisplayObjectNode
{
	public numEntities:number = 1;

	private _partition:PartitionBase;
	private _maskPosition:Vector3D = new Vector3D();


	constructor(displayObject:DisplayObject, partition:PartitionBase)
	{
		super(displayObject, partition);

		this._partition = partition;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._partition = null;
	}

	/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		if (!this._displayObject._iIsVisible())
			return false;

		return true; // todo: hack for 2d. attention. might break stuff in 3d.
		//return this._bounds.isInFrustum(planes, numPlanes);
	}


	/**
	 * @inheritDoc
	 */
	public isIntersectingRay(globalRayPosition:Vector3D, globalRayDirection:Vector3D):boolean
	{
		if (!this._displayObject._iIsVisible() || !this.isIntersectingMasks(globalRayPosition, globalRayDirection, this._displayObject._iAssignedMasks()))
			return false;

		var pickingCollision:PickingCollision = this._displayObject._iPickingCollision;
		pickingCollision.rayPosition = this._displayObject.inverseSceneTransform.transformVector(globalRayPosition);
		pickingCollision.rayDirection = this._displayObject.inverseSceneTransform.deltaTransformVector(globalRayDirection);

		if (!pickingCollision.normal)
			pickingCollision.normal = new Vector3D();

		var rayEntryDistance:number = this.bounds.rayIntersection(pickingCollision.rayPosition, pickingCollision.rayDirection, pickingCollision.normal);

		if (rayEntryDistance < 0)
			return false;

		pickingCollision.rayEntryDistance = rayEntryDistance;
		pickingCollision.globalRayPosition = globalRayPosition;
		pickingCollision.globalRayDirection = globalRayDirection;
		pickingCollision.rayOriginIsInsideBounds = rayEntryDistance == 0;

		return true;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isRenderable():boolean
	{
		return this._displayObject._iAssignedColorTransform()._isRenderable();
	}
	
	/**
	 * @inheritDoc
	 */
	public acceptTraverser(traverser:ITraverser):void
	{
		if (traverser.enterNode(this))
			traverser.applyEntity(this._displayObject);
	}

	public _onInvalidatePartitionBounds(event:DisplayObjectEvent):void
	{
		this.bounds.invalidate();

		this._partition.iMarkForUpdate(this);
	}

	private isIntersectingMasks(globalRayPosition:Vector3D, globalRayDirection:Vector3D, masks:Array<Array<DisplayObject>>):boolean
	{
		//horrible hack for 2d masks
		if (masks != null) {
			this._maskPosition.x = globalRayPosition.x + globalRayDirection.x*1000;
			this._maskPosition.y = globalRayPosition.y + globalRayDirection.y*1000;
			var numLayers:number = masks.length;
			var children:Array<DisplayObject>;
			var numChildren:number;
			var layerHit:boolean;
			for (var i:number = 0; i < numLayers; i++) {
				children = masks[i];
				numChildren = children.length;
				layerHit = false;
				for (var j:number = 0; j < numChildren; j++) {
					if (children[j].hitTestPoint(this._maskPosition.x, this._maskPosition.y, true, true)) {
						layerHit = true;
						break;
					}
				}

				if (!layerHit)
					return false;
			}
		}

		return true;
	}
}