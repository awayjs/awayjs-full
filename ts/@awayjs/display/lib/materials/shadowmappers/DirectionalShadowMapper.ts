import {Image2D}						from "@awayjs/core/lib/image/Image2D";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {FreeMatrixProjection}			from "@awayjs/core/lib/projections/FreeMatrixProjection";

import {Scene}						from "../../display/Scene";
import {IRenderer}					from "../../IRenderer";
import {Camera}						from "../../display/Camera";
import {DirectionalLight}				from "../../display/DirectionalLight";
import {ShadowMapperBase}				from "../../materials/shadowmappers/ShadowMapperBase";
import {Single2DTexture}				from "../../textures/Single2DTexture";

export class DirectionalShadowMapper extends ShadowMapperBase
{
	public _pOverallDepthCamera:Camera;
	public _pLocalFrustum:Array<number>;

	public _pLightOffset:number = 10000;
	public _pMatrix:Matrix3D;
	public _pOverallDepthProjection:FreeMatrixProjection;
	public _pSnap:number = 64;

	public _pCullPlanes:Array<Plane3D>;
	public _pMinZ:number;
	public _pMaxZ:number;

	constructor()
	{
		super();

		this._pCullPlanes = [];
		this._pOverallDepthProjection = new FreeMatrixProjection();
		this._pOverallDepthCamera = new Camera(this._pOverallDepthProjection);
		this._pLocalFrustum = [];
		this._pMatrix = new Matrix3D();
	}

	public get snap():number
	{
		return this._pSnap;
	}

	public set snap(value:number)
	{
		this._pSnap = value;
	}

	public get lightOffset():number
	{
		return this._pLightOffset;
	}

	public set lightOffset(value:number)
	{
		this._pLightOffset = value;
	}

	//@arcane
	public get iDepthProjection():Matrix3D
	{
		return this._pOverallDepthCamera.viewProjection;
	}

	//@arcane
	public get depth():number
	{
		return this._pMaxZ - this._pMinZ;
	}

	public iSetDepthMap(depthMap:Single2DTexture):void
	{
		if (this._depthMap == depthMap)
			return;

		super.iSetDepthMap(depthMap);

		if (this._depthMap) {
			this._explicitDepthMap = true;
			this._pDepthMapSize = depthMap.image2D.rect.width;
		} else {
			this._explicitDepthMap = false;
		}
	}

	public pCreateDepthTexture():Single2DTexture
	{
		return new Single2DTexture(new Image2D(this._pDepthMapSize, this._pDepthMapSize));
	}

	//@override
	public pDrawDepthMap(scene:Scene, target:Single2DTexture, renderer:IRenderer):void
	{
		renderer.cullPlanes = this._pCullPlanes;
		renderer._iRender(this._pOverallDepthCamera, scene, target.image2D);
	}

	//@protected
	public pUpdateCullPlanes(camera:Camera):void
	{
		var lightFrustumPlanes:Array<Plane3D> = this._pOverallDepthCamera.frustumPlanes;
		var viewFrustumPlanes:Array<Plane3D> = camera.frustumPlanes;
		this._pCullPlanes.length = 4;

		this._pCullPlanes[0] = lightFrustumPlanes[0];
		this._pCullPlanes[1] = lightFrustumPlanes[1];
		this._pCullPlanes[2] = lightFrustumPlanes[2];
		this._pCullPlanes[3] = lightFrustumPlanes[3];

		var light:DirectionalLight = <DirectionalLight> this._pLight;
		var dir:Vector3D = light.sceneDirection;
		var dirX:number = dir.x;
		var dirY:number = dir.y;
		var dirZ:number = dir.z;
		var j:number = 4;
		for (var i:number = 0; i < 6; ++i) {
			var plane:Plane3D = viewFrustumPlanes[i];
			if (plane.a*dirX + plane.b*dirY + plane.c*dirZ < 0)
				this._pCullPlanes[j++] = plane;
		}
	}

	//@override
	public pUpdateDepthProjection(camera:Camera):void
	{
		this.pUpdateProjectionFromFrustumCorners(camera, camera.projection.frustumCorners, this._pMatrix);
		this._pOverallDepthProjection.matrix = this._pMatrix;
		this.pUpdateCullPlanes(camera);
	}

	public pUpdateProjectionFromFrustumCorners(camera:Camera, corners:Array<number>, matrix:Matrix3D):void
	{
		var raw:Float32Array = Matrix3DUtils.RAW_DATA_CONTAINER;
		var dir:Vector3D;
		var x:number, y:number, z:number;
		var minX:number, minY:number;
		var maxX:number, maxY:number;
		var i:number;

		var light:DirectionalLight = <DirectionalLight> this._pLight;
		dir = light.sceneDirection;
		this._pOverallDepthCamera.transform.matrix3D = this._pLight.sceneTransform;
		x = Math.floor((camera.x - dir.x*this._pLightOffset)/this._pSnap)*this._pSnap;
		y = Math.floor((camera.y - dir.y*this._pLightOffset)/this._pSnap)*this._pSnap;
		z = Math.floor((camera.z - dir.z*this._pLightOffset)/this._pSnap)*this._pSnap;
		this._pOverallDepthCamera.x = x;
		this._pOverallDepthCamera.y = y;
		this._pOverallDepthCamera.z = z;

		this._pMatrix.copyFrom(this._pOverallDepthCamera.inverseSceneTransform);
		this._pMatrix.prepend(camera.sceneTransform);
		this._pMatrix.transformVectors(corners, this._pLocalFrustum);

		minX = maxX = this._pLocalFrustum[0];
		minY = maxY = this._pLocalFrustum[1];
		this._pMaxZ = this._pLocalFrustum[2];

		i = 3;
		while (i < 24) {
			x = this._pLocalFrustum[i];
			y = this._pLocalFrustum[i + 1];
			z = this._pLocalFrustum[i + 2];
			if (x < minX)
				minX = x;
			if (x > maxX)
				maxX = x;
			if (y < minY)
				minY = y;
			if (y > maxY)
				maxY = y;
			if (z > this._pMaxZ)
				this._pMaxZ = z;
			i += 3;
		}

		this._pMinZ = 1;

		var w:number = maxX - minX;
		var h:number = maxY - minY;
		var d:number = 1/(this._pMaxZ - this._pMinZ);

		if (minX < 0)
			minX -= this._pSnap; // because int() rounds up for < 0

		if (minY < 0)
			minY -= this._pSnap;

		minX = Math.floor(minX/this._pSnap)*this._pSnap;
		minY = Math.floor(minY/this._pSnap)*this._pSnap;

		var snap2:number = 2*this._pSnap;
		w = Math.floor(w/snap2 + 2)*snap2;
		h = Math.floor(h/snap2 + 2)*snap2;

		maxX = minX + w;
		maxY = minY + h;

		w = 1/w;
		h = 1/h;

		raw[0] = 2*w;
		raw[5] = 2*h;
		raw[10] = d;
		raw[12] = -(maxX + minX)*w;
		raw[13] = -(maxY + minY)*h;
		raw[14] = -this._pMinZ*d;
		raw[15] = 1;
		raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

		matrix.copyRawDataFrom(raw);
	}
}