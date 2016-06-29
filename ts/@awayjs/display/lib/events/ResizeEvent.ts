import {EventBase}				from "@awayjs/core/lib/events/EventBase";

export class ResizeEvent extends EventBase
{
	public static RESIZE:string = "resize";

	private _oldHeight:number;
	private _oldWidth:number;

	constructor(type:string, oldHeight:number = NaN, oldWidth:number = NaN)
	{
		super(type);

		this._oldHeight = oldHeight;
		this._oldWidth = oldWidth;
	}

	public get oldHeight():number
	{
		return this._oldHeight;
	}

	public get oldWidth():number
	{
		return this._oldWidth;
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current object.
	 */
	public clone():ResizeEvent
	{
		return new ResizeEvent(this.type, this._oldHeight, this._oldWidth);
	}
}