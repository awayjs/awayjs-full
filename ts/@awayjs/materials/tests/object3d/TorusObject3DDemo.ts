import {Sampler2D}					from "awayjs-core/lib/image/Sampler2D";
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
import {PointLight}					from "awayjs-display/lib/display/PointLight";
import {ElementsType}					from "awayjs-display/lib/graphics/ElementsType";
import {StaticLightPicker}			from "awayjs-display/lib/materials/lightpickers/StaticLightPicker";
import {PrimitiveTorusPrefab}			from "awayjs-display/lib/prefabs/PrimitiveTorusPrefab";

import {DefaultRenderer}				from "awayjs-renderergl/lib/DefaultRenderer";

import {MethodMaterial}				from "awayjs-methodmaterials/lib/MethodMaterial";

class TorusObject3DDemo
{
	private view:View;

	private light:PointLight;
	private raf:RequestAnimationFrame;
	private sprites:Array<Sprite>;

	private t:number = 0;
	private tPos:number = 0;
	private radius:number = 1000;
	private follow:boolean = true;

	private pointLight:PointLight;
	private lightPicker:StaticLightPicker;

	private _image:HTMLImageElement;

	constructor()
	{
		Debug.THROW_ERRORS = false;
		Debug.LOG_PI_ERRORS = false;

		this.sprites = new Array<Sprite>();
		this.light = new PointLight();
		this.view = new View(new DefaultRenderer());
		this.pointLight = new PointLight();
		this.lightPicker = new StaticLightPicker([this.pointLight]);

		this.view.scene.addChild(this.pointLight);

		var perspectiveLens:PerspectiveProjection = <PerspectiveProjection> this.view.camera.projection;
		perspectiveLens.fieldOfView = 75;

		this.view.camera.z = 0;
		this.view.backgroundColor = 0x000000;
		this.view.backgroundAlpha = 1;

		this.view.scene.addChild(this.light);

		this.raf = new RequestAnimationFrame(this.tick, this);
		this.raf.start();
		this.onResize();

		document.onmousedown = (event:MouseEvent) => this.followObject(event);

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.loadResources();
	}

	private loadResources()
	{
		var urlRequest:URLRequest = new URLRequest("assets/custom_uv_horizontal.png");
		var urlLoader:URLLoader = new URLLoader();
		urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
		urlLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, (event:URLLoaderEvent) => this.imageCompleteHandler(event));
		urlLoader.load(urlRequest);
	}

	private imageCompleteHandler(event:URLLoaderEvent)
	{
		var urlLoader:URLLoader = event.target;

		this._image = ParserUtils.blobToImage(urlLoader.data);
		this._image.onload = (event:Event) => this.onImageLoadComplete(event);

	}

	private onImageLoadComplete(event:Event)
	{
		var matTx:MethodMaterial = new MethodMaterial(ParserUtils.imageToBitmapImage2D(this._image));
		matTx.style.sampler = new Sampler2D(true, true, true);
		matTx.lightPicker =  this.lightPicker;

		var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(matTx, ElementsType.TRIANGLE, 150, 50, 32, 32, false);

		var l:number = 10;
		//var radius:number = 1000;

		for (var c : number = 0; c < l ; c++) {

			var t : number=Math.PI * 2 * c / l;

			var sprite:Sprite = <Sprite> torus.getNewObject();
			sprite.x = Math.cos(t)*this.radius;
			sprite.y = 0;
			sprite.z = Math.sin(t)*this.radius;

			this.view.scene.addChild(sprite);
			this.sprites.push(sprite);

		}
	}

	private tick(dt:number)
	{
		this.tPos += .02;

		for (var c:number = 0 ; c < this.sprites.length ; c ++) {
			var objPos:number=Math.PI*2*c/this.sprites.length;

			this.t += .005;
			var s:number = 1.2 + Math.sin(this.t + objPos);

			this.sprites[c].rotationY += 2*(c/this.sprites.length);
			this.sprites[c].rotationX += 2*(c/this.sprites.length);
			this.sprites[c].rotationZ += 2*(c/this.sprites.length);
			this.sprites[c].scaleX = this.sprites[c].scaleY = this.sprites[c].scaleZ = s;
			this.sprites[c].x = Math.cos(objPos + this.tPos)*this.radius;
			this.sprites[c].y = Math.sin(this.t)*500;
			this.sprites[c].z = Math.sin(objPos + this.tPos)*this.radius;

			if (this.follow && c == 0)
				this.view.camera.lookAt(this.sprites[c].transform.position);
		}

		//this.view.camera.y = Math.sin( this.tPos ) * 1500;

		this.view.camera.y = Math.sin(this.tPos) * 1500;

		this.view.render();
	}

	public onResize(event:UIEvent = null)
	{
		this.view.y = 0;
		this.view.x = 0;

		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}

	public followObject(e)
	{
		this.follow = !this.follow;
	}
}