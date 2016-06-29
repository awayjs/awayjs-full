import {IIndexBuffer}					from "../base/IIndexBuffer";

export class IndexBufferSoftware implements IIndexBuffer
{
	private _numIndices:number;
	private _data:Uint16Array;
	private _startOffset:number;

	constructor(numIndices:number)
	{
		this._numIndices = numIndices;
	}

	public uploadFromArray(data:number[], startOffset:number, count:number):void
	{
		this._startOffset = startOffset*2;
		this._data = new Uint16Array(data);
	}

	public uploadFromByteArray(data:ArrayBuffer, startOffset:number, count:number):void
	{
		this._startOffset = startOffset*2;
		this._data = new Uint16Array(data);
	}

	public dispose():void
	{
		this._data = null;
	}

	public get numIndices():number
	{
		return this._numIndices;
	}

	public get data():Uint16Array
	{
		return this._data;
	}

	public get startOffset():number
	{
		return this._startOffset;
	}

}