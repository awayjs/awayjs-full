import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {MipmapGenerator}				from "@awayjs/core/lib/utils/MipmapGenerator";

import {GL_Image2D}					from "../image/GL_Image2D";
import {ITexture}						from "../base/ITexture";

/**
 *
 * @class away.pool.ImageObjectBase
 */
export class GL_BitmapImage2D extends GL_Image2D
{
	private _mipmapData:Array<BitmapImage2D>;

	public activate(index:number, mipmap:boolean):void
	{
		if (mipmap && this._stage.globalDisableMipmap)
			mipmap = false;
		
		if (!this._texture) {
			this._createTexture();
			this._invalid = true;
		}

		if (!this._mipmap && mipmap) {
			this._mipmap = true;
			this._invalid = true;
		}

		if (this._invalid) {
			this._invalid = false;
			if (mipmap) {
				var mipmapData:Array<BitmapImage2D> = this._mipmapData || (this._mipmapData = new Array<BitmapImage2D>());

				MipmapGenerator._generateMipMaps((<BitmapImage2D> this._asset).getCanvas(), mipmapData, true);
				var len:number = mipmapData.length;
				for (var i:number = 0; i < len; i++)
					(<ITexture> this._texture).uploadFromData(mipmapData[i].getImageData(), i);
			} else {
				(<ITexture> this._texture).uploadFromData((<BitmapImage2D> this._asset).getImageData(), 0);
			}
		}

		super.activate(index, mipmap);
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		if (this._mipmapData) {
			var len:number = this._mipmapData.length;
			for (var i:number = 0; i < len; i++)
				MipmapGenerator._freeMipMapHolder(this._mipmapData[i]);
		}
	}
}