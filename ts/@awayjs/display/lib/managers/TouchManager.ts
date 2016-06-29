import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {DisplayObject}				from "../display/DisplayObject";
import {View}							from "../View";
import {PickingCollision}				from "../pick/PickingCollision";
import {TouchEvent}				from "../events/TouchEvent";

export class TouchManager
{
	private static _instance:TouchManager;

	private _updateDirty:boolean = true;
	private _nullVector:Vector3D = new Vector3D();
	private _numTouchPoints:number;
	private _touchPoint:TouchPoint;
	private _iCollision:PickingCollision;
	private _previousCollidingObject:PickingCollision;
	public static _iCollisionFromTouchId:Object;
	public static _previousCollidingObjectFromTouchId:Object;
	private _queuedEvents:Array<TouchEvent> = new Array<TouchEvent>();
	
	private _touchPoints:Array<TouchPoint>;
	private _touchPointFromId:Object;
	
	private _touchMoveEvent:TouchEvent;

	private _touchOut:TouchEvent = new TouchEvent(TouchEvent.TOUCH_OUT);
	private _touchBegin:TouchEvent = new TouchEvent(TouchEvent.TOUCH_BEGIN);
	private _touchMove:TouchEvent = new TouchEvent(TouchEvent.TOUCH_MOVE);
	private _touchEnd:TouchEvent = new TouchEvent(TouchEvent.TOUCH_END);
	private _touchOver:TouchEvent = new TouchEvent(TouchEvent.TOUCH_OVER);

	private onTouchBeginDelegate:(event) => void;
	private onTouchMoveDelegate:(event) => void;
	private onTouchEndDelegate:(event) => void;
	
	constructor()
	{
		this._touchPoints = new Array<TouchPoint>();
		this._touchPointFromId = new Object();
		TouchManager._iCollisionFromTouchId = new Object();
		TouchManager._previousCollidingObjectFromTouchId = new Object();

		this.onTouchBeginDelegate = (event) => this.onTouchBegin(event);
		this.onTouchMoveDelegate = (event) => this.onTouchMove(event);
		this.onTouchEndDelegate = (event) => this.onTouchEnd(event);
	}

	public static getInstance():TouchManager
	{
		if (this._instance)
			return this._instance;

		return (this._instance = new TouchManager());
	}

	// ---------------------------------------------------------------------
	// Interface.
	// ---------------------------------------------------------------------
	
	public updateCollider(forceTouchMove:boolean):void
	{
		//if (forceTouchMove || this._updateDirty) { // If forceTouchMove is off, and no 2D Touch events dirty the update, don't update either.
		//	for (var i:number; i < this._numTouchPoints; ++i) {
		//		this._touchPoint = this._touchPoints[ i ];
		//		this._iCollision = this._touchPicker.getViewCollision(this._touchPoint.x, this._touchPoint.y, this._view);
		//		TouchManager._iCollisionFromTouchId[ this._touchPoint.id ] = this._iCollision;
		//	}
		//}
	}
	
	public fireTouchEvents(forceTouchMove:boolean):void
	{
		var i:number;
		for (i = 0; i < this._numTouchPoints; ++i) {
			this._touchPoint = this._touchPoints[i];
			// If colliding object has changed, queue over/out events.
			this._iCollision = TouchManager._iCollisionFromTouchId[ this._touchPoint.id ];
			this._previousCollidingObject = TouchManager._previousCollidingObjectFromTouchId[ this._touchPoint.id ];
			if (this._iCollision != this._previousCollidingObject) {
				if (this._previousCollidingObject)
					this.queueDispatch(this._touchOut, this._touchMoveEvent, this._previousCollidingObject, this._touchPoint);
				if (this._iCollision)
					this.queueDispatch(this._touchOver, this._touchMoveEvent, this._iCollision, this._touchPoint);
			}
			// Fire Touch move events here if forceTouchMove is on.
			if (forceTouchMove && this._iCollision)
				this.queueDispatch(this._touchMove, this._touchMoveEvent, this._iCollision, this._touchPoint);
		}

		var event:TouchEvent;
		var dispatcher:DisplayObject;

		// Dispatch all queued events.
		var len:number = this._queuedEvents.length;
		for (i = 0; i < len; ++i) {
			// Only dispatch from first implicitly enabled object ( one that is not a child of a TouchChildren = false hierarchy ).
			event = this._queuedEvents[i];
			dispatcher = <DisplayObject> event.entity;
			
			while (dispatcher && !dispatcher._iIsMouseEnabled())
				dispatcher = dispatcher.parent;
			
			if (dispatcher)
				dispatcher.dispatchEvent(event);
		}
		this._queuedEvents.length = 0;

		this._updateDirty = false;
		
		for (i = 0; i < this._numTouchPoints; ++i) {
			this._touchPoint = this._touchPoints[ i ];
			TouchManager._previousCollidingObjectFromTouchId[ this._touchPoint.id ] = TouchManager._iCollisionFromTouchId[ this._touchPoint.id ];
		}
	}
	
