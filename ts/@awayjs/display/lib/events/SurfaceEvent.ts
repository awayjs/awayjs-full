import {EventBase}					from "@awayjs/core/lib/events/EventBase";

import {ISurface}						from "../base/ISurface";

export class SurfaceEvent extends EventBase
{
	public static INVALIDATE_TEXTURE:string = "invalidateTexture";

	public static INVALIDATE_ANIMATION:string = "invalidateAnimation";

	public static INVALIDATE_PASSES:string = "invalidatePasses";

	private _surface:ISurface;


	/**
	 * Create a new GraphicsEvent
	 * @param type The event type.
	 * @param dataType An optional data type of the vertex data being updated.
	 */
	constructor(type:string, surface:ISurface)
	{
		super(type);

		this._surface = surface;
	}

	/**
	 * The surface of the renderable.
	 */
	public get surface():ISurface
	{
		return this._surface;
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current object.
	 */
	public clone():SurfaceEvent
	{
		return new SurfaceEvent(this.type, this._surface);
	}
}