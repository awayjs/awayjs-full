import {ByteArray}					from "@awayjs/core/lib/utils/ByteArray";

import {AGALTokenizer}				from "../aglsl/AGALTokenizer";
import {AGLSLParser}					from "../aglsl/AGLSLParser";
import {IProgram}						from "../base/IProgram";
import {VertexBufferWebGL}			from "../base/VertexBufferWebGL";

export class ProgramWebGL implements IProgram
{
	private static _tokenizer:AGALTokenizer = new AGALTokenizer();
	private static _aglslParser:AGLSLParser = new AGLSLParser();
	private static _uniformLocationNameDictionary:Array<string> = ["fc", "fs", "vc"];
	// private static _uniformLocationNameDictionary:Array<string> = ["fcarrr", "fs", "vcarrr"];

	private _gl:WebGLRenderingContext;
	private _program:WebGLProgram;
	private _vertexShader:WebGLShader;
	private _fragmentShader:WebGLShader;
	private _uniforms:Array<Array<WebGLUniformLocation>> = [[],[],[]];
	private _attribs:Array<number> = [];

	constructor(gl:WebGLRenderingContext)
	{
		this._gl = gl;
		this._program = this._gl.createProgram();
	}

	public upload(vertexProgram:ByteArray, fragmentProgram:ByteArray):void
	{
		var vertexString:string = ProgramWebGL._aglslParser.parse(ProgramWebGL._tokenizer.decribeAGALByteArray(vertexProgram));
		var fragmentString:string = ProgramWebGL._aglslParser.parse(ProgramWebGL._tokenizer.decribeAGALByteArray(fragmentProgram));

		this._vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
		this._fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);

		this._gl.shaderSource(this._vertexShader, vertexString);
		this._gl.compileShader(this._vertexShader);

		if (!this._gl.getShaderParameter(this._vertexShader, this._gl.COMPILE_STATUS))
			throw new Error(this._gl.getShaderInfoLog(this._vertexShader));

		this._gl.shaderSource(this._fragmentShader, fragmentString);
		this._gl.compileShader(this._fragmentShader);

		if (!this._gl.getShaderParameter(this._fragmentShader, this._gl.COMPILE_STATUS))
			throw new Error(this._gl.getShaderInfoLog(this._fragmentShader));

		this._gl.attachShader(this._program, this._vertexShader);
		this._gl.attachShader(this._program, this._fragmentShader);
		this._gl.linkProgram(this._program);

		if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS))
			throw new Error(this._gl.getProgramInfoLog(this._program));

		this._uniforms[0].length = 0;
		this._uniforms[1].length = 0;
		this._uniforms[2].length = 0;
		this._attribs.length = 0;
	}

	public getUniformLocation(programType:number, index:number = -1):WebGLUniformLocation
	{
		if (this._uniforms[programType][index + 1] != null)
			return this._uniforms[programType][index + 1];
	
		var name:string =  (index == -1)? ProgramWebGL._uniformLocationNameDictionary[programType] : ProgramWebGL._uniformLocationNameDictionary[programType] + index;
		return (this._uniforms[programType][index + 1] = this._gl.getUniformLocation(this._program, name));
	}
	
	//
	// public getUniformLocation(programType:number, index:number):WebGLUniformLocation
	// {
	// 	if (this._uniforms[programType][index] != null)
	// 		return this._uniforms[programType][index];
	//
	// 	return (this._uniforms[programType][index] = this._gl.getUniformLocation(this._program, ProgramWebGL._uniformLocationNameDictionary[programType] + index));
	// }


	public getAttribLocation(index:number):number
	{
		if (this._attribs[index] != null)
			return this._attribs[index];

		return (this._attribs[index] = this._gl.getAttribLocation(this._program, "va" + index));
	}


	public dispose():void
	{
		this._gl.deleteProgram(this._program);
	}

	public focusProgram():void
	{
		this._gl.useProgram(this._program);
	}

	public get glProgram():WebGLProgram
	{
		return this._program;
	}
}