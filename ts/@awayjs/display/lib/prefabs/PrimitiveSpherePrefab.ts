import {IAsset}					from "@awayjs/core/lib/library/IAsset";

import {ElementsType}				from "../graphics/ElementsType";
import {LineElements}				from "../graphics/LineElements";
import {ElementsBase}				from "../graphics/ElementsBase";
import {TriangleElements}			from "../graphics/TriangleElements";
import {MaterialBase}				from "../materials/MaterialBase";
import {PrimitivePrefabBase}		from "../prefabs/PrimitivePrefabBase";

/**
 * A UV Sphere primitive sprite.
 */
export class PrimitiveSpherePrefab extends PrimitivePrefabBase
{
	private _radius:number;
	private _segmentsW:number;
	private _segmentsH:number;
	private _yUp:boolean;

	/**
	 * The radius of the sphere.
	 */
	public get radius():number
	{
		return this._radius;
	}

	public set radius(value:number)
	{
		this._radius = value;

		this._pInvalidatePrimitive();
	}

	/**
	 * Defines the number of horizontal segments that make up the sphere. Defaults to 16.
	 */
	public get segmentsW():number
	{
		return this._segmentsW;
	}

	public set segmentsW(value:number)
	{
		this._segmentsW = value;

		this._pInvalidatePrimitive();
		this._pInvalidateUVs();
	}

	/**
	 * Defines the number of vertical segments that make up the sphere. Defaults to 12.
	 */
	public get segmentsH():number
	{
		return this._segmentsH;
	}

	public set segmentsH(value:number)
	{
		this._segmentsH = value;

		this._pInvalidatePrimitive();
		this._pInvalidateUVs();
	}

	/**
	 * Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
	 */
	public get yUp():boolean
	{
		return this._yUp;
	}

	public set yUp(value:boolean)
	{
		this._yUp = value;

		this._pInvalidatePrimitive();
	}

	/**
	 * Creates a new Sphere object.
	 *
	 * @param radius The radius of the sphere.
	 * @param segmentsW Defines the number of horizontal segments that make up the sphere.
	 * @param segmentsH Defines the number of vertical segments that make up the sphere.
	 * @param yUp Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
	 */
	constructor(material:MaterialBase = null, elementsType:string = "triangle", radius:number = 50, segmentsW:number = 16, segmentsH:number = 12, yUp:boolean = true)
	{
		super(material, elementsType);

		this._radius = radius;
		this._segmentsW = segmentsW;
		this._segmentsH = segmentsH;
		this._yUp = yUp;
	}

