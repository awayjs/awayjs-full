import {ByteArray}					from "@awayjs/core/lib/utils/ByteArray";

export interface IProgram
{
	upload(vertexProgram:ByteArray, fragmentProgram:ByteArray);

	dispose();
}