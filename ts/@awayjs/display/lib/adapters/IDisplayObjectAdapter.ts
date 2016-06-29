import {DisplayObject}				from "../display/DisplayObject";

export interface IDisplayObjectAdapter
{
	adaptee:DisplayObject;

	isBlockedByScript():boolean;

	isVisibilityByScript():boolean;

	freeFromScript():void;

	clone(newAdaptee:DisplayObject):IDisplayObjectAdapter;

	dispose();
}