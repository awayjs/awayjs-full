import {AssetBase}					from "@awayjs/core/lib/library/AssetBase";

import {BitmapFontChar}			from "../text/BitmapFontChar";
import {IFontTable}				from "../text/IFontTable";
import {BitmapImage2D}			from "@awayjs/core/lib/image/BitmapImage2D";
import {AbstractMethodError}		from "@awayjs/core/lib/errors/AbstractMethodError";
/**
 * GraphicBase wraps a TriangleElements as a scene graph instantiation. A GraphicBase is owned by a Sprite object.
 *
 *
 * @see away.base.TriangleElements
 * @see away.entities.Sprite
 *
 * @class away.base.GraphicBase
 */
export class BitmapFontTable extends AssetBase implements IFontTable
{
	public static assetType:string = "[asset BitmapFontTable]";
	private _font_chars:Array<BitmapFontChar>;
	public _init_size:number;
	public _current_size:number;
	public _size_multiply:number;
	private _bitmap_pages:Array<BitmapImage2D>;
	public _font_chars_dic:Object;
	private _font_em_size:number;
	private _whitespace_width:number;
	private _offset_x:number;
	private _offset_y:number;
	private _ascent:number;
	private _descent:number;
	private _charDictDirty:Boolean;
	//TODO test shader picking
//		public get shaderPickingDetails():boolean
//		{
//
//			return this.sourceEntity.shaderPickingDetails;
//		}

	/**
	 * Creates a new TesselatedFont object
	 */
	constructor()
	{
		super();
		this._font_chars = [];
		this._bitmap_pages = [];
		this._font_chars_dic = new Object();
		this._ascent=0;
		this._descent=0;
		this._current_size=0;
		this._size_multiply=0;
		this._init_size=0;
	}

	public get assetType():string
	{
		return BitmapFontTable.assetType;
	}

	public initFontSize(font_size:number)
	{
		if(this._current_size==font_size) return;
		this._current_size = font_size;
		this._size_multiply= font_size/this._init_size;
	}

	public getCharDataCanvas(char_code:string):Array<number>
	{
		var this_char:BitmapFontChar=this._font_chars_dic[char_code];
		if(this_char){
			//console.log("this_char found");
			return [this_char.x, this_char.y, this_char.width, this_char.height, this_char.x_offset*this._size_multiply, this_char.y_offset*this._size_multiply];
		}
		//console.log("this_char not found" + char_code);
		return [];
	}
	public getCharData(char_code:string):Array<number>
	{
		var this_char:BitmapFontChar=this._font_chars_dic[char_code];
		if(this_char){
			//console.log("this_char found");
			return [this_char.x/256, this_char.y/256, this_char.width/256, this_char.height/256, this_char.x_offset*this._size_multiply, this_char.y_offset*this._size_multiply];
		}
		//console.log("this_char not found" + char_code);
		return [];
	}
	public getCharVertCnt(char_code:string):number
	{
		return 6*4;
	}
	public getCharWidth(char_code:string):number
	{
		var this_char:BitmapFontChar=this._font_chars_dic[char_code];
		if(this_char)
			return this._size_multiply*this_char.x_advance;
		return 0;
	}

	public getLineHeight():number
	{
		return this._current_size;
	}

	/**
	 *
	 */
	public dispose()
	{

	}

	public add_page(image:BitmapImage2D) {
		this._bitmap_pages.push(image);
	}
	public get_page(idx:number=0):BitmapImage2D {
		return this._bitmap_pages[idx];
	}
	get ascent():number {
		return this._ascent;
	}

	set ascent(value:number){
		this._ascent=value;
	}
	get descent():number {
		return this._descent;
	}

	set descent(value:number){
		this._descent=value;
	}

	get offset_x():number {
		return this._offset_x;
	}

	set offset_x(value:number){
		this._offset_x=value;
	}
	get offset_y():number {
		return this._offset_y;
	}

	set offset_y(value:number){
		this._offset_y=value;
	}
	public get_font_chars():Array<BitmapFontChar>
	{
		return this._font_chars
	}
	public get_font_em_size():number
	{
		return this._font_em_size
	}
	public set_whitespace_width(value:number):void
	{
		this._whitespace_width=value;
	}
	public get_whitespace_width():number
	{
		return this._whitespace_width
	}
	public set_font_em_size(font_em_size:number):void
	{
		this._font_em_size=font_em_size;
	}
	/**
	 *
	 */
	public getChar(name:string):BitmapFontChar
	{
		return this._font_chars_dic[name];
	}
	/**
	 *
	 */
	public setChar(id:string, x:number,y:number, width:number,  height:number, xoff:number, yoff:number, xadv:number, page:number, channel: number):void
	{
		var bitmap_font_char:BitmapFontChar = new BitmapFontChar(id, x, y, width, height, xoff, yoff, xadv, page, channel);
		this._font_chars.push(bitmap_font_char);
		this._font_chars_dic[id]=bitmap_font_char;
	}

}