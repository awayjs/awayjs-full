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
import {Font}							from "@awayjs/display/lib/text/Font";
import {TesselatedFontTable}			from "@awayjs/display/lib/text/TesselatedFontTable";
import {IFontTable}						from "@awayjs/display/lib/text/IFontTable";

var opentype;
/**
 * FontParser should parse Fonts into TesselatedFontTable for usage with webGL, or just load the Font as css class for usage with canvas and no webGL
 */
export class FontParser extends ParserBase
{
	private _useWebGL:boolean=false;
	/**
	 * Creates a new TextureAtlasParser object.
	 * @param uri The url or id of the data or file to be parsed.
	 * @param extra The holder for extra contextual data that the parser might need.
	 */
	constructor(useWebGL:boolean=true)
	{
		super(URLLoaderDataFormat.ARRAY_BUFFER);
		this._useWebGL=useWebGL;
	}

	/**
	 * Indicates whether or not a given file extension is supported by the parser.
	 * @param extension The file extension of a potential file to be parsed.
	 * @return Whether or not the given file type is supported.
	 */

	public static supportsType(extension:string):boolean
	{
		extension = extension.toLowerCase();
		var supports:boolean = ((extension == "ttf")||(extension == "otf"));
		if(supports){
			console.log("FontParse encountered file with supported extension: = " + extension);
		}
		return ((extension == "ttf")||(extension == "otf"));
	}

	/**
	 * Tests whether a data block can be parsed by the parser.
	 * @param data The data block to potentially be parsed.
	 * @return Whether or not the given data is supported.
	 */
	public static supportsData(data:any):boolean
	{

		console.log("ParserFont = "+ParserUtils.toString(data, 20));
		try {
			/*
			var content:string = ParserUtils.toString(data);
			if(content.indexOf("font") != -1 || content.indexOf("Font") != -1){
				console.log("supportsData fnt");
				return true;

			}
			*/

			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependency(resourceDependency:ResourceDependency)
	{
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependencyFailure(resourceDependency:ResourceDependency)
	{
	}


	private sortKeys(dict) {
		var keys = [];
		for (var key in dict) {
			keys.push(key);
		}
		keys.sort();
		return keys;
	}
	/**
	 * @inheritDoc
	 */
	public _pProceedParsing():boolean
	{
		//console.log("proceed parsing = "+this._iFileName);

		opentype=window["opentype"];
		if(opentype){
			//console.log("parsing font = "+this._iFileName+" / bytelength = "+this._pGetByteData().getBytesAvailable());
			var font_name:string="";
			var font_style_name:string="";
			var font = opentype.parse(this.data);
			var tablename, table, property, value, fontname;
			var head = font.tables.head;
			/*
			*/
			for (tablename in font.tables) {
				table = font.tables[tablename];
				if (tablename == 'name') {
					var properties = this.sortKeys(table);
					for (var i = 0; i < properties.length; i++) {
						var property = properties[i];
						var translations = table[property];
						var langs = this.sortKeys(translations);
						for (var j = 0; j < langs.length; j++) {
							var lang = langs[j];
							if(property=="fontFamily"){
								font_name=translations[lang];
							}
							else if(property=="fontSubfamily"){
								font_style_name=translations[lang];
							}
							console.log("    "+property+": "+lang+" : "+translations[lang]);
						}
					}
				}
			}
			if(font_name==""){
				console.log("FontParser.ts '"+this._iFileName+"': Could not read fontname !!!")
			}
			if(font_style_name==""){
				console.log("FontParser.ts '"+this._iFileName+"': Could not read font_style_name !!!")
			}

			var new_font:Font=<Font>AssetLibrary.getAsset(font_name);
			var newfont:Boolean = false;
			if(new_font==undefined){
				new_font = new Font();
				newfont=true;
			}
			new_font.name=font_name;
			var new_font_style:TesselatedFontTable = <TesselatedFontTable>new_font.get_font_table(font_style_name, TesselatedFontTable.assetType, font);
			/*
			for(var i=0; i<font.numGlyphs; i++){
				console.log("glyph: "+i);
				var glyph = font.glyphs.get(i);
				console.log("       glyph: "+glyph);
				console.log("       glyph.name: "+glyph.name);
				console.log("       glyph.unicode: "+glyph.unicode);
				console.log("       glyph.unicodes: "+glyph.unicodes.length);
				console.log("       glyph.advanceWidth: "+glyph.advanceWidth);
				var path = glyph.getPath();
				console.log("       path "+path.commands.length);
				var contours  = glyph.getContours ();
				console.log("       contours: "+contours.length);

			}
			*/
		}
		if(document){
			var s = document.createElement('style');
			s.type = "text/css";
			document.getElementsByTagName('head')[0].appendChild(s);
			s.style.cssText = "@font-face {\
					font-family: ''"+this._iFileName+"';\
					src: url('"+this._iFileName+"');\
					};";
		}
		this._pFinalizeAsset(<IAsset>new_font, new_font.name);
		return ParserBase.PARSING_DONE;
	}
}
