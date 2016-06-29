import {Matrix3D}					from "@awayjs/core/lib/geom/Matrix3D";
import {AbstractMethodError}		from "@awayjs/core/lib/errors/AbstractMethodError";

import {DisplayObjectContainer}	from "../display/DisplayObjectContainer";
import {Camera}					from "../display/Camera";
import {IEntity}					from "../display/IEntity";
import {LightEvent}				from "../events/LightEvent";
import {ShadowMapperBase}			from "../materials/shadowmappers/ShadowMapperBase";

export class LightBase extends DisplayObjectContainer
{
	private _color:number = 0xffffff;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	private _ambientColor:number = 0xffffff;
	private _ambient:number = 0;
	public _iAmbientR:number = 0;
	public _iAmbientG:number = 0;
	public _iAmbientB:number = 0;

	private _specular:number = 1;
	public _iSpecularR:number = 1;
	public _iSpecularG:number = 1;
	public _iSpecularB:number = 1;

	private _diffuse:number = 1;
	public _iDiffuseR:number = 1;
	public _iDiffuseG:number = 1;
	public _iDiffuseB:number = 1;

	private _shadowsEnabled:boolean = false;

	private _shadowMapper:ShadowMapperBase;

	constructor()
	{
		super();
	}

	public get shadowsEnabled():boolean
	{
		return this._shadowsEnabled;
	}

	public set shadowsEnabled(value:boolean)
	{
		if (this._shadowsEnabled == value)
			return;

		this._shadowsEnabled = value;

		if (value) {
			if (this._shadowMapper == null)
				this._shadowMapper = this.pCreateShadowMapper();

			this._shadowMapper.light = this;
		} else {
			this._shadowMapper.dispose();
			this._shadowMapper = null;
		}
		//*/
		this.dispatchEvent(new LightEvent(LightEvent.CASTS_SHADOW_CHANGE));
	}

	public pCreateShadowMapper():ShadowMapperBase
	{
		throw new AbstractMethodError();
	}

	public get specular():number
	{
		return this._specular;
	}

	public set specular(value:number)
	{
		if (value < 0)
			value = 0;

		this._specular = value;
		this.updateSpecular();
	}

	public get diffuse():number
	{
		return this._diffuse;
	}

	public set diffuse(value:number)
	{
		if (value < 0)
			value = 0;

		this._diffuse = value;
		this.updateDiffuse();
	}

	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		this._color = value;
		this._colorR = ((this._color >> 16) & 0xff)/0xff;
		this._colorG = ((this._color >> 8) & 0xff)/0xff;
		this._colorB = (this._color & 0xff)/0xff;

		this.updateDiffuse();
		this.updateSpecular();
	}

	public get ambient():number
	{
		return this._ambient;
	}

	public set ambient(value:number)
	{
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		this._ambient = value;
		this.updateAmbient();
	}

	public get ambientColor():number
	{
		return this._ambientColor;
	}

	public set ambientColor(value:number)
	{
		this._ambientColor = value;
		this.updateAmbient();
	}

	private updateAmbient():void
	{
		this._iAmbientR = ((this._ambientColor >> 16) & 0xff)/0xff*this._ambient;
		this._iAmbientG = ((this._ambientColor >> 8) & 0xff)/0xff*this._ambient;
		this._iAmbientB = (this._ambientColor & 0xff)/0xff*this._ambient;
	}

	public iGetObjectProjectionMatrix(entity:IEntity, cameraTransform:Matrix3D, target:Matrix3D = null):Matrix3D
	{
		throw new AbstractMethodError();
	}

	private updateSpecular():void
	{
		this._iSpecularR = this._colorR*this._specular;
		this._iSpecularG = this._colorG*this._specular;
		this._iSpecularB = this._colorB*this._specular;
	}

	private updateDiffuse():void
	{
		this._iDiffuseR = this._colorR*this._diffuse;
		this._iDiffuseG = this._colorG*this._diffuse;
		this._iDiffuseB = this._colorB*this._diffuse;
	}

	public get shadowMapper():ShadowMapperBase
	{
		return this._shadowMapper;
	}

	public set shadowMapper(value:ShadowMapperBase)
	{
		this._shadowMapper = value;
		this._shadowMapper.light = this;
	}
}