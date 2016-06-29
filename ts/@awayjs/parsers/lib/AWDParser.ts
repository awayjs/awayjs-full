import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {Short3Attributes}				from "@awayjs/core/lib/attributes/Short3Attributes";
import {Float3Attributes}				from "@awayjs/core/lib/attributes/Float3Attributes";
import {Float2Attributes}				from "@awayjs/core/lib/attributes/Float2Attributes";
import {Byte4Attributes}				from "@awayjs/core/lib/attributes/Byte4Attributes";

import {BitmapImage2D}					from "@awayjs/core/lib/image/BitmapImage2D";
import {BitmapImageCube}				from "@awayjs/core/lib/image/BitmapImageCube";
import {BlendMode}						from "@awayjs/core/lib/image/BlendMode";
import {Sampler2D}						from "@awayjs/core/lib/image/Sampler2D";
import {WaveAudio}						from "@awayjs/core/lib/audio/WaveAudio";
import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {URLLoaderDataFormat}			from "@awayjs/core/lib/net/URLLoaderDataFormat";
import {URLRequest}						from "@awayjs/core/lib/net/URLRequest";
import {IAsset}							from "@awayjs/core/lib/library/IAsset";
import {ParserBase}						from "@awayjs/core/lib/parsers/ParserBase";
import {ParserUtils}					from "@awayjs/core/lib/parsers/ParserUtils";
import {ResourceDependency}				from "@awayjs/core/lib/parsers/ResourceDependency";
import {ProjectionBase}					from "@awayjs/core/lib/projections/ProjectionBase";
import {PerspectiveProjection}			from "@awayjs/core/lib/projections/PerspectiveProjection";
import {OrthographicProjection}			from "@awayjs/core/lib/projections/OrthographicProjection";
import {OrthographicOffCenterProjection}from "@awayjs/core/lib/projections/OrthographicOffCenterProjection";
import {ByteArray}						from "@awayjs/core/lib/utils/ByteArray";
import {Point}							from "@awayjs/core/lib/geom/Point";

import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import {DisplayObjectContainer}			from "@awayjs/display/lib/display/DisplayObjectContainer";
import {View}							from "@awayjs/display/lib/View";
import {DisplayObject}					from "@awayjs/display/lib/display/DisplayObject";
import {LightBase}						from "@awayjs/display/lib/display/LightBase";
import {Graphics}						from "@awayjs/display/lib/graphics/Graphics";
import {TriangleElements}				from "@awayjs/display/lib/graphics/TriangleElements";
import {ElementsBase}					from "@awayjs/display/lib/graphics/ElementsBase";
import {DirectionalLight}				from "@awayjs/display/lib/display/DirectionalLight";
import {PointLight}						from "@awayjs/display/lib/display/PointLight";
import {Camera}							from "@awayjs/display/lib/display/Camera";
import {Sprite}							from "@awayjs/display/lib/display/Sprite";
import {TextField}						from "@awayjs/display/lib/display/TextField";
import {Billboard}						from "@awayjs/display/lib/display/Billboard";
import {Skybox}							from "@awayjs/display/lib/display/Skybox";
import {DefaultMaterialManager}			from "@awayjs/display/lib/managers/DefaultMaterialManager";
import {MaterialBase}					from "@awayjs/display/lib/materials/MaterialBase";
import {LightPickerBase}				from "@awayjs/display/lib/materials/lightpickers/LightPickerBase";
import {StaticLightPicker}				from "@awayjs/display/lib/materials/lightpickers/StaticLightPicker";
import {CubeMapShadowMapper}			from "@awayjs/display/lib/materials/shadowmappers/CubeMapShadowMapper";
import {DirectionalShadowMapper}		from "@awayjs/display/lib/materials/shadowmappers/DirectionalShadowMapper";
import {ShadowMapperBase}				from "@awayjs/display/lib/materials/shadowmappers/ShadowMapperBase";

import {PrefabBase}						from "@awayjs/display/lib/prefabs/PrefabBase";
import {PrimitivePrefabBase}			from "@awayjs/display/lib/prefabs/PrimitivePrefabBase";
import {PrimitiveCapsulePrefab}			from "@awayjs/display/lib/prefabs/PrimitiveCapsulePrefab";
import {PrimitiveConePrefab}			from "@awayjs/display/lib/prefabs/PrimitiveConePrefab";
import {PrimitiveCubePrefab}			from "@awayjs/display/lib/prefabs/PrimitiveCubePrefab";
import {PrimitiveCylinderPrefab}		from "@awayjs/display/lib/prefabs/PrimitiveCylinderPrefab";
import {PrimitivePlanePrefab}			from "@awayjs/display/lib/prefabs/PrimitivePlanePrefab";
import {PrimitiveSpherePrefab}			from "@awayjs/display/lib/prefabs/PrimitiveSpherePrefab";
import {PrimitiveTorusPrefab}			from "@awayjs/display/lib/prefabs/PrimitiveTorusPrefab";
import {SingleCubeTexture}				from "@awayjs/display/lib/textures/SingleCubeTexture";
import {Single2DTexture}				from "@awayjs/display/lib/textures/Single2DTexture";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {AnimationSetBase}				from "@awayjs/renderer/lib/animators/AnimationSetBase";
import {AnimatorBase}					from "@awayjs/renderer/lib/animators/AnimatorBase";
import {VertexAnimationSet}				from "@awayjs/renderer/lib/animators/VertexAnimationSet";
import {VertexAnimator}					from "@awayjs/renderer/lib/animators/VertexAnimator";
import {SkeletonAnimationSet}			from "@awayjs/renderer/lib/animators/SkeletonAnimationSet";
import {SkeletonAnimator}				from "@awayjs/renderer/lib/animators/SkeletonAnimator";
import {JointPose}						from "@awayjs/renderer/lib/animators/data/JointPose";
import {Skeleton}						from "@awayjs/renderer/lib/animators/data/Skeleton";
import {SkeletonPose}					from "@awayjs/renderer/lib/animators/data/SkeletonPose";
import {SkeletonJoint}					from "@awayjs/renderer/lib/animators/data/SkeletonJoint";
import {SkeletonClipNode}				from "@awayjs/renderer/lib/animators/nodes/SkeletonClipNode";
import {VertexClipNode}					from "@awayjs/renderer/lib/animators/nodes/VertexClipNode";
import {AnimationClipNodeBase}			from "@awayjs/renderer/lib/animators/nodes/AnimationClipNodeBase";

import {MethodMaterialMode}				from "@awayjs/materials/lib/MethodMaterialMode";
import {MethodMaterial}					from "@awayjs/materials/lib/MethodMaterial";
import {AmbientEnvMapMethod}			from "@awayjs/materials/lib/methods/AmbientEnvMapMethod";
import {DiffuseDepthMethod}				from "@awayjs/materials/lib/methods/DiffuseDepthMethod";
import {DiffuseCelMethod}				from "@awayjs/materials/lib/methods/DiffuseCelMethod";
import {DiffuseGradientMethod}			from "@awayjs/materials/lib/methods/DiffuseGradientMethod";
import {DiffuseLightMapMethod}			from "@awayjs/materials/lib/methods/DiffuseLightMapMethod";
import {DiffuseWrapMethod}				from "@awayjs/materials/lib/methods/DiffuseWrapMethod";
import {EffectAlphaMaskMethod}			from "@awayjs/materials/lib/methods/EffectAlphaMaskMethod";
import {EffectColorMatrixMethod}		from "@awayjs/materials/lib/methods/EffectColorMatrixMethod";
import {EffectColorTransformMethod}		from "@awayjs/materials/lib/methods/EffectColorTransformMethod";
import {EffectEnvMapMethod}				from "@awayjs/materials/lib/methods/EffectEnvMapMethod";
import {EffectFogMethod}				from "@awayjs/materials/lib/methods/EffectFogMethod";
import {EffectFresnelEnvMapMethod}		from "@awayjs/materials/lib/methods/EffectFresnelEnvMapMethod";
import {EffectLightMapMethod}			from "@awayjs/materials/lib/methods/EffectLightMapMethod";
import {EffectMethodBase}				from "@awayjs/materials/lib/methods/EffectMethodBase";
import {EffectRimLightMethod}			from "@awayjs/materials/lib/methods/EffectRimLightMethod";
import {NormalSimpleWaterMethod}		from "@awayjs/materials/lib/methods/NormalSimpleWaterMethod";
import {ShadowDitheredMethod}			from "@awayjs/materials/lib/methods/ShadowDitheredMethod";
import {ShadowFilteredMethod}			from "@awayjs/materials/lib/methods/ShadowFilteredMethod";
import {ShadowMapMethodBase}			from "@awayjs/materials/lib/methods/ShadowMapMethodBase";
import {ShadowMethodBase}				from "@awayjs/materials/lib/methods/ShadowMethodBase";
import {SpecularFresnelMethod}			from "@awayjs/materials/lib/methods/SpecularFresnelMethod";
import {ShadowHardMethod}				from "@awayjs/materials/lib/methods/ShadowHardMethod";
import {SpecularAnisotropicMethod}		from "@awayjs/materials/lib/methods/SpecularAnisotropicMethod";
import {SpecularCelMethod}				from "@awayjs/materials/lib/methods/SpecularCelMethod";
import {SpecularPhongMethod}			from "@awayjs/materials/lib/methods/SpecularPhongMethod";
import {ShadowNearMethod}				from "@awayjs/materials/lib/methods/ShadowNearMethod";
import {ShadowSoftMethod}				from "@awayjs/materials/lib/methods/ShadowSoftMethod";

import {BasicMaterial}					from "@awayjs/display/lib/materials/BasicMaterial";

import {ITimelineSceneGraphFactory} 	from "@awayjs/display/lib/factories/ITimelineSceneGraphFactory";
import {AS2SceneGraphFactory} 			from "@awayjs/player/lib/factories/AS2SceneGraphFactory";
import {MovieClip} 						from "@awayjs/display/lib/display/MovieClip";
import {Timeline}			 			from "@awayjs/display/lib/base/Timeline";


import {AssetLibrary}					from "@awayjs/core/lib/library/AssetLibrary";

import {Font}							from "@awayjs/display/lib/text/Font";
import {TesselatedFontTable}			from "@awayjs/display/lib/text/TesselatedFontTable";
import {IFontTable}						from "@awayjs/display/lib/text/IFontTable";
import {TextFormat}						from "@awayjs/display/lib/text/TextFormat";
import {TextFieldType}					from "@awayjs/display/lib/text/TextFieldType";

import {AWDBlock}						from "./AWD3ParserUtils/AWDBlock";
import {Rectangle} 						from "@awayjs/core/lib/geom/Rectangle";
import {Style} 							from "@awayjs/display/lib/base/Style";
import {Matrix} 						from "@awayjs/core/lib/geom/Matrix";
import {MappingMode} 					from "@awayjs/display/lib/textures/MappingMode";
import {ElementsType}					from "@awayjs/display/lib/graphics/ElementsType";
import {Graphic}						from "@awayjs/display/lib/graphics/Graphic";
/**
 * AWDParser provides a parser for the AWD data type.
 */
export class AWDParser extends ParserBase
{
	private _view:View;

	//set to "true" to have some console.logs in the Console
	private _debug:boolean = false;
	private _debugTimers:boolean = true;
	private _byteData:ByteArray;
	private _startedParsing:boolean = false;
	private _cur_block_id:number;
	private _blocks:Array<AWDBlock>;
	private _newBlockBytes:ByteArray;
	private _version:Array<number>;
	private _compression:number;
	private _accuracyOnBlocks:boolean;
	private _accuracyMatrix:boolean;
	private _accuracyGeo:boolean;
	private _accuracyProps:boolean;
	private _streaming:boolean;
	private _texture_users:Object = {};
	private _parsed_header:boolean = false;
	private _body:ByteArray;


	public static COMPRESSIONMODE_LZMA:string = "lzma";
	public static UNCOMPRESSED:number = 0;
	public static DEFLATE:number = 1;
	public static LZMA:number = 2;
	public static INT8:number = 1;
	public static INT16:number = 2;
	public static INT32:number = 3;
	public static UINT8:number = 4;
	public static UINT16:number = 5;
	public static UINT32:number = 6;
	public static FLOAT32:number = 7;
	public static FLOAT64:number = 8;
	public static BOOL:number = 21;
	public static COLOR:number = 22;
	public static BADDR:number = 23;
	public static AWDSTRING:number = 31;
	public static AWDBYTEARRAY:number = 32;
	public static VECTOR2x1:number = 41;
	public static VECTOR3x1:number = 42;
	public static VECTOR4x1:number = 43;
	public static MTX3x2:number = 44;
	public static MTX3x3:number = 45;
	public static MTX4x3:number = 46;
	public static MTX4x4:number = 47;
	public static GEO_NUMBER:number = 48;
	public static MATRIX_NUMBER:number = 49;
	public static PROPERTY_NUMBER:number = 50;
	

	private blendModeDic:Array<string>;
	private _depthSizeDic:Array<number>;

	private start_timeing:number;
	private _time_all:number=0;
	private _time_graphics:number=0;
	private _time_graphics_bytes:number=0;
	private _time_timeline:number=0;
	private _time_fonts:number=0;
	private _time_textfields:number=0;
	private _time_sounds:number=0;
	private _time_textures:number=0;
	private _time_materials:number=0;
	private _time_sprites:number=0;
	private _num_graphics:number=0;
	private _num_timeline:number=0;
	private _num_fonts:number=0;
	private _num_textfields:number=0;
	private _num_sounds:number=0;
	private _num_textures:number=0;
	private _num_materials:number=0;
	private _num_sprites:number=0;


	/**
	 * Creates a new AWD3Parserutils object.
	 * @param uri The url or id of the data or file to be parsed.
	 * @param extra The holder for extra contextual data that the parser might need.
	 */
	constructor(view:View = null)
	{
		super(URLLoaderDataFormat.ARRAY_BUFFER);

		this._view = view;
		this._blocks = new Array<AWDBlock>();
		this._blocks[0] = new AWDBlock(0,255);
		this._blocks[0].data = null; // Zero address means null in AWD

		this.blendModeDic = new Array<string>(); // used to translate ints to blendMode-strings
		this.blendModeDic.push(BlendMode.NORMAL);
		this.blendModeDic.push(BlendMode.ADD);
		this.blendModeDic.push(BlendMode.ALPHA);
		this.blendModeDic.push(BlendMode.DARKEN);
		this.blendModeDic.push(BlendMode.DIFFERENCE);
		this.blendModeDic.push(BlendMode.ERASE);
		this.blendModeDic.push(BlendMode.HARDLIGHT);
		this.blendModeDic.push(BlendMode.INVERT);
		this.blendModeDic.push(BlendMode.LAYER);
		this.blendModeDic.push(BlendMode.LIGHTEN);
		this.blendModeDic.push(BlendMode.MULTIPLY);
		this.blendModeDic.push(BlendMode.NORMAL);
		this.blendModeDic.push(BlendMode.OVERLAY);
		this.blendModeDic.push(BlendMode.SCREEN);
		this.blendModeDic.push(BlendMode.SHADER);
		this.blendModeDic.push(BlendMode.OVERLAY);

		this._depthSizeDic = new Array<number>(); // used to translate ints to depthSize-values
		this._depthSizeDic.push(256);
		this._depthSizeDic.push(512);
		this._depthSizeDic.push(2048);
		this._depthSizeDic.push(1024);
		this._version = Array<number>(); // will contain 2 int (major-version, minor-version) for awd-version-check
	}

	/**
	 * Indicates whether or not a given file extension is supported by the parser.
	 * @param extension The file extension of a potential file to be parsed.
	 * @return Whether or not the given file type is supported.
	 */
	public static supportsType(extension:string):boolean
	{
		extension = extension.toLowerCase();
		return extension == "awd";
	}

