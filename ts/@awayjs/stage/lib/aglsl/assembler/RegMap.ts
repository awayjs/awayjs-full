
class Reg
{

	public code:number;
	public desc:string;

	constructor(code:number, desc:string)
	{
		this.code = code;
		this.desc = desc;
	}
}

export class RegMap
{

	/*
	 public static map = [ new Reg( 0x00, "vertex attribute" ),
	 new Reg( 0x01, "fragment constant" ),
	 new Reg( 0x01, "vertex constant" ),
	 new Reg( 0x02, "fragment temporary" ),
	 new Reg( 0x02, "vertex temporary" ),
	 new Reg( 0x03, "vertex output" ),
	 new Reg( 0x03, "vertex output" ),
	 new Reg( 0x03, "fragment depth output" ),
	 new Reg( 0x03, "fragment output" ),
	 new Reg( 0x03, "fragment output" ),
	 new Reg( 0x04, "varying" ),
	 new Reg( 0x04, "varying output" ),
	 new Reg( 0x04, "varying input" ),
	 new Reg( 0x05, "sampler" ) ];
	 */

	private static _map:any[];
	public static get map():any[]
	{

		if (!RegMap._map) {

			RegMap._map = new Array<Object>();
			RegMap._map['va'] = new Reg(0x00, "vertex attribute");
			RegMap._map['fc'] = new Reg(0x01, "fragment constant");
			RegMap._map['vc'] = new Reg(0x01, "vertex constant");
			RegMap._map['ft'] = new Reg(0x02, "fragment temporary");
			RegMap._map['vt'] = new Reg(0x02, "vertex temporary");
			RegMap._map['vo'] = new Reg(0x03, "vertex output");
			RegMap._map['op'] = new Reg(0x03, "vertex output");
			RegMap._map['fd'] = new Reg(0x03, "fragment depth output");
			RegMap._map['fo'] = new Reg(0x03, "fragment output");
			RegMap._map['oc'] = new Reg(0x03, "fragment output");
			RegMap._map['v'] = new Reg(0x04, "varying");
			RegMap._map['vi'] = new Reg(0x04, "varying output");
			RegMap._map['fi'] = new Reg(0x04, "varying input");
			RegMap._map['fs'] = new Reg(0x05, "sampler");


		}

		return RegMap._map;

	}

	/*
	 public static va:Reg = new Reg( 0x00, "vertex attribute" );
	 public static fc:Reg = new Reg( 0x01, "fragment constant" );
	 public static vc:Reg = new Reg( 0x01, "vertex constant" );
	 public static ft:Reg = new Reg( 0x02, "fragment temporary" );
	 public static vt:Reg = new Reg( 0x02, "vertex temporary" );
	 public static vo:Reg = new Reg( 0x03, "vertex output" );
	 public static op:Reg = new Reg( 0x03, "vertex output" );
	 public static fd:Reg = new Reg( 0x03, "fragment depth output" );
	 public static fo:Reg = new Reg( 0x03, "fragment output" );
	 public static oc:Reg = new Reg( 0x03, "fragment output" );
	 public static v: Reg = new Reg( 0x04, "varying" );
	 public static vi:Reg = new Reg( 0x04, "varying output" );
	 public static fi:Reg = new Reg( 0x04, "varying input" );
	 public static fs:Reg = new Reg( 0x05, "sampler" );
	 */
	constructor()
	{
	}
}