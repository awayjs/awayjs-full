import {IEntity}						from "./display/IEntity";
import {INode}						from "./partition/INode";
import {IRenderable}					from "./base/IRenderable";

/**
 * ITraverser is an interface for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.ITraverser
 */
export interface ITraverser
{
	/**
	 *
	 * @param node
	 * @returns {boolean}
	 */
	enterNode(node:INode):boolean;

	/**
	 *
	 * @param entity
	 */
	applyDirectionalLight(entity:IEntity);

	/**
	 *
	 * @param entity
	 */
	applyEntity(entity:IEntity);

	/**
	 *
	 * @param entity
	 */
	applyRenderable(renderable:IRenderable);

	/**
	 *
	 * @param entity
	 */
	applyLightProbe(entity:IEntity);

	/**
	 *
	 * @param entity
	 */
	applyPointLight(entity:IEntity);

	/**
	 *
	 * @param entity
	 */
	applySkybox(entity:IEntity);
}