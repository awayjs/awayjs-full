import {ByteArray}						from "@awayjs/core/lib/utils/ByteArray";

import {AWD3Utils}						from "../AWD3ParserUtils/AWD3Utils";


export class AWDBlock
{
	public id:number;
	public name:string;
	public type:number;
	public data:any;
	public dependencies_data:Array<ByteArray>;
	public dependencies_urls:Array<string>;
	public loaded_dependencies:Array<any>;
	public loaded_dependencies_cnt:number;
	public len:number;
	public geoID:number;
	public state:number;
	public extras:Object;
	public bytes:ByteArray;
	public errorMessages:Array<string>;
	public uvsForVertexAnimation:Array<Float32Array>;

	constructor(this_id:number, this_type:number)
	{
		this.type=this_type;
		this.id=this_id;
		this.state = AWD3Utils.BLOCKSTATE_FINALIZE;
		this.dependencies_data=Array<any>();
		this.dependencies_urls=Array<string>();
		if(this_type==83){
			this.loaded_dependencies=Array<any>(6);
		}
		this.loaded_dependencies_cnt=0;
	}

	public dispose():void
	{

		this.id = null;
		this.bytes = null;
		this.errorMessages = null;
		this.uvsForVertexAnimation = null;

	}

	public addError(errorMsg:string):void
	{
		if (!this.errorMessages)
			this.errorMessages = new Array<string>();

		this.errorMessages.push(errorMsg);
	}
}