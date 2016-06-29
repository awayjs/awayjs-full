import {DisplayObject}					from "../display/DisplayObject";
import {MovieClip}						from "../display/MovieClip";

export class FrameScriptManager
{
	// FrameScript debugging:
	// the first line of a FrameScript should be a comment that represents the functions unique name
	// the exporter creates a js file, containing a object that has the framescripts functions set as properties according to the unique names
	// this object can be set as "frameScriptDebug" in order to enable debug mode


	public static frameScriptDebug:Object = undefined;

	//queue of objects for disposal
	private static _queued_dispose:Array<DisplayObject> = new Array<DisplayObject>();

	// queues pass1 of scripts.
	private static _queued_mcs:Array<MovieClip> = [];
	private static _queued_scripts:Array<Function> = [];

	// queues pass2 of scripts. this will be inserted in reversed order into pass1 queue right before something should be added to pass1
	private static _queued_mcs_pass2:Array<MovieClip> = [];
	private static _queued_scripts_pass2:Array<Function> = [];

	private static _active_intervals:Object = new Object(); // maps id to function

	private static _intervalID:number=0;
	public static setInterval(func:any):number
	{
		this._intervalID++;
		this._active_intervals[this._intervalID]=func;
		return this._intervalID
	}

	public static clearInterval(id:number):void
	{
		delete this._active_intervals[id];
	}

	public static execute_intervals():void
	{
		for(var key in this._active_intervals){
			this._active_intervals[key].call();
		}
	}

	public static add_child_to_dispose(child:DisplayObject):void
	{
		this._queued_dispose.push(child);
	}

	public static add_script_to_queue(mc:MovieClip, script:Function):void
	{
		// whenever we queue scripts of new objects, we first inject the lists of pass2
		var i=this._queued_mcs_pass2.length;
		while(i--){
			this._queued_mcs.push(this._queued_mcs_pass2[i]);
			this._queued_scripts.push(this._queued_scripts_pass2[i]);
		}
		this._queued_mcs_pass2.length = 0;
		this._queued_scripts_pass2.length = 0;
		this._queued_mcs.push(mc);
		this._queued_scripts.push(script);
	}

	public static add_script_to_queue_pass2(mc:MovieClip, script:Function):void
	{
		this._queued_mcs_pass2.push(mc);
		this._queued_scripts_pass2.push(script);
	}

	public static execute_queue():void
	{
		if(this._queued_mcs.length==0 && this._queued_mcs_pass2.length==0)
			return;

		var i=this._queued_mcs_pass2.length;
		while(i--){
			this._queued_mcs.push(this._queued_mcs_pass2[i]);
			this._queued_scripts.push(this._queued_scripts_pass2[i]);
		}
		this._queued_mcs_pass2.length = 0;
		this._queued_scripts_pass2.length = 0;

		var mc:MovieClip;
		for (i = 0; i <this._queued_mcs.length; i++) {
			// during the loop we might add more scripts to the queue
			mc=this._queued_mcs[i];
			if(mc.scene!=null) {
				var caller = mc.adapter ? mc.adapter : mc;
			//	try {
				this._queued_scripts[i].call(caller);
			//	}
			/*	catch (err) {
					console.log("Script error in " + mc.name + "\n", this._queued_scripts[i]);
					console.log(err.message);
					throw err;
				}*/
			}
		}
		// all scripts executed. clear all
		this._queued_mcs.length = 0;
		this._queued_scripts.length = 0;
	}

	public static execute_dispose():void
	{
		var len:number = this._queued_dispose.length;
		for (var i:number = 0; i < len; i++)
			this._queued_dispose[i].dispose();

		this._queued_dispose.length = 0;
	}
}
export default FrameScriptManager;