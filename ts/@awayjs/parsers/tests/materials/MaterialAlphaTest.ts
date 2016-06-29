import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";
import {Sampler2D}					from "@awayjs/core/lib/image/Sampler2D";
import {LoaderEvent}					from "@awayjs/core/lib/events/LoaderEvent";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {AssetLibrary}					from "@awayjs/core/lib/library/AssetLibrary";
import {Loader}						from "@awayjs/core/lib/library/Loader";
import {IAsset}						from "@awayjs/core/lib/library/IAsset";
import {URLRequest}					from "@awayjs/core/lib/net/URLRequest";
import {Debug}						from "@awayjs/core/lib/utils/Debug";
import {RequestAnimationFrame}		from "@awayjs/core/lib/utils/RequestAnimationFrame";

import {View}							from "@awayjs/display/lib/View";
import {DirectionalLight}				from "@awayjs/display/lib/display/DirectionalLight";
import {Sprite}						from "@awayjs/display/lib/display/Sprite";
import {ElementsType}					from "@awayjs/display/lib/graphics/ElementsType";
import {StaticLightPicker}			from "@awayjs/display/lib/materials/lightpickers/StaticLightPicker";
import {PrimitiveTorusPrefab}			from "@awayjs/display/lib/prefabs/PrimitiveTorusPrefab";
import {PrimitiveCubePrefab}			from "@awayjs/display/lib/prefabs/PrimitiveCubePrefab";
import {PrimitiveCapsulePrefab}		from "@awayjs/display/lib/prefabs/PrimitiveCapsulePrefab";

import {DefaultRenderer}				from "@awayjs/renderer/lib/DefaultRenderer";

import {MethodMaterial}				from "@awayjs/materials/lib/MethodMaterial";

import {OBJParser}					from "awayjs-parsers/lib/OBJParser";

class MaterialAlphaTest
{
	private view:View;
	private raf:RequestAnimationFrame;
	private sprites  : Array<Sprite> = new Array<Sprite>();
	private loadedSpriteMaterial:MethodMaterial;
	private light:DirectionalLight;
	private lightB:DirectionalLight;
	private loadedSprite:Sprite;

	private aValues:Array<number> = Array<number>(0, .1, .5, .8, .9, .99, 1);
	private aValuesP:number = 0;

	private torusTextureMaterial:MethodMaterial;
	private cubeColorMaterial:MethodMaterial;
	private capsuleColorMaterial:MethodMaterial;
	private staticLightPicker:StaticLightPicker;

	constructor()
	{
		Debug.LOG_PI_ERRORS = false;
		Debug.THROW_ERRORS = false;

		this.view = new View(new DefaultRenderer());
		this.raf = new RequestAnimationFrame(this.render, this);
		this.onResize();

		this.light = new DirectionalLight();
		this.light.color = 0xFFFFFF;
		this.light.direction = new Vector3D(1, 1, 0);
		this.light.ambient = 0;
		this.light.ambientColor = 0xFFFFFF;
		this.light.diffuse = 1;
		this.light.specular = 1;

		this.lightB = new DirectionalLight();
		this.lightB.color= 0xFF0000;
		this.lightB.direction = new Vector3D(-1, 0, 1);
		this.lightB.ambient = 0;
		this.lightB.ambientColor = 0xFFFFFF;
		this.lightB.diffuse = 1;
		this.lightB.specular = 1;

		this.view.scene.addChild(this.light);
		this.view.scene.addChild(this.lightB);

		this.view.backgroundColor = 0x222222;

		AssetLibrary.enableParser(OBJParser);

		var session:Loader;

		session = AssetLibrary.getLoader();
		session.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => this.onLoadComplete(event));
		session.load(new URLRequest('assets/platonic.obj'));

