import {IGraphicsData}		from "../draw/IGraphicsData";
import {JointStyle}		    from "../draw/JointStyle";
import {CapsStyle}		    from "../draw/CapsStyle";

export class GraphicsStrokeStyle implements IGraphicsData
{
    public static data_type:string = "[graphicsdata StrokeStyle]";

    private _color:number;
    private _alpha:number;
    private _thickness:number;
    private _jointstyle:number;
    private _capstyle:number;
    private _miter_limit:number;

    constructor(color:number = 0xffffff, alpha:number = 1, thickness:number = 10, jointstyle:number = JointStyle.ROUND, capstyle:number = CapsStyle.SQUARE, miter_limit:number=10)
    {
        this._color=color;
        this._alpha=alpha;
        this._thickness=thickness;
        this._jointstyle=jointstyle;
        this._capstyle=capstyle;
        this._miter_limit=miter_limit;
    }

    public get data_type():string
    {
        return GraphicsStrokeStyle.data_type;
    }

    public get color():number
    {
        return this._color;
    }
    public set color(value:number)
    {
        this._color = value;
    }

    public get alpha():number
    {
        return this._alpha;
    }
    public set alpha(value:number)
    {
        this._alpha = value;
    }

    public get half_thickness():number
    {
        return this._thickness/2;
    }
    public get thickness():number
    {
        return this._thickness;
    }
    public set thickness(value:number)
    {
        this._thickness = value;
    }

    public get jointstyle():number
    {
        return this._jointstyle;
    }
    public set jointstyle(value:number)
    {
        this._jointstyle = value;
    }
    public get miter_limit():number
    {
        return this._miter_limit;
    }
    public set miter_limit(value:number){

        this._miter_limit = value;
    }
    public get capstyle():number
    {
        return this._capstyle;
    }
    public set capstyle(value:number)
    {
        this._capstyle = value;
    }
}