import {ByteArray}					from "@awayjs/core/lib/utils/ByteArray";

import {ITextureBase}					from "../base/ITextureBase";

export interface ICubeTexture extends ITextureBase
{
	size:number;

	uploadFromData(image:HTMLImageElement, side:number, miplevel?:number);
	uploadFromData(imageData:ImageData, side:number, miplevel?:number);

	uploadCompressedTextureFromByteArray(data:ByteArray, byteArrayOffset:number, async:boolean);
}