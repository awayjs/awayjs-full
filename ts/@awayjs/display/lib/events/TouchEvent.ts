import {Point}					from "@awayjs/core/lib/geom/Point";
import {Vector3D}					from "@awayjs/core/lib/geom/Vector3D";
import {EventBase}				from "@awayjs/core/lib/events/EventBase";

import {IEntity}					from "../display/IEntity";
import {IRenderable}				from "../base/IRenderable";
import {View}						from "../View";
import {MaterialBase}				from "../materials/MaterialBase";

export class TouchEvent extends EventBase
{
	// Private.
	public _iAllowedToPropagate:boolean = true;
	public _iParentEvent:TouchEvent;

	/**
	 *
	 */
	public static TOUCH_END:string = "touchEnd3d";

	/**
	 *
	 */
	public static TOUCH_BEGIN:string = "touchBegin3d";

	/**
	 *
	 */
	public static TOUCH_MOVE:string = "touchMove3d";

	/**
	 *
	 */
	public static TOUCH_OUT:string = "touchOut3d";

	/**
	 *
	 */
	public static TOUCH_OVER:string = "touchOver3d";
	
	/**
	 * The horizontal coordinate at which the event occurred in view coordinates.
	 */
	public screenX:number;
	
	/**
	 * The vertical coordinate at which the event occurred in view coordinates.
	 */
	public screenY:number;
	
	/**
	 * The view object inside which the event took place.
	 */
	public view:View;
	
	/**
	 * The 3d object inside which the event took place.
	 */
	public entity:IEntity;
	
	/**
	 * The renderable owner inside which the event took place.
	 */
	public renderable:IRenderable;
	
	/**
	 * The material of the 3d element inside which the event took place.
	 */
	public material:MaterialBase;
	
	/**
	 * The uv coordinate inside the draw primitive where the event took place.
	 */
	public uv:Point;
	
	/**
	 * The index of the elements where the event took place.
	 */
	public elementIndex:number;
	
	/**
	 * The position in object space where the event took place
	 */
	public position:Vector3D;
	
	/**
	 * The normal in object space where the event took place
	 */
	public normal:Vector3D;
	
	/**
	 * Indicates whether the Control key is active (true) or inactive (false).
	 */
	public ctrlKey:boolean;
	
	/**
	 * Indicates whether the Alt key is active (true) or inactive (false).
	 */
	public altKey:boolean;
	
	/**
	 * Indicates whether the Shift key is active (true) or inactive (false).
	 */
	public shiftKey:boolean;


	public touchPointID:number;
	
	/**
	 * Create a new TouchEvent object.
	 * @param type The type of the TouchEvent.
	 */
	constructor(type:string)
	{
		super(type);
	}
	
	/**
	 * @inheritDoc
	 */
	public get bubbles():boolean
	{
		var doesBubble:boolean = this._iAllowedToPropagate;
		this._iAllowedToPropagate = true;

		// Don't bubble if propagation has been stopped.
		return doesBubble;
	}
	
	/**
	 * @inheritDoc
	 */
	public stopPropagation():void
	{
		this._iAllowedToPropagate = false;
		
		if (this._iParentEvent)
			this._iParentEvent.stopPropagation();
	}
	
	/**
	 * @inheritDoc
	 */
	public stopImmediatePropagation():void
	{
		this._iAllowedToPropagate = false;

		if (this._iParentEvent)
			this._iParentEvent.stopImmediatePropagation();
	}
	
	/**
	 * Creates a copy of the TouchEvent object and sets the value of each property to match that of the original.
	 */
	public clone():TouchEvent
	{
		var result:TouchEvent = new TouchEvent(this.type);

		/* TODO: Debug / test - look into isDefaultPrevented
		 if (isDefaultPrevented())
		 result.preventDefault();
		 */
		
		result.screenX = this.screenX;
		result.screenY = this.screenY;
		
		result.view = this.view;
		result.entity = this.entity;
		result.renderable = this.renderable;
		result.material = this.material;
		result.uv = this.uv;
		result.position = this.position;
		result.normal = this.normal;
		result.elementIndex = this.elementIndex;
		
		result.ctrlKey = this.ctrlKey;
		result.shiftKey = this.shiftKey;
		
		result._iParentEvent = this;
		
		return result;
	}
	
	/**
	 * The position in scene space where the event took place
	 */
	public get scenePosition():Vector3D
	{
		return this.entity.sceneTransform.transformVector(this.position);
	}
	
	/**
	 * The normal in scene space where the event took place
	 */
	public get sceneNormal():Vector3D
	{
		var sceneNormal:Vector3D = this.entity.sceneTransform.deltaTransformVector(this.normal);
		sceneNormal.normalize();

		return sceneNormal;
	}
}