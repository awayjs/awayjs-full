import {IGraphicsData}		from "../draw/IGraphicsData";


export class GraphicsFillStyle implements IGraphicsData
{
    public static data_type:string = "[graphicsdata FillStyle]";
    /**
     * The Vector of drawing commands as integers representing the path.
     */
    private _color:number;
    private _alpha:number;

    constructor(color:number = 0xffffff, alpha:number = 1)
    {
        this._color=color;
        this._alpha=alpha;
    }

    public get data_type():string
    {
        return GraphicsFillStyle.data_type;
    }
}