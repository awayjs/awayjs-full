import {AssetBase}				from "@awayjs/core/lib/library/AssetBase";
import {AbstractMethodError}		from "@awayjs/core/lib/errors/AbstractMethodError";

import {DisplayObject}			from "../display/DisplayObject";

/**
 * PrefabBase is an abstract base class for prefabs, which are prebuilt display objects that allow easy cloning and updating
 */
export class PrefabBase extends AssetBase
{
	public _pObjects:Array<DisplayObject> = new Array<DisplayObject>();

//		public _pBatchObjects:Array<BatchObject> = new Array<BatchObject>();

	/**
	 * Creates a new PrefabBase object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Returns a display object generated from this prefab
	 */
	public getNewObject():DisplayObject
	{
		var object:DisplayObject = this._pCreateObject();

		this._pObjects.push(object);

		return object;
	}

//		public getNewBatchObject():BatchObject
//		{
//			var object:BatchObject = this._pCreateBatchObject();
//
//			this._pBatchObjects.push(object);
//
//			return object;
//		}

	public _pCreateObject():DisplayObject
	{
		throw new AbstractMethodError();
	}

	public _iValidate():void
	{
		// To be overridden when necessary
	}
}