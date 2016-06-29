export class Sampler
{
	public shift:number;
	public mask:number;
	public value:number;

	constructor(shift:number, mask:number, value:number)
	{
		this.shift = shift;
		this.mask = mask;
		this.value = value;
	}
}