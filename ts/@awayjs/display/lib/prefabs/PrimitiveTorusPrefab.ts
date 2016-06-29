import {IAsset}					from "@awayjs/core/lib/library/IAsset";

import {ElementsType}				from "../graphics/ElementsType";
import {ElementsBase}				from "../graphics/ElementsBase";
import {TriangleElements}			from "../graphics/TriangleElements";
import {MaterialBase}				from "../materials/MaterialBase";
import {PrimitivePrefabBase}		from "../prefabs/PrimitivePrefabBase";

/**
 * A UV Cylinder primitive sprite.
 */
export class PrimitiveTorusPrefab extends PrimitivePrefabBase
{
	private _radius:number;
	private _tubeRadius:number;
	private _segmentsR:number;
	private _segmentsT:number;
	private _yUp:boolean;
	private _numVertices:number = 0;

	/**
	 * The radius of the torus.
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
	 * The radius of the inner tube of the torus.
	 */
	public get tubeRadius():number
	{
		return this._tubeRadius;
	}

	public set tubeRadius(value:number)
	{
		this._tubeRadius = value;
		this._pInvalidatePrimitive();
	}

	/**
	 * Defines the number of horizontal segments that make up the torus. Defaults to 16.
	 */
	public get segmentsR():number
	{
		return this._segmentsR;
	}

	public set segmentsR(value:number)
	{
		this._segmentsR = value;
		this._pInvalidatePrimitive();
		this._pInvalidateUVs();
	}

	/**
	 * Defines the number of vertical segments that make up the torus. Defaults to 8.
	 */
	public get segmentsT():number
	{
		return this._segmentsT;
	}

	public set segmentsT(value:number)
	{
		this._segmentsT = value;
		this._pInvalidatePrimitive();
		this._pInvalidateUVs();
	}

	/**
	 * Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
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
	 * Creates a new <code>Torus</code> object.
	 * @param radius The radius of the torus.
	 * @param tuebRadius The radius of the inner tube of the torus.
	 * @param segmentsR Defines the number of horizontal segments that make up the torus.
	 * @param segmentsT Defines the number of vertical segments that make up the torus.
	 * @param yUp Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
	 */
	constructor(material:MaterialBase = null, elementsType:string = "triangle", radius:number = 50, tubeRadius:number = 50, segmentsR:number = 16, segmentsT:number = 8, yUp:boolean = true)
	{
		super(material, elementsType);

		this._radius = radius;
		this._tubeRadius = tubeRadius;
		this._segmentsR = segmentsR;
		this._segmentsT = segmentsT;
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

		var i:number, j:number;
		var x:number, y:number, z:number, nx:number, ny:number, nz:number, revolutionAngleR:number, revolutionAngleT:number;
		var vidx:number;
		var fidx:number;
		var numIndices:number = 0;

		if (elementsType == ElementsType.TRIANGLE) {

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			// evaluate target number of vertices, triangles and indices
			this._numVertices = (this._segmentsT + 1)*(this._segmentsR + 1); // segmentsT + 1 because of closure, segmentsR + 1 because of closure
			numIndices = this._segmentsT*this._segmentsR*6; // each level has segmentR quads, each of 2 triangles

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

			vidx = 0;
			fidx = 0;

			// evaluate revolution steps
			var revolutionAngleDeltaR:number = 2*Math.PI/this._segmentsR;
			var revolutionAngleDeltaT:number = 2*Math.PI/this._segmentsT;

			var comp1:number, comp2:number;
			var t1:number, t2:number, n1:number, n2:number;
			var startIndex:number = 0;
			var nextVertexIndex:number = 0;

			// surface
			var a:number, b:number, c:number, d:number, length:number;

			for (j = 0; j <= this._segmentsT; ++j) {

				startIndex = vidx;

				for (i = 0; i <= this._segmentsR; ++i) {

					// revolution vertex
					revolutionAngleR = i*revolutionAngleDeltaR;
					revolutionAngleT = j*revolutionAngleDeltaT;

					length = Math.cos(revolutionAngleT);
					nx = length*Math.cos(revolutionAngleR);
					ny = length*Math.sin(revolutionAngleR);
					nz = Math.sin(revolutionAngleT);

					x = this._radius*Math.cos(revolutionAngleR) + this._tubeRadius*nx;
					y = this._radius*Math.sin(revolutionAngleR) + this._tubeRadius*ny;
					z = (j == this._segmentsT)? 0 : this._tubeRadius*nz;

					if (this._yUp) {

						n1 = -nz;
						n2 = ny;
						t1 = 0;
						t2 = (length? nx/length : x/this._radius);
						comp1 = -z;
						comp2 = y;

					} else {
						n1 = ny;
						n2 = nz;
						t1 = (length? nx/length : x/this._radius);
						t2 = 0;
						comp1 = y;
						comp2 = z;
					}

					if (i == this._segmentsR) {
						positions[vidx] = x;
						positions[vidx + 1] = positions[startIndex + 1];
						positions[vidx + 2] = positions[startIndex + 2];
					} else {
						positions[vidx] = x;
						positions[vidx + 1] = comp1;
						positions[vidx + 2] = comp2;
					}

					normals[vidx] = nx;
					normals[vidx + 1] = n1;
					normals[vidx + 2] = n2;
					tangents[vidx] = -(length? ny/length : y/this._radius);
					tangents[vidx + 1] = t1;
					tangents[vidx + 2] = t2;

					vidx += stride;

					// close triangle
					if (i > 0 && j > 0) {
						a = nextVertexIndex; // current
						b = nextVertexIndex - 1; // previous
						c = b - this._segmentsR - 1; // previous of last level
						d = a - this._segmentsR - 1; // current of last level

						indices[fidx++] = a;
						indices[fidx++] = b;
						indices[fidx++] = c;

						indices[fidx++] = a;
						indices[fidx++] = c;
						indices[fidx++] = d;
					}

					nextVertexIndex++;
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
			for (j = 0; j <= this._segmentsT; ++j) {
				for (i = 0; i <= this._segmentsR; ++i) {
					// revolution vertex
					uvs[index] = ( i/this._segmentsR )*this._scaleU;
					uvs[index + 1] = ( j/this._segmentsT )*this._scaleV;

					index += stride;
				}
			}

		} else if (elementsType == ElementsType.LINE) {
			//nothing to do here
		}
	}
}