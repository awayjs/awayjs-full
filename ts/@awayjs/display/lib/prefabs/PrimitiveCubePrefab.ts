import {ElementsType}				from "../graphics/ElementsType";
import {LineElements}				from "../graphics/LineElements";
import {ElementsBase}				from "../graphics/ElementsBase";
import {TriangleElements}			from "../graphics/TriangleElements";
import {MaterialBase}				from "../materials/MaterialBase";
import {PrimitivePrefabBase}		from "../prefabs/PrimitivePrefabBase";

/**
 * A Cube primitive prefab.
 */
export class PrimitiveCubePrefab extends PrimitivePrefabBase
{
	private _width:number;
	private _height:number;
	private _depth:number;
	private _tile6:boolean;

	private _segmentsW:number;
	private _segmentsH:number;
	private _segmentsD:number;

	/**
	 * Creates a new Cube object.
	 * @param width The size of the cube along its X-axis.
	 * @param height The size of the cube along its Y-axis.
	 * @param depth The size of the cube along its Z-axis.
	 * @param segmentsW The number of segments that make up the cube along the X-axis.
	 * @param segmentsH The number of segments that make up the cube along the Y-axis.
	 * @param segmentsD The number of segments that make up the cube along the Z-axis.
	 * @param tile6 The type of uv mapping to use. When true, a texture will be subdivided in a 2x3 grid, each used for a single face. When false, the entire image is mapped on each face.
	 */
	constructor(material:MaterialBase = null, elementsType:string = "triangle", width:number = 100, height:number = 100, depth:number = 100, segmentsW:number = 1, segmentsH:number = 1, segmentsD:number = 1, tile6:boolean = true)
	{
		super(material, elementsType);

		this._width = width;
		this._height = height;
		this._depth = depth;
		this._segmentsW = segmentsW;
		this._segmentsH = segmentsH;
		this._segmentsD = segmentsD;
		this._tile6 = tile6;
	}

	/**
	 * The size of the cube along its X-axis.
	 */
	public get width():number
	{
		return this._width;
	}

	public set width(value:number)
	{
		this._width = value;

		this._pInvalidatePrimitive();
	}

	/**
	 * The size of the cube along its Y-axis.
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
	 * The size of the cube along its Z-axis.
	 */
	public get depth():number
	{
		return this._depth;
	}

	public set depth(value:number)
	{
		this._depth = value;

		this._pInvalidatePrimitive();
	}

	/**
	 * The type of uv mapping to use. When false, the entire image is mapped on each face.
	 * When true, a texture will be subdivided in a 3x2 grid, each used for a single face.
	 * Reading the tiles from left to right, top to bottom they represent the faces of the
	 * cube in the following order: bottom, top, back, left, front, right. This creates
	 * several shared edges (between the top, front, left and right faces) which simplifies
	 * texture painting.
	 */
	public get tile6():boolean
	{
		return this._tile6;
	}

	public set tile6(value:boolean)
	{
		this._tile6 = value;

		this._pInvalidatePrimitive();
	}

	/**
	 * The number of segments that make up the cube along the X-axis. Defaults to 1.
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
	 * The number of segments that make up the cube along the Y-axis. Defaults to 1.
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
	 * The number of segments that make up the cube along the Z-axis. Defaults to 1.
	 */
	public get segmentsD():number
	{
		return this._segmentsD;
	}

