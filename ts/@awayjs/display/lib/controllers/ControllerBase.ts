import {AbstractMethodError}		from "@awayjs/core/lib/errors/AbstractMethodError";

import {DisplayObject}			from "../display/DisplayObject";

export class ControllerBase
{
	public _pControllerDirty:boolean;
	public _pAutoUpdate:boolean = true;
	public _pTargetObject:DisplayObject;

	constructor(targetObject:DisplayObject = null)
	{
		this.targetObject = targetObject;
	}

	public pNotifyUpdate():void
	{
		if (this._pTargetObject)
			this._pTargetObject.invalidatePartitionBounds();
	}

	public get targetObject():DisplayObject
	{
		return this._pTargetObject;
	}

	public set targetObject(val:DisplayObject)
	{
		if (this._pTargetObject == val)
			return;

		if (this._pTargetObject && this._pAutoUpdate)
			this._pTargetObject._iController = null;

		this._pTargetObject = val;

		if (this._pTargetObject && this._pAutoUpdate)
			this._pTargetObject._iController = this;

		this.pNotifyUpdate();
	}

	public get autoUpdate():boolean
	{
		return this._pAutoUpdate;
	}

	public set autoUpdate(val:boolean)
	{
		if (this._pAutoUpdate == val)
			return;

		this._pAutoUpdate = val;

		if (this._pTargetObject) {
			if (this._pAutoUpdate)
				this._pTargetObject._iController = this;
			else
				this._pTargetObject._iController = null;
		}
	}

	public update(interpolate:boolean = true):void
	{
		throw new AbstractMethodError();
	}

	public updateController():void
	{
		if (this._pControllerDirty && this._pAutoUpdate) {
			this._pControllerDirty = false;
			this.pNotifyUpdate();
		}
	}
}