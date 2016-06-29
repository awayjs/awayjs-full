import {TesselatedFontTable}					from "../text/TesselatedFontTable";


export class DefaultFontManager
{
	private static _default_font_table:TesselatedFontTable;

	public static getDefaultFontTable():TesselatedFontTable
	{
		if(DefaultFontManager._default_font_table==null){
			DefaultFontManager.createDefaultFontTable();
		}
		return DefaultFontManager._default_font_table;
	}


	private static createDefaultFontTable():void
	{
		/*
		var allchars=[];
		//allchars[cnt1++] = ['33',[0,0,226,67,0,192,11,68,127,127,0,0,0,128,177,67,0,80,137,68,127,127,0,0,0,0,212,67,0,192,204,68,127,127,0,0,0,0,212,67,0,192,204,68,127,127,0,0,0,128,177,67,0,80,137,68,127,127,0,0,0,0,129,67,0,192,204,68,127,127,0,0,0,0,129,67,0,192,204,68,127,127,0,0,0,128,177,67,0,80,137,68,127,127,0,0,0,0,100,67,0,192,11,68,127,127,0,0,0,0,100,67,0,192,11,68,127,127,0,0,0,128,177,67,0,80,137,68,127,127,0,0,0,0,226,67,0,192,11,68,127,127,0,0,0,0,221,67,0,0,0,69,127,127,0,0,0,0,170,67,0,208,242,68,127,127,0,0,0,0,110,67,0,0,0,69,127,127,0,0,0,0,110,67,0,0,0,69,127,127,0,0,0,0,170,67,0,208,242,68,127,127,0,0,0,0,110,67,0,160,229,68,127,127,0,0,0,0,110,67,0,160,229,68,127,127,0,0,0,0,170,67,0,208,242,68,127,127,0,0,0,0,221,67,0,160,229,68,127,127,0,0,0,0,221,67,0,160,229,68,127,127,0,0,0,0,170,67,0,208,242,68,127,127,0,0,0,0,221,67,0,0,0,69,127,127]]
		var i:number=0;
		for(i=0; i<cnt1;i++){
			var vertexBuffer:AttributesBuffer = new AttributesBuffer(20, allchars[i][1].length / 20);
			vertexBuffer.bufferView = new Uint8Array(<ArrayBuffer> allchars[i][1]);

			var curve_elements:TriangleElements = new TriangleElements(vertexBuffer);

			curve_elements.setPositions(new Float2Attributes(vertexBuffer));
			curve_elements.setCustomAttributes("curves", new Float3Attributes(vertexBuffer));

			//add UVs if they exist in the data
			if (attr_count == 28)
				curve_elements.setUVs(new Float2Attributes(vertexBuffer));

			new_font_style.setChar(font_style_char.toString(), curve_elements, char_width);
			DefaultFontManager._default_font_table = new TesselatedFontTable();
		}
		*/
		//DefaultFontManager._default_font_table.
	}

}