	public set segmentsD(value:number)
	{
		this._segmentsD = value;

		this._pInvalidatePrimitive();
		this._pInvalidateUVs();
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
		
		var tl:number, tr:number, bl:number, br:number;
		var i:number, j:number, inc:number = 0;

		var vidx:number, fidx:number; // indices
		var hw:number, hh:number, hd:number; // halves
		var dw:number, dh:number, dd:number; // deltas

		var outer_pos:number;

		// half cube dimensions
		hw = this._width/2;
		hh = this._height/2;
		hd = this._depth/2;

		if (elementsType == ElementsType.TRIANGLE) {

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			var numVertices:number = ((this._segmentsW + 1)*(this._segmentsH + 1) + (this._segmentsW + 1)*(this._segmentsD + 1) + (this._segmentsH + 1)*(this._segmentsD + 1))*2;

			var numIndices:number = ((this._segmentsW*this._segmentsH + this._segmentsW*this._segmentsD + this._segmentsH*this._segmentsD)*12);

			if (numVertices == triangleGraphics.numVertices && triangleGraphics.indices != null) {
				triangleGraphics.invalidateIndices();
				triangleGraphics.invalidateVertices(triangleGraphics.positions);
				triangleGraphics.invalidateVertices(triangleGraphics.normals);
				triangleGraphics.invalidateVertices(triangleGraphics.tangents);
			} else {
				triangleGraphics.setIndices(new Uint16Array(numIndices));
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

			// Segment dimensions
			dw = this._width/this._segmentsW;
			dh = this._height/this._segmentsH;
			dd = this._depth/this._segmentsD;

			for (i = 0; i <= this._segmentsW; i++) {
				outer_pos = -hw + i*dw;

				for (j = 0; j <= this._segmentsH; j++) {
					// front
					positions[vidx] = outer_pos;
					positions[vidx + 1] = -hh + j*dh;
					positions[vidx + 2] = -hd;
					normals[vidx] = 0;
					normals[vidx + 1] = 0;
					normals[vidx + 2] = -1;
					tangents[vidx] = 1;
					tangents[vidx + 1] = 0;
					tangents[vidx + 2] = 0;
					vidx += stride;

					// back
					positions[vidx] = outer_pos;
					positions[vidx + 1] = -hh + j*dh;
					positions[vidx + 2] = hd;
					normals[vidx] = 0;
					normals[vidx + 1] = 0;
					normals[vidx + 2] = 1;
					tangents[vidx] = -1;
					tangents[vidx + 1] = 0;
					tangents[vidx + 2] = 0;
					vidx += stride;

					if (i && j) {
						tl = 2*((i - 1)*(this._segmentsH + 1) + (j - 1));
						tr = 2*(i*(this._segmentsH + 1) + (j - 1));
						bl = tl + 2;
						br = tr + 2;

						indices[fidx++] = tl;
						indices[fidx++] = bl;
						indices[fidx++] = br;
						indices[fidx++] = tl;
						indices[fidx++] = br;
						indices[fidx++] = tr;
						indices[fidx++] = tr + 1;
						indices[fidx++] = br + 1;
						indices[fidx++] = bl + 1;
						indices[fidx++] = tr + 1;
						indices[fidx++] = bl + 1;
						indices[fidx++] = tl + 1;
					}
				}
			}

			inc += 2*(this._segmentsW + 1)*(this._segmentsH + 1);

			for (i = 0; i <= this._segmentsW; i++) {
				outer_pos = -hw + i*dw;

				for (j = 0; j <= this._segmentsD; j++) {
					// top
					positions[vidx] = outer_pos;
					positions[vidx + 1] = hh;
					positions[vidx + 2] = -hd + j*dd;
					normals[vidx] = 0;
					normals[vidx + 1] = 1;
					normals[vidx + 2] = 0;
					tangents[vidx] = 1;
					tangents[vidx + 1] = 0;
					tangents[vidx + 2] = 0;
					vidx += stride;

					// bottom
					positions[vidx] = outer_pos;
					positions[vidx + 1] = -hh;
					positions[vidx + 2] = -hd + j*dd;
					normals[vidx] = 0;
					normals[vidx + 1] = -1;
					normals[vidx + 2] = 0;
					tangents[vidx] = 1;
					tangents[vidx + 1] = 0;
					tangents[vidx + 2] = 0;
					vidx += stride;

					if (i && j) {
						tl = inc + 2*((i - 1)*(this._segmentsD + 1) + (j - 1));
						tr = inc + 2*(i*(this._segmentsD + 1) + (j - 1));
						bl = tl + 2;
						br = tr + 2;

						indices[fidx++] = tl;
						indices[fidx++] = bl;
						indices[fidx++] = br;
						indices[fidx++] = tl;
						indices[fidx++] = br;
						indices[fidx++] = tr;
						indices[fidx++] = tr + 1;
						indices[fidx++] = br + 1;
						indices[fidx++] = bl + 1;
						indices[fidx++] = tr + 1;
						indices[fidx++] = bl + 1;
						indices[fidx++] = tl + 1;
					}
				}
			}

			inc += 2*(this._segmentsW + 1)*(this._segmentsD + 1);

			for (i = 0; i <= this._segmentsD; i++) {
				outer_pos = hd - i*dd;

				for (j = 0; j <= this._segmentsH; j++) {
					// left
					positions[vidx] = -hw;
					positions[vidx+1] = -hh + j*dh;
					positions[vidx+2] = outer_pos;
					normals[vidx] = -1;
					normals[vidx+1] = 0;
					normals[vidx+2] = 0;
					tangents[vidx] = 0;
					tangents[vidx+1] = 0;
					tangents[vidx+2] = -1;
					vidx += stride;

					// right
					positions[vidx] = hw;
					positions[vidx+1] = -hh + j*dh;
					positions[vidx+2] = outer_pos;
					normals[vidx] = 1;
					normals[vidx+1] = 0;
					normals[vidx+2] = 0;
					tangents[vidx] = 0;
					tangents[vidx+1] = 0;
					tangents[vidx+2] = 1;
					vidx += stride;

					if (i && j) {
						tl = inc + 2*((i - 1)*(this._segmentsH + 1) + (j - 1));
						tr = inc + 2*(i*(this._segmentsH + 1) + (j - 1));
						bl = tl + 2;
						br = tr + 2;

						indices[fidx++] = tl;
						indices[fidx++] = bl;
						indices[fidx++] = br;
						indices[fidx++] = tl;
						indices[fidx++] = br;
						indices[fidx++] = tr;
						indices[fidx++] = tr + 1;
						indices[fidx++] = br + 1;
						indices[fidx++] = bl + 1;
						indices[fidx++] = tr + 1;
						indices[fidx++] = bl + 1;
						indices[fidx++] = tl + 1;
					}
				}
			}

		} else if (elementsType == ElementsType.LINE) {
			var lineGraphics:LineElements = <LineElements> target;

			var numSegments:number = this._segmentsH*4 +  this._segmentsW*4 + this._segmentsD*4;
			var thickness:Float32Array;
			
			positions = new Float32Array(numSegments*6);
			thickness = new Float32Array(numSegments);

			vidx = 0;

			fidx = 0;

			//front/back face
			for (i = 0; i < this._segmentsH; ++i) {
				positions[vidx++] = -hw;
				positions[vidx++] = i*this._height/this._segmentsH - hh;
				positions[vidx++] = -hd;

				positions[vidx++] = hw;
				positions[vidx++] = i*this._height/this._segmentsH - hh;
				positions[vidx++] = -hd;

				thickness[fidx++] = 1;

				positions[vidx++] = -hw;
				positions[vidx++] = hh - i*this._height/this._segmentsH;
				positions[vidx++] = hd;

				positions[vidx++] = hw;
				positions[vidx++] = hh - i*this._height/this._segmentsH;
				positions[vidx++] = hd;

				thickness[fidx++] = 1;
			}

			for (i = 0; i < this._segmentsW; ++i) {
				positions[vidx++] = i*this._width/this._segmentsW - hw;
				positions[vidx++] = -hh;
				positions[vidx++] = -hd;

				positions[vidx++] = i*this._width/this._segmentsW - hw;
				positions[vidx++] = hh;
				positions[vidx++] = -hd;

				thickness[fidx++] = 1;

				positions[vidx++] = hw - i*this._width/this._segmentsW;
				positions[vidx++] = -hh;
				positions[vidx++] = hd;

				positions[vidx++] = hw - i*this._width/this._segmentsW;
				positions[vidx++] = hh;
				positions[vidx++] = hd;

				thickness[fidx++] = 1;
			}

			//left/right face
			for (i = 0; i < this._segmentsH; ++i) {
				positions[vidx++] = -hw;
				positions[vidx++] = i*this._height/this._segmentsH - hh;
				positions[vidx++] = -hd;

				positions[vidx++] = -hw;
				positions[vidx++] = i*this._height/this._segmentsH - hh;
				positions[vidx++] = hd;

				thickness[fidx++] = 1;

				positions[vidx++] = hw;
				positions[vidx++] = hh - i*this._height/this._segmentsH;
				positions[vidx++] = -hd;

				positions[vidx++] = hw;
				positions[vidx++] = hh - i*this._height/this._segmentsH;
				positions[vidx++] = hd;

				thickness[fidx++] = 1;
			}

			for (i = 0; i < this._segmentsD; ++i) {
				positions[vidx++] = hw;
				positions[vidx++] = -hh;
				positions[vidx++] = i*this._depth/this._segmentsD - hd;

				positions[vidx++] = hw;
				positions[vidx++] = hh;
				positions[vidx++] = i*this._depth/this._segmentsD - hd;

				thickness[fidx++] = 1;

				positions[vidx++] = -hw;
				positions[vidx++] = -hh;
				positions[vidx++] = hd - i*this._depth/this._segmentsD;

				positions[vidx++] = -hw;
				positions[vidx++] = hh;
				positions[vidx++] = hd - i*this._depth/this._segmentsD;

				thickness[fidx++] = 1;
			}


			//top/bottom face
			for (i = 0; i < this._segmentsD; ++i) {
				positions[vidx++] = -hw;
				positions[vidx++] = -hh;
				positions[vidx++] = hd - i*this._depth/this._segmentsD;

				positions[vidx++] = hw;
				positions[vidx++] = -hh;
				positions[vidx++] = hd - i*this._depth/this._segmentsD;

				thickness[fidx++] = 1;

				positions[vidx++] = -hw;
				positions[vidx++] = hh;
				positions[vidx++] = i*this._depth/this._segmentsD - hd;

				positions[vidx++] = hw;
				positions[vidx++] = hh;
				positions[vidx++] = i*this._depth/this._segmentsD - hd;

				thickness[fidx++] = 1;
			}

			for (i = 0; i < this._segmentsW; ++i) {
				positions[vidx++] = hw - i*this._width/this._segmentsW;
				positions[vidx++] = -hh;
				positions[vidx++] = -hd;

				positions[vidx++] = hw - i*this._width/this._segmentsW;
				positions[vidx++] = -hh;
				positions[vidx++] = hd;

				thickness[fidx++] = 1;

				positions[vidx++] = i*this._width/this._segmentsW - hw;
				positions[vidx++] = hh;
				positions[vidx++] = -hd;

				positions[vidx++] = i*this._width/this._segmentsW - hw;
				positions[vidx++] = hh;
				positions[vidx++] = hd;

				thickness[fidx++] = 1;
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
		var i:number, j:number, index:number;
		var uvs:ArrayBufferView;
		var stride:number;

		var u_tile_dim:number, v_tile_dim:number;
		var u_tile_step:number, v_tile_step:number;
		var tl0u:number, tl0v:number;
		var tl1u:number, tl1v:number;
		var du:number, dv:number;
		var numVertices:number;

		if (elementsType == ElementsType.TRIANGLE) {

			numVertices = ((this._segmentsW + 1)*(this._segmentsH + 1) + (this._segmentsW + 1)*(this._segmentsD + 1) + (this._segmentsH + 1)*(this._segmentsD + 1))*2;

			var triangleGraphics:TriangleElements = <TriangleElements> target;

			if (triangleGraphics.uvs && numVertices == triangleGraphics.numVertices) {
				triangleGraphics.invalidateVertices(triangleGraphics.uvs);
			} else {
				triangleGraphics.setUVs(new Float32Array(numVertices*2));
			}

			uvs = triangleGraphics.uvs.get(numVertices);
			stride = triangleGraphics.uvs.stride;

			if (this._tile6) {
				u_tile_dim = u_tile_step = 1/3;
				v_tile_dim = v_tile_step = 1/2;
			} else {
				u_tile_dim = v_tile_dim = 1;
				u_tile_step = v_tile_step = 0;
			}

			// Create planes two and two, the same way that they were
			// constructed in the buildGraphics() function. First calculate
			// the top-left UV coordinate for both planes, and then loop
			// over the points, calculating the UVs from these numbers.

			// When tile6 is true, the layout is as follows:
			//       .-----.-----.-----. (1,1)
			//       | Bot |  T  | Bak |
			//       |-----+-----+-----|
			//       |  L  |  F  |  R  |
			// (0,0)'-----'-----'-----'

			index = 0;

			// FRONT / BACK
			tl0u = 1*u_tile_step;
			tl0v = 1*v_tile_step;
			tl1u = 2*u_tile_step;
			tl1v = 0*v_tile_step;
			du = u_tile_dim/this._segmentsW;
			dv = v_tile_dim/this._segmentsH;
			for (i = 0; i <= this._segmentsW; i++) {
				for (j = 0; j <= this._segmentsH; j++) {
					uvs[index] = ( tl0u + i*du )*this._scaleU;
					uvs[index + 1] = ( tl0v + (v_tile_dim - j*dv))*this._scaleV;

					index += stride;

					uvs[index] = ( tl1u + (u_tile_dim - i*du))*this._scaleU;
					uvs[index + 1] = ( tl1v + (v_tile_dim - j*dv))*this._scaleV;

					index += stride;
				}
			}

			// TOP / BOTTOM
			tl0u = 1*u_tile_step;
			tl0v = 0*v_tile_step;
			tl1u = 0*u_tile_step;
			tl1v = 0*v_tile_step;
			du = u_tile_dim/this._segmentsW;
			dv = v_tile_dim/this._segmentsD;
			for (i = 0; i <= this._segmentsW; i++) {
				for (j = 0; j <= this._segmentsD; j++) {
					uvs[index] = ( tl0u + i*du)*this._scaleU;
					uvs[index + 1] = ( tl0v + (v_tile_dim - j*dv))*this._scaleV;

					index += stride;

					uvs[index] = ( tl1u + i*du)*this._scaleU;
					uvs[index + 1] = ( tl1v + j*dv)*this._scaleV;

					index += stride;
				}
			}

			// LEFT / RIGHT
			tl0u = 0*u_tile_step;
			tl0v = 1*v_tile_step;
			tl1u = 2*u_tile_step;
			tl1v = 1*v_tile_step;
			du = u_tile_dim/this._segmentsD;
			dv = v_tile_dim/this._segmentsH;
			for (i = 0; i <= this._segmentsD; i++) {
				for (j = 0; j <= this._segmentsH; j++) {
					uvs[index] = ( tl0u + i*du)*this._scaleU;
					uvs[index + 1] = ( tl0v + (v_tile_dim - j*dv))*this._scaleV;

					index += stride;

					uvs[index] = ( tl1u + (u_tile_dim - i*du))*this._scaleU;
					uvs[index + 1] = ( tl1v + (v_tile_dim - j*dv))*this._scaleV;

					index += stride;
				}
			}

		} else if (elementsType == ElementsType.LINE) {
			//nothing to do here
		}
	}
}