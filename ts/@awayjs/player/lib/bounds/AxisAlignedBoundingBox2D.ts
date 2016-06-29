import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {AxisAlignedBoundingBox}		from "@awayjs/display/lib/bounds/AxisAlignedBoundingBox";
import {IEntity}						from "@awayjs/display/lib/display/IEntity";

/**
 * AxisAlignedBoundingBox represents a bounding box volume that has its planes aligned to the local coordinate axes of the bounded object.
 * This is useful for most meshes.
 */
export class AxisAlignedBoundingBox2D extends AxisAlignedBoundingBox
{
	/**
	 * Creates a new <code>AxisAlignedBoundingBox</code> object.
	 */
	constructor(entity:IEntity)
	{
		super(entity);
	}

	public rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):number
	{
		if(this._pInvalidated)
			this._pUpdate();

		var halfExtentsX:number = this._box.width/2;
		var halfExtentsY:number = this._box.height/2;

		var centerX:number = this._box.x + halfExtentsX;
		var centerY:number = this._box.y + halfExtentsY;

		var px:number = position.x - centerX;
		var py:number = position.y - centerY;
		var pz:number = position.z;

		var vx:number = direction.x;
		var vy:number = direction.y;
		var vz:number = direction.z;

		var ix:number;
		var iy:number;

		var intersects:boolean;
		var rayEntryDistance:number;

		if (!intersects && vz < 0) {
			rayEntryDistance =  - pz/vz;
			if (rayEntryDistance > 0) {
				ix = px + rayEntryDistance*vx;
				iy = py + rayEntryDistance*vy;
				if (iy > -halfExtentsY && iy < halfExtentsY && ix > -halfExtentsX && ix < halfExtentsX) {
					targetNormal.x = 0;
					targetNormal.y = 0;
					targetNormal.z = 1;
					intersects = true;
				}
			}
		}
		if (!intersects && vz > 0) {
			rayEntryDistance = - pz/vz;
			if (rayEntryDistance > 0) {
				ix = px + rayEntryDistance*vx;
				iy = py + rayEntryDistance*vy;
				if (iy > -halfExtentsY && iy < halfExtentsY && ix > -halfExtentsX && ix < halfExtentsX) {
					targetNormal.x = 0;
					targetNormal.y = 0;
					targetNormal.z = -1;
					intersects = true;
				}
			}
		}

		return intersects? rayEntryDistance : -1;
	}
}