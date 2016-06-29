import {IVertexBuffer}				from "../base/IVertexBuffer";

export class VertexBufferWebGL implements IVertexBuffer
{

	private _gl:WebGLRenderingContext;
	private _numVertices:number;
	private _dataPerVertex:number;
	private _buffer:WebGLBuffer;

	constructor(gl:WebGLRenderingContext, numVertices:number, dataPerVertex:number)
	{
		this._gl = gl;
		this._buffer = this._gl.createBuffer();
		this._numVertices = numVertices;
		this._dataPerVertex = dataPerVertex;
	}

	public uploadFromArray(vertices:number[], startVertex:number, numVertices:number):void
	{
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);

		if (startVertex)
			this._gl.bufferSubData(this._gl.ARRAY_BUFFER, startVertex*this._dataPerVertex, new Float32Array(vertices));
		else
			this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
	}


	public uploadFromByteArray(data:ArrayBuffer, startVertex:number, numVertices:number):void
	{
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);

		if (startVertex)
			this._gl.bufferSubData(this._gl.ARRAY_BUFFER, startVertex*this._dataPerVertex, data);
		else
			this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
	}

	public get numVertices():number
	{
		return this._numVertices;
	}

	public get dataPerVertex():number
	{
		return this._dataPerVertex;
	}

	public get glBuffer():WebGLBuffer
	{
		return this._buffer;
	}

	public dispose():void
	{
		this._gl.deleteBuffer(this._buffer);
	}
}