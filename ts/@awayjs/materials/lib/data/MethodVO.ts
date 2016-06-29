import {GL_TextureBase}				from "@awayjs/renderer/lib/textures/GL_TextureBase";

import {MethodPass}					from "../surfaces/passes/MethodPass";
import {ShadingMethodBase}			from "../methods/ShadingMethodBase";

/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
export class MethodVO
{
	public useMethod:boolean = true;

	public method:ShadingMethodBase;
	public pass:MethodPass;

	// public register indices
	public textureGL:GL_TextureBase;
	public secondaryTextureGL:GL_TextureBase; // sometimes needed for composites
	public vertexConstantsIndex:number;
	public secondaryVertexConstantsIndex:number; // sometimes needed for composites
	public fragmentConstantsIndex:number;
	public secondaryFragmentConstantsIndex:number; // sometimes needed for composites

	// internal stuff for the material to know before assembling code
	public needsProjection:boolean;
	public needsView:boolean;
	public needsNormals:boolean;
	public needsTangents:boolean;
	public needsGlobalVertexPos:boolean;
	public needsGlobalFragmentPos:boolean;
	/**
	 * Creates a new MethodVO object.
	 */
	constructor(method:ShadingMethodBase, pass:MethodPass)
	{
		this.method = method;
		this.pass = pass;
	}

	/**
	 * Resets the values of the value object to their "unused" state.
	 */
	public reset():void
	{
		this.method.iReset();

		this.vertexConstantsIndex = -1;
		this.secondaryVertexConstantsIndex = -1;
		this.fragmentConstantsIndex = -1;
		this.secondaryFragmentConstantsIndex = -1;

		this.needsProjection = false;
		this.needsView = false;
		this.needsNormals = false;
		this.needsTangents = false;
		this.needsGlobalVertexPos = false;
		this.needsGlobalFragmentPos = false;
	}
}
