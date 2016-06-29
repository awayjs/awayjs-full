export class ContextGLClearMask
{
	static COLOR:number = 1;
	static DEPTH:number = 2;
	static STENCIL:number = 4;
	static ALL:number = ContextGLClearMask.COLOR | ContextGLClearMask.DEPTH | ContextGLClearMask.STENCIL;
}