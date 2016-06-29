import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

export class ProgramVOSoftware
{
	public outputPosition:Float32Array;
	public outputColor:Float32Array = new Float32Array([0,0,0,1]);
	public outputDepth:number;
	public varying:Float32Array;
	public derivativeX:Float32Array;
	public derivativeY:Float32Array;
	public temp:Float32Array;
	public attributes:Float32Array;
	public discard:boolean = false;
}