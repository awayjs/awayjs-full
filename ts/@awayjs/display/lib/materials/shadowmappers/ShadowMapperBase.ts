import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {AssetBase}					from "@awayjs/core/lib/library/AssetBase";

import {Scene}						from "../../display/Scene";
import {LightBase}					from "../../display/LightBase";
import {IRenderer}					from "../../IRenderer";
import {Camera}						from "../../display/Camera";
import {TextureBase}					from "../../textures/TextureBase";

export class ShadowMapperBase extends AssetBase
{
	public _depthMap:TextureBase;
	public _pDepthMapSize:number = 2048;
	public _pLight:LightBase;
	public _explicitDepthMap:boolean;
	private _autoUpdateShadows:boolean = true;
	public _iShadowsInvalid:boolean;

	public get autoUpdateShadows():boolean
	{
		return this._autoUpdateShadows;
	}

	public set autoUpdateShadows(value:boolean)
	{
		this._autoUpdateShadows = value;
	}

	public updateShadows():void
	{
		this._iShadowsInvalid = true;
	}

	public iSetDepthMap(depthMap:TextureBase):void
	{
		if (this._depthMap && !this._explicitDepthMap)
			this._depthMap.dispose();

		this._depthMap = depthMap;
	}

	public get light():LightBase
	{
		return this._pLight;
	}

	public set light(value:LightBase)
	{
		this._pLight = value;
	}

	public get depthMap():TextureBase
	{
		if (!this._depthMap)
			this._depthMap = this.pCreateDepthTexture();

		return this._depthMap;
	}

	public get depthMapSize():number
	{
		return this._pDepthMapSize;
	}

	public set depthMapSize(value:number)
	{
		if (value == this._pDepthMapSize)
			return;

		this._pSetDepthMapSize(value);
	}

	public dispose():void
	{
		if (this._depthMap && !this._explicitDepthMap)
			this._depthMap.dispose();

		this._depthMap = null;
	}

	public pCreateDepthTexture():TextureBase
	{
		throw new AbstractMethodError();
	}

	public iRenderDepthMap(camera:Camera, scene:Scene, renderer:IRenderer):void
	{
		this._iShadowsInvalid = false;

		this.pUpdateDepthProjection(camera);

		if (!this._depthMap)
			this._depthMap = this.pCreateDepthTexture();

		this.pDrawDepthMap(scene, this._depthMap, renderer);
	}

	public pUpdateDepthProjection(camera:Camera):void
	{
		throw new AbstractMethodError();
	}

	public pDrawDepthMap(scene:Scene, target:TextureBase, renderer:IRenderer):void
	{
		throw new AbstractMethodError();
	}

	public _pSetDepthMapSize(value):void
	{
		this._pDepthMapSize = value;

		if (this._explicitDepthMap) {
			throw Error("Cannot set depth map size for the current renderer.");
		} else if (this._depthMap) {
			this._depthMap.dispose();
			this._depthMap = null;
		}
	}
}