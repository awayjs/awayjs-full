import {Sampler}				from "../../aglsl/assembler/Sampler";

export class SamplerMap
{

	private static _map:Object[];

	public static get map():Object[]
	{

		if (!SamplerMap._map) {

			SamplerMap._map = new Array<Object>();
			SamplerMap._map['rgba'] = new Sampler(8, 0xf, 0);
			SamplerMap._map['rg'] = new Sampler(8, 0xf, 5);
			SamplerMap._map['r'] = new Sampler(8, 0xf, 4);
			SamplerMap._map['compressed'] = new Sampler(8, 0xf, 1);
			SamplerMap._map['compressed_alpha'] = new Sampler(8, 0xf, 2);
			SamplerMap._map['dxt1'] = new Sampler(8, 0xf, 1);
			SamplerMap._map['dxt5'] = new Sampler(8, 0xf, 2);

			// dimension
			SamplerMap._map['2d'] = new Sampler(12, 0xf, 0);
			SamplerMap._map['cube'] = new Sampler(12, 0xf, 1);
			SamplerMap._map['3d'] = new Sampler(12, 0xf, 2);

			// special
			SamplerMap._map['centroid'] = new Sampler(16, 1, 1);
			SamplerMap._map['ignoresampler'] = new Sampler(16, 4, 4);

			// repeat
			SamplerMap._map['clamp'] = new Sampler(20, 0xf, 0);
			SamplerMap._map['repeat'] = new Sampler(20, 0xf, 1);
			SamplerMap._map['wrap'] = new Sampler(20, 0xf, 1);

			// mip
			SamplerMap._map['nomip'] = new Sampler(24, 0xf, 0);
			SamplerMap._map['mipnone'] = new Sampler(24, 0xf, 0);
			SamplerMap._map['mipnearest'] = new Sampler(24, 0xf, 1);
			SamplerMap._map['miplinear'] = new Sampler(24, 0xf, 2);

			// filter
			SamplerMap._map['nearest'] = new Sampler(28, 0xf, 0);
			SamplerMap._map['linear'] = new Sampler(28, 0xf, 1);

		}

		return SamplerMap._map;

	}

	/*
	 public static map =     [ new Sampler( 8, 0xf, 0 ),
	 new Sampler( 8, 0xf, 5 ),
	 new Sampler( 8, 0xf, 4 ),
	 new Sampler( 8, 0xf, 1 ),
	 new Sampler( 8, 0xf, 2 ),
	 new Sampler( 8, 0xf, 1 ),
	 new Sampler( 8, 0xf, 2 ),

	 // dimension
	 new Sampler( 12, 0xf, 0 ),
	 new Sampler( 12, 0xf, 1 ),
	 new Sampler( 12, 0xf, 2 ),

	 // special
	 new Sampler( 16, 1, 1 ),
	 new Sampler( 16, 4, 4 ),

	 // repeat
	 new Sampler( 20, 0xf, 0 ),
	 new Sampler( 20, 0xf, 1 ),
	 new Sampler( 20, 0xf, 1 ),

	 // mip
	 new Sampler( 24, 0xf, 0 ),
	 new Sampler( 24, 0xf, 0 ),
	 new Sampler( 24, 0xf, 1 ),
	 new Sampler( 24, 0xf, 2 ),

	 // filter
	 new Sampler( 28, 0xf, 0 ),
	 new Sampler( 28, 0xf, 1 ) ]
	 */
	/*
	 public static rgba: Sampler = new Sampler( 8, 0xf, 0 );
	 public static rg: Sampler = new Sampler( 8, 0xf, 5 );
	 public static r: Sampler = new Sampler( 8, 0xf, 4 );
	 public static compressed: Sampler = new Sampler( 8, 0xf, 1 );
	 public static compressed_alpha: Sampler = new Sampler( 8, 0xf, 2 );
	 public static dxt1: Sampler = new Sampler( 8, 0xf, 1 );
	 public static dxt5: Sampler = new Sampler( 8, 0xf, 2 );

	 // dimension
	 public static sampler2d: Sampler = new Sampler( 12, 0xf, 0 );
	 public static cube: Sampler = new Sampler( 12, 0xf, 1 );
	 public static sampler3d: Sampler = new Sampler( 12, 0xf, 2 );

	 // special
	 public static centroid: Sampler = new Sampler( 16, 1, 1 );
	 public static ignoresampler: Sampler = new Sampler( 16, 4, 4 );

	 // repeat
	 public static clamp: Sampler = new Sampler( 20, 0xf, 0 );
	 public static repeat: Sampler = new Sampler( 20, 0xf, 1 );
	 public static wrap: Sampler = new Sampler( 20, 0xf, 1 );

	 // mip
	 public static nomip: Sampler = new Sampler( 24, 0xf, 0 );
	 public static mipnone: Sampler = new Sampler( 24, 0xf, 0 );
	 public static mipnearest: Sampler = new Sampler( 24, 0xf, 1 );
	 public static miplinear: Sampler = new Sampler( 24, 0xf, 2 );

	 // filter
	 public static nearest: Sampler = new Sampler( 28, 0xf, 0 );
	 public static linear: Sampler = new Sampler( 28, 0xf, 1 );
	 */
	constructor()
	{
	}
}