import {HierarchicalProperties}			from "../base/HierarchicalProperties";
import {MovieClip}						from "../display/MovieClip";
import {DisplayObject}					from "../display/DisplayObject";
import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {FrameScriptManager}				from "../managers/FrameScriptManager";


export class Timeline
{
	private _functions:Array<(child:DisplayObject, target_mc:MovieClip, i:number) => void> = [];
	private _blocked:boolean;
	public _update_indices:Array<number> = [];
	public _labels:Object;			// dictionary to store label => keyframeindex
	public _framescripts:Object;    // dictionary to store keyframeindex => ExecuteScriptCommand
	public _framescripts_translated:Object;    // dictionary to store keyframeindex => bool that keeps track of already converted scripts

	public keyframe_indices:Array<number>;     		//stores 1 keyframeindex per frameindex
	public keyframe_firstframes:Array<number>;     	//stores the firstframe of each keyframe
	public keyframe_constructframes:Array<number>;    //stores the previous fullConstruct keyframeindex

	public keyframe_durations:ArrayBufferView;    //only needed to calulcate other arrays

	// synched:
	public frame_command_indices:ArrayBufferView;
	public frame_recipe:ArrayBufferView;

	// synched:
	public command_index_stream:ArrayBufferView;
	public command_length_stream:ArrayBufferView;

	public add_child_stream:ArrayBufferView;
	public remove_child_stream:ArrayBufferView;
	public update_child_stream:ArrayBufferView;

	public update_child_props_length_stream:ArrayBufferView;
	public update_child_props_indices_stream:ArrayBufferView;

	public property_index_stream:ArrayBufferView;
	public property_type_stream:ArrayBufferView;

	public properties_stream_int:ArrayBufferView;		// lists of ints used for property values. for now, only mask_ids are using ints

	// propertiy_values_stream:
	public properties_stream_f32_mtx_all:ArrayBufferView;	// list of floats
	public properties_stream_f32_mtx_scale_rot:ArrayBufferView;	// list of floats
	public properties_stream_f32_mtx_pos:ArrayBufferView;	// list of floats
	public properties_stream_f32_ct:ArrayBufferView;	// list of floats
	public properties_stream_strings:Array<string>;

	private _potentialPrototypes:Array<DisplayObject>;

	public numKeyFrames:number=0;

	constructor()
	{
		this.keyframe_indices = [];

		this._potentialPrototypes = [];
		this._labels = {};
		this._framescripts = {};
		this._framescripts_translated = {};

		//cache functions
		this._functions[1] = this.update_mtx_all;
		this._functions[2] = this.update_colortransform;
		this._functions[3] = this.update_masks;
		this._functions[4] = this.update_name;
		this._functions[5] = this.update_button_name;
		this._functions[6] = this.update_visibility;
		this._functions[7] = this.update_blendmode;
		this._functions[8] = this.update_rendermode;
		this._functions[11] = this.update_mtx_scale_rot;
		this._functions[12] = this.update_mtx_pos;
		this._functions[200] = this.enable_maskmode;
		this._functions[201] = this.remove_masks;

	}

	public init():void
	{
		if((this.frame_command_indices == null)||(this.frame_recipe == null)||(this.keyframe_durations == null))
			return;

		this.keyframe_firstframes = [];
		this.keyframe_constructframes = [];
		var frame_cnt = 0;
		var ic = 0;
		var ic2 = 0;
		var keyframe_cnt = 0;
		var last_construct_frame = 0;
		for(ic = 0; ic < this.numKeyFrames; ic++){
			var duration=this.keyframe_durations[(ic)];

			if(this.frame_recipe[ic] & 1)
				last_construct_frame = keyframe_cnt;

			this.keyframe_firstframes[keyframe_cnt] = frame_cnt;
			this.keyframe_constructframes[keyframe_cnt++] = last_construct_frame;

			for(ic2 = 0; ic2 < duration; ic2++)
				this.keyframe_indices[frame_cnt++] = ic;
		}
	}

