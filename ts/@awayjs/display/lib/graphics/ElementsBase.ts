import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AttributesView}				from "@awayjs/core/lib/attributes/AttributesView";
import {Float3Attributes}				from "@awayjs/core/lib/attributes/Float3Attributes";
import {Short3Attributes}				from "@awayjs/core/lib/attributes/Short3Attributes";
import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {Box}							from "@awayjs/core/lib/geom/Box";
import {Sphere}						from "@awayjs/core/lib/geom/Sphere";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {AssetBase}					from "@awayjs/core/lib/library/AssetBase";

import {ElementsEvent}				from "../events/ElementsEvent";
import {Graphic}						from "../graphics/Graphic";
import {IPickingCollider}				from "../pick/IPickingCollider";
import {PickingCollision}				from "../pick/PickingCollision";
import {MaterialBase}					from "../materials/MaterialBase";

/**
 * @class away.base.TriangleElements
 */
export class ElementsBase extends AssetBase
{
	private _indices:Short3Attributes;
	private _customAttributesNames:Array<string> = new Array<string>();
	private _customAttributes:Object = new Object();
	
	private _numElements:number = 0;
	public _numVertices:number = 0;
	public _concatenatedBuffer:AttributesBuffer;

	private _invalidateIndices:ElementsEvent;

	public _verticesDirty:Object = new Object();
	public _invalidateVertices:Object = new Object();

	
	public get concatenatedBuffer():AttributesBuffer
	{
		return this._concatenatedBuffer;
	}

	/**
	 * The raw index data that define the faces.
	 */
	public get indices():Short3Attributes
	{
		return this._indices;
	}

	/**
	 *
	 */
	public getCustomAtributesNames():Array<string>
	{
		return this._customAttributesNames;
	}

	/**
	 *
	 */
	public getCustomAtributes(name:string):AttributesView
	{
		return this._customAttributes[name];
	}
	
	/**
	 * The total amount of triangles in the TriangleElements.
	 */
	public get numElements():number
	{
		return this._numElements;
	}

	public get numVertices():number
	{
		return this._numVertices;
	}

	/**
	 *
	 */
	constructor(concatenatedBuffer:AttributesBuffer = null)
	{
		super();

		this._concatenatedBuffer = concatenatedBuffer;
	}


	public copyTo(elements:ElementsBase):void
	{
		if (this.indices)
			elements.setIndices(this.indices.clone());
		
		for (var name in this._customAttributes)
			elements.setCustomAttributes(name, this.getCustomAtributes(name).clone());
	}
	
	/**
	 *
	 */
	public dispose():void
	{
		super.dispose();

		if (this._indices) {
			this._indices.dispose();
			this._indices = null;
		}
		
		for (var name in this._customAttributes) {
			this._customAttributes[name].dispose();
			delete this._customAttributes;
		}
	}

	/**
	 * Updates the face indices of the TriangleElements.
	 *
	 * @param indices The face indices to upload.
	 */
	public setIndices(array:Array<number>, offset?:number);
	public setIndices(uint16Array:Uint16Array, offset?:number);
	public setIndices(short3Attributes:Short3Attributes, offset?:number);
	public setIndices(values:any, offset:number = 0):void
	{
		if (values instanceof Short3Attributes) {
			if (this._indices)
				this.clearIndices();

			this._indices = <Short3Attributes> values;
		} else if (values) {
			if (!this._indices)
				this._indices = new Short3Attributes();

			this._indices.set(values, offset);
		} else if (this._indices) {
			this._indices.dispose();
			this._indices = null;

			this.clearIndices();
		}

		if (this._indices) {
			this._numElements = this._indices.count;

			this.invalidateIndices();
		} else {
			this._numElements = 0;
		}
	}
	
	/**
	 * Updates custom attributes.
	 */
	public setCustomAttributes(name:string, array:Array<number>, offset?:number);
	public setCustomAttributes(name:string, arrayBufferView:ArrayBufferView, offset?:number);
	public setCustomAttributes(name:string, attributesView:AttributesView, offset?:number);
	public setCustomAttributes(name:string, values:any, offset:number = 0):void
	{
		if (values == this._customAttributes[name])
			return;

		if (values instanceof AttributesView) {
			this.clearVertices(this._customAttributes[name]);
			this._customAttributes[name] = values;
		} else if (values) {
			if (!this._customAttributes[name])
				this._customAttributes[name] = new Float3Attributes(this._concatenatedBuffer); //default custom atrributes is Float3

			this._customAttributes[name].set(values, offset);
		} else if (this._customAttributes[name]) {
			this.clearVertices(this._customAttributes[name]);
			this._customAttributesNames.splice(this._customAttributesNames.indexOf(name), 1);
			delete this._customAttributes[name];
			return;
		}

		this.invalidateVertices(this._customAttributes[name]);

		this._verticesDirty[this._customAttributes[name].id] = false;

		if (this._customAttributesNames.indexOf(name) == -1)
			this._customAttributesNames.push(name);
	}

	/**
	 * Clones the current object
	 * @return An exact duplicate of the current object.
	 */
	public clone():ElementsBase
	{
		throw new AbstractMethodError();
	}

	public applyTransformation(transform:Matrix3D, count:number = 0, offset:number = 0):void
	{
		throw new AbstractMethodError();
	}

	/**
	 * Scales the geometry.
	 * @param scale The amount by which to scale.
	 */
	public scale(scale:number, count:number = 0, offset:number = 0):void
	{
		throw new AbstractMethodError();
	}

	public scaleUV(scaleU:number = 1, scaleV:number = 1, count:number = 0, offset:number = 0):void
	{
		throw new AbstractMethodError();
	}

	public getBoxBounds(target:Box = null, count:number = 0, offset:number = 0):Box
	{
		throw new AbstractMethodError();
	}

	public getSphereBounds(center:Vector3D, target:Sphere = null, count:number = 0, offset:number = 0):Sphere
	{
		throw new AbstractMethodError();
	}

	public hitTestPoint(x:number, y:number, z:number, box:Box, count:number = 0, offset:number = 0):boolean
	{
		throw new AbstractMethodError();
	}

	public invalidateIndices():void
	{
		if (!this._invalidateIndices)
			this._invalidateIndices = new ElementsEvent(ElementsEvent.INVALIDATE_INDICES, this._indices);

		this.dispatchEvent(this._invalidateIndices);
	}

	private clearIndices():void
	{
		this.dispatchEvent(new ElementsEvent(ElementsEvent.CLEAR_INDICES, this._indices));
	}

	public invalidateVertices(attributesView:AttributesView):void
	{
		if (!attributesView || this._verticesDirty[attributesView.id])
			return;

		this._verticesDirty[attributesView.id] = true;

		if (!this._invalidateVertices[attributesView.id])
			this._invalidateVertices[attributesView.id] = new ElementsEvent(ElementsEvent.INVALIDATE_VERTICES, attributesView);

		this.dispatchEvent(this._invalidateVertices[attributesView.id]);
	}


	public clearVertices(attributesView:AttributesView):void
	{
		if (!attributesView)
			return;

		attributesView.dispose();

		this.dispatchEvent(new ElementsEvent(ElementsEvent.CLEAR_VERTICES, attributesView));

		this._verticesDirty[attributesView.id] = null;
		this._invalidateVertices[attributesView.id] = null;
	}

	public _iTestCollision(pickingCollider:IPickingCollider, material:MaterialBase, pickingCollision:PickingCollision, count:number = 0, offset:number = 0):boolean
	{
		throw new AbstractMethodError();
	}
}