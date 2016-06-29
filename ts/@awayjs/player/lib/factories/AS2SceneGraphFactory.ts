import {AS2MovieClipAdapter}			from "../adapters/AS2MovieClipAdapter";
import {AS2TextFieldAdapter}			from "../adapters/AS2TextFieldAdapter";
import {TextField}					from "@awayjs/display/lib/display/TextField";
import {Timeline}						from "@awayjs/display/lib/base/Timeline";
import {MovieClip}					from "@awayjs/display/lib/display/MovieClip";
import {ITimelineSceneGraphFactory}	from "@awayjs/display/lib/factories/ITimelineSceneGraphFactory";
import {View}						from "@awayjs/display/lib/View";


export class AS2SceneGraphFactory implements ITimelineSceneGraphFactory
{
	private _view:View;

	constructor(view:View)
	{
		this._view = view;
	}
	createMovieClip(timeline:Timeline):MovieClip
	{
		var mc = new MovieClip(timeline);
		mc.adapter = new AS2MovieClipAdapter(mc, this._view);
		return mc;
	}

	createTextField():TextField
	{
		var tf = new TextField();
		tf.adapter = new AS2TextFieldAdapter(tf, this._view);
		return tf;
	}
}