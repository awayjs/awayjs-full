import {Sampler2D}					from "awayjs-core/lib/image/Sampler2D";
import {Vector3D}						from "awayjs-core/lib/geom/Vector3D";
import {URLLoader}					from "awayjs-core/lib/net/URLLoader";
import {URLLoaderDataFormat}			from "awayjs-core/lib/net/URLLoaderDataFormat";
import {URLRequest}					from "awayjs-core/lib/net/URLRequest";
import {URLLoaderEvent}				from "awayjs-core/lib/events/URLLoaderEvent";
import {ParserUtils}					from "awayjs-core/lib/parsers/ParserUtils";
import {PerspectiveProjection}		from "awayjs-core/lib/projections/PerspectiveProjection";
import {RequestAnimationFrame}		from "awayjs-core/lib/utils/RequestAnimationFrame";
import {Debug}						from "awayjs-core/lib/utils/Debug";

import {View}							from "awayjs-display/lib/View";
import {Sprite}						from "awayjs-display/lib/display/Sprite";
import {DirectionalLight}				from "awayjs-display/lib/display/DirectionalLight";
import {ElementsType}					from "awayjs-display/lib/graphics/ElementsType";
import {StaticLightPicker}			from "awayjs-display/lib/materials/lightpickers/StaticLightPicker";
import {PrimitiveTorusPrefab}			from "awayjs-display/lib/prefabs/PrimitiveTorusPrefab";

import {DefaultRenderer}				from "awayjs-renderergl/lib/DefaultRenderer";

import {MethodMaterial}				from "awayjs-methodmaterials/lib/MethodMaterial";

class TorusLight
{
	private _view:View;
	private _sprite:Sprite;
	private _raf:RequestAnimationFrame;
	private _image:HTMLImageElement;

	constructor()
	{
		Debug.THROW_ERRORS = false;
		Debug.ENABLE_LOG = false;
		Debug.LOG_PI_ERRORS = false;

		this._view = new View(new DefaultRenderer());
		this._view.camera.projection = new PerspectiveProjection(60);

		this.loadResources();
	}

	private loadResources()
	{
		var urlRequest:URLRequest = new URLRequest("assets/dots.png");

		var urlLoader:URLLoader = new URLLoader();
		urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
		urlLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, (event:URLLoaderEvent) => this.imageCompleteHandler(event));
		urlLoader.load(urlRequest);
	}

	private imageCompleteHandler(event:URLLoaderEvent)
	{
		var imageLoader:URLLoader = event.target;

		this._image = ParserUtils.blobToImage(imageLoader.data);
		this._image.onload = (event:Event) => this.onLoadComplete(event);
	}

	private onLoadComplete(event:Event)
	{
		var light:DirectionalLight = new DirectionalLight();
		light.direction = new Vector3D(0, 0, 1);
		light.diffuse = .7;
		light.specular = 1;

		this._view.scene.addChild(light);

		var lightPicker:StaticLightPicker = new StaticLightPicker([light]);

		var matTx:MethodMaterial = new MethodMaterial(ParserUtils.imageToBitmapImage2D(this._image));
		matTx.style.sampler = new Sampler2D(true, true, true);
		matTx.lightPicker = lightPicker;

		var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(matTx, ElementsType.TRIANGLE, 220, 80, 32, 16, false);

		this._sprite = <Sprite> torus.getNewObject();

		this._view.scene.addChild(this._sprite);

		this._raf = new RequestAnimationFrame(this.render , this);
		this._raf.start();

		window.onresize = (event:UIEvent) => this.resize(event);

		this.resize();
	}


	public render(dt:number = null):void
	{
		this._sprite.rotationY += 1;
		this._view.render();
	}


	public resize(event:UIEvent = null)
	{
		this._view.y = 0;
		this._view.x = 0;

		this._view.width = window.innerWidth;
		this._view.height = window.innerHeight;
	}
}