import {WaveAudio}				from "@awayjs/core/lib/audio/WaveAudio";
import {AssetEvent}				from "@awayjs/core/lib/events/AssetEvent";
import {AssetBase}				from "@awayjs/core/lib/library/AssetBase";

export class AS2MCSoundProps extends AssetBase
{
    private _volume:number = 1;
    private _pan:number = 1;
    private _changeEvent:AssetEvent;
    private _audio:WaveAudio;

    constructor()
    {
        super();
		
		this._changeEvent = new AssetEvent(AssetEvent.INVALIDATE, this);
    }

    public dispose()
    {
        this._audio = null;
        this._changeEvent = null;
    }

    public get volume()
    {
        return this._volume;
    }

    public set volume(value:number)
    {
        if (this._volume != value) {
            this._volume = value;
            this.dispatchEvent(this._changeEvent);
        }
    }

    public get pan()
    {
        return this._pan;
    }

    public set pan(value:number)
    {
        if (this._pan != value) {
            this._pan = value;
            this.dispatchEvent(this._changeEvent);
        }
    }

    public get audio()
    {
        return this._audio;
    }

    public set audio(value:WaveAudio)
    {
        if (this._audio)
            this._audio.stop();

        this._audio = value;
    }

}