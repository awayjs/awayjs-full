import {ColorTransform}			from "@awayjs/core/lib/geom/ColorTransform";
import {EventDispatcher}			from "@awayjs/core/lib/events/EventDispatcher";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";
import {DisplayObjectContainer}		from "@awayjs/display/lib/display/DisplayObjectContainer";
import {HierarchicalProperties}		from "@awayjs/display/lib/base/HierarchicalProperties";
import {TouchPoint}					from "@awayjs/display/lib/base/TouchPoint";

import {AS2SharedObjectAdapter}		from "../adapters/AS2SharedObjectAdapter";
import {AS2MovieClipAdapter}			from "../adapters/AS2MovieClipAdapter";
import {AS2KeyAdapter}				from "../adapters/AS2KeyAdapter";
import {AS2MouseAdapter}				from "../adapters/AS2MouseAdapter";
import {AS2StageAdapter}				from "../adapters/AS2StageAdapter";
import {FrameScriptManager}			from "@awayjs/display/lib/managers/FrameScriptManager";

import {View}			from "@awayjs/display/lib/View";


// also contains global AS2 gunctions
export class AS2SymbolAdapter
{
	public _view:View;

	public isBlockedByScript():boolean { return this._blockedByScript;}
	public isVisibilityByScript():boolean { return this._visibilityByScript;}
	public freeFromScript():void { this._blockedByScript=false; this._visibilityByScript=false;}

	// blendMode
	// cacheAsBitmap
	// filters
	// _focusrect: Boolean
	// _highquality: Number // DEPRECATED ANYWAY
	// menu: ContextMenu
	// scale9Grid: Rectangle
	// _soundbuftime: Number
	// tabEnabled: Boolean
	// tabIndex: Number
	// _target: String  [read-only]
	// trackAsMenu: Boolean
	// _url: String [read-only]
	// useHandCursor: Boolean

	// id (renamed to instanceID)

	/*public onDragOut:Function;
	public onDragOver:Function;
	public onKeyDown:Function;
	public onKeyUp:Function;
	public onKillFocus:Function;
	public onPress:Function;
		public onRelease:Function;
	public onReleaseOutside:Function;
	public onRollOut:Function;
	public onRollOver:Function;
	public onSetFocus:Function;*/

	private __root:AS2SymbolAdapter;

	private _adaptee:DisplayObjectContainer;

	private __quality:string = "high";

	public _blockedByScript:boolean;
	public _visibilityByScript:boolean;

	public static REFERENCE_TIME:number = -1;

	constructor(adaptee:DisplayObjectContainer, view:View)
	{
		this._adaptee = adaptee;
		this._view = view;

		this._blockedByScript=false;
		if (AS2SymbolAdapter.REFERENCE_TIME === -1)
			AS2SymbolAdapter.REFERENCE_TIME = new Date().getTime();
	}

	public dispose()
	{
		this._adaptee = null;
		this._view = null;
	}

	public getVersion():number
	{
		return 0;
	}

	public get adaptee():DisplayObjectContainer
	{
		return this._adaptee;
	}

	public get _height():number
	{
		return this._adaptee.height;
	}

	public set _height(value:number)
	{
		this._adaptee.height = value;
		this._blockedByScript=true;
	}

	public get _name():string
	{
		return this._adaptee.name;
	}

	public get _rotation():number
	{
		return this._adaptee.rotationZ;
	}

	public set _rotation(value:number)
	{
		this._adaptee.rotationZ = value;
		this._blockedByScript=true;
	}

	public get _x():number
	{
		return this._adaptee.x;
	}

	public set _x(value:number)
	{
		this._adaptee.x = value;
		this._blockedByScript=true;
	}

	public get _xmouse():number
	{
		return this._view.getLocalMouseX(this._adaptee);
	}

	public get _y():number
	{
		return this._adaptee.y;
	}

	public set _y(value:number)
	{
		this._adaptee.y = value;
		this._blockedByScript=true;
	}

	public get _ymouse():number
	{
		return this._view.getLocalMouseY(this._adaptee);
	}

	public get _xscale():number
	{
		return this._adaptee.scaleX*100;
	}

	public set _xscale(value:number)
	{
		this._adaptee.scaleX = value/100;
		this._blockedByScript=true;
	}

	public get _yscale():number
	{
		return this._adaptee.scaleY*100;
	}

	public set _yscale(value:number)
	{
		this._adaptee.scaleY = value/100;
		this._blockedByScript=true;
	}

	public get _visible():boolean
	{
		return this._adaptee.visible;
	}

	public set _visible(value:boolean)
	{
		this._adaptee.visible = value;
		this._visibilityByScript=true;
	}

	public get _width():number
	{
		return this._adaptee.width;
	}

	public set _width(value:number)
	{
		this._adaptee.width = value;
		this._blockedByScript=true;
	}

	public get _touchpoints():Array<TouchPoint>
	{
		return this._view.getLocalTouchPoints(this._adaptee);
	}

	public getDepth():number
	{
		return this._adaptee.z;
	}

	// just assure consistency for scripts, doesn't actually effect rendering.
	public get _quality():string
	{
		return this.__quality;
	}

	public set quality(value:string)
	{
		this.__quality = value;
	   // this._blockedByScript=true;
	}

	public trace(message:any):void
	{
		console.log(message);
	}

	// may need proper high-def timer mechanism
	public getTimer():Number
	{
		return new Date().getTime() - AS2SymbolAdapter.REFERENCE_TIME;
	}

	public get _alpha():number
	{
		return this.adaptee.transform.colorTransform? (this.adaptee.transform.colorTransform.alphaMultiplier*100):100;
	}

	public set _alpha(value: number)
	{
		if(!this.adaptee.transform.colorTransform)
			this.adaptee.transform.colorTransform = new ColorTransform();

		this.adaptee.transform.colorTransform.alphaMultiplier = value/100;

		this.adaptee.pInvalidateHierarchicalProperties(HierarchicalProperties.COLOR_TRANSFORM);

		this._blockedByScript = true;
	}

	public get _url():string
	{
		return document.URL;
	}

	public get _global():AS2MovieClipAdapter
	{
		return null;
	}

	public get _level0():AS2SymbolAdapter
	{
		return this._root;
	}

	public clearInterval(handle:number)
	{
		FrameScriptManager.clearInterval(handle);//window.clearInterval(handle);
		return;
	}

	public setInterval(handler:Function, timeout:number, ...args:any[]):number;
	public setInterval(scope:any, handler:string, timeout:number, ...args:any[]):number;
	public setInterval(...args:any[])
	{
		var scope:any;
		var func:any;

		if (typeof(args[0]) == "function") {
			scope = this;
			func = args[0];
		} else {
			//remove scope variable from args
			scope = args.shift();

			//reformat function string to actual function variable in the scope
			func = scope[args[0]];
		}

		//wrap function to maintain scope
		args[0] = function () { func.apply(scope, arguments); }

		return FrameScriptManager.setInterval(args[0]);// window.setInterval.apply(window, args);
	}

	// temporary:
	public get _level10301():AS2SymbolAdapter
	{
		return this._root;
	}

	public get _root():AS2SymbolAdapter
	{
		if (!this.__root) {
			var p = this._parent;
			// parents are always MovieClips
			this.__root = p? p._root:this;
		}

		return this.__root;
	}

	public random(range:number)
	{
		return Math.floor(Math.random() * range);
	}

	public get _parent():AS2MovieClipAdapter
	{
		var parent = this.adaptee.parent;

		return parent? <AS2MovieClipAdapter> parent.adapter:null;
	}
}