import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {LoaderEvent}					from "@awayjs/core/lib/events/LoaderEvent";
import {AssetLibrary}					from "@awayjs/core/lib/library/AssetLibrary";
import {Loader}						from "@awayjs/core/lib/library/Loader";
import {IAsset}						from "@awayjs/core/lib/library/IAsset";
import {URLRequest}					from "@awayjs/core/lib/net/URLRequest";
import {Debug}						from "@awayjs/core/lib/utils/Debug";
import {RequestAnimationFrame}		from "@awayjs/core/lib/utils/RequestAnimationFrame";

import {Graphics}						from "@awayjs/display/lib/graphics/Graphics";
import {View}							from "@awayjs/display/lib/View";
import {Sprite}						from "@awayjs/display/lib/display/Sprite";

import {DefaultRenderer}				from "@awayjs/renderer/lib/DefaultRenderer";

import {MethodMaterial}				from "@awayjs/materials/lib/MethodMaterial";

import {AWDParser}					from "awayjs-parsers/lib/AWDParser";

class AWDParserTest
{

	private _view:View;
	private _timer:RequestAnimationFrame;
	private _suzanne:Sprite;

	constructor()
	{
		Debug.LOG_PI_ERRORS = true;
		Debug.THROW_ERRORS = false;

		AssetLibrary.enableParser(AWDParser);

		var session:Loader = AssetLibrary.getLoader();
		session.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => this.onLoadComplete(event));
		session.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));
		session.load(new URLRequest('assets/suzanne.awd'));

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
		if (this._suzanne)
			this._suzanne.rotationY += 1;

		this._view.render();
		this._view.camera.z = -2000;
	}

	public onAssetComplete(event:AssetEvent)
	{
		//console.log('------------------------------------------------------------------------------');
		//console.log('events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
		//console.log('------------------------------------------------------------------------------');
	}

	public onLoadComplete(event:LoaderEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('events.LoaderEvent.RESOURCE_COMPLETE' , event);
		console.log('------------------------------------------------------------------------------');

		var loader:Loader = event.target;
		var numAssets:number = loader.baseDependency.assets.length;

		for(var i:number = 0; i < numAssets; ++i) {
			var asset:IAsset = loader.baseDependency.assets[i];

			switch (asset.assetType) {
				case Sprite.assetType:

					this._suzanne = <Sprite> asset;
					this._suzanne.transform.scaleTo(600, 600, 600);

					this._view.scene.addChild(this._suzanne);

					break;

				case Graphics.assetType:
					break;

				case MethodMaterial.assetType:
					break;
			}
		}
	}
}