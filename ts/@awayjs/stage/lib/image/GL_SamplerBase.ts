import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {IAsset}						from "@awayjs/core/lib/library/IAsset";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {Stage}						from "../base/Stage";

/**
 *
 * @class away.pool.GL_SamplerBase
 */
export class GL_SamplerBase extends AbstractionBase
{
	public _stage:Stage;

	constructor(asset:IAsset, stage:Stage)
	{
		super(asset, stage);

		this._stage = stage;
	}

	public activate(index:number):void
	{
		throw new AbstractMethodError();
	}
}