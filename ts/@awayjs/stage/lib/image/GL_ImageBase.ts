import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {IAsset}						from "@awayjs/core/lib/library/IAsset";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {Stage}						from "../base/Stage";
import {ITextureBase}					from "../base/ITextureBase";

/**
 *
 * @class away.pool.GL_ImageBase
 */
export class GL_ImageBase extends AbstractionBase
{
	public usages:number = 0;

	public _texture:ITextureBase;

	public _mipmap:boolean;

	public _stage:Stage;

	public get texture():ITextureBase
	{
		if (!this._texture) {
			this._createTexture();
			this._invalid = true;
		}

		return this._texture;
	}

	constructor(asset:IAsset, stage:Stage)
	{
		super(asset, stage);

		this._stage = stage;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		if (this._texture) {
			this._texture.dispose();
			this._texture = null;
		}
	}

	public activate(index:number, mipmap:boolean):void
	{
		this._stage.context.setTextureAt(index, this._texture);
	}

	public _createTexture():void
	{
		throw new AbstractMethodError();
	}
}