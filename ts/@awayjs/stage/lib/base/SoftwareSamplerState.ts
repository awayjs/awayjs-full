import {ContextGLTextureFilter}		from "./ContextGLTextureFilter";
import {ContextGLMipFilter}			from "./ContextGLMipFilter";
import {ContextGLWrapMode}			from "./ContextGLWrapMode";

/**
 * The same as SamplerState, but with strings
 * TODO: replace two similar classes with one
 */
export class SoftwareSamplerState
{
	public type:string;
	public wrap:string = ContextGLWrapMode.REPEAT;
	public filter:string = ContextGLTextureFilter.LINEAR;
	public mipfilter:string = ContextGLMipFilter.MIPLINEAR;
}
export default SoftwareSamplerState;