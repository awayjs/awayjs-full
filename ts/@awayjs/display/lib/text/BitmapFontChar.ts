import {TesselatedFontTable}			from "../text/TesselatedFontTable";
import {MaterialBase}					from "../materials/MaterialBase";
import {TriangleElements}				from "../graphics/TriangleElements";

/**
 * The TextFormat class represents character formatting information. Use the
 * TextFormat class to create specific text formatting for text fields. You
 * can apply text formatting to both static and dynamic text fields. The
 * properties of the TextFormat class apply to device and embedded fonts.
 * However, for embedded fonts, bold and italic text actually require specific
 * fonts. If you want to display bold or italic text with an embedded font,
 * you need to embed the bold and italic variations of that font.
 *
 * <p> You must use the constructor <code>new TextFormat()</code> to create a
 * TextFormat object before setting its properties. When you apply a
 * TextFormat object to a text field using the
 * <code>TextField.defaultTextFormat</code> property or the
 * <code>TextField.setTextFormat()</code> method, only its defined properties
 * are applied. Use the <code>TextField.defaultTextFormat</code> property to
 * apply formatting BEFORE you add text to the <code>TextField</code>, and the
 * <code>setTextFormat()</code> method to add formatting AFTER you add text to
 * the <code>TextField</code>. The TextFormat properties are <code>null</code>
 * by default because if you don't provide values for the properties, Flash
 * Player uses its own default formatting. The default formatting that Flash
 * Player uses for each property(if property's value is <code>null</code>) is
 * as follows:</p>
 *
 * <p>The default formatting for each property is also described in each
 * property description.</p>
 */
export class BitmapFontChar
{

	public id:string;
	public x:number;
	public y:number;
	public width:number;
	public height:number;
	public x_offset:number;
	public y_offset:number;
	public x_advance:number;
	public page:number;
	public channel:number;

	constructor(id:string, x:number,y:number, width:number,  height:number, xoff:number, yoff:number, xadv:number, page:number, channel: number)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.x_offset = xoff;
		this.y_offset = yoff;
		this.x_advance = xadv;
		this.page = page;
		this.channel = channel;
	}

}