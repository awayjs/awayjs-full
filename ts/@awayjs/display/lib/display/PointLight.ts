import {Box}							from "@awayjs/core/lib/geom/Box";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {LightBase}					from "../display/LightBase";
import {BoundsType}					from "../bounds/BoundsType";
import {Camera}						from "../display/Camera";
import {IEntity}						from "../display/IEntity";
import {CubeMapShadowMapper}			from "../materials/shadowmappers/CubeMapShadowMapper";

export class PointLight extends LightBase implements IEntity
{
	public static assetType:string = "[light PointLight]";

	public _pRadius:number = 90000;
	public _pFallOff:number = 100000;
	public _pFallOffFactor:number;

	constructor()
	{
		super();

		this._pIsEntity = true;

		this._pFallOffFactor = 1/(this._pFallOff*this._pFallOff - this._pRadius*this._pRadius);

		//default bounds type
		this._boundsType = BoundsType.SPHERE;
	}


	public get assetType():string
	{
		return PointLight.assetType;
	}

	public pCreateShadowMapper():CubeMapShadowMapper
	{
		return new CubeMapShadowMapper();
	}

	public get radius():number
	{
		return this._pRadius;
	}

	public set radius(value:number)
	{
		this._pRadius = value;

		if (this._pRadius < 0) {
			this._pRadius = 0;
		} else if (this._pRadius > this._pFallOff) {
			this._pFallOff = this._pRadius;
			this._pInvalidateBounds();
		}
		this._pFallOffFactor = 1/( this._pFallOff*this._pFallOff - this._pRadius*this._pRadius );
	}

	public iFallOffFactor():number
	{
		return this._pFallOffFactor;
	}

	public get fallOff():number
	{
		return this._pFallOff;
	}

	public set fallOff(value:number)
	{
		this._pFallOff = value;

		if (this._pFallOff < 0)
			this._pFallOff = 0;

		if (this._pFallOff < this._pRadius)
			this._pRadius = this._pFallOff;

		this._pFallOffFactor = 1/( this._pFallOff*this._pFallOff - this._pRadius*this._pRadius);
		this._pInvalidateBounds();
	}

	public _pUpdateSphereBounds():void
	{
		super._pUpdateSphereBounds();

		this._pSphereBounds.radius = this._pFallOff;
	}

	public iGetObjectProjectionMatrix(entity:IEntity, cameraTransform:Matrix3D, target:Matrix3D = null):Matrix3D
	{
		var raw:Float32Array = Matrix3DUtils.RAW_DATA_CONTAINER;
		var m:Matrix3D = new Matrix3D();

		// todo: do not use lookAt on Light
		m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
		m.append(this._pParent.inverseSceneTransform);
		this.lookAt(m.position);

		m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
		m.append(this.inverseSceneTransform);

		var box:Box = entity.getBox();
		var v1:Vector3D = m.deltaTransformVector(new Vector3D(box.left, box.bottom, box.front));
		var v2:Vector3D = m.deltaTransformVector(new Vector3D(box.right, box.top, box.back));
		var d1:number = v1.x*v1.x + v1.y*v1.y + v1.z*v1.z;
		var d2:number = v2.x*v2.x + v2.y*v2.y + v2.z*v2.z;
		var d:number = Math.sqrt(d1 > d2? d1 : d2);
		var zMin:number;
		var zMax:number;

		var z:number = m.rawData[14];
		zMin = z - d;
		zMax = z + d;

		raw[5] = raw[0] = zMin/d;
		raw[10] = zMax/(zMax - zMin);
		raw[11] = 1;
		raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[12] = raw[13] = raw[15] = 0;
		raw[14] = -zMin*raw[10];

		if (!target)
			target = new Matrix3D();

		target.copyRawDataFrom(raw);
		target.prepend(m);

		return target;
	}
}