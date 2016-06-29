import {EventDispatcher}				from "@awayjs/core/lib/events/EventDispatcher";
import {ColorTransform}				from "@awayjs/core/lib/geom/ColorTransform";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {PerspectiveProjection}		from "@awayjs/core/lib/projections/PerspectiveProjection";


import {DisplayObject}				from "../display/DisplayObject";
import {TransformEvent}				from "../events/TransformEvent";

/**
 * The Transform class provides access to color adjustment properties and two-
 * or three-dimensional transformation objects that can be applied to a
 * display object. During the transformation, the color or the orientation and
 * position of a display object is adjusted(offset) from the current values
 * or coordinates to new values or coordinates. The Transform class also
 * collects data about color and two-dimensional matrix transformations that
 * are applied to a display object and all of its parent objects. You can
 * access these combined transformations through the
 * <code>concatenatedColorTransform</code> and <code>concatenatedMatrix</code>
 * properties.
 *
 * <p>To apply color transformations: create a ColorTransform object, set the
 * color adjustments using the object's methods and properties, and then
 * assign the <code>colorTransformation</code> property of the
 * <code>transform</code> property of the display object to the new
 * ColorTransformation object.</p>
 *
 * <p>To apply two-dimensional transformations: create a Matrix object, set
 * the matrix's two-dimensional transformation, and then assign the
 * <code>transform.matrix</code> property of the display object to the new
 * Matrix object.</p>
 *
 * <p>To apply three-dimensional transformations: start with a
 * three-dimensional display object. A three-dimensional display object has a
 * <code>z</code> property value other than zero. You do not need to create
 * the Matrix3D object. For all three-dimensional objects, a Matrix3D object
 * is created automatically when you assign a <code>z</code> value to a
 * display object. You can access the display object's Matrix3D object through
 * the display object's <code>transform</code> property. Using the methods of
 * the Matrix3D class, you can add to or modify the existing transformation
 * settings. Also, you can create a custom Matrix3D object, set the custom
 * Matrix3D object's transformation elements, and then assign the new Matrix3D
 * object to the display object using the <code>transform.matrix</code>
 * property.</p>
 *
 * <p>To modify a perspective projection of the stage or root object: use the
 * <code>transform.matrix</code> property of the root display object to gain
 * access to the PerspectiveProjection object. Or, apply different perspective
 * projection properties to a display object by setting the perspective
 * projection properties of the display object's parent. The child display
 * object inherits the new properties. Specifically, create a
 * PerspectiveProjection object and set its properties, then assign the
 * PerspectiveProjection object to the <code>perspectiveProjection</code>
 * property of the parent display object's <code>transform</code> property.
 * The specified projection transformation then applies to all the display
 * object's three-dimensional children.</p>
 *
 * <p>Since both PerspectiveProjection and Matrix3D objects perform
 * perspective transformations, do not assign both to a display object at the
 * same time. Use the PerspectiveProjection object for focal length and
 * projection center changes. For more control over the perspective
 * transformation, create a perspective projection Matrix3D object.</p>
 */
export class Transform extends EventDispatcher
{
	private _concatenatedColorTransform:ColorTransform;
	private _concatenatedMatrix:Matrix;
	private _pixelBounds:Rectangle;
	private _colorTransform:ColorTransform;
	private _matrix3D:Matrix3D = new Matrix3D();
	private _matrix3DDirty:boolean;
	private _rotation:Vector3D = new Vector3D();
	private _skew:Vector3D = new Vector3D();
	private _scale:Vector3D = new Vector3D(1, 1, 1);
	private _components:Array<Vector3D>;
	private _componentsDirty:boolean;

	/**
	 *
	 */
	public get backVector():Vector3D
	{
		var director:Vector3D = Matrix3DUtils.getForward(this._matrix3D);
		director.negate();

		return director;
	}

	/**
	 * A ColorTransform object containing values that universally adjust the
	 * colors in the display object.
	 * 
	 * @throws TypeError The colorTransform is null when being set
	 */
	public get colorTransform():ColorTransform
	{
		return this._colorTransform;
	}

	public set colorTransform(val:ColorTransform)
	{
		if (this._colorTransform == val)
			return;

		this._colorTransform = val;

		this.invalidateColorTransform();
	}

