import {NodeBase}						from "../partition/NodeBase";
import {PartitionBase}				from "../partition/PartitionBase";


/**
 * @class away.partition.Partition
 */
export class BasicPartition extends PartitionBase
{
	constructor()
	{
		super();

		this._rootNode = new NodeBase();
	}
}