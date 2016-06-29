import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {FreeMatrixProjection}			from "@awayjs/core/lib/projections/FreeMatrixProjection";
import {IProjection}					from "@awayjs/core/lib/projections/IProjection";

import {IRenderer}					from "../../IRenderer";
import {Scene}						from "../../display/Scene";
import {Camera}						from "../../display/Camera";
import {DirectionalShadowMapper}		from "../../materials/shadowmappers/DirectionalShadowMapper";
import {Single2DTexture}				from "../../textures/Single2DTexture";

export class CascadeShadowMapper extends DirectionalShadowMapper
{
	public _pScissorRects:Rectangle[];
	private _pScissorRectsInvalid:boolean = true;
	private _splitRatios:number[];

	private _numCascades:number /*int*/;
	private _depthCameras:Array<Camera>;
	private _depthLenses:Array<FreeMatrixProjection>;

	private _texOffsetsX:Array<number>;
	private _texOffsetsY:Array<number>;

	private _nearPlaneDistances:number[];

	constructor(numCascades:number /*uint*/ = 3)
	{
		super();

		if (numCascades < 1 || numCascades > 4)
			throw new Error("numCascades must be an integer between 1 and 4");

		this._numCascades = numCascades;
		this.init();
	}

	public getSplitRatio(index:number /*uint*/):number
	{
		return this._splitRatios[index];
	}

	public setSplitRatio(index:number /*uint*/, value:number):void
	{
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		if (index >= this._numCascades)
			throw new Error("index must be smaller than the number of cascades!");

		this._splitRatios[index] = value;
	}

	public getDepthProjections(partition:number /*uint*/):Matrix3D
	{
		return this._depthCameras[partition].viewProjection;
	}

	private init():void
	{
		this._splitRatios = new Array<number>(this._numCascades);
		this._nearPlaneDistances = new Array<number>(this._numCascades);

		var s:number = 1;
		for (var i:number /*int*/ = this._numCascades - 1; i >= 0; --i) {
			this._splitRatios[i] = s;
			s *= .4;
		}

		this._texOffsetsX = Array<number>(-1, 1, -1, 1);
		this._texOffsetsY = Array<number>(1, 1, -1, -1);
		this._pScissorRects = new Array<Rectangle>(4);
		this._depthLenses = new Array<FreeMatrixProjection>();
		this._depthCameras = new Array<Camera>();

		for (i = 0; i < this._numCascades; ++i) {
			this._depthLenses[i] = new FreeMatrixProjection();
			this._depthCameras[i] = new Camera(this._depthLenses[i]);
		}
	}

	public _pSetDepthMapSize(value:number /*uint*/):void
	{
		super._pSetDepthMapSize(value);

		this.invalidateScissorRects();
	}

	private invalidateScissorRects():void
	{
		this._pScissorRectsInvalid = true;
	}

	public get numCascades():number /*int*/
	{
		return this._numCascades;
	}

	public set numCascades(value:number /*int*/)
	{
		if (value == this._numCascades)
			return;

		if (value < 1 || value > 4)
			throw new Error("numCascades must be an integer between 1 and 4");

		this._numCascades = value;
		this.invalidateScissorRects();
		this.init();
		this.dispatchEvent(new AssetEvent(AssetEvent.INVALIDATE, this));
	}

	public pDrawDepthMap(scene:Scene, target:Single2DTexture, renderer:IRenderer):void
	{
		if (this._pScissorRectsInvalid)
			this.updateScissorRects();

		renderer.cullPlanes = this._pCullPlanes;
		renderer._iRenderCascades(this._pOverallDepthCamera, scene, target.image2D, this._numCascades, this._pScissorRects, this._depthCameras);
	}

	private updateScissorRects():void
	{
		var half:number = this._pDepthMapSize*.5;

		this._pScissorRects[0] = new Rectangle(0, 0, half, half);
		this._pScissorRects[1] = new Rectangle(half, 0, half, half);
		this._pScissorRects[2] = new Rectangle(0, half, half, half);
		this._pScissorRects[3] = new Rectangle(half, half, half, half);

		this._pScissorRectsInvalid = false;
	}

