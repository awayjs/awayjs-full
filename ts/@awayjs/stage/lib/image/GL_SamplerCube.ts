import {SamplerCube}					from "@awayjs/core/lib/image/SamplerCube";

import {Stage}						from "../base/Stage";
import {GL_SamplerBase}				from "../image/GL_SamplerBase";

/**
 *
 * @class away.pool.GL_SamplerBase
 */
export class GL_SamplerCube extends GL_SamplerBase
{
	public _sampler:SamplerCube;

	constructor(sampler:SamplerCube, stage:Stage)
	{
		super(sampler, stage);

		this._sampler = sampler;
	}

	public activate(index:number):void
	{
		this._stage.setSamplerState(index, false, this._sampler.smooth, this._sampler.mipmap);
	}
}