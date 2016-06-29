import {AttributesBuffer}			from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AbstractMethodError}		from "@awayjs/core/lib/errors/AbstractMethodError";

import {DisplayObject}			from "../display/DisplayObject";
import {ElementsType}				from "../graphics/ElementsType";
import {ElementsBase}				from "../graphics/ElementsBase";
import {TriangleElements}			from "../graphics/TriangleElements";
import {LineElements}				from "../graphics/LineElements";
import {Sprite}					from "../display/Sprite";
import {MaterialBase}				from "../materials/MaterialBase";
import {PrefabBase}				from "../prefabs/PrefabBase";

/**
 * PrimitivePrefabBase is an abstract base class for polytope prefabs, which are simple pre-built geometric shapes
 */
export class PrimitivePrefabBase extends PrefabBase
{
	public static assetType:string = "[asset PrimitivePrefab]";

	public _primitiveDirty:boolean = true;
	public _uvDirty:boolean = true;
	public _scaleU:number = 1;
	public _scaleV:number = 1;

	private _material:MaterialBase;
	private _elements:ElementsBase;
	private _elementsType:string;

	/**
	 *
	 */
	public get assetType():string
	{
		return PrimitivePrefabBase.assetType;
	}

	/**
	 *
	 */
	public get elementsType():string
	{
		return this._elementsType;
	}

	/**
	 * The material with which to render the primitive.
	 */
	public get material():MaterialBase
	{
		return this._material;
	}

	public set material(value:MaterialBase)
	{
		if (value == this._material)
			return;

		this._material = value;

		var len:number = this._pObjects.length;
		for (var i:number = 0; i < len; i++)
			(<Sprite> this._pObjects[i]).material = this._material;
	}

	public get scaleU():number
	{
		return this._scaleU;
	}

	public set scaleU(value:number)
	{
		if (this._scaleU = value)
			return;

		this._scaleU = value;

		this._pInvalidateUVs();
	}


	public get scaleV():number
	{
		return this._scaleV;
	}

	public set scaleV(value:number)
	{
		if (this._scaleV = value)
			return;

		this._scaleV = value;

		this._pInvalidateUVs();
	}


	/**
	 * Creates a new PrimitivePrefabBase object.
	 *
	 * @param material The material with which to render the object
	 */
	constructor(material:MaterialBase = null, elementsType:string = "triangle")
	{
		super();
		
		this._material = material;
		this._elementsType = elementsType;

		if (this._elementsType == ElementsType.TRIANGLE) {
			var triangleElements:TriangleElements = new TriangleElements(new AttributesBuffer());
			triangleElements.autoDeriveNormals = false;
			triangleElements.autoDeriveTangents = false;
			this._elements = triangleElements;
		} else if (this._elementsType == ElementsType.LINE) {
			this._elements = new LineElements(new AttributesBuffer());
		}
	}

	/**
	 * Builds the primitive's geometry when invalid. This method should not be called directly. The calling should
	 * be triggered by the invalidateGraphics method (and in turn by updateGraphics).
	 */
	public _pBuildGraphics(target:ElementsBase, elementsType:string):void
	{
		throw new AbstractMethodError();
	}

	/**
	 * Builds the primitive's uv coordinates when invalid. This method should not be called directly. The calling
	 * should be triggered by the invalidateUVs method (and in turn by updateUVs).
	 */
	public _pBuildUVs(target:ElementsBase, elementsType:string):void
	{
		throw new AbstractMethodError();
	}
	
	/**
	 * Invalidates the primitive, causing it to be updated when requested.
	 */
	public _pInvalidatePrimitive():void
	{
		this._primitiveDirty = true;
	}

	/**
	 * Invalidates the primitive's uv coordinates, causing them to be updated when requested.
	 */
	public _pInvalidateUVs():void
	{
		this._uvDirty = true;
	}

	
	/**
	 * Updates the geometry when invalid.
	 */
	private updateGraphics():void
	{
		this._pBuildGraphics(this._elements, this._elementsType);

		this._primitiveDirty = false;
	}

	/**
	 * Updates the uv coordinates when invalid.
	 */
	private updateUVs():void
	{
		this._pBuildUVs(this._elements, this._elementsType);

		this._uvDirty = false;
	}

	public _iValidate():void
	{
		if (this._primitiveDirty)
			this.updateGraphics();

		if (this._uvDirty)
			this.updateUVs();
	}


	public _pCreateObject():DisplayObject
	{
		var sprite:Sprite = new Sprite(this._material);
		sprite.graphics.addGraphic(this._elements);
		sprite._iSourcePrefab = this;

		return sprite;
	}


//		public _pCreateBatchObject():BatchObject
//		{
//			var batch:BatchObject = new BatchObject(this._geometry, this._material);
//			batch._iSourcePrefab = this;
//
//			return batch;
//		}
}