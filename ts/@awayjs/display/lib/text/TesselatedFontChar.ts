import {AttributesBuffer}			from "@awayjs/core/lib/attributes/AttributesBuffer";


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
export class TesselatedFontChar
{

	/**
	 * The width of the char
	 */
	public char_width:number;

	/**
	 * Elements for this char
	 */
	public stroke_data:AttributesBuffer;
	public fill_data:AttributesBuffer;

	/**
	 * the char_codes that this geom has kerning set for
	 */
	public kerningCharCodes:Array<number>=[];
	/**
	 * the kerning values per char_code
	 */
	public kerningValues:Array<number>=[];


	constructor(fill_data:AttributesBuffer=null, stroke_data:AttributesBuffer=null)
	{
		this.fill_data = fill_data;
		this.stroke_data = stroke_data;
	}

}