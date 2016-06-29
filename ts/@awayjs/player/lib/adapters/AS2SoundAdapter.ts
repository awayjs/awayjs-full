import {WaveAudio}							from "@awayjs/core/lib/audio/WaveAudio";
import {AssetEvent}							from "@awayjs/core/lib/events/AssetEvent";
import {AS2MovieClipAdapter}				from "../adapters/AS2MovieClipAdapter";
import {AS2MCSoundProps}					from "../adapters/AS2MCSoundProps";
import {AssetLibrary}						from "@awayjs/core/lib/library/AssetLibrary";
import {AudioManager}						from "@awayjs/core/lib/managers/AudioManager";

declare var mainApplication;

// also contains global AS2 functions
export class AS2SoundAdapter
{
	//private _transform:Object;
	private _target:AS2MovieClipAdapter;
	private _soundProps:AS2MCSoundProps;

	private _loop:boolean = false;
	private _name:string = "";
	private _id:number = -1;
	private _playing:boolean = false;
	private  _volume:number = 0; // uses this vol property on sound.

	private static _globalSoundProps:AS2MCSoundProps = new AS2MCSoundProps();
	private static _soundIDCnt:number = 0;

	private _onGlobalChangeDelegate:(event:AssetEvent) => void;

	// TODO: Any real Sound stuff should be externalized for AwayJS use. For now use internally since it's only 2D.
	constructor(target:AS2MovieClipAdapter)
	{
		// not sure how to handle target yet
		this._id = AS2SoundAdapter._soundIDCnt++;
		this._target = target;
		this._soundProps = (target != null && target.__pSoundProps)? this._target.__pSoundProps:AS2SoundAdapter._globalSoundProps;

		this._onGlobalChangeDelegate = (event:AssetEvent) => this.onGlobalChange(event);

		AS2SoundAdapter._globalSoundProps.addEventListener(AssetEvent.INVALIDATE, this._onGlobalChangeDelegate);
	}

	public attachSound(id:string):void
	{
		this._name=id;
		// TODO: This will be AudioAsset or something
		var asset = <WaveAudio> AssetLibrary.getAsset(id);

		if (asset)
			this._soundProps.audio = asset.clone();

		this.updateVolume();
	}

	/*getBytesLoaded():number
	{
		return 1;
	}

	getBytesTotal():number
	{
		return 1;
	}*/

	public getPan():number
	{
		return this._soundProps.pan;
	}

	public setPan(value:number):void
	{
		this._soundProps.pan = value;
		// panning not supported at this point
	}

	/*getTransform():Object
	{
		return this._transform;
	}

	setTransform(value:Object):void
	{
		this._transform = value;
	}*/

	public getVolume():number
	{
		return this._soundProps.volume * 100;
	}

	public setVolume(value:number):void
	{
		this._soundProps.volume = value / 100;

		this.updateVolume();
	}

	/*loadSound(url:string, isStreaming:boolean):void
	{
		this.disposeAudio();
		// how to handle isStreaming == false? Manually?
		this._soundProps.audio = new Audio();
		this._soundProps.audio.src = url;
		this.initAudio();
	}*/

	public start(offsetInSeconds:number = 0, loops:number = 0):void
	{
		this._playing = true;

		this._loop = Boolean(loops > 0);

		if(AudioManager.getExternalSoundInterface()){
			AudioManager.getExternalSoundInterface().startSound(this._name, this._id, this._volume, this._loop);
			return;
		}
		if(this._soundProps.audio){
			this._soundProps.audio.play(offsetInSeconds, this._loop);
			return;
		}
		console.log("Calling AS2SoundAdapter.start() was not successfull. Audio not set for this sound.")
	}

	public stop(linkageID:string = null):void
	{
		if(!this._playing)
			return;

		this._playing = false;

		if(AudioManager.getExternalSoundInterface()){
			AudioManager.getExternalSoundInterface().stopSound(this._id);
			return;
		}
		else if(this._soundProps.audio){
			this._soundProps.audio.stop();
			return;
		}
		console.log("Calling AS2SoundAdapter.stop() was not successfull. Audio not set for this sound.")
	}

	public get position():number
	{
		if(this._soundProps.audio)
			return this._soundProps.audio.currentTime;
		return 0;
	}

	public get duration():number
	{
		if(this._soundProps.audio)
			return this._soundProps.audio.duration;
		return 0;
	}

	public get id3():Object
	{
		return {};
	}

	private onGlobalChange(event:AssetEvent):void
	{
		this.updateVolume();
	}

	private updateVolume():void
	{
		var vol:number =  this._soundProps.volume * AS2SoundAdapter._globalSoundProps.volume;
		
		if(vol>1)
			vol=1;
		
		if(vol<0)
			vol=0;
		
		vol = Math.round(vol*100)/100;

		if(this._volume == vol)
			return;

		this._volume = vol;

		if(AudioManager.getExternalSoundInterface()){
			if (this._playing)
				AudioManager.getExternalSoundInterface().updateSound(this._id, this._volume, this._loop);
		} else if (this._soundProps.audio)
			this._soundProps.audio.volume = this._volume;
	}
}
export default AS2SoundAdapter;