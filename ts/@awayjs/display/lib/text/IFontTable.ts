import {IAsset}					from "@awayjs/core/lib/library/IAsset";

/**
 */
export interface IFontTable extends IAsset
{
	initFontSize(font_size:number);
	getCharWidth(char_code:string);
	getCharVertCnt(char_code:string);
	getLineHeight();
}