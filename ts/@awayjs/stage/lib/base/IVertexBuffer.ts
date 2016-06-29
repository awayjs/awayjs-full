export interface IVertexBuffer
{
	numVertices:number;

	dataPerVertex:number;

	uploadFromArray(data:number[], startVertex:number, numVertices:number);

	uploadFromByteArray(data:ArrayBuffer, startVertex:number, numVertices:number);

	dispose();
}