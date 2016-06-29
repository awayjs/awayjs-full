import {PlaneClassification}			from "@awayjs/core/lib/geom/PlaneClassification";
import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";

import {BoundingVolumeBase}			from "../bounds/BoundingVolumeBase";


export class NullBounds extends BoundingVolumeBase
{
	private _alwaysIn:boolean;

	constructor(alwaysIn:boolean = true)
	{
		super(null);

		this._alwaysIn = alwaysIn;
	}

	//@override
	public clone():BoundingVolumeBase
	{
		return new NullBounds(this._alwaysIn);
	}

	//@override
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		return this._alwaysIn;
	}

	public classifyToPlane(plane:Plane3D):number
	{
		return PlaneClassification.INTERSECT;
	}
}