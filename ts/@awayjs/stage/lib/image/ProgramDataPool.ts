import {Stage}						from "../base/Stage";
import {ProgramData}					from "../image/ProgramData";

/**
 * @class away.pool.ProgramDataPool
 */
export class ProgramDataPool
{
	private _pool:Object = new Object();
	private _stage:Stage;

	/**
	 * //TODO
	 *
	 * @param textureDataClass
	 */
	constructor(stage:Stage)
	{
		this._stage = stage;
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 * @returns ITexture
	 */
	public getItem(vertexString:string, fragmentString:string):ProgramData
	{
		var key:string = vertexString + fragmentString;
		return this._pool[key] || (this._pool[key] = new ProgramData(this, this._stage, vertexString, fragmentString));
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(key:string):void
	{
		this._pool[key] = null;
	}
}