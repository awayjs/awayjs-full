import {EventBase}				from "@awayjs/core/lib/events/EventBase";

export class LightEvent extends EventBase
{
	public static CASTS_SHADOW_CHANGE:string = "castsShadowChange";

	constructor(type:string)
	{
		super(type);
	}

	//@override
	public clone():LightEvent
	{
		return new LightEvent(this.type);
	}
}