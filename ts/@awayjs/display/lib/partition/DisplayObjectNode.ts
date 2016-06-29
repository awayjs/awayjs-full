import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {IAbstractionPool}				from "@awayjs/core/lib/library/IAbstractionPool";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {DisplayObject}				from "../display/DisplayObject";
import {AxisAlignedBoundingBox}		from "../bounds/AxisAlignedBoundingBox";
import {BoundingSphere}				from "../bounds/BoundingSphere";
import {BoundingVolumeBase}			from "../bounds/BoundingVolumeBase";
import {BoundsType}					from "../bounds/BoundsType";
import {NullBounds}					from "../bounds/NullBounds";
import {SceneGraphNode}				from "../partition/SceneGraphNode";
import {ITraverser}					from "../ITraverser";
import {IEntity}						from "../display/IEntity";
import {DisplayObjectEvent}			from "../events/DisplayObjectEvent";
import {INode}						from "../partition/INode";

/**
 * @class away.partition.EntityNode
 */
export class DisplayObjectNode extends AbstractionBase implements INode
{
	public numEntities:number = 0;

	public isSceneGraphNode:boolean = false;

	public _iUpdateQueueNext:DisplayObjectNode;

	private _onInvalidatePartitionBoundsDelegate:(event:DisplayObjectEvent) => void;
	
	public _displayObject:DisplayObject;
	private _boundsDirty:boolean = true;
	private _bounds:BoundingVolumeBase;

	public _iCollectionMark:number;// = 0;

	public parent:SceneGraphNode;

	private _boundsType:string;

	public get debugVisible():boolean
	{
		return this._displayObject.debugVisible;
	}

	/**
	 * @internal
	 */
	public get bounds():BoundingVolumeBase
	{
		if (this._boundsDirty)
			this._updateBounds();

		return this._bounds;
	}

	constructor(displayObject:DisplayObject, pool:IAbstractionPool)
	{
		super(displayObject, pool);

		this._onInvalidatePartitionBoundsDelegate = (event:DisplayObjectEvent) => this._onInvalidatePartitionBounds(event);

		this._displayObject = displayObject;
		this._displayObject.addEventListener(DisplayObjectEvent.INVALIDATE_PARTITION_BOUNDS, this._onInvalidatePartitionBoundsDelegate);

		this._boundsType = this._displayObject.boundsType;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isCastingShadow():boolean
	{
		return this._displayObject.castsShadows;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isMask():boolean
	{
		return this._displayObject.maskMode;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._displayObject.removeEventListener(DisplayObjectEvent.INVALIDATE_PARTITION_BOUNDS, this._onInvalidatePartitionBoundsDelegate);
		this._displayObject = null;

		if (this._bounds)
			this._bounds.dispose();

		this._bounds = null;
	}

	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		if (this._boundsType != this._displayObject.boundsType) {
			this._boundsType = this._displayObject.boundsType;
			this._boundsDirty = true;
		}
	}

	/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		return true;
	}


	/**
	 * @inheritDoc
	 */
	public isIntersectingRay(rayPosition:Vector3D, rayDirection:Vector3D):boolean
	{
		return true;
	}
	
	/**
	 *
	 * @returns {boolean}
	 */
	public isRenderable():boolean
	{
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public acceptTraverser(traverser:ITraverser):void
	{
		// do nothing here
	}

	public _onInvalidatePartitionBounds(event:DisplayObjectEvent):void
	{
		// do nothing here
	}

	private _updateBounds():void
	{
		if (this._bounds)
			this._bounds.dispose();

		if (this._boundsType == BoundsType.AXIS_ALIGNED_BOX)
			this._bounds = new AxisAlignedBoundingBox(this._displayObject);
		else if (this._boundsType == BoundsType.SPHERE)
			this._bounds = new BoundingSphere(this._displayObject);
		else if (this._boundsType == BoundsType.NULL)
			this._bounds = new NullBounds();

		this._boundsDirty = false;
	}
}