	/**
	 * A ColorTransform object representing the combined color transformations
	 * applied to the display object and all of its parent objects, back to the
	 * root level. If different color transformations have been applied at
	 * different levels, all of those transformations are concatenated into one
	 * ColorTransform object for this property.
	 */
	public get concatenatedColorTransform():ColorTransform
	{
		return this._concatenatedColorTransform; //TODO
	}

	/**
	 * A Matrix object representing the combined transformation matrixes of the
	 * display object and all of its parent objects, back to the root level. If
	 * different transformation matrixes have been applied at different levels,
	 * all of those matrixes are concatenated into one matrix for this property.
	 * Also, for resizeable SWF content running in the browser, this property
	 * factors in the difference between stage coordinates and window coordinates
	 * due to window resizing. Thus, the property converts local coordinates to
	 * window coordinates, which may not be the same coordinate space as that of
	 * the Scene.
	 */
	public get concatenatedMatrix():Matrix
	{
		return this._concatenatedMatrix; //TODO
	}

	/**
	 *
	 */
	public get downVector():Vector3D
	{
		var director:Vector3D = Matrix3DUtils.getUp(this._matrix3D);
		director.negate();

		return director;
	}

	/**
	 *
	 */
	public get forwardVector():Vector3D
	{
		return Matrix3DUtils.getForward(this._matrix3D);
	}

	/**
	 *
	 */
	public get leftVector():Vector3D
	{
		var director:Vector3D = Matrix3DUtils.getRight(this._matrix3D);
		director.negate();

		return director;
	}

	/**
	 * A Matrix object containing values that alter the scaling, rotation, and
	 * translation of the display object.
	 *
	 * <p>If the <code>matrix</code> property is set to a value(not
	 * <code>null</code>), the <code>matrix3D</code> property is
	 * <code>null</code>. And if the <code>matrix3D</code> property is set to a
	 * value(not <code>null</code>), the <code>matrix</code> property is
	 * <code>null</code>.</p>
	 * 
	 * @throws TypeError The matrix is null when being set
	 */
	public matrix:Matrix;

	/**
	 * Provides access to the Matrix3D object of a three-dimensional display
	 * object. The Matrix3D object represents a transformation matrix that
	 * determines the display object's position and orientation. A Matrix3D
	 * object can also perform perspective projection.
	 *
	 * <p>If the <code>matrix</code> property is set to a value(not
	 * <code>null</code>), the <code>matrix3D</code> property is
	 * <code>null</code>. And if the <code>matrix3D</code> property is set to a
	 * value(not <code>null</code>), the <code>matrix</code> property is
	 * <code>null</code>.</p>
	 */
	public get matrix3D():Matrix3D
	{
		if (this._matrix3DDirty)
			this._updateMatrix3D();

		return this._matrix3D;
	}

	public set matrix3D(val:Matrix3D)
	{
		for (var i:number = 0; i < 15; i++)
			this._matrix3D.rawData[i] = val.rawData[i];
		
		this.invalidateComponents();
	}

	/**
	 * Provides access to the PerspectiveProjection object of a three-dimensional
	 * display object. The PerspectiveProjection object can be used to modify the
	 * perspective transformation of the stage or to assign a perspective
	 * transformation to all the three-dimensional children of a display object.
	 *
	 * <p>Based on the field of view and aspect ratio(dimensions) of the stage,
	 * a default PerspectiveProjection object is assigned to the root object.</p>
	 */
	public perspectiveProjection:PerspectiveProjection;

	/**
	 * A Rectangle object that defines the bounding rectangle of the display
	 * object on the stage.
	 */
	public get pixelBounds():Rectangle
	{
		return this._pixelBounds;
	}

	/**
	 * Defines the position of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
	 */
	public get position():Vector3D
	{
		return this._matrix3D.position;
	}

	/**
	 *
	 */
	public get rightVector():Vector3D
	{
		return Matrix3DUtils.getRight(this.matrix3D);
	}

	/**
	 * Defines the rotation of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
	 */
	public get rotation():Vector3D
	{
		if (this._componentsDirty)
			this._updateComponents();

		return this._rotation;
	}

