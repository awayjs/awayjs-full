import {AS2SymbolAdapter}			from "../adapters/AS2SymbolAdapter";

import {IDisplayObjectAdapter}		from "@awayjs/display/lib/adapters/IDisplayObjectAdapter";
import {TextField}					from "@awayjs/display/lib/display/TextField";
import {View}						from "@awayjs/display/lib/View";

export class AS2TextFieldAdapter extends AS2SymbolAdapter implements IDisplayObjectAdapter
{
	private _embedFonts:boolean;

	constructor(adaptee:TextField, view:View)
	{
		// create an empty text field if none is passed
		super(adaptee || new TextField(), view);
	}

	public clone(newAdaptee:TextField):AS2TextFieldAdapter
	{
		return new AS2TextFieldAdapter(newAdaptee, this._view);
	}

	public get textColor():number
	{
		return (<TextField>this.adaptee).textColor;
	}

	public set textColor(value:number)
	{
		(<TextField>this.adaptee).textColor = value;
	}
	
	public get embedFonts():boolean
	{
		return this._embedFonts;
	}

	public set embedFonts(value:boolean)
	{
		this._embedFonts = value;
	}

	public get text():string
	{
		return (<TextField>this.adaptee).text;
	}

	public set text(value:string)
	{
		(<TextField>this.adaptee).text = value;
	}
}
export default AS2TextFieldAdapter;