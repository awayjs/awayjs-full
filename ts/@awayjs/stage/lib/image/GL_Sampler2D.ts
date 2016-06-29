import {Sampler2D}					from "@awayjs/core/lib/image/Sampler2D";

import {Stage}						from "../base/Stage";
import {GL_SamplerBase}				from "../image/GL_SamplerBase";

/**
 *
 * @class away.pool.GL_SamplerBase
 */
export class GL_Sampler2D extends GL_SamplerBase
{
	public _sampler:Sampler2D;

	constructor(sampler:Sampler2D, stage:Stage)
	{
		super(sampler, stage);

		this._sampler = sampler;
	}

	public activate(index:number):void
	{
		this._stage.setSamplerState(index, this._sampler.repeat, this._sampler.smooth, this._sampler.mipmap);
	}
}