import {GL_ImageCube}					from "../image/GL_ImageCube";

/**
 *
 * @class away.pool.ImageObjectBase
 */
export class GL_RenderImageCube extends GL_ImageCube
{
	public activate(index:number, mipmap:boolean):void
	{
		super.activate(index, false);

		//TODO: allow automatic mipmap generation

	}
}