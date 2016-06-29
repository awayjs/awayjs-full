import {IAsset}					from "@awayjs/core/lib/library/IAsset";

import {ElementsType}				from "../graphics/ElementsType";
import {LineElements}				from "../graphics/LineElements";
import {ElementsBase}				from "../graphics/ElementsBase";
import {TriangleElements}			from "../graphics/TriangleElements";
import {MaterialBase}				from "../materials/MaterialBase";
import {PrimitivePrefabBase}		from "../prefabs/PrimitivePrefabBase";

/**
 * A Capsule primitive sprite.
 */
export class PrimitiveCapsulePrefab extends PrimitivePrefabBase
{
	private _radius:number;
	private _height:number;
	private _segmentsW:number;
	private _segmentsH:number;
	private _yUp:boolean;
	private _numVertices:number = 0;

	/**
	 * The radius of the capsule.
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
	 * The height of the capsule.
	 */
	public get height():number
	{
		return this._height;
	}

	public set height(value:number)
	{
		this._height = value;
		this._pInvalidatePrimitive();
	}

	/**
	 * Defines the number of horizontal segments that make up the capsule. Defaults to 16.
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
	 * Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven.
	 */
	public get segmentsH():number
	{
		return this._segmentsH;
	}

	public set segmentsH(value:number)
	{
		this._segmentsH = (value%2 == 0)? value + 1 : value;

		this._pInvalidatePrimitive();
		this._pInvalidateUVs();
	}

	/**
	 * Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
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
	 * Creates a new Capsule object.
	 * @param radius The radius of the capsule.
	 * @param height The height of the capsule.
	 * @param segmentsW Defines the number of horizontal segments that make up the capsule. Defaults to 16.
	 * @param segmentsH Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven value.
	 * @param yUp Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
	 */
	constructor(material:MaterialBase = null, elementsType:string = "triangle", radius:number = 50, height:number = 100, segmentsW:number = 16, segmentsH:number = 15, yUp:boolean = true)
	{
		super(material, elementsType);

		this._radius = radius;
		this._height = height;
		this._segmentsW = segmentsW;
		this._segmentsH = (segmentsH%2 == 0)? segmentsH + 1 : segmentsH;
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
		var triIndex:number = 0;
		var index:number = 0;
		var startIndex:number;
		var comp1:number, comp2:number, t1:number, t2:number;
		var numIndices:number = 0;

		if (elementsType == ElementsType.TRIANGLE) {

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			// evaluate target number of vertices, triangles and indices
			this._numVertices = (this._segmentsH + 1)*(this._segmentsW + 1); // segmentsH + 1 because of closure, segmentsW + 1 because of closure
			numIndices = (this._segmentsH - 1)*this._segmentsW*6; // each level has segmentH quads, each of 2 triangles

			// need to initialize raw arrays or can be reused?
			if (this._numVertices == triangleGraphics.numVertices) {
				triangleGraphics.invalidateIndices();
				triangleGraphics.invalidateVertices(triangleGraphics.positions);
				triangleGraphics.invalidateVertices(triangleGraphics.normals);
				triangleGraphics.invalidateVertices(triangleGraphics.tangents);
			} else {
				triangleGraphics.setIndices(new Uint16Array(numIndices));
				triangleGraphics.setPositions(new Float32Array(this._numVertices*3));
				triangleGraphics.setNormals(new Float32Array(this._numVertices*3));
				triangleGraphics.setTangents(new Float32Array(this._numVertices*3));
				
				this._pInvalidateUVs();
			}

			indices = triangleGraphics.indices.get(triangleGraphics.numElements);
			positions = triangleGraphics.positions.get(this._numVertices);
			normals = triangleGraphics.normals.get(this._numVertices);
			tangents = triangleGraphics.tangents.get(this._numVertices);
			stride = triangleGraphics.concatenatedBuffer.stride/4;
			
			for (j = 0; j <= this._segmentsH; ++j) {

				var horangle:number = Math.PI*j/this._segmentsH;
				var z:number = -this._radius*Math.cos(horangle);
				var ringradius:number = this._radius*Math.sin(horangle);

				startIndex = index;

				for (i = 0; i <= this._segmentsW; ++i) {
					var verangle:number = 2*Math.PI*i/this._segmentsW;
					var x:number = ringradius*Math.cos(verangle);
					var offset:number = j > this._segmentsH/2? this._height/2 : -this._height/2;
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

						positions[index] = positions[startIndex];
						positions[index + 1] = positions[startIndex + 1];
						positions[index + 2] = positions[startIndex + 2];
						normals[index] = (normals[startIndex] + (x*normLen))*.5;
						normals[index + 1] = (normals[startIndex + 1] + ( comp1*normLen))*.5;
						normals[index + 2] = (normals[startIndex + 2] + (comp2*normLen))*.5;
						tangents[index] = (tangents[startIndex] + (tanLen > .007? -y/tanLen : 1))*.5;
						tangents[index + 1] = (tangents[startIndex + 1] + t1)*.5;
						tangents[index + 2] = (tangents[startIndex + 2] + t2)*.5;

					} else {
						// vertex
						positions[index] = x;
						positions[index + 1] = (this._yUp)? comp1 - offset : comp1;
						positions[index + 2] = (this._yUp)? comp2 : comp2 + offset;
						// normal
						normals[index] = x*normLen;
						normals[index + 1] = comp1*normLen;
						normals[index + 2] = comp2*normLen;
						// tangent
						tangents[index] = tanLen > .007? -y/tanLen : 1;
						tangents[index + 1] = t1;
						tangents[index + 2] = t2;
					}

					if (i > 0 && j > 0) {
						var a:number = (this._segmentsW + 1)*j + i;
						var b:number = (this._segmentsW + 1)*j + i - 1;
						var c:number = (this._segmentsW + 1)*(j - 1) + i - 1;
						var d:number = (this._segmentsW + 1)*(j - 1) + i;

						if (j == this._segmentsH) {
							positions[index] = positions[startIndex];
							positions[index + 1] = positions[startIndex + 1];
							positions[index + 2] = positions[startIndex + 2];

							indices[triIndex++] = a;
							indices[triIndex++] = c;
							indices[triIndex++] = d;

						} else if (j == 1) {
							indices[triIndex++] = a;
							indices[triIndex++] = b;
							indices[triIndex++] = c;

						} else {
							indices[triIndex++] = a;
							indices[triIndex++] = b;
							indices[triIndex++] = c;
							indices[triIndex++] = a;
							indices[triIndex++] = c;
							indices[triIndex++] = d;
						}
					}

					index += stride;
				}
			}

		} else if (elementsType == ElementsType.LINE) {
			//TODO
		}
	}

	/**
	 * @inheritDoc
	 */
	public _pBuildUVs(target:ElementsBase, elementsType:string):void
	{
		var i:number, j:number;
		var uvs:ArrayBufferView;
		var stride:number;

		if (elementsType == ElementsType.TRIANGLE) {

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			// need to initialize raw array or can be reused?
			if (triangleGraphics.uvs && this._numVertices == triangleGraphics.numVertices) {
				triangleGraphics.invalidateVertices(triangleGraphics.uvs);
			} else {
				triangleGraphics.setUVs(new Float32Array(this._numVertices*2));
			}

			uvs = triangleGraphics.uvs.get(this._numVertices);
			stride = triangleGraphics.uvs.stride;

			// current uv component index
			var index:number = 0;

			// surface
			for (j = 0; j <= this._segmentsH; ++j) {
				for (i = 0; i <= this._segmentsW; ++i) {
					// revolution vertex
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