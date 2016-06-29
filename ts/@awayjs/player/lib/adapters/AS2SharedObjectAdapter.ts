export class AS2SharedObjectAdapter
{
	public data : Object;
	private _object_name : string;

	constructor(name:string)
	{
		this._object_name=name;
		if(typeof(Storage) !== "undefined") {
			this.data = JSON.parse(localStorage.getItem(name));
		}
		if(this.data==null){
			console.log("no shared object found");
			this.data = {};
		}
	}

	// should become a static
	public static getLocal(name:string, localPath?:string, secure?:boolean) : AS2SharedObjectAdapter
	{
		return new AS2SharedObjectAdapter(name);
	}

	// needs to stay as it is
	public flush() : void
	{
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem(this._object_name, JSON.stringify(this.data));
		}
		else{
			console.log("no local storage available");

		}
		// save all local data to wherever it needs to go
	}
}