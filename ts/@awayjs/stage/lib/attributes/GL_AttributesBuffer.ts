import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {Stage}						from "../base/Stage";
import {IIndexBuffer}					from "../base/IIndexBuffer";
import {IVertexBuffer}				from "../base/IVertexBuffer";

/**
 *
 * @class away.pool.GL_AttributesBuffer
 */
export class GL_AttributesBuffer extends AbstractionBase
{
	public _indexBuffer:IIndexBuffer;

	public _vertexBuffer:IVertexBuffer;

	public _stage:Stage;

	public _attributesBuffer:AttributesBuffer;

	public _mipmap:boolean;

	public _invalid:boolean;

	constructor(attributesBuffer:AttributesBuffer, stage:Stage)
	{
		super(attributesBuffer, stage);

		this._stage = stage;

		this._attributesBuffer = attributesBuffer;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._attributesBuffer = null;

		if (this._indexBuffer) {
			this._indexBuffer.dispose();
			this._indexBuffer = null;
		}

		if (this._vertexBuffer) {
			this._vertexBuffer.dispose();
			this._vertexBuffer = null;
		}
	}

	public activate(index:number, size:number, dimensions:number, offset:number, unsigned:boolean = false):void
	{
		this._stage.setVertexBuffer(index, this._getVertexBuffer(), size, dimensions, offset, unsigned);
	}

	public draw(mode:string, firstIndex:number, numIndices:number):void
	{
		this._stage.context.drawIndices(mode, this._getIndexBuffer(), firstIndex, numIndices);
	}

	public _getIndexBuffer():IIndexBuffer
	{
		if (!this._indexBuffer) {
			this._invalid = true;
			this._indexBuffer = this._stage.context.createIndexBuffer(this._attributesBuffer.count*this._attributesBuffer.stride/2); //hardcoded assuming UintArray
		}

		if (this._invalid) {
			this._invalid = false;
			this._indexBuffer.uploadFromByteArray(this._attributesBuffer.buffer, 0, this._attributesBuffer.length);
		}

		return this._indexBuffer;
	}

	public _getVertexBuffer():IVertexBuffer
	{
		if (!this._vertexBuffer) {
			this._invalid = true;
			this._vertexBuffer = this._stage.context.createVertexBuffer(this._attributesBuffer.count, this._attributesBuffer.stride);
		}

		if (this._invalid) {
			this._invalid = false;
			this._vertexBuffer.uploadFromByteArray(this._attributesBuffer.buffer, 0, this._attributesBuffer.count);
		}

		return this._vertexBuffer;
	}
}