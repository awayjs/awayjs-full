import {EntityNode}					from "../partition/EntityNode";
import {ITraverser}				from "../ITraverser";

/**
 * @class away.partition.PointLightNode
 */
export class PointLightNode extends EntityNode
{
	/**
	 * @inheritDoc
	 */
	public acceptTraverser(traverser:ITraverser):void
	{
		if (traverser.enterNode(this))
			traverser.applyPointLight(this._displayObject);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isCastingShadow():boolean
	{
		return false;
	}
}