	public get_framescript(keyframe_index:number):string
	{
		if(this._framescripts[keyframe_index] == null)
			return "";

		if (typeof this._framescripts[keyframe_index] == "string")
			return this._framescripts[keyframe_index];
		else{
			throw new Error("Framescript is already translated to Function!!!");
		}
	}
	public add_framescript(value:string, keyframe_index:number):void
	{
		if(FrameScriptManager.frameScriptDebug){
			// if we are in debug mode, we try to extract the function name from the first line of framescript code,
			// and check if this function is available on the object that is set as frameScriptDebug
			// try to get the functions name (it should be the first line as comment)
			var functionname = value.split(/[\r\n]+/g)[0].split("//")[1];
			if(FrameScriptManager.frameScriptDebug[functionname]){
				this._framescripts[keyframe_index] = FrameScriptManager.frameScriptDebug[functionname];
				this._framescripts_translated[keyframe_index]=true;
				return;
			}
			else{
				throw new Error("Framescript could not be found on FrameScriptManager.frameScriptDebug.\n the Object set as FrameScriptmanager.frameScriptDebug should contain a function with the name '"+functionname+"' !!!");
			}
		}
		this._framescripts[keyframe_index] = value;
	}

	private regexIndexOf(str : string, regex : RegExp, startpos : number) {
		var indexOf = str.substring(startpos || 0).search(regex);
		return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
	}


	public add_script_for_postcontruct(target_mc:MovieClip, keyframe_idx:number, scriptPass1:Boolean=false) : void
	{
		if(this._framescripts[keyframe_idx]!=null){
			if(this._framescripts_translated[keyframe_idx]==null){
				this._framescripts[keyframe_idx] = target_mc.adapter.evalScript(this._framescripts[keyframe_idx]);
				this._framescripts_translated[keyframe_idx]=true;
			}
			if(scriptPass1)
				FrameScriptManager.add_script_to_queue(target_mc, this._framescripts[keyframe_idx]);
			else
				FrameScriptManager.add_script_to_queue_pass2(target_mc, this._framescripts[keyframe_idx]);

		}
	}

	public get numFrames():number
	{
		return this.keyframe_indices.length;
	}


	public getPotentialChildPrototype(id:number):DisplayObject
	{
		return this._potentialPrototypes[id];

	}
	public getKeyframeIndexForFrameIndex(frame_index:number) : number
	{
		return this.keyframe_indices[frame_index];
	}

	public getPotentialChildInstance(id:number) : DisplayObject
	{
		var this_clone:DisplayObject = this._potentialPrototypes[id].clone();
		this_clone.name = "";
		return this_clone;
	}

	public registerPotentialChild(prototype:DisplayObject) : void
	{
		var id = this._potentialPrototypes.length;
		this._potentialPrototypes[id] = prototype;
	}

	public jumpToLabel(target_mc:MovieClip, label:string) : void
	{
		var key_frame_index:number = this._labels[label];
		if(key_frame_index >= 0)
			target_mc.currentFrameIndex = this.keyframe_firstframes[key_frame_index];
	}

