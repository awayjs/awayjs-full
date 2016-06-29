import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";

import {EntityNode}					from "../partition/EntityNode";
import {ITraverser}				from "../ITraverser";

/**
 * SkyboxNode is a space partitioning leaf node that contains a Skybox object.
 *
 * @class away.partition.SkyboxNode
 */
export class SkyboxNode extends EntityNode
{
	/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		if (!this._displayObject._iIsVisible)
			return false;

		//a skybox is always in view unless its visibility is set to false
		return true;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isCastingShadow():boolean
	{
		return false; //skybox never casts shadows
	}
}