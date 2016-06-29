import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Box}							from "@awayjs/core/lib/geom/Box";
import {Point}						from "@awayjs/core/lib/geom/Point";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {ITraverser}					from "../ITraverser";
import {IAnimator}					from "../animators/IAnimator";
import {DisplayObject}				from "../display/DisplayObject";
import {Graphics}						from "../graphics/Graphics";
import {ElementsBase}					from "../graphics/ElementsBase";
import {DisplayObjectContainer}		from "../display/DisplayObjectContainer";
import {MaterialBase}					from "../materials/MaterialBase";
import {TextureBase}					from "../textures/TextureBase";
import {ElementsUtils}				from "../utils/ElementsUtils";
import {Style}						from "../base/Style";
import {StyleEvent}					from "../events/StyleEvent";

/**
 * Sprite is an instance of a Graphics, augmenting it with a presence in the scene graph, a material, and an animation
 * state. It consists out of Graphices, which in turn correspond to SubGeometries. Graphices allow different parts
 * of the graphics to be assigned different materials.
 */
export class Sprite extends DisplayObjectContainer
{
	private static _sprites:Array<Sprite> = new Array<Sprite>();

	public static assetType:string = "[asset Sprite]";

	private _center:Vector3D;
	public _graphics:Graphics; //TODO
	private _onGraphicsInvalidateDelegate:(event:AssetEvent) => void;

	//temp point used in hit testing
	private _tempPoint:Point = new Point();

	/**
	 *
	 */
	public get assetType():string
	{
		return Sprite.assetType;
	}

	/**
	 * Specifies the Graphics object belonging to this Sprite object, where
	 * drawing commands can occur.
	 */
	public get graphics():Graphics
	{
		if (this._iSourcePrefab)
			this._iSourcePrefab._iValidate();

		return this._graphics;
	}

	/**
	 * Defines the animator of the graphics object.  Default value is <code>null</code>.
	 */
	public get animator():IAnimator
	{
		return this._graphics.animator;
	}

	public set animator(value:IAnimator)
	{
		if (this._graphics.animator)
			this._graphics.animator.removeOwner(this);

		this._graphics.animator = value;

		if (this._graphics.animator)
			this._graphics.animator.addOwner(this);
	}

	/**
	 * The material with which to render the Sprite.
	 */
	public get material():MaterialBase
	{
		return this._graphics.material;
	}

	public set material(value:MaterialBase)
	{
		this._graphics.material = value;
	}

	/**
	 *
	 */
	public get style():Style
	{
		return this._graphics.style;
	}

	public set style(value:Style)
	{
		this._graphics.style = value;
	}

	/**
	 * Create a new Sprite object.
	 *
	 * @param material    [optional]        The material with which to render the Sprite.
	 */
	constructor(material:MaterialBase = null)
	{
		super();

		this._onGraphicsInvalidateDelegate = (event:AssetEvent) => this._onGraphicsInvalidate(event);

		this._graphics = new Graphics(); //unique graphics object for each Sprite
		this._graphics.addEventListener(AssetEvent.INVALIDATE, this._onGraphicsInvalidateDelegate);

		this.material = material;
	}

	/**
	 *
	 */
	public bakeTransformations():void
	{
		this._graphics.applyTransformation(this.transform.matrix3D);
		this.transform.clearMatrix3D();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this.disposeValues();

		Sprite._sprites.push(this);
	}

	/**
	 * @inheritDoc
	 */
	public disposeValues():void
	{
		super.disposeValues();

		this._graphics.dispose();
	}

	/**
	 * Clones this Sprite instance along with all it's children, while re-using the same
	 * material, graphics and animation set. The returned result will be a copy of this sprite,
	 * containing copies of all of it's children.
	 *
	 * Properties that are re-used (i.e. not cloned) by the new copy include name,
	 * graphics, and material. Properties that are cloned or created anew for the copy
	 * include subSpritees, children of the sprite, and the animator.
	 *
	 * If you want to copy just the sprite, reusing it's graphics and material while not
	 * cloning it's children, the simplest way is to create a new sprite manually:
	 *
	 * <code>
	 * var clone : Sprite = new Sprite(original.graphics, original.material);
	 * </code>
	 */
	public clone():Sprite
	{
		var newInstance:Sprite = (Sprite._sprites.length)? Sprite._sprites.pop() : new Sprite();

		this.copyTo(newInstance);

		return newInstance;
	}

	public copyTo(sprite:Sprite):void
	{
		super.copyTo(sprite);

		this._graphics.copyTo(sprite.graphics);
    }

	/**
	 * //TODO
	 *
	 * @protected
	 */
	public _pUpdateBoxBounds():void
	{
		super._pUpdateBoxBounds();

		this._pBoxBounds.union(this._graphics.getBoxBounds(), this._pBoxBounds);
	}


	public _pUpdateSphereBounds():void
	{
		super._pUpdateSphereBounds();

		var box:Box = this.getBox();

		if (!this._center)
			this._center = new Vector3D();

		this._center.x = box.x + box.width/2;
		this._center.y = box.y + box.height/2;
		this._center.z = box.z + box.depth/2;

		this._pSphereBounds = this._graphics.getSphereBounds(this._center, this._pSphereBounds);
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	private _onGraphicsInvalidate(event:AssetEvent):void
	{
		if (this._pIsEntity != Boolean(this._graphics.count)) {
			if (this._pImplicitPartition)
				this._pImplicitPartition._iUnregisterEntity(this);

			this._pIsEntity = Boolean(this._graphics.count);

			if (this._pImplicitPartition)
				this._pImplicitPartition._iRegisterEntity(this);
		}

		this._pInvalidateBounds();
	}

	/**
	 *
	 * @param renderer
	 *
	 * @internal
	 */
	public _acceptTraverser(traverser:ITraverser):void
	{
		this.graphics.acceptTraverser(traverser);
	}

	public _hitTestPointInternal(x:number, y:number, shapeFlag:boolean, masksFlag:boolean):boolean
	{
		if(this._graphics.count) {
			this._tempPoint.setTo(x,y);
			var local:Point = this.globalToLocal(this._tempPoint, this._tempPoint);
			var box:Box;

			//early out for box test
			if(!(box = this.getBox()).contains(local.x, local.y, 0))
				return false;

			//early out for non-shape tests
			if (!shapeFlag)
				return true;

			//ok do the graphics thing
			if (this._graphics._hitTestPointInternal(local.x, local.y))
				return true;
		}

		return super._hitTestPointInternal(x, y, shapeFlag, masksFlag);
	}

	public clear():void
	{
		super.clear();

		this._graphics.clear();
	}
}