	public gotoFrame(target_mc:MovieClip, value:number, skip_script:boolean = false):void
	{
		var current_keyframe_idx:number = target_mc.constructedKeyFrameIndex;
		var target_keyframe_idx:number = this.keyframe_indices[value];

		if (current_keyframe_idx == target_keyframe_idx) // already constructed - exit
			return;

		if (current_keyframe_idx + 1 == target_keyframe_idx) { // target_keyframe_idx is the next keyframe. we can just use constructnext for this
			this.constructNextFrame(target_mc, !skip_script, true);
			return;
		}

		var break_frame_idx:number = this.keyframe_constructframes[target_keyframe_idx];

		//we now have 3 index to keyframes: current_keyframe_idx / target_keyframe_idx / break_frame_idx

		var jump_forward:boolean = (target_keyframe_idx > current_keyframe_idx);
		var jump_gap:boolean = (break_frame_idx > current_keyframe_idx);

		// in case we jump forward, but not jump a gap, we start at current_keyframe_idx + 1
		// in case we jump back or we jump a gap, we want to start constructing at BreakFrame
		var start_construct_idx:number = (jump_forward && !jump_gap)? current_keyframe_idx + 1 : break_frame_idx;

		var i:number;
		var k:number;

		if (jump_gap) // if we jump a gap forward, we just can remove all childs from mc. all script blockage will be gone
			for (i = target_mc.numChildren - 1; i >= 0; i--)
				if (target_mc._children[i]._depthID < 0)
					target_mc.removeChildAt(i);

		//if we jump back, we want to reset all objects (but not the timelines of the mcs)
		if (!jump_forward)
			target_mc.resetSessionIDs();

		// in other cases, we want to collect the current objects to compare state of targetframe with state of currentframe
		var depth_sessionIDs:Object = target_mc.getSessionIDDepths();

		//pass1: only apply add/remove commands into depth_sessionIDs.
		this.pass1(start_construct_idx, target_keyframe_idx, depth_sessionIDs);

		// check what childs are alive on both frames.
		// childs that are not alive anymore get removed and unregistered
		// childs that are alive on both frames have their properties reset if we are jumping back
		var child:DisplayObject;
		for (i = target_mc.numChildren - 1; i >= 0; i--) {
			child = target_mc._children[i];
			if (child._depthID < 0) {
				if (depth_sessionIDs[child._depthID] != child._sessionID) {
					target_mc.removeChildAt(i);
				} else if (!jump_forward) {
					if(child.adapter) {
						if (!child.adapter.isBlockedByScript()) {
							child.transform.clearMatrix3D();
							child.transform.clearColorTransform();
							//this.name="";
							child.masks = null;
							child.maskMode = false;
						}
						if (!child.adapter.isVisibilityByScript()) {
							child.visible = true;
						}
					}
				}
			}
		}

		// now we need to addchild the objects that were added before targetframe first
		// than we can add the script of the targetframe
		// than we can addchild objects added on targetframe
		for (var key in depth_sessionIDs) {
			child = target_mc.getPotentialChildInstance(this.add_child_stream[depth_sessionIDs[key]*2]);
			if (child._sessionID == -1)
				target_mc._addTimelineChildAt(child, Number(key), depth_sessionIDs[key]);
		}

		if (!skip_script && this.keyframe_firstframes[target_keyframe_idx] == value) //frame changed. and firstframe of keyframe. execute framescript if available
			this.add_script_for_postcontruct(target_mc, target_keyframe_idx, true);


		//pass2: apply update commands for objects on stage (only if they are not blocked by script)
		this.pass2(target_mc);

		target_mc.constructedKeyFrameIndex = target_keyframe_idx;
	}

	public pass1(start_construct_idx:number, target_keyframe_idx:number, depth_sessionIDs:Object):void
	{
		var i:number;
		var k:number;

		this._update_indices.length = 0;// store a list of updatecommand_indices, so we dont have to read frame_recipe again
		var update_cnt = 0;
		var start_index:number;
		var end_index:number;
		for (k = start_construct_idx; k <= target_keyframe_idx; k++) {
			var frame_command_idx:number = this.frame_command_indices[k];
			var frame_recipe:number = this.frame_recipe[k];

			if (frame_recipe & 2) {
				// remove childs
				start_index = this.command_index_stream[frame_command_idx];
				end_index = start_index + this.command_length_stream[frame_command_idx++];
				for (i = start_index; i < end_index; i++)
					delete depth_sessionIDs[this.remove_child_stream[i] - 16383];
			}

			if (frame_recipe & 4) {
				start_index = this.command_index_stream[frame_command_idx];
				end_index = start_index + this.command_length_stream[frame_command_idx++];
				// apply add commands in reversed order to have script exeucted in correct order.
				// this could be changed in exporter
				for (i = end_index - 1; i >= start_index; i--)
					depth_sessionIDs[this.add_child_stream[i*2 + 1] - 16383] = i;
			}

			if (frame_recipe & 8)
				this._update_indices[update_cnt++] = frame_command_idx;// execute update command later
		}
	}

