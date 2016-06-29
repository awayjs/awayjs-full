import {EventBase}				from "@awayjs/core/lib/events/EventBase";

import {DisplayObject}			from "../display/DisplayObject";

export class DisplayObjectEvent extends EventBase
{
	/**
	 *
	 */
	public static VISIBLITY_UPDATED:string = "visiblityUpdated";

	/**
	 *
	 */
	public static SCENETRANSFORM_CHANGED:string = "scenetransformChanged";

	/**
	 *
	 */
	public static SCENE_CHANGED:string = "sceneChanged";

	/**
	 *
	 */
	public static PARTITION_CHANGED:string = "partitionChanged";

	/**
	 *
	 */
	public static INVALIDATE_PARTITION_BOUNDS:string = "invalidatePartitionBounds";

	private _object:DisplayObject;

	public get object():DisplayObject
	{
		return this._object;
	}

	constructor(type:string, object:DisplayObject)
	{
		super(type);
		this._object = object;
	}

	/**
	 * Clones the event.
	 * @return An exact duplicate of the current object.
	 */
	public clone():DisplayObjectEvent
	{
		return new DisplayObjectEvent(this.type, this._object);
	}
}