import {EntityNode}					from "../partition/EntityNode";
import {ITraverser}				from "../ITraverser";

/**
 * @class away.partition.DirectionalLightNode
 */
export class DirectionalLightNode extends EntityNode
{
	/**
	 * @inheritDoc
	 */
	public acceptTraverser(traverser:ITraverser):void
	{
		if (traverser.enterNode(this))
			traverser.applyDirectionalLight(this._displayObject);
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