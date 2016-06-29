import {ImageCube}					from "@awayjs/core/lib/image/ImageCube";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {PerspectiveProjection}		from "@awayjs/core/lib/projections/PerspectiveProjection";

import {Scene}						from "../../display/Scene";
import {Camera}						from "../../display/Camera";
import {PointLight}					from "../../display/PointLight";
import {ShadowMapperBase}				from "../../materials/shadowmappers/ShadowMapperBase";
import {IRenderer}					from "../../IRenderer";
import {SingleCubeTexture}			from "../../textures/SingleCubeTexture";

export class CubeMapShadowMapper extends ShadowMapperBase
{
	private _depthCameras:Array<Camera>;
	private _projections:Array<PerspectiveProjection>;
	private _needsRender:Array<boolean>;

	constructor()
	{
		super();

		this._pDepthMapSize = 512;
		this._needsRender = new Array();
		this.initCameras();
	}

	private initCameras():void
	{
		this._depthCameras = new Array();
		this._projections = new Array();

		// posX, negX, posY, negY, posZ, negZ
		this.addCamera(0, 90, 0);
		this.addCamera(0, -90, 0);
		this.addCamera(-90, 0, 0);
		this.addCamera(90, 0, 0);
		this.addCamera(0, 0, 0);
		this.addCamera(0, 180, 0);
	}

	private addCamera(rotationX:number, rotationY:number, rotationZ:number):void
	{
		var cam:Camera = new Camera();
		cam.rotationX = rotationX;
		cam.rotationY = rotationY;
		cam.rotationZ = rotationZ;
		cam.projection.near = .01;

		var projection:PerspectiveProjection = <PerspectiveProjection> cam.projection;
		projection.fieldOfView = 90;
		this._projections.push(projection);
		cam.projection._iAspectRatio = 1;
		this._depthCameras.push(cam);
	}

	//@override
	public pCreateDepthTexture():SingleCubeTexture
	{
		 return new SingleCubeTexture(new ImageCube(this._pDepthMapSize));
	}

	//@override
	public pUpdateDepthProjection(camera:Camera):void
	{
		var light:PointLight = <PointLight>(this._pLight);
		var maxDistance:number = light._pFallOff;
		var pos:Vector3D = this._pLight.scenePosition;

		// todo: faces outside frustum which are pointing away from camera need not be rendered!
		for (var i:number = 0; i < 6; ++i) {
			this._projections[i].far = maxDistance;
			this._depthCameras[i].transform.moveTo(pos.x, pos.y, pos.z);
			this._needsRender[i] = true;
		}
	}

	//@override
	public pDrawDepthMap(scene:Scene, target:SingleCubeTexture, renderer:IRenderer):void
	{
		for (var i:number = 0; i < 6; ++i)
			if (this._needsRender[i])
				renderer._iRender(this._depthCameras[i], scene, target.imageCube, null, i)
	}
}