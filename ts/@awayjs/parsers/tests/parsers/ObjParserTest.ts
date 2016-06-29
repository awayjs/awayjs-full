import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {LoaderEvent}					from "@awayjs/core/lib/events/LoaderEvent";
import {AssetLibrary}					from "@awayjs/core/lib/library/AssetLibrary";
import {Loader}						from "@awayjs/core/lib/library/Loader";
import {URLRequest}					from "@awayjs/core/lib/net/URLRequest";
import {Debug}						from "@awayjs/core/lib/utils/Debug";
import {RequestAnimationFrame}		from "@awayjs/core/lib/utils/RequestAnimationFrame";

import {View}							from "@awayjs/display/lib/View";
import {Sprite}						from "@awayjs/display/lib/display/Sprite";

import {DefaultRenderer}				from "@awayjs/renderer/lib/DefaultRenderer";

import {OBJParser}					from "awayjs-parsers/lib/OBJParser";

/**
 *
 */
class ObjParserTest
{
	private _view:View;
	private _timer:RequestAnimationFrame;
	private _t800:Sprite;

	constructor()
	{
		Debug.LOG_PI_ERRORS = true;
		Debug.THROW_ERRORS = false;

		AssetLibrary.enableParser(OBJParser) ;

		var session:Loader = AssetLibrary.getLoader();
		session.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => this.onLoadComplete(event));
		session.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));
		session.load(new URLRequest('assets/t800.obj'));

		this._view = new View(new DefaultRenderer());
		this._timer = new RequestAnimationFrame(this.render, this);

		window.onresize = (event:UIEvent) => this.resize(event);

		this._timer.start();
		this.resize();
	}

	private resize(event:UIEvent = null)
	{
		this._view.y = 0;
		this._view.x = 0;
		this._view.width = window.innerWidth;
		this._view.height = window.innerHeight;
	}

	private render(dt:number) //animate based on dt for firefox
	{
		if (this._t800)
			this._t800.rotationY += 1;

		this._view.render();
	}

	public onAssetComplete(event:AssetEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
		console.log('------------------------------------------------------------------------------');
	}

	public onLoadComplete(event:LoaderEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('events.LoaderEvent.RESOURCE_COMPLETE', event);
		console.log('------------------------------------------------------------------------------');

		console.log(AssetLibrary.getAsset('Mesh_g0'));

		this._t800 = <Sprite> AssetLibrary.getAsset('Mesh_g0');
		this._t800.y = -200;
		this._t800.transform.scaleTo(4, 4, 4);

		this._view.scene.addChild(this._t800);
	}
}