import {Sampler2D}					from "awayjs-core/lib/image/Sampler2D";
import {URLLoaderEvent}				from "awayjs-core/lib/events/URLLoaderEvent";
import {RequestAnimationFrame}        from "awayjs-core/lib/utils/RequestAnimationFrame";
import {Debug}                        from "awayjs-core/lib/utils/Debug";

import {View}                         from "awayjs-display/lib/View";
import {Sprite}                       from "awayjs-display/lib/display/Sprite";
import {PrimitivePlanePrefab}         from "awayjs-display/lib/prefabs/PrimitivePlanePrefab";

import {DefaultRenderer}              from "awayjs-renderergl/lib/DefaultRenderer";

import {BasicMaterial}                from "awayjs-display/lib/materials/BasicMaterial";
import {URLLoader}					from "awayjs-core/lib/net/URLLoader";
import {URLLoaderDataFormat}			from "awayjs-core/lib/net/URLLoaderDataFormat";
import {URLRequest}					from "awayjs-core/lib/net/URLRequest";
import {ParserUtils}					from "awayjs-core/lib/parsers/ParserUtils";
import {ElementsType}                 from "awayjs-display/lib/graphics/ElementsType";

class MipMapSoftwareTest {

	private view:View;
	private raf:RequestAnimationFrame;
	private pngLoader   : URLLoader;
	private image:HTMLImageElement;

	constructor() {

		var pngURLRequest:URLRequest = new URLRequest('assets/dots.png');

		this.pngLoader = new URLLoader();
		this.pngLoader.dataFormat = URLLoaderDataFormat.BLOB;
		this.pngLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, (event:URLLoaderEvent) => this.pngLoaderComplete(event));
		this.pngLoader.load(pngURLRequest);
	}

	private pngLoaderComplete(event:URLLoaderEvent) {
		var imageLoader:URLLoader = event.target;
		this.image = ParserUtils.blobToImage(imageLoader.data);
		this.image.onload = (event) => this.onLoadComplete(event);
	}

	private onLoadComplete(event) {
		Debug.LOG_PI_ERRORS = false;
		Debug.THROW_ERRORS = false;

		var defaultRenderer:DefaultRenderer = new DefaultRenderer(null, false, "baseline", "software");
		defaultRenderer.antiAlias = 2;
		this.view = new View(defaultRenderer);
		//this.view = new View(new DefaultRenderer(null, false, "baseline"));
		this.raf = new RequestAnimationFrame(this.render, this);

		this.view.backgroundColor = 0x222222;

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.initSpritees();
		this.raf.start();
		this.onResize();
	}

	private initSpritees():void {
		//var material:BasicMaterial = new BasicMaterial(DefaultMaterialManager.getDefaultTexture());
		var material:BasicMaterial = new BasicMaterial(ParserUtils.imageToBitmapImage2D(this.image));
		material.style.sampler = new Sampler2D(true, true, true);
		var plane:PrimitivePlanePrefab = new PrimitivePlanePrefab(material, ElementsType.TRIANGLE, 1000,1000,1000);
		//var plane:PrimitiveCubePrefab = new PrimitiveCubePrefab();
		plane.material = material;

		var sprite:Sprite = <Sprite>plane.getNewObject();
		sprite.y = -100;
		this.view.scene.addChild(sprite);
	}

	private c:number = 100;

	private render() {
		if (this.c > 10) {
			this.c = 0;
			this.view.render();
		}
		this.c++;
	}

	public onResize(event:UIEvent = null) {
		this.view.y = 0;
		this.view.x = 0;

		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}
}