import {Image2D}						from "@awayjs/core/lib/image/Image2D";

import {ContextGLTextureFormat}		from "../base/ContextGLTextureFormat";
import {GL_ImageBase}					from "../image/GL_ImageBase";

/**
 *
 * @class away.pool.GL_ImageBase
 */
export class GL_Image2D extends GL_ImageBase
{
	/**
	 *
	 * @param context
	 * @returns {ITexture}
	 */
	public _createTexture():void
	{
		this._texture = this._stage.context.createTexture((<Image2D> this._asset).width, (<Image2D> this._asset).height, ContextGLTextureFormat.BGRA, true);
	}
}