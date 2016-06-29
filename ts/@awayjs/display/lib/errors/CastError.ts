import {ErrorBase}				from "@awayjs/core/lib/errors/ErrorBase";

export class CastError extends ErrorBase
{
	constructor(message:string)
	{
		super(message);
	}
}