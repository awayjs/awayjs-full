import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {BitmapImage2D}				from "@awayjs/core/lib/image/BitmapImage2D";

import {ICubeTexture}					from "../base/ICubeTexture";
import {IIndexBuffer}					from "../base/IIndexBuffer";
import {IProgram}						from "../base/IProgram";
import {ITexture}						from "../base/ITexture";
import {ITextureBase}					from "../base/ITextureBase";
import {IVertexBuffer}				from "../base/IVertexBuffer";

export interface IContextGL
{
	container:HTMLElement;

	clear(red?:number, green?:number, blue?:number, alpha?:number, depth?:number, stencil?:number, mask?:number);

	configureBackBuffer(width:number, height:number, antiAlias:number, enableDepthAndStencil?:boolean);

	createCubeTexture(size:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels?:number):ICubeTexture;

	createIndexBuffer(numIndices:number):IIndexBuffer;

	createProgram():IProgram;

	createTexture(width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels?:number):ITexture;

	createVertexBuffer(numVertices:number, dataPerVertex:number):IVertexBuffer;

	dispose();

	drawToBitmapImage2D(destination:BitmapImage2D);

	drawIndices(mode:string, indexBuffer:IIndexBuffer, firstIndex?:number, numIndices?:number);

	drawVertices(mode:string, firstVertex?:number, numVertices?:number);

	present();

	setBlendFactors(sourceFactor:string, destinationFactor:string);

	setColorMask(red:boolean, green:boolean, blue:boolean, alpha:boolean);

    setStencilActions(triangleFace?:string, compareMode?:string, actionOnBothPass?:string, actionOnDepthFail?:string, actionOnDepthPassStencilFail?:string, coordinateSystem?:string);

    setStencilReferenceValue(referenceValue:number, readMask?:number, writeMask?:number);

	setCulling(triangleFaceToCull:string, coordinateSystem?:string);

	setDepthTest(depthMask:boolean, passCompareMode:string);

	setProgram(program:IProgram);
	
	setProgramConstantsFromArray(programType:number, data:Float32Array);

	setSamplerStateAt(sampler:number, wrap:string, filter:string, mipfilter:string);

	setScissorRectangle(rectangle:Rectangle);

	setTextureAt(sampler:number, texture:ITextureBase);

	setVertexBufferAt(index:number, buffer:IVertexBuffer, bufferOffset?:number, format?:number);

	setRenderToTexture(target:ITextureBase, enableDepthAndStencil?:boolean, antiAlias?:number, surfaceSelector?:number);

	setRenderToBackBuffer();
}