	public pUpdateDepthProjection(camera:Camera):void
	{
		var matrix:Matrix3D;
		var projection:IProjection = camera.projection;
		var projectionNear:number = projection.near;
		var projectionRange:number = projection.far - projectionNear;

		this.pUpdateProjectionFromFrustumCorners(camera, camera.projection.frustumCorners, this._pMatrix);
		this._pMatrix.appendScale(.96, .96, 1);
		this._pOverallDepthProjection.matrix = this._pMatrix;
		this.pUpdateCullPlanes(camera);

		for (var i:number /*int*/ = 0; i < this._numCascades; ++i) {
			matrix = this._depthLenses[i].matrix;

			this._nearPlaneDistances[i] = projectionNear + this._splitRatios[i]*projectionRange;
			this._depthCameras[i].transform.matrix3D = this._pOverallDepthCamera.transform.matrix3D;

			this.updateProjectionPartition(matrix, this._splitRatios[i], this._texOffsetsX[i], this._texOffsetsY[i]);

			this._depthLenses[i].matrix = matrix;
		}
	}

	private updateProjectionPartition(matrix:Matrix3D, splitRatio:number, texOffsetX:number, texOffsetY:number):void
	{
		var raw:Float32Array = Matrix3DUtils.RAW_DATA_CONTAINER;
		var xN:number, yN:number, zN:number;
		var xF:number, yF:number, zF:number;
		var minX:number = Number.POSITIVE_INFINITY, minY:number = Number.POSITIVE_INFINITY, minZ:number;
		var maxX:number = Number.NEGATIVE_INFINITY, maxY:number = Number.NEGATIVE_INFINITY, maxZ:number = Number.NEGATIVE_INFINITY;
		var i:number /*uint*/ = 0;

		while (i < 12) {
			xN = this._pLocalFrustum[i];
			yN = this._pLocalFrustum[i + 1];
			zN = this._pLocalFrustum[i + 2];
			xF = xN + (this._pLocalFrustum[i + 12] - xN)*splitRatio;
			yF = yN + (this._pLocalFrustum[i + 13] - yN)*splitRatio;
			zF = zN + (this._pLocalFrustum[i + 14] - zN)*splitRatio;
			if (xN < minX)
				minX = xN;
			if (xN > maxX)
				maxX = xN;
			if (yN < minY)
				minY = yN;
			if (yN > maxY)
				maxY = yN;
			if (zN > maxZ)
				maxZ = zN;
			if (xF < minX)
				minX = xF;
			if (xF > maxX)
				maxX = xF;
			if (yF < minY)
				minY = yF;
			if (yF > maxY)
				maxY = yF;
			if (zF > maxZ)
				maxZ = zF;
			i += 3;
		}

		minZ = 1;

		var w:number = (maxX - minX);
		var h:number = (maxY - minY);
		var d:number = 1/(maxZ - minZ);

		if (minX < 0)
			minX -= this._pSnap; // because int() rounds up for < 0
		if (minY < 0)
			minY -= this._pSnap;
		minX = Math.floor(minX/this._pSnap)*this._pSnap;
		minY = Math.floor(minY/this._pSnap)*this._pSnap;

		var snap2:number = 2*this._pSnap;
		w = Math.floor(w/snap2 + 1)*snap2;
		h = Math.floor(h/snap2 + 1)*snap2;

		maxX = minX + w;
		maxY = minY + h;

		w = 1/w;
		h = 1/h;

		raw[0] = 2*w;
		raw[5] = 2*h;
		raw[10] = d;
		raw[12] = -(maxX + minX)*w;
		raw[13] = -(maxY + minY)*h;
		raw[14] = -minZ*d;
		raw[15] = 1;
		raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

		matrix.copyRawDataFrom(raw);
		matrix.appendScale(.96, .96, 1);
		matrix.appendTranslation(texOffsetX, texOffsetY, 0);
		matrix.appendScale(.5, .5, 1);
	}

	get _iNearPlaneDistances():Array<number>
	{
		return this._nearPlaneDistances;
	}
}