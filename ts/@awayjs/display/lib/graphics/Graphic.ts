import {Box}							from "@awayjs/core/lib/geom/Box";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Sphere}						from "@awayjs/core/lib/geom/Sphere";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {AssetBase}					from "@awayjs/core/lib/library/AssetBase";

import {IAnimator}					from "../animators/IAnimator";
import {RenderableEvent}				from "../events/RenderableEvent";
import {MaterialBase}					from "../materials/MaterialBase";
import {Style}						from "../base/Style";
import {StyleEvent}					from "../events/StyleEvent";
import {ElementsEvent}				from "../events/ElementsEvent";
import {IRenderable}					from "../base/IRenderable";
import {Graphics}						from "../graphics/Graphics";
import {ElementsBase}					from "../graphics/ElementsBase";
import {TriangleElements}				from "../graphics/TriangleElements";
import {IPickingCollider}				from "../pick/IPickingCollider";
import {PickingCollision}				from "../pick/PickingCollision";

/**
 * Graphic wraps a Elements as a scene graph instantiation. A Graphic is owned by a Sprite object.
 *
 *
 * @see away.base.ElementsBase
 * @see away.entities.Sprite
 *
 * @class away.base.Graphic
 */
export class Graphic extends AssetBase implements IRenderable
{
	public static _available:Array<Graphic> = new Array<Graphic>();

	public static assetType:string = "[asset Graphic]";

	public _iIndex:number = 0;

	private _boxBounds:Box;
	private _boxBoundsInvalid:boolean = true;
	private _sphereBounds:Sphere;
	private _sphereBoundsInvalid = true;
	private _style:Style;
	private _material:MaterialBase;
	private _elements:ElementsBase;
	private _onInvalidatePropertiesDelegate:(event:StyleEvent) => void;
	private _onInvalidateVerticesDelegate:(event:ElementsEvent) => void;

	public count:number;

	public offset:number;
	
	public parent:Graphics;

	/**
	 * The Elements object which provides the geometry data for this Graphic.
	 */
	public get  elements():ElementsBase
	{
		return this._elements;
	}

	public set elements(value:ElementsBase)
	{
		if (this._elements == value)
			return;

		this._elements = value;

		this.invalidateElements();
	}

	/**
	 *
	 */
	public get assetType():string
	{
		return Graphic.assetType;
	}


	/**
	 *
	 */
	public get animator():IAnimator
	{
		return this.parent.animator;
	}

	//TODO test shader picking
//		public get shaderPickingDetails():boolean
//		{
//
//			return this.sourceEntity.shaderPickingDetails;
//		}

	/**
	 * The material used to render the current TriangleGraphic. If set to null, its parent Sprite's material will be used instead.
	 */
	public get material():MaterialBase
	{
		return this._material || this.parent.material;
	}

	public set material(value:MaterialBase)
	{
		if (this.material)
			this.material.iRemoveOwner(this);

		this._material = value;

		if (this.material)
			this.material.iAddOwner(this);
	}

	/**
	 * The style used to render the current TriangleGraphic. If set to null, its parent Sprite's style will be used instead.
	 */
	public get style():Style
	{
		return this._style || this.parent.style;
	}

	public set style(value:Style)
	{
		if (this._style == value)
			return;

		if (this._style)
			this._style.removeEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);

		this._style = value;

		if (this._style)
			this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);

		this.invalidateSurface();
	}


	/**
	 * Creates a new Graphic object
	 */
	constructor(index:number, parent:Graphics, elements:ElementsBase, material:MaterialBase = null, style:Style = null, count:number = 0, offset:number = 0)
	{
		super();

		this._onInvalidatePropertiesDelegate = (event:StyleEvent) => this._onInvalidateProperties(event);
		this._onInvalidateVerticesDelegate = (event:ElementsEvent) => this._onInvalidateVertices(event);
		
		this._iIndex = index;
		this.parent = parent;
		this.elements = elements;
		this.material = material;
		this.style = style;
		this.count = count;
		this.offset = offset;
	}

	/**
	 *
	 */
	public dispose():void
	{
		super.dispose();

		this.parent.removeGraphic(this);
		this.parent = null;

		Graphic._available.push(this);
	}

	public invalidate():void
	{
		super.invalidate();

		this._boxBoundsInvalid = true;
		this._sphereBoundsInvalid = true;
	}
	
	public invalidateElements():void
	{
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_ELEMENTS, this));

		this._boxBoundsInvalid = true;
		this._sphereBoundsInvalid = true;
	}

	public invalidateSurface():void
	{
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_SURFACE, this));
	}

	public _iGetExplicitMaterial():MaterialBase
	{
		return this._material;
	}

	public _iGetExplicitStyle():Style
	{
		return this._style;
	}

	private _onInvalidateProperties(event:StyleEvent):void
	{
		this.invalidateSurface();
	}

	private _onInvalidateVertices(event:ElementsEvent):void
	{
		if (event.attributesView != (<TriangleElements> event.target).positions)
			return;
		
		this.invalidate();
		
		this.dispatchEvent(event);
	}
	
	/**
	 * //TODO
	 *
	 * @param shortestCollisionDistance
	 * @param findClosest
	 * @returns {boolean}
	 *
	 * @internal
	 */
	public _iTestCollision(pickingCollision:PickingCollision, pickingCollider:IPickingCollider):boolean
	{
		return this._elements._iTestCollision(pickingCollider, this.material, pickingCollision, this.count, this.offset)
	}


	public applyTransformation(transform:Matrix3D):void
	{
		this._elements.applyTransformation(transform, this.count, this.offset);
	}

	public hitTestPoint(x:number, y:number, z:number):boolean
	{
		var box:Box;

		//early out for box test
		if(!(box = this.getBoxBounds()).contains(x, y, z))
			return false;

		return this._elements.hitTestPoint(x, y, z, box, this.count, this.offset);
	}
	
	public scale(scale:number):void
	{
		this._elements.scale(scale, this.count, this.offset);
	}

	public scaleUV(scaleU:number = 1, scaleV:number = 1):void
	{
		this._elements.scaleUV(scaleU, scaleV, this.count, this.offset);
	}

	public getBoxBounds():Box
	{
		if (this._boxBoundsInvalid) {
			this._boxBoundsInvalid = false;

			this._boxBounds = this._elements.getBoxBounds(this._boxBounds || (this._boxBounds = new Box()), this.count, this.offset);
		}

		return this._boxBounds;
	}

	public getSphereBounds(center:Vector3D, target:Sphere = null):Sphere
	{
		return this._elements.getSphereBounds(center, target, this.count, this.offset);
	}
}