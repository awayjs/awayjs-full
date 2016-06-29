import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {ProjectionEvent}				from "@awayjs/core/lib/events/ProjectionEvent";
import {IProjection}					from "@awayjs/core/lib/projections/IProjection";
import {PerspectiveProjection}		from "@awayjs/core/lib/projections/PerspectiveProjection";

import {HierarchicalProperties}		from "../base/HierarchicalProperties";
import {IRenderer}					from "../IRenderer";
import {BoundsType}					from "../bounds/BoundsType";
import {DisplayObjectContainer}		from "../display/DisplayObjectContainer";
import {IEntity}						from "../display/IEntity";
import {CameraEvent}					from "../events/CameraEvent";


export class Camera extends DisplayObjectContainer implements IEntity
{
	public static assetType:string = "[asset Camera]";

	private _viewProjection:Matrix3D = new Matrix3D();
	private _viewProjectionDirty:Boolean = true;
	private _projection:IProjection;
	private _frustumPlanes:Array<Plane3D>;
	private _frustumPlanesDirty:Boolean = true;
	private _onProjectionMatrixChangedDelegate:(event:ProjectionEvent) => void;

	constructor(projection:IProjection = null)
	{
		super();

		this._pIsEntity = true;

		this._onProjectionMatrixChangedDelegate = (event:ProjectionEvent) => this.onProjectionMatrixChanged(event);

		this._projection = projection || new PerspectiveProjection();
		this._projection.addEventListener(ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);

		this._frustumPlanes = [];

		for (var i:number = 0; i < 6; ++i)
			this._frustumPlanes[i] = new Plane3D();

		this.z = -1000;

		//default bounds type
		this._boundsType = BoundsType.NULL;
	}

	//@override
	public get assetType():string
	{
		return Camera.assetType;
	}

	private onProjectionMatrixChanged(event:ProjectionEvent):void
	{
		this._viewProjectionDirty = true;
		this._frustumPlanesDirty = true;
		this.dispatchEvent(event);
	}

	public get frustumPlanes():Array<Plane3D>
	{
		if (this._frustumPlanesDirty)
			this.updateFrustum();

		return this._frustumPlanes;
	}

	private updateFrustum():void
	{
		var a:number, b:number, c:number;
		//var d : Number;
		var c11:number, c12:number, c13:number, c14:number;
		var c21:number, c22:number, c23:number, c24:number;
		var c31:number, c32:number, c33:number, c34:number;
		var c41:number, c42:number, c43:number, c44:number;
		var p:Plane3D;
		var raw:Float32Array = this.viewProjection.rawData;
		var invLen:number;

		c11 = raw[0];
		c12 = raw[4];
		c13 = raw[8];
		c14 = raw[12];
		c21 = raw[1];
		c22 = raw[5];
		c23 = raw[9];
		c24 = raw[13];
		c31 = raw[2];
		c32 = raw[6];
		c33 = raw[10];
		c34 = raw[14];
		c41 = raw[3];
		c42 = raw[7];
		c43 = raw[11];
		c44 = raw[15];

		// left plane
		p = this._frustumPlanes[0];
		a = c41 + c11;
		b = c42 + c12;
		c = c43 + c13;
		invLen = 1/Math.sqrt(a*a + b*b + c*c);
		p.a = a*invLen;
		p.b = b*invLen;
		p.c = c*invLen;
		p.d = -(c44 + c14)*invLen;

		// right plane
		p = this._frustumPlanes[1];
		a = c41 - c11;
		b = c42 - c12;
		c = c43 - c13;
		invLen = 1/Math.sqrt(a*a + b*b + c*c);
		p.a = a*invLen;
		p.b = b*invLen;
		p.c = c*invLen;
		p.d = (c14 - c44)*invLen;

		// bottom
		p = this._frustumPlanes[2];
		a = c41 + c21;
		b = c42 + c22;
		c = c43 + c23;
		invLen = 1/Math.sqrt(a*a + b*b + c*c);
		p.a = a*invLen;
		p.b = b*invLen;
		p.c = c*invLen;
		p.d = -(c44 + c24)*invLen;

		// top
		p = this._frustumPlanes[3];
		a = c41 - c21;
		b = c42 - c22;
		c = c43 - c23;
		invLen = 1/Math.sqrt(a*a + b*b + c*c);
		p.a = a*invLen;
		p.b = b*invLen;
		p.c = c*invLen;
		p.d = (c24 - c44)*invLen;

		// near
		p = this._frustumPlanes[4];
		a = c31;
		b = c32;
		c = c33;
		invLen = 1/Math.sqrt(a*a + b*b + c*c);
		p.a = a*invLen;
		p.b = b*invLen;
		p.c = c*invLen;
		p.d = -c34*invLen;

		// far
		p = this._frustumPlanes[5];
		a = c41 - c31;
		b = c42 - c32;
		c = c43 - c33;
		invLen = 1/Math.sqrt(a*a + b*b + c*c);
		p.a = a*invLen;
		p.b = b*invLen;
		p.c = c*invLen;
		p.d = (c34 - c44)*invLen;

		this._frustumPlanesDirty = false;

	}

