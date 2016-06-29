export class OpCodes
{
	public static trueValue:number = 32;
	public static falseValue:number = 33;
	public static intMask:number = 63;
	public static drawTriangles:number = 41;
	public static setProgramConstant:number = 42;
	public static setProgram:number = 43;
	public static present:number = 44;
	public static clear:number = 45;
	public static initProgram:number = 46;
	public static initVertexBuffer:number = 47;
	public static initIndexBuffer:number = 48;
	public static configureBackBuffer:number = 49;
	public static uploadArrayIndexBuffer:number = 50;
	public static uploadArrayVertexBuffer:number = 51;
	public static uploadAGALBytesProgram:number = 52;
	public static setVertexBufferAt:number = 53;
	public static uploadBytesIndexBuffer:number = 54;
	public static uploadBytesVertexBuffer:number = 55;
	public static setColorMask:number = 56;
	public static setDepthTest:number = 57;
	public static disposeProgram:number = 58;
	public static disposeContext:number = 59;
	// must skip 60 '<' as it will invalidate xml being passed over the bridge
	public static disposeVertexBuffer:number = 61;
	// must skip 62 '>' as it will invalidate xml being passed over the bridge
	public static disposeIndexBuffer:number = 63;
	public static initTexture:number = 64;
	public static setTextureAt:number = 65;
	public static uploadBytesTexture:number = 66;
	public static disposeTexture:number = 67;
	public static setCulling:number = 68;
	public static setScissorRect:number = 69;
	public static clearScissorRect:number = 70;
	public static setBlendFactors:number = 71;
	public static setRenderToTexture:number = 72;
	public static clearTextureAt:number = 73;
	public static clearVertexBufferAt:number = 74;
	public static setStencilActions:number = 75;
	public static setStencilReferenceValue:number = 76;
	public static initCubeTexture:number = 77;
	public static disposeCubeTexture:number = 78;
	public static uploadBytesCubeTexture:number = 79;
	public static clearRenderToTexture:number = 80;
	public static enableErrorChecking:number = 81;
}