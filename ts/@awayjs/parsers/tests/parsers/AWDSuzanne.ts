import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {LoaderEvent}					from "@awayjs/core/lib/events/LoaderEvent";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {AssetLibrary}					from "@awayjs/core/lib/library/AssetLibrary";
import {Loader}						from "@awayjs/core/lib/library/Loader";
import {IAsset}						from "@awayjs/core/lib/library/IAsset";
import {URLRequest}					from "@awayjs/core/lib/net/URLRequest";
import {Debug}						from "@awayjs/core/lib/utils/Debug";
import {RequestAnimationFrame}		from "@awayjs/core/lib/utils/RequestAnimationFrame";

import {Graphics}						from "@awayjs/display/lib/graphics/Graphics";
import {View}							from "@awayjs/display/lib/View";
import {DirectionalLight}				from "@awayjs/display/lib/display/DirectionalLight";
import {Sprite}						from "@awayjs/display/lib/display/Sprite";
import {StaticLightPicker}			from "@awayjs/display/lib/materials/lightpickers/StaticLightPicker";

import {DefaultRenderer}				from "@awayjs/renderer/lib/DefaultRenderer";

import {MethodMaterial}				from "@awayjs/materials/lib/MethodMaterial";

import {AWDParser}					from "awayjs-parsers/lib/AWDParser";

class AWDSuzanne
{
	private _view:View;
	private _timer:RequestAnimationFrame;
	private _suzanne:Sprite;
	private _light:DirectionalLight;
	private _lightPicker:StaticLightPicker;
	private lookAtPosition:Vector3D = new Vector3D();
	private _cameraIncrement:number = 0;

	constructor()
	{
		Debug.LOG_PI_ERRORS = true;
		Debug.THROW_ERRORS = false;

		AssetLibrary.enableParser(AWDParser) ;

		var session:Loader = AssetLibrary.getLoader();
		session.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => this.onLoadComplete(event));
		session.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));
		session.load(new URLRequest('assets/suzanne.awd'));

		this._view = new View(new DefaultRenderer());
		this._view.camera.projection.far  = 6000;
		this._timer = new RequestAnimationFrame(this.render, this);

		this._light = new DirectionalLight();
		this._light.color = 0x683019;//683019;
		this._light.direction = new Vector3D( 1 , 0 ,0 );
		this._light.ambient = 0.1;//0.05;//.4;
		this._light.ambientColor = 0x85b2cd;//4F6877;//313D51;
		this._light.diffuse = 2.8;
		this._light.specular = 1.8;
		this._view.scene.addChild(this._light);

		this._lightPicker = new StaticLightPicker([this._light]);

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
		if (this._view.camera) {
			this._view.camera.lookAt(this.lookAtPosition) ;
			this._cameraIncrement += 0.01;
			this._view.camera.x = Math.cos(this._cameraIncrement)*1400;
			this._view.camera.z = Math.sin(this._cameraIncrement)*1400;

			this._light.x = Math.cos(this._cameraIncrement)*1400;
			this._light.y = Math.sin(this._cameraIncrement)*1400;
		}

		this._view.render();
	}

	public onAssetComplete(event:AssetEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
		console.log('------------------------------------------------------------------------------');
	}

	public onLoadComplete(event:LoaderEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('away.events.LoaderEvent.RESOURCE_COMPLETE' , event);
		console.log('------------------------------------------------------------------------------');

		var loader:Loader = event.target;
		var numAssets:number = loader.baseDependency.assets.length;

		for(var i:number = 0; i < numAssets; ++i) {
			var asset:IAsset = loader.baseDependency.assets[i];

			switch (asset.assetType) {
				case Sprite.assetType:

					this._suzanne = <Sprite> asset;

					(<MethodMaterial> this._suzanne.material).lightPicker = this._lightPicker;
					this._suzanne.y = -100;


					for ( var c : number = 0 ; c < 80 ; c ++ )
					{
						var scale:number = this.getRandom( 50 , 200 );
						var clone:Sprite = <Sprite> this._suzanne.clone();
							clone.x = this.getRandom(-2000 , 2000);
							clone.y = this.getRandom(-2000 , 2000);
							clone.z = this.getRandom(-2000 , 2000);
							clone.transform.scaleTo(scale, scale, scale);
							clone.rotationY = this.getRandom(0 , 360);
						this._view.scene.addChild( clone );

					}

					this._suzanne.transform.scaleTo(500, 500, 500);

					this._view.scene.addChild(this._suzanne);

					break;

				case Graphics.assetType:
					break;

				case MethodMaterial.assetType:

					break;
			}
		}
	}

	private getRandom(min:number, max:number):number
	{
		return Math.random()*(max - min) + min;
	}
}