import {BitmapImage2D}			from "@awayjs/core/lib/image/BitmapImage2D";
import {IAsset}					from "@awayjs/core/lib/library/IAsset";
import {AssetLibrary}			from "@awayjs/core/lib/library/AssetLibrary";
import {URLLoaderDataFormat}	from "@awayjs/core/lib/net/URLLoaderDataFormat";
import {URLRequest}				from "@awayjs/core/lib/net/URLRequest";
import {ParserBase}				from "@awayjs/core/lib/parsers/ParserBase";
import {ParserUtils}			from "@awayjs/core/lib/parsers/ParserUtils";
import {ResourceDependency}		from "@awayjs/core/lib/parsers/ResourceDependency";
import {XmlUtils}				from "@awayjs/core/lib/utils/XmlUtils";
import {BitmapFontTable}		from "@awayjs/display/lib/text/BitmapFontTable";
import {Font}					from "@awayjs/display/lib/text/Font";

/**
 * TextureAtlasParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
 * a loader object, it wraps it in a BitmapImage2DResource so resource management can happen consistently without
 * exception cases.
 */
export class FNTParser extends ParserBase
{
	private _doc:Node;
	private _imagePath:string;
	private _bitmapFontTable:BitmapFontTable;
	private _font:Font;
	private _chars:NodeList;
	private _parseState:number = 0;

	/**
	 * Creates a new TextureAtlasParser object.
	 * @param uri The url or id of the data or file to be parsed.
	 * @param extra The holder for extra contextual data that the parser might need.
	 */
	constructor()
	{
		super(URLLoaderDataFormat.TEXT);
	}

	/**
	 * Indicates whether or not a given file extension is supported by the parser.
	 * @param extension The file extension of a potential file to be parsed.
	 * @return Whether or not the given file type is supported.
	 */

	public static supportsType(extension:string):boolean
	{
		extension = extension.toLowerCase();
		var supports:boolean=extension == "fnt";
		if(supports){
			console.log("supportsType fnt = "+extension);
		}
		return extension == "fnt";
	}

	/**
	 * Tests whether a data block can be parsed by the parser.
	 * @param data The data block to potentially be parsed.
	 * @return Whether or not the given data is supported.
	 */
	public static supportsData(data:any):boolean
	{
		try {
			var content:string = ParserUtils.toString(data);
			if(content.indexOf("font") != -1 || content.indexOf("Font") != -1){
				console.log("supportsData fnt");
				return true;

			}

			return false;
		} catch (e) {
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependency(resourceDependency:ResourceDependency)
	{
		if(resourceDependency.assets.length) {
			this._bitmapFontTable.add_page(<BitmapImage2D> resourceDependency.assets[0]);
			this._pFinalizeAsset(<BitmapImage2D> resourceDependency.assets[0]);
			this._parseState = FNTParserState.PARSE_CHARS;
		} else {
			this._parseState = FNTParserState.PARSE_COMPLETE;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependencyFailure(resourceDependency:ResourceDependency)
	{
		this._parseState = FNTParserState.PARSE_COMPLETE;
	}

	/**
	 * @inheritDoc
	 */
	public _pProceedParsing():boolean
	{
		var nodes:NodeList;

		switch(this._parseState) {
			case FNTParserState.PARSE_XML:
				try {
					this._doc = XmlUtils.getChildrenWithTag(XmlUtils.strToXml(this._pGetTextData()), "font")[0];
					var page_node:Node = XmlUtils.getChildrenWithTag(this._doc, "pages")[0];
					var all_pages:NodeList = XmlUtils.getChildrenWithTag(page_node, "page");
					var len:number = all_pages.length;
					// todo: correctly support multiple pages
					for (var i:number = 0; i < len; i++) {
						this._imagePath = XmlUtils.readAttributeValue(all_pages[i], "file");
					}
					var char_node:Node = XmlUtils.getChildrenWithTag(this._doc, "chars")[0];
					this._chars = XmlUtils.getChildrenWithTag(char_node, "char");
					this._parseState = FNTParserState.PARSE_IMAGE;
					var info_node:Node = XmlUtils.getChildrenWithTag(this._doc, "info")[0];
					var common_node:Node = XmlUtils.getChildrenWithTag(this._doc, "common")[0];

					var font_name:string = XmlUtils.readAttributeValue(info_node, "face");
					this._font = <Font>AssetLibrary.getAsset(font_name);
					if(this._font==undefined){
						this._font = new Font();
						this._font.name=font_name;
					}
					var bold:string = XmlUtils.readAttributeValue(info_node, "bold");
					if(bold!="0") font_name+="_bold";
					var italic:string = XmlUtils.readAttributeValue(info_node, "italic");
					if(italic!="0") font_name+="_italic";
					this._bitmapFontTable = <BitmapFontTable> this._font.get_font_table(font_name, BitmapFontTable.assetType);
					
					var size:string = XmlUtils.readAttributeValue(info_node, "size");
					this._bitmapFontTable._init_size=parseInt(size);

				} catch(Error) {
					return ParserBase.PARSING_DONE;
				}
				break;

			case FNTParserState.PARSE_IMAGE:
				if (this._imagePath){
					this._pAddDependency(this._imagePath, new URLRequest(this._imagePath));
					this._pPauseAndRetrieveDependencies();
				} else {
					return ParserBase.PARSING_DONE;
				}

				break;

			case FNTParserState.PARSE_CHARS:
				var element:Node;
				var x, y, width, height, xoff, yoff, xadv, page, chnl:number;
				var id:string;
				var len:number = this._chars.length;
				for (var i:number = 0; i < len; i++) {
					element = this._chars[i];
					x = parseInt(XmlUtils.readAttributeValue(element, "x"));
					y = parseInt(XmlUtils.readAttributeValue(element, "y"));
					width = parseInt(XmlUtils.readAttributeValue(element, "width"));
					height = parseInt(XmlUtils.readAttributeValue(element, "height"));
					xoff = parseInt(XmlUtils.readAttributeValue(element, "xoffset"));
					yoff = parseInt(XmlUtils.readAttributeValue(element, "yoffset"));
					xadv = parseInt(XmlUtils.readAttributeValue(element, "xadvance"));
					page = parseInt(XmlUtils.readAttributeValue(element, "page"));
					chnl = parseInt(XmlUtils.readAttributeValue(element, "chnl"));
					id = XmlUtils.readAttributeValue(element, "id");
					this._bitmapFontTable.setChar(id, x, y, width, height, xoff, yoff, xadv, page, chnl);
				}
				this._pFinalizeAsset(<IAsset>this._font, this._font.name);
				this._parseState = FNTParserState.PARSE_COMPLETE;
				break;

			case FNTParserState.PARSE_COMPLETE:
				return ParserBase.PARSING_DONE;
		}

		return ParserBase.MORE_TO_PARSE;
	}
}


class FNTParserState {
	public static PARSE_XML:number = 0;
	public static PARSE_IMAGE:number = 1;
	public static PARSE_CHARS:number = 2;
	public static PARSE_COMPLETE:number = 3;
}