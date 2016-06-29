import {Vector3D}					from "@awayjs/core/lib/geom/Vector3D";

import {DisplayObject}			from "../display/DisplayObject";
import {ControllerBase}			from "../controllers/ControllerBase";
import {DisplayObjectEvent}		from "../events/DisplayObjectEvent";

export class LookAtController extends ControllerBase
{
	public _pLookAtPosition:Vector3D;
	public _pLookAtObject:DisplayObject;
	public _pOrigin:Vector3D = new Vector3D(0.0, 0.0, 0.0);

	private _onLookAtObjectChangedDelegate:(event:DisplayObjectEvent) => void;

	constructor(targetObject:DisplayObject = null, lookAtObject:DisplayObject = null)
	{
		super(targetObject);

		this._onLookAtObjectChangedDelegate = (event:DisplayObjectEvent) => this.onLookAtObjectChanged(event);

		if (lookAtObject)
			this.lookAtObject = lookAtObject;
		else
			this.lookAtPosition = new Vector3D();
	}

	public get lookAtPosition():Vector3D
	{
		return this._pLookAtPosition;
	}

	public set lookAtPosition(val:Vector3D)
	{
		if (this._pLookAtObject) {
			this._pLookAtObject.removeEventListener(DisplayObjectEvent.SCENETRANSFORM_CHANGED, this._onLookAtObjectChangedDelegate);
			this._pLookAtObject = null;
		}

		this._pLookAtPosition = val;
		this.pNotifyUpdate();
	}

	public get lookAtObject():DisplayObject
	{
		return this._pLookAtObject;
	}

	public set lookAtObject(val:DisplayObject)
	{
		if (this._pLookAtPosition)
			this._pLookAtPosition = null;

		if (this._pLookAtObject == val)
			return;

		if (this._pLookAtObject)
			this._pLookAtObject.removeEventListener(DisplayObjectEvent.SCENETRANSFORM_CHANGED, this._onLookAtObjectChangedDelegate);

		this._pLookAtObject = val;

		if (this._pLookAtObject)
			this._pLookAtObject.addEventListener(DisplayObjectEvent.SCENETRANSFORM_CHANGED, this._onLookAtObjectChangedDelegate);

		this.pNotifyUpdate();
	}

	//@override
	public update(interpolate:boolean = true):void
	{
		if (this._pTargetObject) {
			if (this._pLookAtPosition)
				this._pTargetObject.lookAt(this._pLookAtPosition);
			else if (this._pLookAtObject)
				this._pTargetObject.lookAt(this._pLookAtObject.scene? this._pLookAtObject.scenePosition : this._pLookAtObject.transform.position);
		}
	}

	private onLookAtObjectChanged(event:DisplayObjectEvent):void
	{
		this.pNotifyUpdate();
	}
}