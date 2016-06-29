import {IEntity}						from "../display/IEntity";
import {EntityNode}					from "../partition/EntityNode";
import {PartitionBase}				from "../partition/PartitionBase";

/**
 * IEntityNodeClass is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IEntityNodeClass
 */
export interface IEntityNodeClass
{
	/**
	 *
	 */
	new(entity:IEntity, pool:PartitionBase):EntityNode;
}