	/**
	 * Rotates the 3d object directly to a euler angle
	 *
	 * @param    ax        The angle in degrees of the rotation around the x axis.
	 * @param    ay        The angle in degrees of the rotation around the y axis.
	 * @param    az        The angle in degrees of the rotation around the z axis.
	 */
	public rotateTo(ax:number, ay:number, az:number):void
	{
		if (this._componentsDirty)
			this._updateComponents();

		this._rotation.x = ax;
		this._rotation.y = ay;
		this._rotation.z = az;

		this.invalidateMatrix3D();
	}

	/**
	 * Defines the scale of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
	 */
	public get scale():Vector3D
	{
		if (this._componentsDirty)
			this._updateComponents();

		return this._scale;
	}

	public scaleTo(sx:number, sy:number, sz:number):void
	{
		if (this._componentsDirty)
			this._updateComponents();

		this._scale.x = sx;
		this._scale.y = sy;
		this._scale.z = sz;

		this.invalidateMatrix3D();
	}

	/**
	 * Defines the scale of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
	 */
	public get skew():Vector3D
	{
		if (this._componentsDirty)
			this._updateComponents();

		return this._skew;
	}

	public skewTo(sx:number, sy:number, sz:number):void
	{
		if (this._componentsDirty)
			this._updateComponents();

		this._skew.x = sx;
		this._skew.y = sy;
		this._skew.z = sz;

		this.invalidateMatrix3D();
	}


	/**
	 *
	 */
	public get upVector():Vector3D
	{
		return Matrix3DUtils.getUp(this.matrix3D);
	}

	constructor()
	{
		super();

		// Cached vector of transformation components used when
		// recomposing the transform matrix in updateTransform()

		this._components = new Array<Vector3D>(4);

		this._components[1] = this._rotation;
		this._components[2] = this._skew;
		this._components[3] = this._scale;
	}

	public dispose():void
	{
		
	}

	/**
	 * Returns a Matrix3D object, which can transform the space of a specified
	 * display object in relation to the current display object's space. You can
	 * use the <code>getRelativeMatrix3D()</code> method to move one
	 * three-dimensional display object relative to another three-dimensional
	 * display object.
	 * 
	 * @param relativeTo The display object relative to which the transformation
	 *                   occurs. To get a Matrix3D object relative to the stage,
	 *                   set the parameter to the <code>root</code> or
	 *                   <code>stage</code> object. To get the world-relative
	 *                   matrix of the display object, set the parameter to a
	 *                   display object that has a perspective transformation
	 *                   applied to it.
	 * @return A Matrix3D object that can be used to transform the space from the
	 *         <code>relativeTo</code> display object to the current display
	 *         object space.
	 */
	public getRelativeMatrix3D(relativeTo:DisplayObject):Matrix3D
	{
		return new Matrix3D(); //TODO
	}


	/**
	 * Moves the 3d object forwards along it's local z axis
	 *
	 * @param    distance    The length of the movement
	 */
	public moveForward(distance:number):void
	{
		this.translateLocal(Vector3D.Z_AXIS, distance);
	}

	/**
	 * Moves the 3d object backwards along it's local z axis
	 *
	 * @param    distance    The length of the movement
	 */
	public moveBackward(distance:number):void
	{
		this.translateLocal(Vector3D.Z_AXIS, -distance);
	}

	/**
	 * Moves the 3d object backwards along it's local x axis
	 *
	 * @param    distance    The length of the movement
	 */

	public moveLeft(distance:number):void
	{
		this.translateLocal(Vector3D.X_AXIS, -distance);
	}

	/**
	 * Moves the 3d object forwards along it's local x axis
	 *
	 * @param    distance    The length of the movement
	 */
	public moveRight(distance:number):void
	{
		this.translateLocal(Vector3D.X_AXIS, distance);
	}

	/**
	 * Moves the 3d object forwards along it's local y axis
	 *
	 * @param    distance    The length of the movement
	 */
	public moveUp(distance:number):void
	{
		this.translateLocal(Vector3D.Y_AXIS, distance);
	}

	/**
	 * Moves the 3d object backwards along it's local y axis
	 *
	 * @param    distance    The length of the movement
	 */
	public moveDown(distance:number):void
	{
		this.translateLocal(Vector3D.Y_AXIS, -distance);
	}

	/**
	 * Moves the 3d object directly to a point in space
	 *
	 * @param    dx        The amount of movement along the local x axis.
	 * @param    dy        The amount of movement along the local y axis.
	 * @param    dz        The amount of movement along the local z axis.
	 */

