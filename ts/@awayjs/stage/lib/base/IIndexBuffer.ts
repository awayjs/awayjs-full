export interface IIndexBuffer
{
	numIndices:number;

	uploadFromArray(data:number[], startOffset:number, count:number);

	uploadFromByteArray(data:ArrayBuffer, startOffset:number, count:number);

	dispose();
}