	/**
	 * Tests whether a data block can be parsed by the parser.
	 * @param data The data block to potentially be parsed.
	 * @return Whether or not the given data is supported.
	 */
	public static supportsData(data:any):boolean
	{
		return (ParserUtils.toString(data, 3) == 'AWD');
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependency(resourceDependency:ResourceDependency):void
	{
		// this will be called when Dependency has finished loading.
		// the ressource dependecniy has a id that point to the awd_block waiting for it.
		//console.log("AWDParser resolve dependencies";
		if (resourceDependency.assets.length == 1) {
			var this_block:AWDBlock = this._blocks[parseInt(resourceDependency.id)];
			if(this_block.type==82){
				var image_asset:BitmapImage2D = <BitmapImage2D> resourceDependency.assets[0];
				this_block.data = image_asset; // Store finished asset
				// Finalize texture asset to dispatch texture event, which was
				// previously suppressed while the dependency was loaded.
				this._pFinalizeAsset(<IAsset> image_asset, this_block.name);

				if (this._debug)
					console.log("Parsed Texture: Name = " + this_block.name);
			}
			else if(this_block.type==44){
				var audio_asset:WaveAudio = <WaveAudio> resourceDependency.assets[0];
				this_block.data = audio_asset; // Store finished asset
				// Finalize texture asset to dispatch texture event, which was
				// previously suppressed while the dependency was loaded.
				//console.log("Parsing audio " + this_block.name);
				this._pFinalizeAsset(<IAsset> audio_asset, this_block.name);

				if (this._debug)
					console.log("Parsed WaveAudio: Name = " + this_block.name);
			}
			else if(this_block.type==83){
				this_block.loaded_dependencies[resourceDependency.sub_id]= resourceDependency.assets[0];
				this_block.loaded_dependencies_cnt++;

				if (this._debug)
					console.log("Successfully loaded Bitmap " + resourceDependency.sub_id + " / 6 for Cubetexture");

				if(this_block.loaded_dependencies_cnt==6){
					var cube_image_asset = new BitmapImageCube(this_block.loaded_dependencies[0].width);

					for (var i:number = 0; i < 6; i++)
						cube_image_asset.draw(i, this_block.loaded_dependencies[i]);

					this_block.data = cube_image_asset; // Store finished asset
					this._pFinalizeAsset(<IAsset> cube_image_asset, this_block.name);

					if (this._debug)
						console.log("Parsed CubeTexture: Name = " + this_block.name);
				}
			}

			if (this._debugTimers && !this._isParsing)
				this.updateTimers(this_block.type);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependencyFailure(resourceDependency:ResourceDependency):void
	{
		//not used - if a dependcy fails, the awaiting Texture or CubeTexture will never be finalized, and the default-bitmaps will be used.
		// this means, that if one Bitmap of a CubeTexture fails, the CubeTexture will have the DefaultTexture applied for all six Bitmaps.
	}

	/**
	 * Resolve a dependency name
	 *
	 * @param resourceDependency The dependency to be resolved.
	 */
	public _iResolveDependencyName(resourceDependency:ResourceDependency, asset:IAsset):string
	{
		var oldName:string = asset.name;

		if (asset) {
			var block:AWDBlock = this._blocks[parseInt(resourceDependency.id)];
			// Reset name of texture to the one defined in the AWD file,
			// as opposed to whatever the image parser came up with.
			asset.resetAssetPath(block.name, null, true);
		}

		var newName:string = asset.name;

		asset.name = oldName;

		return newName;
	}

	/**
	 * @inheritDoc
	 */
	public _pProceedParsing():boolean
	{
		if (!this._startedParsing) {
			this._byteData = this._pGetByteData();//getByteData();
			this._startedParsing = true;
		}

		if (!this._parsed_header) {

			//----------------------------------------------------------------------------
			// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
			//----------------------------------------------------------------------------
			//this._byteData.endian = Endian.LITTLE_ENDIAN;
			//----------------------------------------------------------------------------

			//----------------------------------------------------------------------------
			// Parse header and decompress body if needed
			this.parseHeader();

			switch (this._compression) {
				case AWDParser.DEFLATE:
				case AWDParser.LZMA:
					this._pDieWithError('Compressed AWD formats not yet supported');
					break;

				case AWDParser.UNCOMPRESSED:
					this._body = this._byteData;
					break;

				//----------------------------------------------------------------------------
				// Compressed AWD Formats not yet supported
				//----------------------------------------------------------------------------

				/*
				 case AWD3Parserutils.DEFLATE:

				 this._body = new ByteArray();
				 this._byteData.readBytes(this._body, 0, this._byteData.getBytesAvailable());
				 this._body.uncompress();

				 break;
				 case AWD3Parserutils.LZMA:

				 this._body = new ByteArray();
				 this._byteData.readBytes(this._body, 0, this._byteData.getBytesAvailable());
				 this._body.uncompress(COMPRESSIONMODE_LZMA);

				 break;
				 //*/

			}

			this._parsed_header = true;

			//----------------------------------------------------------------------------
			// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
			//----------------------------------------------------------------------------
			//this._body.endian = Endian.LITTLE_ENDIAN;// Should be default
			//----------------------------------------------------------------------------

		}

		if (this._body) {
			while (this._body.getBytesAvailable() > 0 && !this.parsingPaused) //&& this._pHasTime() )
				this.parseNextBlock();

			//----------------------------------------------------------------------------
			// Return complete status
			if (this._body.getBytesAvailable() == 0) {
				this.dispose();

				if (this._debugTimers)
					console.log("Parsing total: "+(this._time_all | 0)+"ms",
						" | graphics: "+this._num_graphics+", "+(this._time_graphics | 0)+"ms",
						" | graphics bytes: "+this._num_graphics+", "+(this._time_graphics_bytes | 0)+"ms",
						" | timelines: "+this._num_timeline+", "+(this._time_timeline | 0)+"ms",
						" | fonts: "+this._num_fonts+", "+(this._time_fonts | 0)+"ms",
						" | sounds: "+this._num_sounds+", "+(this._time_sounds | 0)+"ms",
						" | mats: "+this._num_materials+", "+(this._time_materials | 0)+"ms",
						" | textures: "+this._num_textures+", "+(this._time_textures | 0)+"ms",
						" | sprites: "+this._num_sprites+", "+(this._time_sprites | 0)+"ms");

				return  ParserBase.PARSING_DONE;
			} else {
				return  ParserBase.MORE_TO_PARSE;
			}
		} else {

			switch (this._compression) {
				case AWDParser.DEFLATE:
				case AWDParser.LZMA:
					if (this._debug)
						console.log("(!) AWDParser Error: Compressed AWD formats not yet supported (!)");

					break;
			}
			// Error - most likely _body not set because we do not support compression.
			return  ParserBase.PARSING_DONE;
		}
	}

	public _pStartParsing(frameLimit:number):void
	{
		//create a content object for Loaders
		this._pContent = new DisplayObjectContainer();

		super._pStartParsing(frameLimit);
	}

	private dispose():void
	{
		for (var c in this._blocks) {
			var b:AWDBlock = <AWDBlock> this._blocks[c];
			b.dispose();
		}
	}

	private parseNextBlock():void
	{
		var block:AWDBlock;
		var isParsed:boolean = false;
		var ns:number;
		var type:number;
		var flags:number;
		var len:number;
//*
		if (this._debugTimers)
			this.start_timeing = performance.now();
//*/
		this._cur_block_id = this._body.readUnsignedInt();

		ns = this._body.readUnsignedByte();
		type = this._body.readUnsignedByte();
		flags = this._body.readUnsignedByte();
		len = this._body.readUnsignedInt();

		var blockCompression:boolean = BitFlags.test(flags, BitFlags.FLAG4);
		var blockCompressionLZMA:boolean = BitFlags.test(flags, BitFlags.FLAG5);

		if (this._accuracyOnBlocks) {
			this._accuracyMatrix = BitFlags.test(flags, BitFlags.FLAG1);
			this._accuracyGeo = BitFlags.test(flags, BitFlags.FLAG2);
			this._accuracyProps = BitFlags.test(flags, BitFlags.FLAG3);
		}

		var blockEndAll:number = this._body.position + len;

		if (len > this._body.getBytesAvailable()) {
			this._pDieWithError('AWD2 block length is bigger than the bytes that are available!');
			this._body.position += this._body.getBytesAvailable();
			return;
		}

		//----------------------------------------------------------------------------
		// Compressed AWD Formats not yet supported

		if (blockCompression) {
			this._pDieWithError('Compressed AWD formats not yet supported');
			this._newBlockBytes = new ByteArray();
			this._body.readBytes(this._newBlockBytes, 0, len);
			this._newBlockBytes.position = 0;
			/*
			 if (blockCompressionLZMA)
			 {
			 this._newBlockBytes.uncompress(AWD3Parserutils.COMPRESSIONMODE_LZMA);
			 }
			 else
			 {
			 this._newBlockBytes.uncompress();
			 }
			 */

		} else {
			this._newBlockBytes = this._body;
		}

		//----------------------------------------------------------------------------
		// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
		//----------------------------------------------------------------------------
		//this._newBlockBytes.endian = Endian.LITTLE_ENDIAN;
		//----------------------------------------------------------------------------

		block = new AWDBlock(this._cur_block_id, type);
		block.len = len;
		var blockEndBlock:number = this._newBlockBytes.position + len;

		if (blockCompression) {
			this._pDieWithError('Compressed AWD formats not yet supported');
			//blockEndBlock   = this._newBlockBytes.position + this._newBlockBytes.length;
			//block.len       = blockEndBlock;
		}

		if (this._debug)
			console.log("AWDBlock:  ID = " + this._cur_block_id + " | TypeID = " + type + " | Compression = " + blockCompression + " | Matrix-Precision = " + this._accuracyMatrix + " | Graphics-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);

		this._blocks[this._cur_block_id] = block;

		if ((this._version[0] == 3) && (this._version[1] == 0)) {
			// probably should contain some info about the type of animation
			var factory = new AS2SceneGraphFactory(this._view);

			switch (type) {
				case 24:
					this.parseSpriteLibraryBlock(this._cur_block_id);
					isParsed = true;
					break;
				case 25:
					this.parseBillBoardLibraryBlock(this._cur_block_id);
					isParsed = true;
					break;
				case 44:
					this.parseAudioBlock(this._cur_block_id, factory);
					isParsed = true;
					break;
				case 133:
					this.parseMovieClip(this._cur_block_id, factory);
					isParsed = true;
					break;
				case 134:
					this.parseTextField(this._cur_block_id, factory);
					isParsed = true;
					break;
				case 135:
					this.parseTesselatedFont(this._cur_block_id);
					isParsed = true;
					break;
				case 136:
					this.parseTextFormat(this._cur_block_id);
					isParsed = true;
					break;
			}
		}

		if ((this._version[0] > 2)||((this._version[0] >= 2) && (this._version[1] >= 1))) {
			switch (type) {
				case 11:
					this.parsePrimitves(this._cur_block_id);
					isParsed = true;
					break;
				case 31:
					this.parseSkyboxInstance(this._cur_block_id);
					isParsed = true;
					break;
				case 41:
					this.parseLight(this._cur_block_id);
					isParsed = true;
					break;
				case 42:
					this.parseCamera(this._cur_block_id);
					isParsed = true;
					break;

				//  case 43:
				//      parseTextureProjector(_cur_block_id);
				//      isParsed = true;
				//      break;

				case 51:
					this.parseLightPicker(this._cur_block_id);
					isParsed = true;
					break;
				case 81:
					this.parseMaterial_v1(this._cur_block_id);
					isParsed = true;
					break;
				case 83:
					this.parseCubeTexture(this._cur_block_id);
					isParsed = true;
					break;
				case 91:
					this.parseSharedMethodBlock(this._cur_block_id);
					isParsed = true;
					break;
				case 92:
					this.parseShadowMethodBlock(this._cur_block_id);
					isParsed = true;
					break;
				case 111:
					this.parseSpritePoseAnimation(this._cur_block_id, true);
					isParsed = true;
					break;
				case 112:
					this.parseSpritePoseAnimation(this._cur_block_id);
					isParsed = true;
					break;
				case 113:
					this.parseVertexAnimationSet(this._cur_block_id);
					isParsed = true;
					break;
				case 122:
					this.parseAnimatorSet(this._cur_block_id);
					isParsed = true;
					break;
				case 253:
					this.parseCommand(this._cur_block_id);
					isParsed = true;
					break;
			}
		}

		if (isParsed == false) {
			switch (type) {
				case 1:
					this.parseGraphics(this._cur_block_id);
					break;
				case 22:
					this.parseContainer(this._cur_block_id);
					break;
				case 23:
					this.parseSpriteInstance(this._cur_block_id);
					break;
				case 81:
					this.parseMaterial(this._cur_block_id);
					break;
				case 82:
					this.parseTexture(this._cur_block_id);
					break;
				case 101:
					this.parseSkeleton(this._cur_block_id);
					break;
				case 102:
					this.parseSkeletonPose(this._cur_block_id);
					break;
				case 103:
					this.parseSkeletonAnimation(this._cur_block_id);
					break;
				case 121:
				//this.parseUVAnimation(this._cur_block_id);
				//break;
				case 254:
					this.parseNameSpace(this._cur_block_id);
					break;
				case 255:
					this.parseMetaData(this._cur_block_id);
					break;
				default:
					if (this._debug)
						console.log("AWDBlock:   Unknown BlockType  (BlockID = " + this._cur_block_id + ") - Skip " + len + " bytes");

					this._newBlockBytes.position += len;
					break;
			}
		}

		if (this._debug) {
			if (this._newBlockBytes.position != blockEndBlock)
				console.log("  (!)(!)(!) Error while reading AWDBlock ID " + this._cur_block_id + " = skip to next block");

			if (block.errorMessages) {
				var len:number = block.errorMessages.length;
				for (var msgCnt:number = 0; msgCnt < len; msgCnt++)
					console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
			}

			console.log("\n");
		}

		if (this._debugTimers && !this.parsingPaused)
			this.updateTimers(type);

		this._body.position = blockEndAll;
		this._newBlockBytes = null;
	}

	private updateTimers(type:number):void
	{
		var end_timing = performance.now();
		var time_delta = end_timing - this.start_timeing;
		this._time_all += time_delta;

		if (type == 1) {
			this._time_graphics += time_delta;
			this._num_graphics++;
		} else if (type == 133) {
			this._time_timeline += time_delta;
			this._num_timeline++;
		} else if (type == 135) {
			this._time_fonts += time_delta;
			this._num_fonts++;
		} else if (type == 134) {
			this._time_textfields += time_delta;
			this._num_textfields++;
		} else if (type == 44) {
			this._time_sounds += time_delta;
			this._num_sounds++;
		} else if (type == 82) {
			this._time_textures += time_delta;
			this._num_textures++;
		} else if (type == 81) {
			this._time_materials += time_delta;
			this._num_materials++;
		} else if(type==24) {
			this._time_sprites += time_delta;
			this._num_sprites++;
		}
	}


	//--Parser Blocks---------------------------------------------------------------------------


	private parseTesselatedFont(blockID:number):void
	{
		var name:string = this.parseVarStr();
		this._blocks[blockID].name = name;
		var new_font:Font=<Font>AssetLibrary.getAsset(this._blocks[blockID].name);
		var newfont:Boolean = false;
		if(new_font==undefined){
			new_font = new Font();
			newfont=true;
		}
		var font_style_cnt:number = this._newBlockBytes.readUnsignedInt();
		var font_style_char_cnt:number;
		var font_style_name:string;
		var new_font_style:TesselatedFontTable;
		var font_style_char:number;
		var attr_count:number=0;
		var sm_len:number;
		var sm_end:number;
		var str_ftype:number, str_type:number, str_len:number, str_end:number;
		for (var i:number = 0; i < font_style_cnt; ++i) {
			font_style_name = this.parseVarStr();

			// dirty hack for icycle
			// we use bold chars for non-latin chars, but we use regular for � sign,
			// so the dirty hack is to merge the regular and the bold style
			if((this._blocks[blockID].name=="Tahoma") && (font_style_name=="RegularStyle")){
				font_style_name="BoldStyle";
			}

			new_font_style = <TesselatedFontTable>new_font.get_font_table(font_style_name, TesselatedFontTable.assetType);
			new_font_style.set_font_em_size(this._newBlockBytes.readUnsignedInt());
			new_font_style.set_whitespace_width(this._newBlockBytes.readUnsignedInt());
			new_font_style.ascent=this._newBlockBytes.readFloat();
			new_font_style.descent=this._newBlockBytes.readFloat();
			//console.log(new_font_style.get_whitespace_width());
			font_style_char_cnt = this._newBlockBytes.readUnsignedInt();
			for (var j:number = 0; j < font_style_char_cnt; ++j) {
				// todo: this is basically a simplified version of the elements-parsing done in parseGraphics. Make a parseElements() instead (?)
				font_style_char = this._newBlockBytes.readUnsignedInt();
				var char_width=this._newBlockBytes.readFloat();
				sm_len = this._newBlockBytes.readUnsignedInt();
				sm_end = this._newBlockBytes.position + sm_len;

				// Loop through data streams
				while (this._newBlockBytes.position < sm_end) {
					// Type, field type, length
					str_type = this._newBlockBytes.readUnsignedByte();
					str_ftype = this._newBlockBytes.readUnsignedByte();
					str_len = this._newBlockBytes.readUnsignedInt();
					str_end = this._newBlockBytes.position + str_len;

					if (str_type == 2) {//face indices positions
						var indices:Array<number> = new Array<number>();
						for(var idx:number = 0; this._newBlockBytes.position < str_end; idx++)
							indices[idx] = this._newBlockBytes.readUnsignedShort();
					} else if (str_type == 11) {// combined vertex2D stream 5 x float32 (position + curvedata)
						attr_count = 20;
						var curveData:ByteArray = new ByteArray(str_len);
						this._newBlockBytes.readBytes(curveData, 0, str_len);
					} else if (str_type == 12) {// combined vertex2D stream 5 x float32 (position + curvedata)
						attr_count = 12;
						var curveData:ByteArray = new ByteArray(str_len);
						this._newBlockBytes.readBytes(curveData, 0, str_len);
					} else if (str_type == 10) {// combined vertex2D stream 7 x float32 (position + curvedata + uv)
						attr_count = 28;
						var curveData:ByteArray = new ByteArray(str_len);
						this._newBlockBytes.readBytes(curveData, 0, str_len);
					} else {
						this._newBlockBytes.position = str_end;
					}
				}
				if(curveData) {
					var vertexBuffer:AttributesBuffer = new AttributesBuffer(attr_count, str_len / attr_count);
					vertexBuffer.bufferView = new Uint8Array(<ArrayBuffer> curveData.arraybytes);
					//console.log("allchars[cnt1++] = ['"+font_style_char.toString()+"',["+vertexBuffer.bufferView.toString()+"]]");

					new_font_style.setChar(font_style_char.toString(), char_width, vertexBuffer, null);
				}
			}
		}

		this.parseProperties(null);
		this.parseUserAttributes();
		if(newfont) {
			this._pFinalizeAsset(<IAsset>new_font, name);
		}

		this._blocks[blockID].data = new_font;

		if (this._debug)
			console.log("Parsed a font: Name = '" + name);
	}

	private static textFormatProperties:Object = {
		1:AWDParser.UINT16,		//fontsize
		2:AWDParser.FLOAT32,		//letterspacing
		3:AWDParser.UINT8,		//rotated
		4:AWDParser.UINT8,		//auto-kerning
		5:AWDParser.UINT8,		//baselineshift
		6:AWDParser.UINT8,		//align
		7:AWDParser.FLOAT32,		//intent
		8:AWDParser.FLOAT32,		//left margin
		9:AWDParser.FLOAT32,		//right margin
		10:AWDParser.FLOAT32};	//line spacing

	private parseTextFormat(blockID:number):void
	{
		var name:string = this.parseVarStr();
		this._blocks[blockID].name = name;

		var font:Font = <Font> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		var font_style_name:string = this.parseVarStr();

		var newTextFormat:TextFormat = new TextFormat();
		newTextFormat.font_name = font.name;

		// todo:  atm in awd this will always default to get a TesselatedFontTable. need to find a way to request the correct type here
		var font_table:IFontTable = font.get_font_table(font_style_name);
		if (font_table!=null) {
			newTextFormat.font_style = font_style_name;
			newTextFormat.font_table = font_table;
		}

		var mat:BasicMaterial = <BasicMaterial> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		mat.bothSides = true;
		mat.curves = true;
		var num_uv_values:number = this._newBlockBytes.readUnsignedByte();
		var uv_values:Array<number> = [];
		for(var uvcnt:number = 0; uvcnt < num_uv_values; uvcnt++)
			uv_values[uvcnt] = this._newBlockBytes.readFloat();

		newTextFormat.uv_values = uv_values;
		var format_props:AWDProperties = this.parseProperties(AWDParser.textFormatProperties);

		newTextFormat.size = format_props.get(1,12);
		newTextFormat.letterSpacing = format_props.get(2,0);
		//newTextFormat.rotated = format_props.get(3,false);
		newTextFormat.kerning = format_props.get(4,true);
		//newTextFormat.baseline_shift = format_props.get(5,1);
		var tf_align_int:number = format_props.get(6,0);
		if(tf_align_int==1){
			newTextFormat.align="right";
		}
		else if(tf_align_int==2){
			newTextFormat.align="center";
		}
		else if(tf_align_int==3){
			newTextFormat.align="justify";
		}
		newTextFormat.indent = format_props.get(7,0);
		newTextFormat.leftMargin = format_props.get(8,0);
		newTextFormat.rightMargin = format_props.get(9,0);
		newTextFormat.leading = format_props.get(10,0);
		newTextFormat.material = mat;
		this.parseUserAttributes();// textformat has no extra-properties
		//newTextFormat.extra =

		this._pFinalizeAsset(<IAsset> newTextFormat, name);
		this._blocks[blockID].data = newTextFormat;

		if (this._debug)
			console.log("Parsed a TextFormat: Name = '" + name + " font: "+font.name);
	}

	private static textFieldProperties:Object = {
		1:AWDParser.BOOL,
		3:AWDParser.BOOL,
		4:AWDParser.BOOL,
		5:AWDParser.BOOL,
		7:AWDParser.UINT8,
		8:AWDParser.UINT8,
		9:AWDParser.UINT8};

	private static textFieldTypes:Array<string> = ["static", "dynamic", "input", "input"];


	private parseTextField(blockID:number, factory:ITimelineSceneGraphFactory):void
	{
		var name:string = this.parseVarStr();
		this._blocks[blockID].name = name;
        var newTextField = factory.createTextField();
		var text_field_type:number=this._newBlockBytes.readUnsignedByte();

		newTextField.type = AWDParser.textFieldTypes[text_field_type];

		if(text_field_type == 3)
			newTextField.displayAsPassword = true;

		//
		newTextField.textWidth = Math.abs(this._newBlockBytes.readFloat());
		newTextField.textHeight = Math.abs(this._newBlockBytes.readFloat());
		var num_paragraphs:number = this._newBlockBytes.readUnsignedInt();
		var complete_text:string = "";
		//console.log("num_paragraphs  '" + num_paragraphs);
		for(var paracnt:number=0; paracnt<num_paragraphs; paracnt++){

			var num_textruns:number = this._newBlockBytes.readUnsignedInt();
			//console.log("num_textruns  '" + num_textruns);
			for(var textrun_cnt:number=0; textrun_cnt<num_textruns; textrun_cnt++) {
				var text_format:TextFormat = <TextFormat> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
				var txt_length = this._newBlockBytes.readUnsignedInt();
				//console.log("txt_length  '" + txt_length);
				if (txt_length > 0) {
					var this_txt:string = this._newBlockBytes.readUTFBytes(txt_length);
					//newTextField.appendText(this_txt, text_format);
					complete_text += this_txt;
					//console.log("this_txt  '" + this_txt);
				}
			}
			//newTextField.closeParagraph();
		}
		newTextField.textFormat=text_format;
		newTextField.text=complete_text;
		//newTextField.construct_graphics();
		// todo: optional matrix etc can be put in properties.

		var props:AWDProperties = this.parseProperties(AWDParser.textFieldProperties);
		newTextField.selectable = props.get(1, false);
		newTextField.border =  props.get(3, false);
		//newTextField.renderHTML =  props.get(4, false);
		//newTextField.scrollable =  props.get(5, false);
		//newTextField.text_flow =  props.get(7, 0);
		//newTextField.orientationMode =  props.get(8, 0);
		//newTextField.line_mode =  props.get(9, 0);
		newTextField.extra = this.parseUserAttributes();

		//console.log("Parsed a TextField: Name = '" + name + "| text  = " + complete_text);
		this._pFinalizeAsset(<IAsset> newTextField, name);
		this._blocks[blockID].data = newTextField;

		if (this._debug)
			console.log("Parsed a TextField: Name = '" + name + "| text  = " + complete_text);
	}

	// Block ID = 25
	private parseBillBoardLibraryBlock(blockID:number):void
	{

		var name:string = this.parseVarStr();
		var mat:BasicMaterial = <BasicMaterial> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		mat.bothSides=true;
		var billboard:Billboard = new Billboard(mat);

		// todo: optional matrix etc can be put in properties.
		this.parseProperties(null);

		billboard.extra = this.parseUserAttributes();

		this._pFinalizeAsset(<IAsset> billboard, name);

		this._blocks[blockID].data = billboard;

		if (this._debug)
			console.log("Parsed a Library-Billboard: Name = '" + name + "| Material-Name = " + mat.name);
	}
	// Block ID = 24
	private parseSpriteLibraryBlock(blockID:number):void
	{
		var name:string = this.parseVarStr();
		var data_id:number = this._newBlockBytes.readUnsignedInt();
		var graphics:Graphics = <Graphics> this._blocks[data_id].data;
		this._blocks[blockID].geoID = data_id;

		var num_materials:number = this._newBlockBytes.readUnsignedShort();
		var materials:Array<MethodMaterial> = new Array<MethodMaterial>();
		var materialNames:Array<string> = new Array<string>();
		var mat:MethodMaterial;
		for (var materials_parsed:number = 0; materials_parsed < num_materials; materials_parsed++) {
			mat = <MethodMaterial> (this._blocks[this._newBlockBytes.readUnsignedInt()].data || DefaultMaterialManager.getDefaultMaterial());
			//mat.preserveAlpha = true;
			//mat.alphaBlending = true;
			mat.useColorTransform = true;
			materials[materials_parsed] = mat;
			materialNames[materials_parsed] = mat.name;
		}

		var start_timeing = performance.now();
		var sprite:Sprite = new Sprite();
		graphics.copyTo(sprite.graphics);
		var end_timing = performance.now();
		var time_delta = end_timing - start_timeing;
		this._time_graphics_bytes += time_delta;

		if (materials.length >= 1 && sprite.graphics.count == 1) {
			sprite.material = materials[0];
		} else if (materials.length > 1) {
			// Assign each sub-sprite in the sprite a material from the list. If more sub-sprites
			// than materials, repeat the last material for all remaining sub-sprites.
			for (var i:number = 0; i < sprite.graphics.count; i++)
				sprite.graphics.getGraphicAt(i).material = materials[Math.min(materials.length - 1, i)];
		}

		var count:number = this._newBlockBytes.readUnsignedShort();
		//if(count != sprite.graphics.count)
		//	throw new Error("num elements does not match num subsprites";

		for (var i:number = 0; i < count; i++) {
			var type:number = this._newBlockBytes.readUnsignedByte();

			var sampler:Sampler2D = new Sampler2D();
			var graphic:Graphic = sprite.graphics.getGraphicAt(i);
			if(graphic) {
				graphic.style = new Style();
				graphic.style.addSamplerAt(sampler, graphic.material.getTextureAt(0));
			}
			if (type == 3) {// solid color fill - need tx and ty
				var tx:number=this._newBlockBytes.readFloat();
				var ty:number=this._newBlockBytes.readFloat();
				if(graphic) {
					graphic.material.animateUVs = true;
					graphic.style.uvMatrix = new Matrix(0, 0, 0, 0, tx, ty);
				}
			}
			else if (type == 4) {// texture fill - need full matrix
				var matrix:Float32Array = this.parseMatrix32RawData();
				if(graphic) {
					graphic.material.animateUVs = true;
					graphic.style.uvMatrix = new Matrix(matrix);
				}
			}
			else if (type == 5) {// linear gradient fill - need a, c , tx and ty
				var newMatrix:Matrix = new Matrix(this._newBlockBytes.readFloat(), this._newBlockBytes.readFloat(), 0, 0, this._newBlockBytes.readFloat(), this._newBlockBytes.readFloat());
				if(graphic) {
					graphic.material.animateUVs = true;
					graphic.style.uvMatrix = newMatrix;
				}
			}
				else if (type == 6) {// radial gradient fill - need image rectangle + full transform
					var x:number = this._newBlockBytes.readFloat();
					var y:number = this._newBlockBytes.readFloat();
					var width:number = this._newBlockBytes.readFloat();
					var height:number = this._newBlockBytes.readFloat();
					var matrix:Float32Array = this.parseMatrix32RawData();
					if(graphic) {
						sampler.imageRect = new Rectangle(x, y, width, height);
						graphic.material.imageRect = true;
						graphic.material.animateUVs = true;
						graphic.style.uvMatrix = new Matrix(matrix);
					}
				}
			if(graphic) {
				//check if curves are needed
				if (graphic.elements.getCustomAtributes("curves"))
					graphic.material.curves = true;
			}
			// todo: finish optional properties (spreadmode + focalpoint)
			this._newBlockBytes.readUnsignedInt();
		}

		this.parseProperties(null);
		sprite.extra = this.parseUserAttributes();

		this._pFinalizeAsset(<IAsset> sprite, name);

		this._blocks[blockID].data = sprite;

		if (this._debug)
			console.log("Parsed a Library-Sprite: Name = '" + name + "| Graphics-Name = " + graphics.name + " | Graphics-Count = " + sprite.graphics.count + " | Mat-Names = " + materialNames);
	}

	private parseAudioBlock(blockID:number, factory:ITimelineSceneGraphFactory):void
	{
		//var asset:Audio;todo create asset for audio

		this._blocks[blockID].name = this.parseVarStr();

		var type:number = this._newBlockBytes.readUnsignedByte();
		var data_len:number;

		// External
		if (type == 0) {
			data_len = this._newBlockBytes.readUnsignedInt();
			var url:string;
			url = this._newBlockBytes.readUTFBytes(data_len);
			// todo parser needs to be able to handle mp3 and wav files if we trigger the loading of external ressource
			this._pAddDependency(this._cur_block_id.toString(), new URLRequest(url), false, null, true);
		} else {
			// todo: exporter does not export embed sounds yet
			data_len = this._newBlockBytes.readUnsignedInt();

			var data:ByteArray = new ByteArray(data_len);
			this._newBlockBytes.readBytes(data, 0, data_len);

			// todo parse sound from bytes
			// this._pAddDependency(this._cur_block_id.toString(), null, false, ParserUtils.by(data), true);
			this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);
		}

		// Ignore for now
		this.parseProperties(null);
		this._blocks[blockID].extras = this.parseUserAttributes();
		this._pPauseAndRetrieveDependencies();
		//this._blocks[blockID].data = asset;todo

		if (this._debug)
			console.log("Start parsing a " + ["external", "embed"][type] + " Audio file");
	}

	private static movieClipProperties:Object = {
		1:AWDParser.FLOAT32,	//fps
		2:AWDParser.UINT16,		// sceneID if not present or 0, mc is no scene
		3:AWDParser.UINT8};		// scripting-language right now its always as2
	//Block ID = 4
	private parseMovieClip(blockID:number, factory:ITimelineSceneGraphFactory):void
	{
		var i:number;
		var j:number;
		var cmd_asset:DisplayObject;
		var new_timeline:Timeline = new Timeline();
		var new_mc = factory.createMovieClip(new_timeline);
		var name = this.parseVarStr();

		// register list of potential childs
		// a potential child can be reused on a timeline (added / removed / added)
		// However, for each potential child, we need to register the max-number of instances that a frame contains
		// we parse 2 lists of potential-childs:
		// -	the first list contains potential-childs that are only ever instanced once per frame.
		// -	the second list contains potential-childs that are instanced multiple times on some frames.

		// on registering a child, the child gets a incremental-id assigned. This is the id, that the commands are using to access the childs.
		// hence we need to be careful to register all objects in correct order.

		var num_potential_childs:number = this._newBlockBytes.readUnsignedShort();
		for (i = 0; i < num_potential_childs; i++) {
			cmd_asset = <DisplayObject> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
			if (cmd_asset != null) {
				new_timeline.registerPotentialChild(cmd_asset);
			} else {
				//todo: register a default display object on timeline, so we do not mess up the incremental obj-id
				//new_mc.registerPotentialChild(cmd_asset);
				console.log("ERROR when collecting objects for timeline");
			}
		}

		var num_all_display_instances:number = num_potential_childs;

		var num_potential_childs_multi_instanced = this._newBlockBytes.readUnsignedShort();
		for (i = 0; i < num_potential_childs_multi_instanced; i++) {
			cmd_asset = <DisplayObject> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
			var num_instances:number = this._newBlockBytes.readUnsignedShort();
			num_all_display_instances += num_instances;
			if (cmd_asset != null) {
				for (j = 0; j < num_instances; j++)
					new_timeline.registerPotentialChild(cmd_asset);
			} else {
				for (j = 0; j < num_instances; j++) {
					//todo: register a default display object on timeline, so we do not mess up the incremental obj-id
					//new_mc.registerPotentialChild(cmd_asset);
					console.log("ERROR when collecting objects for timeline");
				}
			}
		}

		if (this._debug)
			console.log("Parsed " + (num_potential_childs + num_potential_childs_multi_instanced) + " potential childs. They will be used by " + num_all_display_instances + " instances.");

		// register list of potential sounds - for now we always have 0 sounds
		var num_potential_sounds = this._newBlockBytes.readUnsignedShort();


		var str_cnt = this._newBlockBytes.readUnsignedByte();
		var str_len = 0;
		var str_data_type = 0;
		var str_type=0;
		var str_counter=0;
		for(i=0; i<str_cnt;i++){
			// the first 6 lists are not optional and always in same order
			// hence we can get type by incremental counter instead of stored uint8
			if(str_counter<6)
				str_type=str_counter;
			else
				str_type = this._newBlockBytes.readUnsignedByte();
			// get the data type for this stream (1:UINT8 - 2:UINT16 - 3:UINT32)
			str_data_type = this._newBlockBytes.readUnsignedByte();
			// size of this stream in byte
			str_len = this._newBlockBytes.readUnsignedInt();
			if(str_len>0) {
				var keyframes_start_indices_data:ByteArray = new ByteArray(str_len);
				this._newBlockBytes.readBytes(keyframes_start_indices_data, 0, str_len);
				var new_buffer:ArrayBufferView;
				//console.log("str_data_type = "+str_type);
				switch (str_data_type) {
					case 1:
						new_buffer = new Uint8Array(<ArrayBuffer> keyframes_start_indices_data.arraybytes);
						break;
					case 2:
						new_buffer = new Uint16Array(<ArrayBuffer> keyframes_start_indices_data.arraybytes);
						break;
					case 4:
						new_buffer = new Uint32Array(<ArrayBuffer> keyframes_start_indices_data.arraybytes);
						break;
				}
				switch (str_type) {
					case 0:
						new_timeline.keyframe_durations = new_buffer;
						new_timeline.numKeyFrames=str_len / str_data_type;
						break;
					case 1:
						new_timeline.frame_command_indices = new_buffer;
						break;
					case 2:
						new_timeline.frame_recipe = new_buffer;
						break;
					case 3:
						new_timeline.command_length_stream = new_buffer;
						break;
					case 4:
						new_timeline.command_index_stream = new_buffer;
						break;
					case 5:
						new_timeline.add_child_stream = new_buffer;
						break;
					case 6:
						new_timeline.remove_child_stream = new_buffer;
						break;
					case 7:
						new_timeline.update_child_stream = new_buffer;
						break;
					case 8:
						new_timeline.update_child_props_indices_stream = new_buffer;
						break;
					case 9:
						new_timeline.update_child_props_length_stream = new_buffer;
						break;
					case 10:
						new_timeline.property_type_stream = new_buffer;
						break;
					case 11:
						new_timeline.property_index_stream = new_buffer;
						break;
					case 12:
						new_timeline.properties_stream_int = new_buffer;
						break;
				}
			}
			str_counter++;
		}
		var lc:number=0;
		var float_array_data:ByteArray;
		str_cnt = this._newBlockBytes.readUnsignedByte();
		for(i=0; i<str_cnt;i++){
			str_type = this._newBlockBytes.readUnsignedByte();
			str_len = this._newBlockBytes.readUnsignedInt();
			switch(str_type) {
				case 0://mtx_scale
					float_array_data = new ByteArray(str_len);
					this._newBlockBytes.readBytes(float_array_data, 0, str_len);
					new_timeline.properties_stream_f32_mtx_scale_rot=new Float32Array(<ArrayBuffer> float_array_data.arraybytes);
					break;
				case 1://mtx_pos
					float_array_data = new ByteArray(str_len);
					this._newBlockBytes.readBytes(float_array_data, 0, str_len);
					new_timeline.properties_stream_f32_mtx_pos=new Float32Array(<ArrayBuffer> float_array_data.arraybytes);
					break;
				case 2://mtx_all
					float_array_data = new ByteArray(str_len);
					this._newBlockBytes.readBytes(float_array_data, 0, str_len);
					new_timeline.properties_stream_f32_mtx_all=new Float32Array(<ArrayBuffer> float_array_data.arraybytes);
					break;
				case 3://ct
					float_array_data = new ByteArray(str_len);
					this._newBlockBytes.readBytes(float_array_data, 0, str_len);
					new_timeline.properties_stream_f32_ct=new Float32Array(<ArrayBuffer> float_array_data.arraybytes);
					break;
				case 4://labels
					str_len = this._newBlockBytes.readUnsignedShort();
					//console.log("start reading labels "+str_len);
					for (lc = 0; lc < str_len; lc++) {
						new_timeline._labels[this.parseVarStr()] = this._newBlockBytes.readUnsignedShort();
					}
					break;
				case 5://name_stream
					str_len = this._newBlockBytes.readUnsignedShort();
					var string_props_array:Array<string>=[];
					for (lc = 0; lc < str_len; lc++) {
						string_props_array.push(this._newBlockBytes.readUTFBytes(this._newBlockBytes.readUnsignedShort()));
					}
					new_timeline.properties_stream_strings = string_props_array;
					break;
				case 6://script_stream
					str_len = this._newBlockBytes.readUnsignedShort();
					for (lc = 0; lc < str_len; lc++) {
						var frame_index=this._newBlockBytes.readUnsignedShort();
						var one_str_len=this._newBlockBytes.readUnsignedInt();
						//this._newBlockBytes.readUTFBytes(one_str_len);
						new_timeline.add_framescript(this._newBlockBytes.readUTFBytes(one_str_len), frame_index);
					}
					break;
			}
		}
		new_timeline.init();

		var sceneID:number = 0;
		var fps:number = 25;
		this.parseProperties(AWDParser.movieClipProperties);
		this.parseUserAttributes();
		this._pFinalizeAsset(<IAsset>new_mc, name);

		this._blocks[blockID].data = new_mc;

		if (this._debug)
			console.log("Parsed a TIMELINE: Name = " + name + "| sceneID = " + sceneID + "| numFrames = " + new_mc.timeline.numFrames);
	}

	private static graphicsProperties:Object = {
		1:AWDParser.GEO_NUMBER,
		2:AWDParser.GEO_NUMBER};

	private static elementsProperties:Object = {
		1:AWDParser.GEO_NUMBER,
		2:AWDParser.GEO_NUMBER};

	//Block ID = 1
	private parseGraphics(blockID:number):void
	{
		var graphics:Graphics = new Graphics();

		// Read name and sub count
		var name:string = this.parseVarStr();
		var numElements:number = this._newBlockBytes.readUnsignedShort();

		// Read optional properties
		var props:AWDProperties = this.parseProperties(AWDParser.graphicsProperties);
		var geoScaleU:number = props.get(1, 1);
		var geoScaleV:number = props.get(2, 1);
		var target_start_idx:number=0;
		var target_vert_cnt:number=0;
		var element_type:number = ElementType.STANDART_STREAMS;
		var target_element:ElementsBase = null;
		// Loop through sub sprites
		for (var elements_parsed:number = 0;  elements_parsed < numElements; elements_parsed++) {
			var is_curve_elements:boolean=false;
			var attr_count:number=0;
			var sm_len:number, sm_end:number;
			var w_indices:Array<number>;
			var weights:Array<number>;
			target_start_idx=0;
			target_vert_cnt=0;
			element_type = ElementType.STANDART_STREAMS;
			target_element = null;
			sm_len = this._newBlockBytes.readUnsignedInt();
			sm_end = this._newBlockBytes.position + sm_len;
			var elementsProps:AWDProperties = this.parseProperties(AWDParser.elementsProperties);
			// Loop through data streams
			while (this._newBlockBytes.position < sm_end) {
				var idx:number = 0;
				var str_ftype:number, str_type:number, str_len:number, str_end:number;

				// Type, field type, length
				str_type = this._newBlockBytes.readUnsignedByte();
				str_ftype = this._newBlockBytes.readUnsignedByte();
				str_len = this._newBlockBytes.readUnsignedInt();
				str_end = this._newBlockBytes.position + str_len;

				var x:number, y:number, z:number;

				if (str_type == 1) {//vertex 3d positions
					var verts:Array<number> = new Array<number>();

					while (this._newBlockBytes.position < str_end) {

						x = this.readNumber(this._accuracyGeo);
						y = this.readNumber(this._accuracyGeo);
						z = this.readNumber(this._accuracyGeo);

						verts[idx++] = x;
						verts[idx++] = y;
						verts[idx++] = z;
					}
				} else if (str_type == 2) {//face indicies positions
					var indices:Array<number> = new Array<number>();
					while (this._newBlockBytes.position < str_end)
						indices[idx++] = this._newBlockBytes.readUnsignedShort();

				} else if (str_type == 3) {
					var uvs:Array<number> = new Array<number>();
					while (this._newBlockBytes.position < str_end)
						uvs[idx++] = this.readNumber(this._accuracyGeo);
				} else if (str_type == 4) {
					var normals:Array<number> = new Array<number>();
					while (this._newBlockBytes.position < str_end)
						normals[idx++] = this.readNumber(this._accuracyGeo);
				} else if (str_type == 6) {
					w_indices = Array<number>();
					while (this._newBlockBytes.position < str_end)
						w_indices[idx++] = this._newBlockBytes.readUnsignedShort()*3;
				} else if (str_type == 7) {
					weights = new Array<number>();
					while (this._newBlockBytes.position < str_end)
						weights[idx++] = this.readNumber(this._accuracyGeo);
				} else if (str_type == 8) {// 2d-positions - not used yet.
					this._newBlockBytes.position = str_end;
				} else if (str_type == 9) {// combined vertex3D stream 13 x float32
					this._newBlockBytes.position = str_end;
				} else if (str_type == 10) {// combined vertex2D stream 7 x float32 (2d pos + uv + curvedata)
					element_type=ElementType.CONCENATED_STREAMS;
					attr_count = 28;
					var curveData:ByteArray = new ByteArray(str_len);
					this._newBlockBytes.readBytes(curveData, 0, str_len);
				} else if (str_type == 11) {// combined vertex2D stream 5 x float32 (2d pos + curvedata)
					element_type=ElementType.CONCENATED_STREAMS;
					attr_count = 20;
					var curveData:ByteArray = new ByteArray(str_len);
					this._newBlockBytes.readBytes(curveData, 0, str_len);
				} else if (str_type == 12) {// combined vertex2D stream 5 x float32 (2d pos + curvedata)
					element_type=ElementType.CONCENATED_STREAMS;
					attr_count = 12;
					var curveData:ByteArray = new ByteArray(str_len);
					this._newBlockBytes.readBytes(curveData, 0, str_len);
				} else if (str_type == 13) {// combined vertex2D stream 5 x float32 (2d pos + curvedata)else {
					element_type=ElementType.SHARED_BUFFER;
					var targetGraphic:Graphics=<Graphics>(this._blocks[this._newBlockBytes.readUnsignedInt()].data);
					var element_idx:number=this._newBlockBytes.readUnsignedByte();
					target_element = targetGraphic.getGraphicAt(element_idx).elements;
					target_start_idx = this._newBlockBytes.readUnsignedInt();
					target_vert_cnt = this._newBlockBytes.readUnsignedInt();
				}else{
					console.log("skipping unknown subgeom stream");
					this._newBlockBytes.position = str_end;
				}
			}

			this.parseUserAttributes(); // Ignore sub-sprite attributes for now

			if(element_type==ElementType.CONCENATED_STREAMS){
				//console.log("str_len/attr_count = "+str_len/attr_count)
				var vertexBuffer:AttributesBuffer = new AttributesBuffer(attr_count, str_len/attr_count);
				vertexBuffer.bufferView = new Uint8Array(<ArrayBuffer> curveData.arraybytes);

				var curve_elements:TriangleElements = new TriangleElements(vertexBuffer);

				curve_elements.setPositions(new Float2Attributes(vertexBuffer));
				if(attr_count==20){
					curve_elements.setCustomAttributes("curves", new Float3Attributes(vertexBuffer));
				}
				else if(attr_count==12){
					curve_elements.setCustomAttributes("curves", new Byte4Attributes(vertexBuffer, false));
				}

				if(attr_count==28)
					curve_elements.setUVs(new Float2Attributes(vertexBuffer));

				graphics.addGraphic(curve_elements);

				if (this._debug)
					console.log("Parsed a TriangleElements with curves");

			}
			else if(element_type==ElementType.STANDART_STREAMS){
				var triangle_elements = new TriangleElements(new AttributesBuffer());

				if (weights)
					triangle_elements.jointsPerVertex = weights.length / (verts.length / 3);

				if (normals)
					triangle_elements.autoDeriveNormals = false;

				triangle_elements.autoDeriveTangents = true;

				triangle_elements.setIndices(indices);
				triangle_elements.setPositions(verts);
				triangle_elements.setNormals(normals);
				triangle_elements.setUVs(uvs);
				triangle_elements.setJointWeights(weights);
				triangle_elements.setJointIndices(w_indices);

				var scaleU:number = elementsProps.get(1, 1);
				var scaleV:number = elementsProps.get(2, 1);
				var setSubUVs:boolean = false; //this should remain false atm, because in AwayBuilder the uv is only scaled by the graphics

				if ((geoScaleU != scaleU) || (geoScaleV != scaleV)) {
					setSubUVs = true;
					scaleU = geoScaleU / scaleU;
					scaleV = geoScaleV / scaleV;
				}

				if (setSubUVs)
					triangle_elements.scaleUV(scaleU, scaleV);

				graphics.addGraphic(triangle_elements);
				if (this._debug)
					console.log("Parsed a TriangleElements");
			}
			else if(element_type==ElementType.SHARED_BUFFER){

				var graphic:Graphic = graphics.addGraphic(target_element);
				graphic.offset = target_start_idx;
				graphic.count = target_vert_cnt;
				if (this._debug)
					console.log("Parsed a TriangleElements that shares buffer from target geom");
			}

			// TODO: Somehow map in-sub to out-sub indices to enable look-up
			// when creating sprites (and their material assignments.)
		}

		if ((geoScaleU != 1) || (geoScaleV != 1))
			graphics.scaleUV(geoScaleU, geoScaleV);
		this.parseUserAttributes();
		this._pFinalizeAsset(<IAsset> graphics, name);
		this._blocks[blockID].data = graphics;

		if (this._debug)
			console.log("Parsed Graphics: Name = " + name);
	}

	private static primitiveProperties:Object = {
		101:AWDParser.GEO_NUMBER,
		102:AWDParser.GEO_NUMBER,
		103:AWDParser.GEO_NUMBER,
		110:AWDParser.GEO_NUMBER,
		111:AWDParser.GEO_NUMBER,
		301:AWDParser.UINT16,
		302:AWDParser.UINT16,
		303:AWDParser.UINT16,
		701:AWDParser.BOOL,
		702:AWDParser.BOOL,
		703:AWDParser.BOOL,
		704:AWDParser.BOOL};

	private static primitiveTypes:Array<string> = ["Unsupported Type-ID", "PrimitivePlanePrefab", "PrimitiveCubePrefab", "PrimitiveSpherePrefab", "PrimitiveCylinderPrefab", "PrimitivesConePrefab", "PrimitivesCapsulePrefab", "PrimitivesTorusPrefab"];

	//Block ID = 11
	private parsePrimitves(blockID:number):void
	{
		var name:string;
		var prefab:PrefabBase;
		var primType:number;
		var elements_parsed:number;
		var props:AWDProperties;
		var bsm:Matrix3D;

		// Read name and sub count
		name = this.parseVarStr();
		primType = this._newBlockBytes.readUnsignedByte();
		props = this.parseProperties(AWDParser.primitiveProperties);

		// to do, not all properties are set on all primitives
		switch (primType) {
			case 1:
				prefab = new PrimitivePlanePrefab(null, ElementsType.TRIANGLE, props.get(101, 100), props.get(102, 100), props.get(301, 1), props.get(302, 1), props.get(701, true), props.get(702, false));
				break;

			case 2:
				prefab = new PrimitiveCubePrefab(null, ElementsType.TRIANGLE, props.get(101, 100), props.get(102, 100), props.get(103, 100), props.get(301, 1), props.get(302, 1), props.get(303, 1), props.get(701, true));
				break;

			case 3:
				prefab = new PrimitiveSpherePrefab(null, ElementsType.TRIANGLE, props.get(101, 50), props.get(301, 16), props.get(302, 12), props.get(701, true));
				break;

			case 4:
				prefab = new PrimitiveCylinderPrefab(null, ElementsType.TRIANGLE, props.get(101, 50), props.get(102, 50), props.get(103, 100), props.get(301, 16), props.get(302, 1), true, true, true); // bool701, bool702, bool703, bool704);
				if (!props.get(701, true))
					(<PrimitiveCylinderPrefab>prefab).topClosed = false;
				if (!props.get(702, true))
					(<PrimitiveCylinderPrefab>prefab).bottomClosed = false;
				if (!props.get(703, true))
					(<PrimitiveCylinderPrefab>prefab).yUp = false;

				break;

			case 5:
				prefab = new PrimitiveConePrefab(null, ElementsType.TRIANGLE, props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 1), props.get(701, true), props.get(702, true));
				break;

			case 6:
				prefab = new PrimitiveCapsulePrefab(null, ElementsType.TRIANGLE, props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 15), props.get(701, true));
				break;

			case 7:
				prefab = new PrimitiveTorusPrefab(null, ElementsType.TRIANGLE, props.get(101, 50), props.get(102, 50), props.get(301, 16), props.get(302, 8), props.get(701, true));
				break;

			default:
				prefab = new PrefabBase();
				console.log("ERROR: UNSUPPORTED PREFAB_TYPE");
				break;
		}

		if ((props.get(110, 1) != 1) || (props.get(111, 1) != 1)) {
			//graphics.elements;
			//graphics.scaleUV(props.get(110, 1), props.get(111, 1)); //TODO add back scaling to prefabs
		}

		this.parseUserAttributes();
		prefab.name = name;
		this._pFinalizeAsset(prefab, name);
		this._blocks[blockID].data = prefab;

		if (this._debug) {
			if ((primType < 0) || (primType > 7))
				primType = 0;

			console.log("Parsed a Primivite: Name = " + name + "| type = " + AWDParser.primitiveTypes[primType]);
		}
	}

	private static containerProperties:Object = {
		1:AWDParser.MATRIX_NUMBER,
		2:AWDParser.MATRIX_NUMBER,
		3:AWDParser.MATRIX_NUMBER,
		4:AWDParser.UINT8};

	// Block ID = 22
	private parseContainer(blockID:number):void
	{
		var name:string;
		var mtx:Matrix3D;
		var ctr:DisplayObjectContainer;
		var parent:DisplayObjectContainer = <DisplayObjectContainer> this._blocks[this._newBlockBytes.readUnsignedInt()].data;

		mtx = this.parseMatrix3D();
		name = this.parseVarStr();

		var parentName:string = "Root (TopLevel)";
		ctr = new DisplayObjectContainer();
		ctr.transform.matrix3D = mtx;

		if (parent) {
			parent.addChild(ctr);
			parentName = parent.name;
		} else {
			//add to the content property
			(<DisplayObjectContainer> this._pContent).addChild(ctr);
		}

		// in AWD version 2.1 we read the Container properties
		if ((this._version[0] == 2) && (this._version[1] == 1)) {
			var props:AWDProperties = this.parseProperties(AWDParser.containerProperties);
			ctr.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
		} else {// in other versions we do not read the Container properties
			this.parseProperties(null);
		}

		// the extraProperties should only be set for AWD2.1-Files, but is read for both versions
		ctr.extra = this.parseUserAttributes();

		this._pFinalizeAsset(<IAsset> ctr, name);
		this._blocks[blockID].data = ctr;

		if (this._debug)
			console.log("Parsed a Container: Name = '" + name + "' | Parent-Name = " + parentName);
	}

	private static spriteInstanceProperties:Object = {
		1:AWDParser.MATRIX_NUMBER,
		2:AWDParser.MATRIX_NUMBER,
		3:AWDParser.MATRIX_NUMBER,
		4:AWDParser.UINT8,
		5:AWDParser.BOOL};

	// Block ID = 23
	private parseSpriteInstance(blockID:number):void
	{
		var parent:DisplayObjectContainer = <DisplayObjectContainer> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		var mtx:Matrix3D = this.parseMatrix3D();
		var name:string = this.parseVarStr();

		var data_id:number = this._newBlockBytes.readUnsignedInt();
		var asset:IAsset = <IAsset> this._blocks[data_id].data;
		var graphics:Graphics;
		var prefab:PrefabBase;
		var isPrefab:boolean=false;
		if (asset.isAsset(Graphics)) {
			graphics = <Graphics> asset;
		} else {
			isPrefab = true;
			prefab = <PrefabBase> asset;
		}

		this._blocks[blockID].geoID = data_id;
		var num_materials:number = this._newBlockBytes.readUnsignedShort();
		var materials:Array<MethodMaterial> = new Array<MethodMaterial>();
		var materialNames:Array<string> = new Array<string>();
		var mat:MethodMaterial;
		for (var materials_parsed:number = 0; materials_parsed < num_materials; materials_parsed++) {
			mat = <MethodMaterial> (this._blocks[this._newBlockBytes.readUnsignedInt()].data || DefaultMaterialManager.getDefaultMaterial());
			materials[materials_parsed] = mat;
			materialNames[materials_parsed] = mat.name;
		}

		var sprite:Sprite;

		if (isPrefab) {
			sprite = <Sprite> prefab.getNewObject()
		} else {
			sprite = new Sprite();
			graphics.copyTo(sprite.graphics);
		}

		sprite.transform.matrix3D = mtx;

		var parentName:string = "Root (TopLevel)";
		if (parent) {
			parent.addChild(sprite);
			parentName = parent.name;
		} else {
			//add to the content property
			(<DisplayObjectContainer> this._pContent).addChild(sprite);
		}

		if (materials.length >= 1 && sprite.graphics.count == 1) {
			sprite.material = materials[0];
		} else if (materials.length > 1) {
			// Assign each sub-sprite in the sprite a material from the list. If more sub-sprites
			// than materials, repeat the last material for all remaining sub-sprites.
			for (var i:number = 0; i < sprite.graphics.count; i++)
				sprite.graphics.getGraphicAt(i).material = materials[Math.min(materials.length - 1, i)];
		}
		if ((this._version[0] == 2) && (this._version[1] == 1)) {
			var props:AWDProperties = this.parseProperties(AWDParser.spriteInstanceProperties);
			sprite.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
			sprite.castsShadows = props.get(5, true);
		} else {
			this.parseProperties(null);
		}

		sprite.extra = this.parseUserAttributes();

		this._pFinalizeAsset(<IAsset> sprite, name);
		this._blocks[blockID].data = sprite;

		if (this._debug) {
			if (isPrefab)
				console.log("Parsed a Sprite for Prefab: Name = '" + name + "' | Parent-Name = " + parentName + "| Prefab-Name = " + prefab.name + " | Graphics-Count = " + sprite.graphics.count + " | Mat-Names = " + materialNames);
			else
				console.log("Parsed a Sprite for Graphics: Name = '" + name + "' | Parent-Name = " + parentName + "| Graphics-Name = " + graphics.name + " | Graphics-Count = " + sprite.graphics.count + " | Mat-Names = " + materialNames);
		}
	}


	//Block ID 31
	private parseSkyboxInstance(blockID:number):void
	{
		var name:string = this.parseVarStr();
		var asset:Skybox = new Skybox();
		var tex:SingleCubeTexture = new SingleCubeTexture(<BitmapImageCube> this._blocks[this._newBlockBytes.readUnsignedInt()].data || DefaultMaterialManager.getDefaultImageCube());
		asset.texture = tex;

		this.parseProperties(null);
		asset.extra = this.parseUserAttributes();
		this._pFinalizeAsset(asset, name);
		this._blocks[blockID].data = asset;
		if (this._debug)
			console.log("Parsed a Skybox: Name = '" + name + "' | CubeTexture-Name = " + tex.name);
	}

	private static lightProperties:Object = {
		1:AWDParser.PROPERTY_NUMBER,
		2:AWDParser.PROPERTY_NUMBER,
		3:AWDParser.COLOR,
		4:AWDParser.PROPERTY_NUMBER,
		5:AWDParser.PROPERTY_NUMBER,
		6:AWDParser.BOOL,
		7:AWDParser.COLOR,
		8:AWDParser.PROPERTY_NUMBER,
		9:AWDParser.UINT8,
		10:AWDParser.UINT8,
		11:AWDParser.PROPERTY_NUMBER,
		12:AWDParser.UINT16,
		21:AWDParser.MATRIX_NUMBER,
		22:AWDParser.MATRIX_NUMBER,
		23:AWDParser.MATRIX_NUMBER};

	//Block ID = 41
	private parseLight(blockID:number):void
	{
		var light:LightBase;
		var newShadowMapper:ShadowMapperBase;

		var parent:DisplayObjectContainer = <DisplayObjectContainer> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		var mtx:Matrix3D = this.parseMatrix3D();
		var name:string = this.parseVarStr();
		var lightType:number = this._newBlockBytes.readUnsignedByte();
		var props:AWDProperties = this.parseProperties(AWDParser.lightProperties);
		var shadowMapperType:number = props.get(9, 0);
		var lightTypes:Array<string> = ["Unsupported LightType", "PointLight", "DirectionalLight"];
		var shadowMapperTypes:Array<string> = ["No ShadowMapper", "DirectionalShadowMapper", "NearDirectionalShadowMapper", "CascadeShadowMapper", "CubeMapShadowMapper"];

		if (lightType == 1) {
			light = new PointLight();

			(<PointLight> light).radius = props.get(1, 90000);
			(<PointLight> light).fallOff = props.get(2, 100000);

			if (shadowMapperType > 0) {
				if (shadowMapperType == 4) {
					newShadowMapper = new CubeMapShadowMapper();
				}
			}

			light.transform.matrix3D = mtx;
		}

		if (lightType == 2) {
			light = new DirectionalLight(props.get(21, 0), props.get(22, -1), props.get(23, 1));

			if (shadowMapperType > 0) {
				if (shadowMapperType == 1) {
					newShadowMapper = new DirectionalShadowMapper();
				}

				//if (shadowMapperType == 2)
				//  newShadowMapper = new NearDirectionalShadowMapper(props.get(11, 0.5));
				//if (shadowMapperType == 3)
				//   newShadowMapper = new CascadeShadowMapper(props.get(12, 3));

			}
		}

		light.color = props.get(3, 0xffffff);
		light.specular = props.get(4, 1.0);
		light.diffuse = props.get(5, 1.0);
		light.ambientColor = props.get(7, 0xffffff);
		light.ambient = props.get(8, 0.0);

		// if a shadowMapper has been created, adjust the depthMapSize if needed, assign to light and set castShadows to true
		if (newShadowMapper) {
			if (newShadowMapper instanceof CubeMapShadowMapper) {
				if (props.get(10, 1) != 1)
					newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 1)];
			} else {
				if (props.get(10, 2) != 2)
					newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 2)];
			}

			light.shadowMapper = newShadowMapper;
			light.castsShadows = true;
		}

		var parentName:string = "Root (TopLevel)";
		if (parent) {
			parent.addChild(light);
			parentName = parent.name;
		} else {
			//add to the content property
			(<DisplayObjectContainer> this._pContent).addChild(light);
		}

		this.parseUserAttributes();
		this._pFinalizeAsset(< IAsset> light, name);

		this._blocks[blockID].data = light;

		if (this._debug)
			console.log("Parsed a Light: Name = '" + name + "' | Type = " + lightTypes[lightType] + " | Parent-Name = " + parentName + " | ShadowMapper-Type = " + shadowMapperTypes[shadowMapperType]);
	}

	private static cameraProperties:Object = {
		101:AWDParser.PROPERTY_NUMBER,
		102:AWDParser.PROPERTY_NUMBER,
		103:AWDParser.PROPERTY_NUMBER,
		104:AWDParser.PROPERTY_NUMBER};

	private static cameraPivotProperties:Object = {
		1:AWDParser.MATRIX_NUMBER,
		2:AWDParser.MATRIX_NUMBER,
		3:AWDParser.MATRIX_NUMBER,
		4:AWDParser.UINT8};

	//Block ID = 43
	private parseCamera(blockID:number):void
	{
		var parent:DisplayObjectContainer = <DisplayObjectContainer> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		var mtx:Matrix3D = this.parseMatrix3D();
		var name:string = this.parseVarStr();
		var projection:ProjectionBase;

		this._newBlockBytes.readUnsignedByte(); //set as active camera
		this._newBlockBytes.readShort(); //lengthof lenses - not used yet

		var projectiontype:number = this._newBlockBytes.readShort();
		var props:AWDProperties = this.parseProperties(AWDParser.cameraProperties);

		switch (projectiontype) {
			case 5001:
				projection = new PerspectiveProjection(props.get(101, 60));
				break;
			case 5002:
				projection = new OrthographicProjection(props.get(101, 500));
				break;
			case 5003:
				projection = new OrthographicOffCenterProjection(props.get(101, -400), props.get(102, 400), props.get(103, -300), props.get(104, 300));
				break;
			default:
				console.log("unsupportedLenstype");
				return;
		}

		var camera:Camera = new Camera(projection);
		camera.transform.matrix3D = mtx;

		var parentName:string = "Root (TopLevel)";
		if (parent) {
			parent.addChild(camera);
			parentName = parent.name;
		} else {
			//add to the content property
			(<DisplayObjectContainer> this._pContent).addChild(camera);
		}

		camera.name = name;
		props = this.parseProperties(AWDParser.cameraPivotProperties);
		camera.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
		camera.extra = this.parseUserAttributes();

		this._pFinalizeAsset(camera, name);

		this._blocks[blockID].data = camera;

		if (this._debug)
			console.log("Parsed a Camera: Name = '" + name + "' | Projectiontype = " + projection + " | Parent-Name = " + parentName);
	}

	//Block ID = 51
	private parseLightPicker(blockID:number):void
	{
		var name:string = this.parseVarStr();
		var numLights:number = this._newBlockBytes.readUnsignedShort();
		var lightsArray:Array<LightBase> = new Array<LightBase>();

		var lightsArrayNames:Array<string> = new Array<string>();

		for (var k:number = 0; k < numLights; k++) {
			var light:LightBase = <LightBase> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
			lightsArray.push(light);
			lightsArrayNames.push(light.name);
		}

		if (lightsArray.length == 0) {
			this._blocks[blockID].addError("Could not create this LightPicker, cause no Light was found.");
			this.parseUserAttributes();
			return; //return without any more parsing for this block
		}

		var lightPick:LightPickerBase = new StaticLightPicker(lightsArray);
		lightPick.name = name;

		this.parseUserAttributes();
		this._pFinalizeAsset(<IAsset> lightPick, name);

		this._blocks[blockID].data = lightPick;

		if (this._debug)
			console.log("Parsed a StaticLightPicker: Name = '" + name + "' | Texture-Name = " + lightsArrayNames);
	}

	// (1=color, 2=bitmap url, 10=alpha, 11=alpha_blending, 12=alpha_threshold, 13=repeat)
	private static materialProperties:Object = {
		1:AWDParser.INT32,
		2:AWDParser.BADDR,
		10:AWDParser.PROPERTY_NUMBER,
		11:AWDParser.BOOL,
		12:AWDParser.PROPERTY_NUMBER,
		13:AWDParser.BOOL};

	//Block ID = 81
	private parseMaterial(blockID:number):void
	{
		// TODO: not used
		////blockLength = block.len;
		var name:string;
		var type:number;
		var props:AWDProperties;
		var mat:MethodMaterial;
		var finalize:boolean;
		var num_methods:number;
		var methods_parsed:number;
		var returnedArray:Array<any>;

		name = this.parseVarStr();
		type = this._newBlockBytes.readUnsignedByte();
		num_methods = this._newBlockBytes.readUnsignedByte();

		// Read material numerical properties
		props = this.parseProperties(AWDParser.materialProperties);

		methods_parsed = 0;
		while (methods_parsed < num_methods) {
			var method_type:number;

			method_type = this._newBlockBytes.readUnsignedShort();
			this.parseProperties(null);
			this.parseUserAttributes();
			methods_parsed += 1;
		}

		var debugString:string = "";
		if (type === 1) { // Color material
			debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
			var color:number = props.get(1, 0xffffff);
			if (this.materialMode < 2) {
				mat = new MethodMaterial(color, props.get(10, 1.0));
			} else {
				mat = new MethodMaterial(color);
				mat.mode = MethodMaterialMode.MULTI_PASS;
			}
		} else if (type === 2) {
			var texture:Single2DTexture = new Single2DTexture(<BitmapImage2D> this._blocks[props.get(2, 0)].data);

			mat = new MethodMaterial();
			mat.ambientMethod.texture = texture;

			if (this.materialMode < 2) {
				mat.alphaBlending = props.get(11, false);
				mat.alpha = props.get(10, 1.0);
				debugString += "Parsed a MethodMaterial(SinglePass): Name = '" + name + "'" + (texture? " | Texture-Name = " + texture.name : "");
			} else {
				mat.mode = MethodMaterialMode.MULTI_PASS;
				debugString += "Parsed a MethodMaterial(MultiPass): Name = '" + name + "'" + (texture? " | Texture-Name = " + texture.name : "");
			}
		}

		mat.extra = this.parseUserAttributes();
		mat.alphaThreshold = props.get(12, 0.0);
		mat.style.sampler = new Sampler2D(props.get(13, false));

		this._pFinalizeAsset(<IAsset> mat, name);

		this._blocks[blockID].data = mat;

		if (this._debug)
			console.log(debugString);
	}
	
	private static material_v1Properties:Object = {1:AWDParser.UINT32,
		2:AWDParser.BADDR,
		3:AWDParser.BADDR,
		4:AWDParser.UINT8,
		5:AWDParser.BOOL,
		6:AWDParser.BOOL,
		7:AWDParser.BOOL,
		8:AWDParser.BOOL,
		9:AWDParser.UINT8,
		10:AWDParser.PROPERTY_NUMBER,
		11:AWDParser.BOOL,
		12:AWDParser.PROPERTY_NUMBER,
		13:AWDParser.BOOL,
		15:AWDParser.PROPERTY_NUMBER,
		16:AWDParser.UINT32,
		17:AWDParser.BADDR,
		18:AWDParser.PROPERTY_NUMBER,
		19:AWDParser.PROPERTY_NUMBER,
		20:AWDParser.UINT32,
		21:AWDParser.BADDR,
		22:AWDParser.BADDR};

	private static method_v1Properties:Object = {
		1:AWDParser.BADDR,
		2:AWDParser.BADDR,
		3:AWDParser.BADDR,
		101:AWDParser.PROPERTY_NUMBER,
		102:AWDParser.PROPERTY_NUMBER,
		103:AWDParser.PROPERTY_NUMBER,
		201:AWDParser.UINT32,
		202:AWDParser.UINT32,
		301:AWDParser.UINT16,
		302:AWDParser.UINT16,
		401:AWDParser.UINT8,
		402:AWDParser.UINT8,
		601:AWDParser.COLOR,
		602:AWDParser.COLOR,
		701:AWDParser.BOOL,
		702:AWDParser.BOOL,
		801:AWDParser.MTX4x4};

	// Block ID = 81 AWD2.1
	private parseMaterial_v1(blockID:number):void
	{
		var mat:MethodMaterial;
		var diffuseImage:BitmapImage2D;
		var normalImage:BitmapImage2D;
		var specImage:BitmapImage2D;

		var name:string = this.parseVarStr();
		var type:number = this._newBlockBytes.readUnsignedByte();
		var num_methods:number = this._newBlockBytes.readUnsignedByte();
		var props:AWDProperties = this.parseProperties(AWDParser.material_v1Properties);
		var spezialType:number = props.get(4, 0);
		var debugString:string = "Parsed Material ";

		if (spezialType >= 2) {//this is no supported material
			this._blocks[blockID].addError("Material-spezialType '" + spezialType + "' is not supported, can only be 0:singlePass, 1:MultiPass !");
			return;
		}

		if (type <= 2) {// Color material
			if (this.materialMode == 1)
				spezialType = 0;
			else if (this.materialMode == 2)
				spezialType = 1;

			if (spezialType < 2) {//this is SinglePass or MultiPass

				if (type == 1) {// Color material
					var color:number = props.get(1, 0xcccccc);//TODO temporarily swapped so that diffuse color goes to ambient

					if (spezialType == 1) {//	MultiPassMaterial
						mat = new MethodMaterial(color);
						mat.mode = MethodMaterialMode.MULTI_PASS;
						debugString += "Parsed a ColorMaterial(MultiPass): Name = '" + name + "' | ";

					} else { //	SinglePassMaterial
						mat = new MethodMaterial(color, props.get(10, 1.0));
						mat.alphaBlending = props.get(11, false);
						debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
					}

				} else if (type == 2) {// texture material
					var texture:Single2DTexture = new Single2DTexture(<BitmapImage2D> this._blocks[props.get(2, 0)].data);

					mat = new MethodMaterial();
					mat.ambientMethod.texture = texture;

					if (spezialType == 1) {// MultiPassMaterial
						mat.mode = MethodMaterialMode.MULTI_PASS;

						debugString += "Parsed a MethodMaterial(MultiPass): Name = '" + name + "'" + (texture? " | Texture-Name = " + texture.name : "");
					} else {//	SinglePassMaterial
						mat.alpha = props.get(10, 1.0);
						mat.alphaBlending = props.get(11, false);

						debugString += "Parsed a MethodMaterial(SinglePass): Name = '" + name + "'" + (texture? " | Texture-Name = " + texture.name : "");
					}
				}

				diffuseImage = <BitmapImage2D> this._blocks[props.get(17, 0)].data;
				normalImage = <BitmapImage2D> this._blocks[props.get(3, 0)].data;
				specImage = <BitmapImage2D> this._blocks[props.get(21, 0)].data;
				mat.lightPicker = <LightPickerBase> this._blocks[props.get(22, 0)].data;
				mat.style.sampler = new Sampler2D(props.get(13, false), props.get(5, true), props.get(6, true));
				mat.bothSides = props.get(7, false);
				mat.alphaPremultiplied = props.get(8, false);
				mat.blendMode = this.blendModeDic[props.get(9, 0)];

				if (diffuseImage) {
					mat.diffuseTexture = new Single2DTexture(diffuseImage);
					debugString += " | DiffuseTexture-Name = " + diffuseImage.name;
				}

				if (normalImage) {
					mat.normalMethod.texture = new Single2DTexture(normalImage);
					debugString += " | NormalTexture-Name = " + normalImage.name;
				}

				if (specImage) {
					mat.specularMethod.texture = new Single2DTexture(specImage);
					debugString += " | SpecularTexture-Name = " + specImage.name;
				}

				mat.alphaThreshold = props.get(12, 0.0);
				mat.ambientMethod.strength = props.get(15, 1.0);
				mat.diffuseMethod.color = props.get(16, 0xffffff);
				mat.specularMethod.strength = props.get(18, 1.0);
				mat.specularMethod.gloss = props.get(19, 50);
				mat.specularMethod.color = props.get(20, 0xffffff);

				for (var methods_parsed:number = 0; methods_parsed < num_methods; methods_parsed++) {
					var method_type:number;
					method_type = this._newBlockBytes.readUnsignedShort();

					props = this.parseProperties(AWDParser.method_v1Properties);

					switch (method_type) {
						case 999: //wrapper-Methods that will load a previous parsed EffektMethod returned
							var effectMethod:EffectMethodBase = <EffectMethodBase> this._blocks[props.get(1, 0)].data;
							mat.addEffectMethod(effectMethod);
							debugString += " | EffectMethod-Name = " + effectMethod.name;

							break;

						case 998: //wrapper-Methods that will load a previous parsed ShadowMapMethod
							var shadowMapMethod:ShadowMapMethodBase = <ShadowMapMethodBase> this._blocks[props.get(1, 0)].data;
							mat.shadowMethod = shadowMapMethod;
							debugString += " | ShadowMethod-Name = " + shadowMapMethod.name;

							break;

						case 1: //EnvMapAmbientMethod
							var cubeTexture:SingleCubeTexture = new SingleCubeTexture(<BitmapImageCube> this._blocks[props.get(1, 0)].data);
							mat.ambientMethod = new AmbientEnvMapMethod();
							mat.ambientMethod.texture = cubeTexture;
							debugString += " | AmbientEnvMapMethod | EnvMap-Name =" + cubeTexture.name;

							break;

						case 51: //DepthDiffuseMethod
							mat.diffuseMethod = new DiffuseDepthMethod();
							debugString += " | DiffuseDepthMethod";
							break;
						case 52: //GradientDiffuseMethod
							var texture:Single2DTexture = new Single2DTexture(<BitmapImage2D> this._blocks[props.get(1, 0)].data);
							mat.diffuseMethod = new DiffuseGradientMethod(texture);
							debugString += " | DiffuseGradientMethod | GradientDiffuseTexture-Name =" + texture.name;
							break;
						case 53: //WrapDiffuseMethod
							mat.diffuseMethod = new DiffuseWrapMethod(props.get(101, 5));
							debugString += " | DiffuseWrapMethod";
							break;
						case 54: //LightMapDiffuseMethod
							var texture:Single2DTexture = new Single2DTexture(<BitmapImage2D> this._blocks[props.get(1, 0)].data);
							mat.diffuseMethod = new DiffuseLightMapMethod(texture, this.blendModeDic[props.get(401, 10)], false, mat.diffuseMethod);
							debugString += " | DiffuseLightMapMethod | LightMapTexture-Name =" + texture.name;
							break;
						case 55: //CelDiffuseMethod
							mat.diffuseMethod = new DiffuseCelMethod(props.get(401, 3), mat.diffuseMethod);
							(<DiffuseCelMethod> mat.diffuseMethod).smoothness = props.get(101, 0.1);
							debugString += " | DiffuseCelMethod";
							break;
						case 56: //SubSurfaceScatteringMethod
							//							mat.diffuseMethod = new DiffuseSubSurfaceMethod(); //depthMapSize and depthMapOffset ?
							//							(<DiffuseSubSurfaceMethod> mat.diffuseMethod).scattering = props.get(101, 0.2);
							//							(<DiffuseSubSurfaceMethod> mat.diffuseMethod).translucency = props.get(102, 1);
							//							(<DiffuseSubSurfaceMethod> mat.diffuseMethod).scatterColor = props.get(601, 0xffffff);
							//							debugString += " | DiffuseSubSurfaceMethod";
							break;

						case 101: //AnisotropicSpecularMethod
							mat.specularMethod = new SpecularAnisotropicMethod();
							debugString += " | SpecularAnisotropicMethod";
							break;
						case 102: //SpecularPhongMethod
							mat.specularMethod = new SpecularPhongMethod();
							debugString += " | SpecularPhongMethod";
							break;
						case 103: //CellSpecularMethod
							mat.specularMethod = new SpecularCelMethod(props.get(101, 0.5), mat.specularMethod);
							(<SpecularCelMethod> mat.specularMethod).smoothness = props.get(102, 0.1);
							debugString += " | SpecularCelMethod";
							break;
						case 104: //SpecularFresnelMethod
							mat.specularMethod = new SpecularFresnelMethod(props.get(701, true), mat.specularMethod);
							(<SpecularFresnelMethod> mat.specularMethod).fresnelPower = props.get(101, 5);
							(<SpecularFresnelMethod> mat.specularMethod).normalReflectance = props.get(102, 0.1);
							debugString += " | SpecularFresnelMethod";
							break;
						case 151://HeightMapNormalMethod - thios is not implemented for now, but might appear later
							break;
						case 152: //SimpleWaterNormalMethod
							var texture:Single2DTexture = new Single2DTexture(<BitmapImage2D> this._blocks[props.get(1, 0)].data);
							mat.normalMethod = new NormalSimpleWaterMethod(<Single2DTexture> mat.normalMethod.texture || texture, texture);
							debugString += " | NormalSimpleWaterMethod | Second-NormalTexture-Name = " + texture.name;
							break;
					}
					this.parseUserAttributes();
				}
			}
		}
		// todo: we should not need this anymore (if using texture-atlas)
		else if ((type>=3)&&(type<=7)){
			// if this is a basic material, we create it, finalize it, assign it to block-cache and return.
			var color:number = props.get(1, 0xcccccc);
			debugString+=color;
			var diffuseTexture:Single2DTexture = new Single2DTexture(<BitmapImage2D> this._blocks[props.get(2, 0)].data);
			if(type==5){
				diffuseTexture.mappingMode = MappingMode.LINEAR_GRADIENT;
			}
			else if(type==6){
				diffuseTexture.mappingMode = MappingMode.RADIAL_GRADIENT;
			}
			var basic_mat:BasicMaterial = new BasicMaterial();
			basic_mat.texture = diffuseTexture;
			basic_mat.bothSides = true;
			basic_mat.alphaBlending = props.get(11, false);
			//basic_mat.preserveAlpha = basic_mat.alphaBlending;
			//basic_mat.alphaBlending = true;
			basic_mat.extra = this.parseUserAttributes();
			this._pFinalizeAsset(<IAsset> basic_mat, name);
			this._blocks[blockID].data = basic_mat;
			if (this._debug)
				console.log(debugString);
			return;
		
		}
		mat.extra = this.parseUserAttributes();
		this._pFinalizeAsset(<IAsset> mat, name);

		this._blocks[blockID].data = mat;

		if (this._debug)
			console.log(debugString);
	}

	//Block ID = 82
	private parseTexture(blockID:number):void
	{
		this._blocks[blockID].name = this.parseVarStr();

		var type:number = this._newBlockBytes.readUnsignedByte();

		this._texture_users[this._cur_block_id] = [];

		// External
		if (type == 0) {
			var url:string = this._newBlockBytes.readUTFBytes(this._newBlockBytes.readUnsignedInt());
			this._pAddDependency(this._cur_block_id.toString(), new URLRequest(url), false, null, true);

		} else {
			var data_len:number = this._newBlockBytes.readUnsignedInt();
			var data:ByteArray = new ByteArray(data_len);
			this._newBlockBytes.readBytes(data, 0, data_len);

			//
			// AWD3Parserutils - Fix for FireFox Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=715075 .
			//
			// Converting data to image here instead of parser - fix FireFox bug where image width / height is 0 when created from data
			// This gives the browser time to initialise image width / height.

			this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);
			//this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);

		}

		// Ignore for now
		this.parseProperties(null);
		this._blocks[blockID].extras = this.parseUserAttributes();

		this._pPauseAndRetrieveDependencies();

		if (this._debug)
			console.log("Start parsing a " + ["external", "embed"][type] + " Bitmap for Texture");
	}

	//Block ID = 83
	private parseCubeTexture(blockID:number):void
	{
		//blockLength = block.len;
		var data_len:number;
		var i:number;

		this._texture_users[ this._cur_block_id ] = [];

		var type:number = this._newBlockBytes.readUnsignedByte();

		this._blocks[blockID].name = this.parseVarStr();

		for (i = 0; i < 6; i++) {
			this._texture_users[this._cur_block_id] = [];

			// External
			if (type == 0) {
				data_len = this._newBlockBytes.readUnsignedInt();
				var url:string;
				url = this._newBlockBytes.readUTFBytes(data_len);
				this._pAddDependency(this._cur_block_id.toString(), new URLRequest(url), false, null, true, i);
			} else {

				data_len = this._newBlockBytes.readUnsignedInt();
				var data:ByteArray = new ByteArray(data_len);
				this._newBlockBytes.readBytes(data, 0, data_len);

				this._pAddDependency(this._cur_block_id.toString(), null, false, ParserUtils.byteArrayToImage(data), true, i);
			}
		}

		// Ignore for now
		this.parseProperties(null);
		this._blocks[blockID].extras = this.parseUserAttributes();
		this._pPauseAndRetrieveDependencies();

		if (this._debug)
			console.log("Start parsing 6 " + ["external", "embed"][type] + " Bitmaps for CubeTexture");
	}

	//Block ID = 91
	private parseSharedMethodBlock(blockID:number):void
	{
		var asset:EffectMethodBase;

		this._blocks[blockID].name = this.parseVarStr();
		asset = this.parseSharedMethodList(blockID);
		this.parseUserAttributes();
		this._blocks[blockID].data = asset;
		this._pFinalizeAsset(<IAsset> asset, this._blocks[blockID].name);
		this._blocks[blockID].data = asset;

		if (this._debug)
			console.log("Parsed a EffectMethod: Name = " + asset.name + " Type = " + asset);
	}

	//Block ID = 92
	private parseShadowMethodBlock(blockID:number):void
	{
		this._blocks[blockID].name = this.parseVarStr();
		var light:LightBase = <LightBase> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		var asset:ShadowMethodBase = this.parseShadowMethodList(light, blockID);

		if (!asset)
			return;

		this.parseUserAttributes(); // Ignore for now
		this._pFinalizeAsset(<IAsset> asset, this._blocks[blockID].name);
		this._blocks[blockID].data = asset;

		if (this._debug)
			console.log("Parsed a ShadowMapMethodMethod: Name = " + asset.name + " | Type = " + asset + " | Light-Name = ", light.name);
	}

	private static commandProperties:Object = {
		1:AWDParser.BADDR};

	private static targetProperties:Object = {
		1:AWDParser.MATRIX_NUMBER,
		2:AWDParser.MATRIX_NUMBER,
		3:AWDParser.MATRIX_NUMBER,
		4:AWDParser.UINT8};
	
	//Block ID = 253
	private parseCommand(blockID:number):void
	{
		var hasBlocks:boolean = ( this._newBlockBytes.readUnsignedByte() == 1 );
		var parentObject:DisplayObjectContainer = <DisplayObjectContainer> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
		var targetObject:DisplayObjectContainer;
		var mtx:Matrix3D = this.parseMatrix3D();
		var name:string = this.parseVarStr();

		var numCommands:number = this._newBlockBytes.readShort();
		var typeCommand:number = this._newBlockBytes.readShort();

		var props:AWDProperties = this.parseProperties(AWDParser.commandProperties);

		switch (typeCommand) {
			case 1:
				targetObject = this._blocks[props.get(1, 0)].data;
				targetObject.transform.matrix3D = mtx;

				if (parentObject)
					parentObject.addChild(targetObject);

				break;
		}

		if (targetObject) {
			props = this.parseProperties(AWDParser.targetProperties);

			targetObject.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
			targetObject.extra = this.parseUserAttributes();
		}

		this._blocks[blockID].data = targetObject;

		if (this._debug)
			console.log("Parsed a CommandBlock: Name = '" + name);
	}
	
	private static metaDataProperties:Object = {
		1:AWDParser.UINT32,
		2:AWDParser.AWDSTRING,
		3:AWDParser.AWDSTRING,
		4:AWDParser.AWDSTRING,
		5:AWDParser.AWDSTRING};

	//blockID 255
	private parseMetaData(blockID:number):void
	{
		var props:AWDProperties = this.parseProperties(AWDParser.metaDataProperties);

		if (this._debug) {
			console.log("Parsed a MetaDataBlock: TimeStamp         = " + props.get(1, 0));
			console.log("                        EncoderName       = " + props.get(2, "unknown"));
			console.log("                        EncoderVersion    = " + props.get(3, "unknown"));
			console.log("                        GeneratorName     = " + props.get(4, "unknown"));
			console.log("                        GeneratorVersion  = " + props.get(5, "unknown"));
		}
	}

	//blockID 254
	private parseNameSpace(blockID:number):void
	{
		var id:number = this._newBlockBytes.readUnsignedByte();
		var nameSpaceString:string = this.parseVarStr();

		if (this._debug)
			console.log("Parsed a NameSpaceBlock: ID = " + id + " | String = " + nameSpaceString);
	}

	//--Parser UTILS---------------------------------------------------------------------------

	private shadowMethodListProperties:Object = {
		1:AWDParser.BADDR,
		2:AWDParser.BADDR,
		3:AWDParser.BADDR,
		101:AWDParser.PROPERTY_NUMBER,
		102:AWDParser.PROPERTY_NUMBER,
		103:AWDParser.PROPERTY_NUMBER,
		201:AWDParser.UINT32,
		202:AWDParser.UINT32,
		301:AWDParser.UINT16,
		302:AWDParser.UINT16,
		401:AWDParser.UINT8,
		402:AWDParser.UINT8,
		601:AWDParser.COLOR,
		602:AWDParser.COLOR,
		701:AWDParser.BOOL,
		702:AWDParser.BOOL,
		801:AWDParser.MTX4x4}
	
	// this functions reads and creates a ShadowMethodMethod
	private parseShadowMethodList(light:LightBase, blockID:number):ShadowMethodBase
	{

		var methodType:number = this._newBlockBytes.readUnsignedShort();
		var shadowMethod:ShadowMethodBase;
		var props:AWDProperties = this.parseProperties(this.shadowMethodListProperties);

		var targetID:number;
		var returnedArray:Array<any>
		switch (methodType) {
			//				case 1001: //CascadeShadowMapMethod
			//					targetID = props.get(1, 0);
			//					returnedArray = getAssetByID(targetID, [ShadowMapMethodBase.assetType]);
			//					if (!returnedArray[0]) {
			//						_blocks[blockID].addError("Could not find the ShadowBaseMethod (ID = " + targetID + " ) for this CascadeShadowMapMethod - ShadowMethod not created");
			//						return shadowMethod;
			//					}
			//					shadowMethod = new CascadeShadowMapMethod(returnedArray[1]);
			//					break;
			case 1002: //ShadowNearMethod
				shadowMethod = new ShadowNearMethod(<ShadowMethodBase> this._blocks[props.get(1, 0)].data);
				break;
			case 1101: //ShadowFilteredMethod
				shadowMethod = new ShadowFilteredMethod(<DirectionalLight> light);
				(<ShadowFilteredMethod> shadowMethod).alpha = props.get(101, 1);
				(<ShadowFilteredMethod> shadowMethod).epsilon = props.get(102, 0.002);
				break;

			case 1102: //ShadowDitheredMethod
				shadowMethod = new ShadowDitheredMethod(<DirectionalLight> light, <number> props.get(201, 5));
				(<ShadowDitheredMethod> shadowMethod).alpha = props.get(101, 1);
				(<ShadowDitheredMethod> shadowMethod).epsilon = props.get(102, 0.002);
				(<ShadowDitheredMethod> shadowMethod).range = props.get(103, 1);

				break;
			case 1103: //ShadowSoftMethod
				shadowMethod = new ShadowSoftMethod(<DirectionalLight> light, <number> props.get(201, 5));
				(<ShadowSoftMethod> shadowMethod).alpha = props.get(101, 1);
				(<ShadowSoftMethod> shadowMethod).epsilon = props.get(102, 0.002);
				(<ShadowSoftMethod> shadowMethod).range = props.get(103, 1);

				break;
			case 1104: //ShadowHardMethod
				shadowMethod = new ShadowHardMethod(light);
				(<ShadowHardMethod> shadowMethod).alpha = props.get(101, 1);
				(<ShadowHardMethod> shadowMethod).epsilon = props.get(102, 0.002);
				break;

		}
		this.parseUserAttributes();
		return shadowMethod;
	}

	//Block ID 101
	private parseSkeleton(blockID:number /*uint*/):void
	{
		var name:string = this.parseVarStr();
		var num_joints:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
		var skeleton:Skeleton = new Skeleton();
		this.parseProperties(null); // Discard properties for now

		for (var joints_parsed:number = 0; joints_parsed < num_joints; joints_parsed++) {
			var joint:SkeletonJoint;
			var ibp:Matrix3D;
			// Ignore joint id
			this._newBlockBytes.readUnsignedShort();
			joint = new SkeletonJoint();
			joint.parentIndex = this._newBlockBytes.readUnsignedShort() - 1; // 0=null in AWD
			joint.name = this.parseVarStr();

			ibp = this.parseMatrix3D();
			joint.inverseBindPose = ibp.rawData;
			// Ignore joint props/attributes for now
			this.parseProperties(null);
			this.parseUserAttributes();
			skeleton.joints.push(joint);
		}

		// Discard attributes for now
		this.parseUserAttributes();
		this._pFinalizeAsset(skeleton, name);

		this._blocks[blockID].data = skeleton;

		if (this._debug)
			console.log("Parsed a Skeleton: Name = " + skeleton.name + " | Number of Joints = " + joints_parsed);
	}

	//Block ID = 102
	private parseSkeletonPose(blockID:number /*uint*/):void
	{
		var name:string = this.parseVarStr();
		var num_joints:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
		this.parseProperties(null); // Ignore properties for now

		var pose:SkeletonPose = new SkeletonPose();

		for (var joints_parsed:number = 0; joints_parsed < num_joints; joints_parsed++) {
			var joint_pose:JointPose;
			var has_transform:number /*uint*/;
			joint_pose = new JointPose();
			has_transform = this._newBlockBytes.readUnsignedByte();
			if (has_transform == 1) {
				var mtx_data:Float32Array = this.parseMatrix43RawData();

				var mtx:Matrix3D = new Matrix3D(mtx_data);
				joint_pose.orientation.fromMatrix(mtx);
				joint_pose.translation.copyFrom(mtx.position);

				pose.jointPoses[joints_parsed] = joint_pose;
			}
		}

		// Skip attributes for now
		this.parseUserAttributes();
		this._pFinalizeAsset(pose, name);

		this._blocks[blockID].data = pose;

		if (this._debug)
			console.log("Parsed a SkeletonPose: Name = " + pose.name + " | Number of Joints = " + joints_parsed);
	}

	//blockID 103
	private parseSkeletonAnimation(blockID:number /*uint*/):void
	{
		var frame_dur:number;
		var pose_id:number;
		var name:string = this.parseVarStr();
		var clip:SkeletonClipNode = new SkeletonClipNode();
		var num_frames:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
		this.parseProperties(null); // Ignore properties for now

		for (var frames_parsed:number = 0; frames_parsed < num_frames; frames_parsed++) {
			pose_id = this._newBlockBytes.readUnsignedInt();
			frame_dur = this._newBlockBytes.readUnsignedShort();
			clip.addFrame(<SkeletonPose> this._blocks[pose_id].data, frame_dur);
		}
		if (clip.frames.length == 0) {
			this._blocks[blockID].addError("Could not this SkeletonClipNode, because no Frames where set.");
			return;
		}
		// Ignore attributes for now
		this.parseUserAttributes();
		this._pFinalizeAsset(clip, name);
		this._blocks[blockID].data = clip;

		if (this._debug)
			console.log("Parsed a SkeletonClipNode: Name = " + clip.name + " | Number of Frames = " + clip.frames.length);
	}
	
	private spritePoseAnimationProperties:Object = {
		1:AWDParser.BOOL,
		2:AWDParser.BOOL};

	//Block ID = 111 /  Block ID = 112
	private parseSpritePoseAnimation(blockID:number /*uint*/, poseOnly:boolean = false):void
	{
		var subSpriteParsed:number /*uint*/;
		var x:number;
		var y:number;
		var z:number;
		var str_len:number;
		var str_end:number;
		var elements:TriangleElements;
		var idx:number /*int*/ = 0;
		var clip:VertexClipNode = new VertexClipNode();
		var indices:Short3Attributes;
		var verts:Array<number>;
		var streamtypes:Array<number> /*int*/ = new Array<number>() /*int*/;
		var props:AWDProperties;
		var name:string = this.parseVarStr();
		var geo_id:number /*int*/ = this._newBlockBytes.readUnsignedInt();
		var graphics:Graphics = <Graphics> this._blocks[geo_id].data;

		var uvs:Array<Float32Array> = this.getUVForVertexAnimation(geo_id);

		var num_frames:number = (!poseOnly)? this._newBlockBytes.readUnsignedShort() : 1;

		var num_subsprites:number = this._newBlockBytes.readUnsignedShort();
		var num_Streams:number = this._newBlockBytes.readUnsignedShort();
		for (var streamsParsed:number = 0; streamsParsed < num_Streams; streamsParsed++)
			streamtypes.push(this._newBlockBytes.readUnsignedShort());

		props = this.parseProperties(this.spritePoseAnimationProperties);

		clip.looping = props.get(1, true);
		clip.stitchFinalFrame = props.get(2, false);

		var frame_dur:number;
		for (var frames_parsed:number = 0; frames_parsed < num_frames; frames_parsed++) {
			frame_dur = this._newBlockBytes.readUnsignedShort();
			graphics = new Graphics();
			subSpriteParsed = 0;
			while (subSpriteParsed < num_subsprites) {
				streamsParsed = 0;
				str_len = this._newBlockBytes.readUnsignedInt();
				str_end = this._newBlockBytes.position + str_len;
				while (streamsParsed < num_Streams) {
					if (streamtypes[streamsParsed] == 1) {
						indices = graphics.getGraphicAt(subSpriteParsed).elements.indices;
						verts = new Array<number>();
						idx = 0;
						while (this._newBlockBytes.position < str_end) {
							x = this.readNumber(this._accuracyGeo);
							y = this.readNumber(this._accuracyGeo);
							z = this.readNumber(this._accuracyGeo);
							verts[idx++] = x;
							verts[idx++] = y;
							verts[idx++] = z;
						}
						elements = new TriangleElements(new AttributesBuffer());
						elements.setIndices(indices);
						elements.setPositions(verts);
						elements.setUVs(uvs[subSpriteParsed]);
						elements.setNormals(null);
						elements.setTangents(null);
						elements.autoDeriveNormals = false;
						elements.autoDeriveTangents = false;
						subSpriteParsed++;
						graphics.addGraphic(elements);
					} else
						this._newBlockBytes.position = str_end;
					streamsParsed++;
				}
			}
			clip.addFrame(graphics, frame_dur);
		}
		this.parseUserAttributes();
		this._pFinalizeAsset(clip, name);

		this._blocks[blockID].data = clip;

		if (this._debug)
			console.log("Parsed a VertexClipNode: Name = " + clip.name + " | Target-Graphics-Name = " + graphics.name + " | Number of Frames = " + clip.frames.length);
	}

	private static vertexAnimationSetProperties:Object = {
		1:AWDParser.UINT16};
	
	//BlockID 113
	private parseVertexAnimationSet(blockID:number /*uint*/):void
	{
		var name:string = this.parseVarStr();
		var num_frames:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
		var props:AWDProperties = this.parseProperties(AWDParser.vertexAnimationSetProperties);
		var skeletonFrames:Array<SkeletonClipNode> = new Array<SkeletonClipNode>();
		var vertexFrames:Array<VertexClipNode> = new Array<VertexClipNode>();
		var clipNode:AnimationClipNodeBase;
		for (var frames_parsed:number = 0; frames_parsed < num_frames; frames_parsed++) {
			clipNode = <AnimationClipNodeBase> this._blocks[this._newBlockBytes.readUnsignedInt()].data;
			if (clipNode instanceof VertexClipNode)
				vertexFrames.push(<VertexClipNode> clipNode);
			else if (clipNode instanceof SkeletonClipNode)
				skeletonFrames.push(<SkeletonClipNode> clipNode);
		}

		if ((vertexFrames.length == 0) && (skeletonFrames.length == 0)) {
			this._blocks[blockID].addError("Could not create this AnimationSet, because it contains no animations");
			return;
		}

		this.parseUserAttributes();

		if (vertexFrames.length > 0) {
			var newVertexAnimationSet:VertexAnimationSet = new VertexAnimationSet();

			for (var i:number /*int*/ = 0; i < vertexFrames.length; i++)
				newVertexAnimationSet.addAnimation(vertexFrames[i]);

			this._pFinalizeAsset(newVertexAnimationSet, name);

			this._blocks[blockID].data = newVertexAnimationSet;

			if (this._debug)
				console.log("Parsed a VertexAnimationSet: Name = " + name + " | Animations = " + newVertexAnimationSet.animations.length + " | Animation-Names = " + newVertexAnimationSet.animationNames);

		} else if (skeletonFrames.length > 0) {
			var newSkeletonAnimationSet:SkeletonAnimationSet = new SkeletonAnimationSet(props.get(1, 4)); //props.get(1,4));
			for (var i:number /*int*/ = 0; i < skeletonFrames.length; i++)
				newSkeletonAnimationSet.addAnimation(skeletonFrames[i]);
			this._pFinalizeAsset(newSkeletonAnimationSet, name);

			this._blocks[blockID].data = newSkeletonAnimationSet;

			if (this._debug)
				console.log("Parsed a SkeletonAnimationSet: Name = " + name + " | Animations = " + newSkeletonAnimationSet.animations.length + " | Animation-Names = " + newSkeletonAnimationSet.animationNames);
		}
	}

	private static animatorSetProperties:Object = {1:AWDParser.BADDR};
	
	//BlockID 122
	private parseAnimatorSet(blockID:number /*uint*/):void
	{
		var name:string = this.parseVarStr();
		var type:number = this._newBlockBytes.readUnsignedShort();
		var props:AWDProperties = this.parseProperties(AWDParser.animatorSetProperties);
		var targetAnimationSet:AnimationSetBase = <AnimationSetBase> this._blocks[this._newBlockBytes.readUnsignedInt()].data;

		var targetSpritees:Array<Sprite> = new Array<Sprite>();
		var targetSpriteLength:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
		for (var i:number /*int*/ = 0; i < targetSpriteLength; i++)
			targetSpritees.push(<Sprite> this._blocks[this._newBlockBytes.readUnsignedInt()].data);

		var activeState:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
		var autoplay:boolean = ( this._newBlockBytes.readUnsignedByte() == 1 );
		this.parseUserAttributes();
		this.parseUserAttributes();

		var thisAnimator:AnimatorBase;
		if (type == 1)
			thisAnimator = new SkeletonAnimator(<SkeletonAnimationSet> targetAnimationSet, <Skeleton> this._blocks[props.get(1, 0)].data);
		else if (type == 2)
			thisAnimator = new VertexAnimator(<VertexAnimationSet> targetAnimationSet);

		this._pFinalizeAsset(thisAnimator, name);
		this._blocks[blockID].data = thisAnimator;

		for (i = 0; i < targetSpritees.length; i++) {
			if (type == 1)
				targetSpritees[i].animator = (<SkeletonAnimator> thisAnimator);
			else if (type == 2)
				targetSpritees[i].animator = (<VertexAnimator> thisAnimator);
		}

		if (this._debug)
			console.log("Parsed a Animator: Name = " + name);
	}

	private sharedMethodListProperties:Object = {
		1:AWDParser.BADDR,
		2:AWDParser.BADDR,
		3:AWDParser.BADDR,
		101:AWDParser.PROPERTY_NUMBER,
		102:AWDParser.PROPERTY_NUMBER,
		103:AWDParser.PROPERTY_NUMBER,
		104:AWDParser.PROPERTY_NUMBER,
		105:AWDParser.PROPERTY_NUMBER,
		106:AWDParser.PROPERTY_NUMBER,
		107:AWDParser.PROPERTY_NUMBER,
		201:AWDParser.UINT32,
		202:AWDParser.UINT32,
		301:AWDParser.UINT16,
		302:AWDParser.UINT16,
		401:AWDParser.UINT8,
		402:AWDParser.UINT8,
		601:AWDParser.COLOR,
		602:AWDParser.COLOR,
		701:AWDParser.BOOL,
		702:AWDParser.BOOL};

	// this functions reads and creates a EffectMethod
	private parseSharedMethodList(blockID:number):EffectMethodBase
	{
		var methodType:number = this._newBlockBytes.readUnsignedShort();
		var effectMethodReturn:EffectMethodBase;

		var props:AWDProperties = this.parseProperties(this.sharedMethodListProperties);

		switch (methodType) {
			// Effect Methods
			case 401: //ColorMatrix
				effectMethodReturn = new EffectColorMatrixMethod(props.get(101, new Array(0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)));
				break;
			case 402: //ColorTransform
				effectMethodReturn = new EffectColorTransformMethod();
				var offCol:number /*uint*/ = props.get(601, 0x00000000);
				(<EffectColorTransformMethod> effectMethodReturn).colorTransform = new ColorTransform(props.get(102, 1), props.get(103, 1), props.get(104, 1), props.get(101, 1), ((offCol >> 16) & 0xFF), ((offCol >> 8) & 0xFF), (offCol & 0xFF), ((offCol >> 24) & 0xFF));
				break;
			case 403: //EnvMap
				effectMethodReturn = new EffectEnvMapMethod(new SingleCubeTexture(<BitmapImageCube> this._blocks[props.get(1, 0)].data), <number> props.get(101, 1));
				var targetID:number = props.get(2, 0);
				if (targetID > 0) {
					// Todo: test mask with EnvMapMethod
					//(<EnvMapMethod> effectMethodReturn).mask = <TextureBase> this._blocks[targetID].data;
				}
				break;
			case 404: //LightMapMethod
				effectMethodReturn = new EffectLightMapMethod(this._blocks[props.get(1, 0)].data, this.blendModeDic[props.get(401, 10)]); //usesecondaryUV not set
				break;
			//				case 405: //ProjectiveTextureMethod
			//					targetID = props.get(1, 0);
			//					returnedArray = getAssetByID(targetID, [TextureProjector.assetType]);
			//					if (!returnedArray[0])
			//						_blocks[blockID].addError("Could not find the TextureProjector (ID = " + targetID + " ) for this ProjectiveTextureMethod");
			//					effectMethodReturn = new ProjectiveTextureMethod(returnedArray[1], blendModeDic[props.get(401, 10)]);
			//					break;
			case 406: //RimLightMethod
				effectMethodReturn = new EffectRimLightMethod(props.get(601, 0xffffff), props.get(101, 0.4), props.get(101, 2)); //blendMode
				break;
			case 407: //AlphaMaskMethod
				effectMethodReturn = new EffectAlphaMaskMethod(this._blocks[props.get(1, 0)].data, props.get(701, false));
				break;
			//				case 408: //RefractionEnvMapMethod
			//					targetID = props.get(1, 0);
			//					returnedArray = getAssetByID(targetID, [TextureBase.assetType], "CubeTexture");
			//					if (!returnedArray[0])
			//						_blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this RefractionEnvMapMethod");
			//					effectMethodReturn = new RefractionEnvMapMethod(returnedArray[1], props.get(101, 0.1), props.get(102, 0.01), props.get(103, 0.01), props.get(104, 0.01));
			//					RefractionEnvMapMethod(effectMethodReturn).alpha = props.get(104, 1);
			//					break;
			//				case 409: //OutlineMethod
			//					effectMethodReturn = new OutlineMethod(props.get(601, 0x00000000), props.get(101, 1), props.get(701, true), props.get(702, false));
			//					break;
			case 410: //FresnelEnvMapMethod
				effectMethodReturn = new EffectFresnelEnvMapMethod(this._blocks[props.get(1, 0)].data, props.get(101, 1));
				break;
			case 411: //FogMethod
				effectMethodReturn = new EffectFogMethod(props.get(101, 0), props.get(102, 1000), props.get(601, 0x808080));
				break;

		}
		this.parseUserAttributes();
		return effectMethodReturn;

	}

	private parseUserAttributes():Object
	{
		var list_len:number = this._newBlockBytes.readUnsignedInt();

		if (list_len > 0) {
			var list_end:number = this._newBlockBytes.position + list_len;
			var attributes:Object = {};

			for (var attibuteCnt:number = 0; this._newBlockBytes.position < list_end; attibuteCnt++) {
				var ns_id:number;
				var attr_key:string;
				var attr_type:number;
				var attr_len:number;
				var attr_val:any;

				// TODO: Properly tend to namespaces in attributes
				ns_id = this._newBlockBytes.readUnsignedByte();
				attr_key = this.parseVarStr();
				attr_type = this._newBlockBytes.readUnsignedByte();
				attr_len = this._newBlockBytes.readUnsignedInt();

				if ((this._newBlockBytes.position + attr_len) > list_end) {
					console.log("           Error in reading attribute # " + attibuteCnt + " = skipped to end of attribute-list");
					this._newBlockBytes.position = list_end;
					return attributes;
				}

				switch (attr_type) {
					case AWDParser.AWDSTRING:
						attr_val = this._newBlockBytes.readUTFBytes(attr_len);
						break;
					case AWDParser.INT8:
						attr_val = this._newBlockBytes.readByte();
						break;
					case AWDParser.INT16:
						attr_val = this._newBlockBytes.readShort();
						break;
					case AWDParser.INT32:
						attr_val = this._newBlockBytes.readInt();
						break;
					case AWDParser.BOOL:
					case AWDParser.UINT8:
						attr_val = this._newBlockBytes.readUnsignedByte();
						break;
					case AWDParser.UINT16:
						attr_val = this._newBlockBytes.readUnsignedShort();
						break;
					case AWDParser.UINT32:
					case AWDParser.BADDR:
						attr_val = this._newBlockBytes.readUnsignedInt();
						break;
					case AWDParser.FLOAT32:
						attr_val = this._newBlockBytes.readFloat();
						break;
					case AWDParser.FLOAT64:
						attr_val = this._newBlockBytes.readDouble();
						break;
					default:
						attr_val = 'unimplemented attribute type ' + attr_type;
						this._newBlockBytes.position += attr_len;
						break;
				}

				attributes[attr_key] = attr_val;

				if (this._debug)
					console.log("attribute = name: " + attr_key + "  / value = " + attr_val);
			}
		}

		return attributes;
	}

	private parseProperties(expected:Object):AWDProperties
	{
		var list_len:number = this._newBlockBytes.readUnsignedInt();
		var props:AWDProperties = new AWDProperties();
		var list_end:number = this._newBlockBytes.position + list_len;

		if (expected) {
			var len:number;
			var key:number;
			var type:number;

			for (var propertyCnt:number = 0; this._newBlockBytes.position < list_end; propertyCnt++) {
				key = this._newBlockBytes.readUnsignedShort();
				len = this._newBlockBytes.readUnsignedInt();

				if ((this._newBlockBytes.position + len) > list_end) {
					console.log("           Error in reading property # " + propertyCnt + " = skipped to end of propertie-list");
					this._newBlockBytes.position = list_end;
					return props;
				}

				if (expected[key]) {
					type = expected[key];
					props.set(key, this.parseAttrValue(type, len));
				} else {
					this._newBlockBytes.position += len;
				}
			}
		} else {
			this._newBlockBytes.position = list_end;
		}

		return props;
	}

	private parseAttrValue(type:number, len:number):any
	{
		var elem_len:number;
		var read_func:Function;
		var accuracy:boolean;

		switch (type) {
			case AWDParser.BOOL:
			case AWDParser.INT8:
				elem_len = 1;
				read_func = this._newBlockBytes.readByte;
				break;

			case AWDParser.INT16:
				elem_len = 2;
				read_func = this._newBlockBytes.readShort;
				break;

			case AWDParser.INT32:
				elem_len = 4;
				read_func = this._newBlockBytes.readInt;
				break;

			case AWDParser.UINT8:
				elem_len = 1;
				read_func = this._newBlockBytes.readUnsignedByte;
				break;

			case AWDParser.UINT16:
				elem_len = 2;
				read_func = this._newBlockBytes.readUnsignedShort;
				break;

			case AWDParser.UINT32:
			case AWDParser.COLOR:
			case AWDParser.BADDR:
				elem_len = 4;
				read_func = this._newBlockBytes.readUnsignedInt;
				break;

			case AWDParser.FLOAT32:
				elem_len = 4;
				read_func = this._newBlockBytes.readFloat;
				break;

			case AWDParser.FLOAT64:
				elem_len = 8;
				read_func = this._newBlockBytes.readDouble;
				break;

			case AWDParser.AWDSTRING:
				return this._newBlockBytes.readUTFBytes(len);

			case AWDParser.VECTOR2x1:
			case AWDParser.VECTOR3x1:
			case AWDParser.VECTOR4x1:
			case AWDParser.MTX3x2:
			case AWDParser.MTX3x3:
			case AWDParser.MTX4x3:
			case AWDParser.MTX4x4:
				elem_len = 8;
				read_func = this._newBlockBytes.readDouble;
				break;
			case AWDParser.GEO_NUMBER:
				accuracy = this._accuracyGeo;
			case AWDParser.MATRIX_NUMBER:
				accuracy = this._accuracyMatrix;
			case AWDParser.PROPERTY_NUMBER:
				accuracy = this._accuracyProps;
			default:
				if (accuracy) {
					elem_len = 8;
					read_func = this._newBlockBytes.readDouble;
				} else {
					elem_len = 4;
					read_func = this._newBlockBytes.readFloat;
				}
		}

		if (elem_len < len) {
			var list:Array<any> = [];
			var num_elems:number = len/elem_len;

			for (var num_read:number = 0; num_read < num_elems; num_read++)
				list[num_read] = read_func.call(this._newBlockBytes);

			return list;
		} else {
			return read_func.call(this._newBlockBytes);
		}
	}

	private parseHeader():void
	{
		this._byteData.position = 3; // Skip magic string and parse version

		this._version[0] = this._byteData.readUnsignedByte();
		this._version[1] = this._byteData.readUnsignedByte();

		var flags:number = this._byteData.readUnsignedShort(); // Parse bit flags

		this._streaming = BitFlags.test(flags, BitFlags.FLAG1);

		// if we set _accuracyOnBlocks, the precision-values are read from each block-header.
		if ((this._version[0] == 2) && (this._version[1] == 1)) {
			this._accuracyMatrix = BitFlags.test(flags, BitFlags.FLAG2);
			this._accuracyGeo = BitFlags.test(flags, BitFlags.FLAG3);
			this._accuracyProps = BitFlags.test(flags, BitFlags.FLAG4);
		}

		this._compression = this._byteData.readUnsignedByte(); // compression

		if (this._debug) {
			console.log("Import AWDFile of version = " + this._version[0] + " - " + this._version[1]);
			console.log("Global Settings = Compression = " + this._compression + " | Streaming = " + this._streaming + " | Matrix-Precision = " + this._accuracyMatrix + " | Graphics-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
		}

		// Check file integrity
		var body_len:number = this._byteData.readUnsignedInt();
		if (!this._streaming && body_len != this._byteData.getBytesAvailable())
			this._pDieWithError('AWD2 body length does not match header integrity field');

	}
	// Helper - functions
	private getUVForVertexAnimation(spriteID:number /*uint*/):Array<Float32Array>
	{
		if (this._blocks[spriteID].data instanceof Sprite)
			spriteID = this._blocks[spriteID].geoID;

		if (this._blocks[spriteID].uvsForVertexAnimation)
			return this._blocks[spriteID].uvsForVertexAnimation;

		var graphics:Graphics = (<Graphics> this._blocks[spriteID].data);
		var elements:TriangleElements;
		var uvsForVertexAnimation:Array<ArrayBufferView> = this._blocks[spriteID].uvsForVertexAnimation = new Array<Float32Array>();

		var len:number = graphics.count;
		for (var geoCnt:number= 0; geoCnt < len; geoCnt++) {
			elements = <TriangleElements> graphics.getGraphicAt(geoCnt).elements;
			uvsForVertexAnimation[geoCnt] = elements.uvs.get(elements.numVertices);
		}

		return this._blocks[spriteID].uvsForVertexAnimation;
	}

	private parseVarStr():string
	{
		return this._newBlockBytes.readUTFBytes(this._newBlockBytes.readUnsignedShort());
	}

	private readNumber(precision:boolean = false):number
	{
		if (precision)
			return this._newBlockBytes.readDouble();

		return this._newBlockBytes.readFloat();
	}

	private parseMatrix3D():Matrix3D
	{
		return new Matrix3D(this.parseMatrix43RawData());
	}

	private parseMatrix32RawData():Float32Array
	{
		var mtx_raw:Float32Array = new Float32Array(6);

		for (var i:number = 0; i < 6; i++)
			mtx_raw[i] = this._newBlockBytes.readFloat();

		return mtx_raw;
	}

	private parseMatrix43RawData():Float32Array
	{
		var mtx_raw:Float32Array = new Float32Array(16);

		mtx_raw[0] = this.readNumber(this._accuracyMatrix);
		mtx_raw[1] = this.readNumber(this._accuracyMatrix);
		mtx_raw[2] = this.readNumber(this._accuracyMatrix);
		mtx_raw[3] = 0.0;
		mtx_raw[4] = this.readNumber(this._accuracyMatrix);
		mtx_raw[5] = this.readNumber(this._accuracyMatrix);
		mtx_raw[6] = this.readNumber(this._accuracyMatrix);
		mtx_raw[7] = 0.0;
		mtx_raw[8] = this.readNumber(this._accuracyMatrix);
		mtx_raw[9] = this.readNumber(this._accuracyMatrix);
		mtx_raw[10] = this.readNumber(this._accuracyMatrix);
		mtx_raw[11] = 0.0;
		mtx_raw[12] = this.readNumber(this._accuracyMatrix);
		mtx_raw[13] = this.readNumber(this._accuracyMatrix);
		mtx_raw[14] = this.readNumber(this._accuracyMatrix);
		mtx_raw[15] = 1.0;

		//TODO: fix max exporter to remove NaN values in joint 0 inverse bind pose

		if (isNaN(mtx_raw[0])) {
			mtx_raw[0] = 1;
			mtx_raw[1] = 0;
			mtx_raw[2] = 0;
			mtx_raw[4] = 0;
			mtx_raw[5] = 1;
			mtx_raw[6] = 0;
			mtx_raw[8] = 0;
			mtx_raw[9] = 0;
			mtx_raw[10] = 1;
			mtx_raw[12] = 0;
			mtx_raw[13] = 0;
			mtx_raw[14] = 0;
		}

		return mtx_raw;
	}
}

class ElementType {
	public static STANDART_STREAMS:number = 0;
	public static CONCENATED_STREAMS:number = 1;
	public static SHARED_BUFFER:number = 2;
}

class AWDProperties
{
	public set(key:number, value:any):void
	{
		this[key] = value;
	}

	public get(key:number, fallback:any):any
	{
		return (this[key] || fallback);
	}
}

/**
 *
 */
class BitFlags
{
	public static FLAG1:number = 1;
	public static FLAG2:number = 2;
	public static FLAG3:number = 4;
	public static FLAG4:number = 8;
	public static FLAG5:number = 16;
	public static FLAG6:number = 32;
	public static FLAG7:number = 64;
	public static FLAG8:number = 128;
	public static FLAG9:number = 256;
	public static FLAG10:number = 512;
	public static FLAG11:number = 1024;
	public static FLAG12:number = 2048;
	public static FLAG13:number = 4096;
	public static FLAG14:number = 8192;
	public static FLAG15:number = 16384;
	public static FLAG16:number = 32768;

	public static test(flags:number, testFlag:number):boolean
	{
		return (flags & testFlag) == testFlag;
	}
}
