import {Timeline}				from "../base/Timeline";
import {MovieClip}			from "../display/MovieClip";
import {TextField}			from "../display/TextField";

export interface ITimelineSceneGraphFactory
{
	createMovieClip(timelime:Timeline):MovieClip;
	createTextField():TextField;
}