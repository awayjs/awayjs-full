import {Vector3D}						from "awayjs-core/lib/geom/Vector3D";
import {RequestAnimationFrame}		from "awayjs-core/lib/utils/RequestAnimationFrame";
import {Debug}						from "awayjs-core/lib/utils/Debug";

import {View}							from "awayjs-display/lib/View";
import {Sprite}						from "awayjs-display/lib/display/Sprite";
import {PointLight}					from "awayjs-display/lib/display/PointLight";
import {StaticLightPicker}			from "awayjs-display/lib/materials/lightpickers/StaticLightPicker";
import {PrimitiveTorusPrefab}			from "awayjs-display/lib/prefabs/PrimitiveTorusPrefab";
import {ElementsType}					from "awayjs-display/lib/graphics/ElementsType";

import {DefaultRenderer}				from "awayjs-renderergl/lib/DefaultRenderer";

import {MethodMaterial}				from "awayjs-methodmaterials/lib/MethodMaterial";

class ColorMultiPassMatTest
{
	private view:View;
	private light:PointLight;
	private raf:RequestAnimationFrame;
	private counter:number = 0;
	private center:Vector3D = new Vector3D();

	constructor()
	{
		Debug.THROW_ERRORS = false;
		Debug.LOG_PI_ERRORS = false;

		this.light = new PointLight();
		this.view = new View(new DefaultRenderer());
		this.view.camera.z = -1000;
		this.view.backgroundColor = 0x000000;

		var l:number = 20;
		var radius:number = 500;

		var mat:MethodMaterial = new MethodMaterial(0xff0000);

		mat.lightPicker = new StaticLightPicker([this.light]);

		var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(mat, ElementsType.TRIANGLE, 50 , 10, 32 , 32 , false);

		for (var c:number = 0; c < l ; c++) {
			var t:number = Math.PI*2*c/l;
			var m:Sprite = <Sprite> torus.getNewObject();

			m.x = Math.cos(t)*radius;
			m.y = 0;
			m.z = Math.sin(t)*radius;

			this.view.scene.addChild(m);
		}

		this.view.scene.addChild(this.light);

		this.view.y = this.view.x = 0;
		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;

		console.log("renderer ", this.view.renderer);
		console.log("scene ", this.view.scene);
		console.log("view ", this.view);

		this.view.render();

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.raf = new RequestAnimationFrame(this.tick, this);
		this.raf.start();
	}


	private tick(dt:number)
	{
		this.counter += 0.005;
		this.view.camera.lookAt(this.center);
		this.view.camera.x = Math.cos(this.counter)*800;
		this.view.camera.z = Math.sin(this.counter)*800;

		this.view.render();
	}

	public onResize(event:UIEvent = null)
	{
		this.view.y = 0;
		this.view.x = 0;
		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}
}