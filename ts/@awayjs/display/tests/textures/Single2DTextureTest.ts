import BitmapImage2D		from "@awayjs/core/lib/image/BitmapImage2D";
import Rectangle			from "@awayjs/core/lib/geom/Rectangle";
import URLLoader			from "@awayjs/core/lib/net/URLLoader";
import URLLoaderDataFormat	from "@awayjs/core/lib/net/URLLoaderDataFormat";
import URLRequest			from "@awayjs/core/lib/net/URLRequest";
import LoaderEvent			from "@awayjs/core/lib/events/LoaderEvent";
import ParserUtils			from "@awayjs/core/lib/parsers/ParserUtils";
import Debug				from "@awayjs/core/lib/utils/Debug";

import Single2DTexture		from "awayjs-display/lib/textures/Single2DTexture";

class Single2DTextureTest
{
	private mipLoader:URLLoader;
	private bitmapData:BitmapImage2D;
	private target:Single2DTexture;

	constructor()
	{
		//---------------------------------------
		// Load a PNG

		var mipUrlRequest = new URLRequest('assets/1024x1024.png');
		this.mipLoader  = new URLLoader();
		this.mipLoader.dataFormat = URLLoaderDataFormat.BLOB;
		this.mipLoader.load(mipUrlRequest);
		this.mipLoader.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => this.mipImgLoaded(event));

	}

	private mipImgLoaded(event:LoaderEvent)
	{

		var loader:URLLoader = event.target;
		var image:HTMLImageElement = ParserUtils.blobToImage(loader.data);
		image.onload = (event) => this.onImageLoad(event);
	}

	private onImageLoad(event)
	{
		var image:HTMLImageElement = <HTMLImageElement> event.target;

		var rect:Rectangle = new Rectangle(0, 0, image.width, image.height);

		console.log('LoaderEvent', image);

		this.bitmapData = new BitmapImage2D(image.width , image.height);
		this.bitmapData.draw(image);

		this.target = new Single2DTexture(this.bitmapData);

		Debug.log('BitmapImage2D', this.bitmapData);
		Debug.log('Single2DTexture', this.target);
	}
}