	/**
	 * @inheritDoc
	 */
	public _pBuildGraphics(target:ElementsBase, elementsType:string):void
	{
		var indices:Uint16Array;
		var positions:ArrayBufferView;
		var normals:Float32Array;
		var tangents:Float32Array;
		var stride:number;
		
		var i:number;
		var j:number;
		var vidx:number, fidx:number; // indices

		var comp1:number;
		var comp2:number;
		var numVertices:number;


		if (elementsType == ElementsType.TRIANGLE) {

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			numVertices = (this._segmentsH + 1)*(this._segmentsW + 1);

			if (numVertices == triangleGraphics.numVertices && triangleGraphics.indices != null) {
				triangleGraphics.invalidateIndices();
				triangleGraphics.invalidateVertices(triangleGraphics.positions);
				triangleGraphics.invalidateVertices(triangleGraphics.normals);
				triangleGraphics.invalidateVertices(triangleGraphics.tangents);
			} else {
				triangleGraphics.setIndices(new Uint16Array((this._segmentsH - 1)*this._segmentsW*6));
				triangleGraphics.setPositions(new Float32Array(numVertices*3));
				triangleGraphics.setNormals(new Float32Array(numVertices*3));
				triangleGraphics.setTangents(new Float32Array(numVertices*3));
				this._pInvalidateUVs();
			}

			indices = triangleGraphics.indices.get(triangleGraphics.numElements);
			positions = triangleGraphics.positions.get(numVertices);
			normals = triangleGraphics.normals.get(numVertices);
			tangents = triangleGraphics.tangents.get(numVertices);
			stride = triangleGraphics.concatenatedBuffer.stride/4;
			
			vidx = 0;
			fidx = 0;

			var startIndex:number;
			var t1:number;
			var t2:number;

			for (j = 0; j <= this._segmentsH; ++j) {

				startIndex = vidx;

				var horangle:number = Math.PI*j/this._segmentsH;
				var z:number = -this._radius*Math.cos(horangle);
				var ringradius:number = this._radius*Math.sin(horangle);

				for (i = 0; i <= this._segmentsW; ++i) {
					var verangle:number = 2*Math.PI*i/this._segmentsW;
					var x:number = ringradius*Math.cos(verangle);
					var y:number = ringradius*Math.sin(verangle);
					var normLen:number = 1/Math.sqrt(x*x + y*y + z*z);
					var tanLen:number = Math.sqrt(y*y + x*x);

					if (this._yUp) {

						t1 = 0;
						t2 = tanLen > .007? x/tanLen : 0;
						comp1 = -z;
						comp2 = y;

					} else {
						t1 = tanLen > .007? x/tanLen : 0;
						t2 = 0;
						comp1 = y;
						comp2 = z;
					}

					if (i == this._segmentsW) {
						positions[vidx] = positions[startIndex];
						positions[vidx+1] = positions[startIndex + 1];
						positions[vidx+2] = positions[startIndex + 2];
						normals[vidx] = normals[startIndex] + (x*normLen)*.5;
						normals[vidx+1] = normals[startIndex + 1] + ( comp1*normLen)*.5;
						normals[vidx+2] = normals[startIndex + 2] + (comp2*normLen)*.5;
						tangents[vidx] = tanLen > .007? -y/tanLen : 1;
						tangents[vidx+1] = t1;
						tangents[vidx+2] = t2;

					} else {

						positions[vidx] = x;
						positions[vidx+1] = comp1;
						positions[vidx+2] = comp2;
						normals[vidx] = x*normLen;
						normals[vidx+1] = comp1*normLen;
						normals[vidx+2] = comp2*normLen;
						tangents[vidx] = tanLen > .007? -y/tanLen : 1;
						tangents[vidx+1] = t1;
						tangents[vidx+2] = t2;
					}

					if (i > 0 && j > 0) {

						var a:number = (this._segmentsW + 1)*j + i;
						var b:number = (this._segmentsW + 1)*j + i - 1;
						var c:number = (this._segmentsW + 1)*(j - 1) + i - 1;
						var d:number = (this._segmentsW + 1)*(j - 1) + i;

						if (j == this._segmentsH) {

							positions[vidx] = positions[startIndex];
							positions[vidx + 1] = positions[startIndex + 1];
							positions[vidx + 2] = positions[startIndex + 2];

							indices[fidx++] = a;
							indices[fidx++] = c;
							indices[fidx++] = d;

						} else if (j == 1) {

							indices[fidx++] = a;
							indices[fidx++] = b;
							indices[fidx++] = c;

						} else {
							indices[fidx++] = a;
							indices[fidx++] = b;
							indices[fidx++] = c;
							indices[fidx++] = a;
							indices[fidx++] = c;
							indices[fidx++] = d;
						}
					}

					vidx += stride;
				}
			}

		} else if (elementsType == ElementsType.LINE) {

			var lineGraphics:LineElements = <LineElements> target;

			var numSegments:number = this._segmentsH*this._segmentsW*2 + this._segmentsW;
			var positions:ArrayBufferView = new Float32Array(numSegments*6);
			var thickness:Float32Array = new Float32Array(numSegments);

			vidx = 0;

			fidx = 0;

			for (j = 0; j <= this._segmentsH; ++j) {

				var horangle:number = Math.PI*j/this._segmentsH;
				var z:number = -this._radius*Math.cos(horangle);
				var ringradius:number = this._radius*Math.sin(horangle);

				for (i = 0; i <= this._segmentsW; ++i) {
					var verangle:number = 2*Math.PI*i/this._segmentsW;
					var x:number = ringradius*Math.cos(verangle);
					var y:number = ringradius*Math.sin(verangle);

					if (this._yUp) {
						comp1 = -z;
						comp2 = y;

					} else {
						comp1 = y;
						comp2 = z;
					}

					if (i > 0) {
						//horizonal lines
						positions[vidx++] = x;
						positions[vidx++] = comp1;
						positions[vidx++] = comp2;

						thickness[fidx++] = 1;

						//vertical lines
						if (j > 0) {
							var addx:number = (j == 1)? 3 - (6*(this._segmentsW-i) + 12*i) : 3 - this._segmentsW*12;
							positions[vidx] = positions[vidx++ + addx];
							positions[vidx] = positions[vidx++ + addx];
							positions[vidx] = positions[vidx++ + addx];

							positions[vidx++] = x;
							positions[vidx++] = comp1;
							positions[vidx++] = comp2;

							thickness[fidx++] = 1;
						}

					}

					//horizonal lines
					if (i < this._segmentsW) {
						positions[vidx++] = x;
						positions[vidx++] = comp1;
						positions[vidx++] = comp2;
					}
				}
			}

			// build real data from raw data
			lineGraphics.setPositions(positions);
			lineGraphics.setThickness(thickness);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _pBuildUVs(target:ElementsBase, elementsType:string):void
	{
		var i:number, j:number;
		var numVertices:number = (this._segmentsH + 1)*(this._segmentsW + 1);
		var uvs:ArrayBufferView;
		var stride:number;

		if (elementsType == ElementsType.TRIANGLE) {

			numVertices = (this._segmentsH + 1)*(this._segmentsW + 1);

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			if (triangleGraphics.uvs && numVertices == triangleGraphics.numVertices) {
				triangleGraphics.invalidateVertices(triangleGraphics.uvs);
			} else {
				triangleGraphics.setUVs(new Float32Array(numVertices*2));
			}

			uvs = triangleGraphics.uvs.get(numVertices);
			stride = triangleGraphics.uvs.stride;
			
			var index:number = 0;
			for (j = 0; j <= this._segmentsH; ++j) {
				for (i = 0; i <= this._segmentsW; ++i) {
					uvs[index] = ( i/this._segmentsW )*this._scaleU;
					uvs[index + 1] = ( j/this._segmentsH )*this._scaleV;

					index += stride;
				}
			}

		} else if (elementsType == ElementsType.LINE) {
			//nothing to do here
		}
	}
}