	public moveTo(dx:number, dy:number, dz:number):void
	{
		this._matrix3D.rawData[12] = dx;
		this._matrix3D.rawData[13] = dy;
		this._matrix3D.rawData[14] = dz;

		this.invalidatePosition();
	}

	/**
	 * Rotates the 3d object around it's local x-axis
	 *
	 * @param    angle        The amount of rotation in degrees
	 */
	public pitch(angle:number):void
	{
		this.rotate(Vector3D.X_AXIS, angle);
	}

	/**
	 * Rotates the 3d object around it's local z-axis
	 *
	 * @param    angle        The amount of rotation in degrees
	 */
	public roll(angle:number):void
	{
		this.rotate(Vector3D.Z_AXIS, angle);
	}

	/**
	 * Rotates the 3d object around it's local y-axis
	 *
	 * @param    angle        The amount of rotation in degrees
	 */
	public yaw(angle:number):void
	{
		this.rotate(Vector3D.Y_AXIS, angle);
	}

	/**
	 * Rotates the 3d object around an axis by a defined angle
	 *
	 * @param    axis        The vector defining the axis of rotation
	 * @param    angle        The amount of rotation in degrees
	 */
	public rotate(axis:Vector3D, angle:number):void
	{
		this.matrix3D.prependRotation(angle, axis);

		this.invalidateComponents();
	}

	/**
	 * Moves the 3d object along a vector by a defined length
	 *
	 * @param    axis        The vector defining the axis of movement
	 * @param    distance    The length of the movement
	 */
	public translate(axis:Vector3D, distance:number):void
	{
		var x:number = axis.x, y:number = axis.y, z:number = axis.z;
		var len:number = distance/Math.sqrt(x*x + y*y + z*z);

		this.matrix3D.appendTranslation(x*len, y*len, z*len);

		this.invalidatePosition();
	}

	/**
	 * Moves the 3d object along a vector by a defined length
	 *
	 * @param    axis        The vector defining the axis of movement
	 * @param    distance    The length of the movement
	 */
	public translateLocal(axis:Vector3D, distance:number):void
	{
		var x:number = axis.x, y:number = axis.y, z:number = axis.z;
		var len:number = distance/Math.sqrt(x*x + y*y + z*z);

		this.matrix3D.prependTranslation(x*len, y*len, z*len);

		this.invalidatePosition();
	}

	public clearMatrix3D():void
	{
		this._matrix3D.identity();
		this.invalidateComponents();
	}

	public clearColorTransform():void
	{
		if (!this._colorTransform)
			return;
		
		this._colorTransform.clear();
		this.invalidateColorTransform();
	}

	/**
	 * Invalidates the 3D transformation matrix, causing it to be updated upon the next request
	 *
	 * @private
	 */
	public invalidateMatrix3D():void
	{
		this._matrix3DDirty = true;
		
		this.dispatchEvent(new TransformEvent(TransformEvent.INVALIDATE_MATRIX3D, this));
	}

	public invalidateComponents():void
	{
		this.invalidatePosition();
		
		this._componentsDirty = true;
	}
	
	/**
	 *
	 */
	public invalidatePosition():void
	{
		this._matrix3D.invalidatePosition();

		this.dispatchEvent(new TransformEvent(TransformEvent.INVALIDATE_MATRIX3D, this));
	}

	public invalidateColorTransform():void
	{
		this.dispatchEvent(new TransformEvent(TransformEvent.INVALIDATE_COLOR_TRANSFORM, this));
	}

	/**
	 *
	 */
	private _updateMatrix3D():void
	{
		this._matrix3D.recompose(this._components);

		this._matrix3DDirty = false;
	}


	private _updateComponents():void
	{
		var elements:Array<Vector3D> = this._matrix3D.decompose();
		var vec:Vector3D;

		vec = elements[1];

		this._rotation.x = vec.x;
		this._rotation.y = vec.y;
		this._rotation.z = vec.z;

		vec = elements[2];

		this._skew.x = vec.x;
		this._skew.y = vec.y;
		this._skew.z = vec.z;

		vec = elements[3];

		this._scale.x = vec.x;
		this._scale.y = vec.y;
		this._scale.z = vec.z;

		this._componentsDirty = false;
	}
}