	public pInvalidateHierarchicalProperties(bitFlag:number):boolean
	{
		if (super.pInvalidateHierarchicalProperties(bitFlag))
			return true;

		if (this._hierarchicalPropsDirty & HierarchicalProperties.SCENE_TRANSFORM) {
			this._viewProjectionDirty = true;
			this._frustumPlanesDirty = true;
		}

		return false;
	}

	/**
	 *
	 */
	public get projection():IProjection
	{
		return this._projection;
	}

	public set projection(value:IProjection)
	{
		if (this._projection == value)
			return;

		if (!value)
			throw new Error("Projection cannot be null!");

		this._projection.removeEventListener(ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
		this._projection = value;
		this._projection.addEventListener(ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
		this.dispatchEvent(new CameraEvent(CameraEvent.PROJECTION_CHANGED, this));
	}

	/**
	 *
	 */
	public get viewProjection():Matrix3D
	{
		if (this._viewProjectionDirty) {
			this._viewProjection.copyFrom(this.inverseSceneTransform);
			this._viewProjection.append(this._projection.matrix);
			this._viewProjectionDirty = false;
		}

		return this._viewProjection;
	}

	/**
	 * Calculates the ray in scene space from the camera to the given normalized coordinates in screen space.
	 *
	 * @param nX The normalised x coordinate in screen space, -1 corresponds to the left edge of the viewport, 1 to the right.
	 * @param nY The normalised y coordinate in screen space, -1 corresponds to the top edge of the viewport, 1 to the bottom.
	 * @param sZ The z coordinate in screen space, representing the distance into the screen.
	 * @return The ray from the camera to the scene space position of the given screen coordinates.
	 */
	public getRay(nX:number, nY:number, sZ:number):Vector3D
	{
		return this.sceneTransform.deltaTransformVector(this._projection.unproject(nX, nY, sZ));
	}

	/**
	 * Calculates the normalised position in screen space of the given scene position.
	 *
	 * @param point3d the position vector of the scene coordinates to be projected.
	 * @return The normalised screen position of the given scene coordinates.
	 */
	public project(point3d:Vector3D):Vector3D
	{
		return this._projection.project(this.inverseSceneTransform.transformVector(point3d));
	}

	/**
	 * Calculates the scene position of the given normalized coordinates in screen space.
	 *
	 * @param nX The normalised x coordinate in screen space, minus the originX offset of the projection property.
	 * @param nY The normalised y coordinate in screen space, minus the originY offset of the projection property.
	 * @param sZ The z coordinate in screen space, representing the distance into the screen.
	 * @return The scene position of the given screen coordinates.
	 */
	public unproject(nX:number, nY:number, sZ:number):Vector3D
	{
		return this.sceneTransform.transformVector(this._projection.unproject(nX, nY, sZ));
	}

	public _applyRenderer(renderer:IRenderer):void
	{
		// Since this getter is invoked every iteration of the render loop, and
		// the prefab construct could affect the sub-sprites, the prefab is
		// validated here to give it a chance to rebuild.
		if (this._iSourcePrefab)
			this._iSourcePrefab._iValidate();

		//nothing to do here
	}
}