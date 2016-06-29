import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {ITraverser}					from "../ITraverser";
import {DisplayObject}				from "../display/DisplayObject";
import {IContainerNode}				from "../partition/IContainerNode";
import {BoundingVolumeBase}			from "../bounds/BoundingVolumeBase";

/**
 * IDisplayObjectNode is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IDisplayObjectNode
 */
export interface INode
{
	debugVisible:boolean;

	bounds:BoundingVolumeBase;

	numEntities:number;

	parent:IContainerNode;

	_iCollectionMark:number;

	isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean;
	
	isRenderable():boolean;

	isMask():boolean;
	
	isIntersectingRay(rayPosition:Vector3D, rayDirection:Vector3D):boolean;

	acceptTraverser(traverser:ITraverser);

	isCastingShadow():boolean;
}