	public pass2(target_mc:MovieClip):void
	{
		var k:number;
		var len:number = this._update_indices.length;
		for (k = 0; k < len; k++)
			this.update_childs(target_mc, this._update_indices[k]);
	}

	public constructNextFrame(target_mc:MovieClip, queueScript:Boolean = true, scriptPass1:Boolean = false):void
	{
		var frameIndex:number = target_mc.currentFrameIndex;
		var new_keyFrameIndex:number = this.keyframe_indices[frameIndex];

		if(queueScript && this.keyframe_firstframes[new_keyFrameIndex] == frameIndex)
			this.add_script_for_postcontruct(target_mc, new_keyFrameIndex, scriptPass1);

		if(target_mc.constructedKeyFrameIndex != new_keyFrameIndex) {
			target_mc.constructedKeyFrameIndex = new_keyFrameIndex;

			var frame_command_idx = this.frame_command_indices[new_keyFrameIndex];
			var frame_recipe = this.frame_recipe[new_keyFrameIndex];

			if(frame_recipe & 1) {
				for (var i:number = target_mc.numChildren - 1; i >= 0; i--)
					if (target_mc._children[i]._depthID < 0)
						target_mc.removeChildAt(i);
			} else if (frame_recipe & 2) {
				this.remove_childs_continous(target_mc, frame_command_idx++);
			}

			if(frame_recipe & 4)
				this.add_childs_continous(target_mc, frame_command_idx++);

			if(frame_recipe & 8)
				this.update_childs(target_mc, frame_command_idx++);
		}
	}



	public remove_childs_continous(sourceMovieClip:MovieClip, frame_command_idx:number):void
	{
		var start_index:number = this.command_index_stream[frame_command_idx];
		var end_index:number = start_index + this.command_length_stream[frame_command_idx];
		for(var i:number = start_index; i < end_index; i++)
			sourceMovieClip.removeChildAt(sourceMovieClip.getDepthIndexInternal(this.remove_child_stream[i] - 16383));
	}


	// used to add childs when jumping between frames
	public add_childs_continous(sourceMovieClip:MovieClip, frame_command_idx:number):void
	{
		// apply add commands in reversed order to have script exeucted in correct order.
		// this could be changed in exporter
		var idx:number;
		var start_index:number = this.command_index_stream[frame_command_idx];
		var end_index:number = start_index + this.command_length_stream[frame_command_idx];
		for (var i:number = end_index - 1; i >= start_index; i--) {
			idx = i*2;
			sourceMovieClip._addTimelineChildAt(sourceMovieClip.getPotentialChildInstance(this.add_child_stream[idx]), this.add_child_stream[idx + 1] - 16383, i);
		}
	}

	public update_childs(target_mc:MovieClip, frame_command_idx:number):void
	{
		var p:number;
		var props_start_idx:number;
		var props_end_index:number;
		var start_index:number = this.command_index_stream[frame_command_idx];
		var end_index:number = start_index + this.command_length_stream[frame_command_idx];
		var child:DisplayObject;
		for(var i:number = start_index; i < end_index; i++) {
			child = target_mc.getChildAtSessionID(this.update_child_stream[i]);
			if (child) {
				// check if the child is active + not blocked by script
				this._blocked = Boolean(child.adapter && child.adapter.isBlockedByScript());

				props_start_idx = this.update_child_props_indices_stream[i];
				props_end_index = props_start_idx + this.update_child_props_length_stream[i];
				for(p = props_start_idx; p < props_end_index; p++)
					this._functions[this.property_type_stream[p]].call(this, child, target_mc, this.property_index_stream[p]);
			}
		}
	}