		session = AssetLibrary.getLoader();
		session.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => this.onLoadComplete(event));
		session.load(new URLRequest('assets/dots.png'));

		window.onresize = (event:UIEvent) => this.onResize(event);
		document.onmousedown = (event:MouseEvent) => this.onMouseDown(event);
	}

	private onMouseDown(event:MouseEvent)
	{
		this.cubeColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedSpriteMaterial.alpha = this.aValues[this.aValuesP];

		alert( 'Alpha: ' + this.aValues[this.aValuesP]);

		this.aValuesP++;

		if (this.aValuesP > this.aValues.length -1)
			this.aValuesP  = 0;
	}

	private render(dt:number)
	{
		if (this.sprites)
			for (var c:number = 0; c < this.sprites.length; c++)
				this.sprites[c].rotationY += .35;

		this.view.render();
	}

	public onLoadComplete(event:LoaderEvent)
	{
		var loader:Loader = event.target;
		var l:number = loader.baseDependency.assets.length

		for (var c:number = 0; c < l; c ++) {

			var d:IAsset = loader.baseDependency.assets[c];

			console.log( d.name);

			switch (d.assetType) {
				case Sprite.assetType:
					var sprite:Sprite = <Sprite> d;

					this.loadedSprite = sprite;

					if (d.name == 'Sprite_g0') {
						this.loadedSprite = sprite;
						sprite.y = -400;
						sprite.transform.scaleTo(5, 5, 5);
					} else {
						sprite.transform.scaleTo(3.5, 3.5, 3.5);
					}

					if (this.loadedSpriteMaterial)
						sprite.material = this.loadedSpriteMaterial;

					this.view.scene.addChild(sprite);
					this.sprites.push(sprite);

					this.raf.start();
					break;
				case BitmapImage2D.assetType:
					// Light Picker
					this.staticLightPicker = new StaticLightPicker( [this.light , this.lightB ] );

					// Material for loaded sprite
					this.loadedSpriteMaterial = new MethodMaterial(<BitmapImage2D> d);
					this.loadedSpriteMaterial.style.sampler = new Sampler2D(true, true, false);
					this.loadedSpriteMaterial.lightPicker = this.staticLightPicker;
					this.loadedSpriteMaterial.alpha = 1;
					this.loadedSpriteMaterial.bothSides = true;

					if (this.loadedSprite)
						this.loadedSprite.material = this.loadedSpriteMaterial;

					// Torus Texture Material
					this.torusTextureMaterial = new MethodMaterial(<BitmapImage2D> d);
					this.torusTextureMaterial.style.sampler = new Sampler2D(true, true, false);
					this.torusTextureMaterial.lightPicker = this.staticLightPicker ;
					this.torusTextureMaterial.bothSides = true;
					this.torusTextureMaterial.alpha = .8;

					// Torus
					var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(this.torusTextureMaterial, ElementsType.TRIANGLE, 150 , 50 , 64 , 64);

					// Torus Sprite ( left )
					var torusSprite:Sprite = <Sprite> torus.getNewObject();
					torusSprite.rotationX = 90;
					torusSprite.x = 600;
					this.sprites.push(torusSprite);
					this.view.scene.addChild(torusSprite);

					// Torus Color Material
					this.cubeColorMaterial = new MethodMaterial(0x0090ff);
					this.cubeColorMaterial.lightPicker = this.staticLightPicker ;
					this.cubeColorMaterial.alpha = .8;
					this.cubeColorMaterial.bothSides = true;

					var cube:PrimitiveCubePrefab = new PrimitiveCubePrefab(this.cubeColorMaterial, ElementsType.TRIANGLE, 300, 300, 300, 20, 20, 20);

					// Torus Sprite ( right )
					var cubeSprite:Sprite = <Sprite> cube.getNewObject();
					cubeSprite.rotationX = 90;
					cubeSprite.x = -600;
					this.sprites.push(cubeSprite);
					this.view.scene.addChild(cubeSprite);

					this.capsuleColorMaterial = new MethodMaterial(0x00ffff);
					this.capsuleColorMaterial.lightPicker = this.staticLightPicker;

					var capsule:PrimitiveCapsulePrefab = new PrimitiveCapsulePrefab(this.capsuleColorMaterial, ElementsType.TRIANGLE, 100, 200);

					// Torus Sprite ( right )
					var capsuleSprite:Sprite = <Sprite> capsule.getNewObject();
					this.sprites.push(capsuleSprite);
					this.view.scene.addChild(capsuleSprite);

					this.cubeColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedSpriteMaterial.alpha = 1;

					break;
			}
		}
	}

	public onResize(event:UIEvent = null)
	{
		this.view.y = 0;
		this.view.x = 0;

		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}
}