	public registerView(view:View):void
	{
		view.htmlElement.addEventListener("touchstart", this.onTouchBeginDelegate);
		view.htmlElement.addEventListener("touchmove", this.onTouchMoveDelegate);
		view.htmlElement.addEventListener("touchend", this.onTouchEndDelegate);
	}
	
	public unregisterView(view:View):void
	{
		view.htmlElement.removeEventListener("touchstart", this.onTouchBeginDelegate);
		view.htmlElement.removeEventListener("touchmove", this.onTouchMoveDelegate);
		view.htmlElement.removeEventListener("touchend", this.onTouchEndDelegate);
	}
	
	// ---------------------------------------------------------------------
	// Private.
	// ---------------------------------------------------------------------
	
	private queueDispatch(event:TouchEvent, sourceEvent, collider:PickingCollision, touch:TouchPoint):void
	{
		// 2D properties.
		event.ctrlKey = sourceEvent.ctrlKey;
		event.altKey = sourceEvent.altKey;
		event.shiftKey = sourceEvent.shiftKey;
		event.screenX = touch.x;
		event.screenY = touch.y;
		event.touchPointID = touch.id;
		
		// 3D properties.
		if (collider) {
			// Object.
			event.entity = collider.entity;
			event.renderable = collider.renderable;
			// UV.
			event.uv = collider.uv;
			// Position.
			event.position = collider.position? collider.position.clone() : null;
			// Normal.
			event.normal = collider.normal? collider.normal.clone() : null;
			// ElementsIndex.
			event.elementIndex = collider.elementIndex;
			
		} else {
			// Set all to null.
			event.uv = null;
			event.entity = null;
			event.position = this._nullVector;
			event.normal = this._nullVector;
			event.elementIndex = 0;
		}
		
		// Store event to be dispatched later.
		this._queuedEvents.push(event);
	}
	
	// ---------------------------------------------------------------------
	// Event handlers.
	// ---------------------------------------------------------------------
	
	private onTouchBegin(event):void
	{
		
		var touch:TouchPoint = new TouchPoint();
		//touch.id = event.touchPointID;
		//touch.x = event.stageX;
		//touch.y = event.stageY;
		this._numTouchPoints++;
		this._touchPoints.push(touch);
		this._touchPointFromId[ touch.id ] = touch;

		//this.updateCollider(event); // ensures collision check is done with correct mouse coordinates on mobile

		this._iCollision = TouchManager._iCollisionFromTouchId[ touch.id ];
		if (this._iCollision)
			this.queueDispatch(this._touchBegin, event, this._iCollision, touch);

		this._updateDirty = true;
	}
	
	private onTouchMove(event):void
	{
		
		//var touch:TouchPoint = this._touchPointFromId[ event.touchPointID ];
		//
		//if (!touch) return;
		//
		////touch.x = event.stageX;
		////touch.y = event.stageY;
		//
		//this._iCollision = TouchManager._iCollisionFromTouchId[ touch.id ];
		//
		//if (this._iCollision)
		//	this.queueDispatch(this._touchMove, this._touchMoveEvent = event, this._iCollision, touch);
		//
		//this._updateDirty = true;
	}
	
	private onTouchEnd(event):void
	{
		
		//var touch:TouchPoint = this._touchPointFromId[ event.touchPointID ];
		//
		//if (!touch) return;
		//
		//this._iCollision = TouchManager._iCollisionFromTouchId[ touch.id ];
		//if (this._iCollision)
		//	this.queueDispatch(this._touchEnd, event, this._iCollision, touch);
		//
		//this._touchPointFromId[ touch.id ] = null;
		//this._numTouchPoints--;
		//this._touchPoints.splice(this._touchPoints.indexOf(touch), 1);
		//
		//this._updateDirty = true;
	}
}


class TouchPoint
{
	public id:number;
	public x:number;
	public y:number;
}

interface TouchList {
	length: number;
	[index: number]: Touch;
	item: (index: number) => Touch;
}

interface Touch {
	identifier: number;
	target: EventTarget;
	screenX: number;
	screenY: number;
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
}

interface Window {
	ontouchstart: (ev) => any;
	ontouchmove: (ev) => any;
	ontouchend: (ev) => any;
	ontouchcancel: (ev) => any;
	addEventListener(type: string, listener: (ev) => any, useCapture?: boolean): void;
}

interface Document {
	ontouchstart: (ev) => any;
	ontouchmove: (ev) => any;
	ontouchend: (ev) => any;
	ontouchcancel: (ev) => any;
	addEventListener(type: string, listener: (ev) => any, useCapture?: boolean): void;
}

interface HTMLElement {
	ontouchstart: (ev) => any;
	ontouchmove: (ev) => any;
	ontouchend: (ev) => any;
	ontouchcancel: (ev) => any;
	addEventListener(type: string, listener: (ev) => any, useCapture?: boolean): void;
}

declare var ontouchstart: (ev) => any;
declare var ontouchmove: (ev) => any;
declare var ontouchend: (ev) => any;
declare var ontouchcancel: (ev) => any;

declare function addEventListener(type: string, listener: (ev) => any, useCapture?: boolean): void;