	public update_mtx_all(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		if (this._blocked)
			return;

		i *= 6;
		var new_matrix:Matrix3D = child.transform.matrix3D;
		new_matrix.rawData[0] = this.properties_stream_f32_mtx_all[i++];
		new_matrix.rawData[1] = this.properties_stream_f32_mtx_all[i++];
		new_matrix.rawData[4] = this.properties_stream_f32_mtx_all[i++];
		new_matrix.rawData[5] = this.properties_stream_f32_mtx_all[i++];
		new_matrix.rawData[12] = this.properties_stream_f32_mtx_all[i++];
		new_matrix.rawData[13] = this.properties_stream_f32_mtx_all[i];

		child.transform.invalidateComponents();
	}

	public update_colortransform(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		if (this._blocked)
			return;

		i *= 8;
		var new_ct:ColorTransform = child.transform.colorTransform || (child.transform.colorTransform = new ColorTransform());
		new_ct.rawData[0] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[1] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[2] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[3] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[4] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[5] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[6] = this.properties_stream_f32_ct[i++];
		new_ct.rawData[7] = this.properties_stream_f32_ct[i];

		child.transform.invalidateColorTransform();
	}

	public update_masks(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		// an object could have multiple groups of masks, in case a graphic clip was merged into the timeline
		// this is not implmeented in the runtime yet
		// for now, a second mask-groupd would overwrite the first one
		var mask:DisplayObject;
		var masks:Array<DisplayObject> = new Array<DisplayObject>();
		var numMasks:number = this.properties_stream_int[i++];

		//mask may not exist if a goto command moves the playhead to a point in the timeline after
		//one of the masks in a mask array has already been removed. Therefore a check is needed.
		for(var m:number = 0; m < numMasks; m++)
			if((mask = target_mc.getChildAtSessionID(this.properties_stream_int[i++])))
				masks.push(mask);


		child.masks = masks;
	}

	public update_name(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		child.name = this.properties_stream_strings[i];
		target_mc.adapter.registerScriptObject(child);
	}

	public update_button_name(target:DisplayObject, sourceMovieClip:MovieClip, i:number):void
	{
		target.name = this.properties_stream_strings[i];
		// todo: creating the buttonlistenrs later should also be done, but for icycle i dont think this will cause problems
		(<MovieClip> target).addButtonListeners();
		sourceMovieClip.adapter.registerScriptObject(target);
	}

	public update_visibility(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		if (!child.adapter || !child.adapter.isVisibilityByScript())
			child.visible = Boolean(i);
	}

	public update_mtx_scale_rot(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		if (this._blocked)
			return;

		i *= 4;

		var new_matrix:Matrix3D = child.transform.matrix3D;
		new_matrix.rawData[0] = this.properties_stream_f32_mtx_scale_rot[i++];
		new_matrix.rawData[1] = this.properties_stream_f32_mtx_scale_rot[i++];
		new_matrix.rawData[4] = this.properties_stream_f32_mtx_scale_rot[i++];
		new_matrix.rawData[5] = this.properties_stream_f32_mtx_scale_rot[i];

		child.transform.invalidateComponents();

		child.pInvalidateHierarchicalProperties(HierarchicalProperties.SCENE_TRANSFORM);
	}

	public update_mtx_pos(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		if (this._blocked)
			return;

		i *= 2;

		var new_matrix:Matrix3D = child.transform.matrix3D;
		new_matrix.rawData[12] = this.properties_stream_f32_mtx_pos[i++];
		new_matrix.rawData[13] = this.properties_stream_f32_mtx_pos[i];

		child.transform.invalidatePosition();
	}

	public enable_maskmode(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		child.maskMode = true;
	}

	public remove_masks(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		child.masks = null;
	}
	public update_blendmode(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		console.log("update blendmode "+i);
	}
	public update_rendermode(child:DisplayObject, target_mc:MovieClip, i:number):void
	{
		console.log("update rendermode "+i);
	}
}