'use strict';

import CONFIG       from '../config.js';
import domain       from 'domainConfig';
import merge        from '../util/merge.js';
import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';

/**
 * @class
 * @classdesc   埋点记录业务模块
 * @extends     ServiceModel
 * */
class LogServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * @param   {String}    [config.uuid]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['log'];

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');

		// this._config.ceKey = CONFIG.ceKey;

		this.disabled = false;  // 是否禁用

		this._scpExtraPromise = null;   // 获取 SCP 额外参数的 Promise

		this._pageExtraPromise = null;  // 获取 page 额外参数的 Promise

		this._searchExtraPromise = null;    // 获取 search 额外参数的 Promise
	}

	// ---------- 私有方法 ----------
	/**
	 * @summary 将对象转为 get 请求格式的参数
	 * @private
	 * @param   {Object}    params
	 * @return  {String}
	 * */
	_toQueryString(params){
		return Object.keys( params ).map((d)=>{
			return d +'='+ encodeURIComponent( params[d] || '' );
		}).join('&');
	}
	
	// ---------- 公有方法 ----------
	/**
	 * @summary 设置 scp 跟踪全局参数
	 * @param   {Promise}   scpEP
	 * */
	setSCPExtra(scpEP){
		this._scpExtraPromise = scpEP;
	}
	/**
	 * @summary 设置 page 跟踪全局参数
	 * @param   {Promise}   pageEP
	 * */
	setPageExtra(pageEP){
		this._pageExtraPromise = pageEP;
	}
	/**
	 * @summary 设置 search 跟踪全局数据
	 * @param   {Promise}   searchEP
	 * */
	setSearchExtra(searchEP){
		this._searchExtraPromise = searchEP;
	}
	/**
	 * @summary 设置是否禁用
	 * @param   {Boolean}   disabled
	 * */
	setDisabled(disabled){
		this.disabled = disabled;
	}
	/**
	 * @summary 发送请求
	 * @param   {String}    url
	 * @param   {Object}    params
	 * */
	sendTrack(url, params){
		if( this.disabled ){
			return;
		}

		let image = document.createElement('img', CONFIG.ceKey)
		// let image = document.createElement('img')
			, timestamp = +new Date()
			, name = 'img_'+ timestamp
			;

		window[name] = image;

		image.onload = image.onerror = ()=>{
			// 内存释放
			window[name] = image = image.onload = image.onerror = null;

			delete window[name];
		};

		image.src = this._config.baseUrl + url +'?'+ this._toQueryString( params );

		console.log('发送 track', params);
	}
	/**
	 * @summary 发送 scp，发送 scp.gif
	 * @param   {String}    scp
	 * @param   {String}    [bk]
	 * @param   {String}    [traceId]
	 * */
	trackSCP(scp, bk, traceId){
		if( this.disabled ){
			return;
		}

		if( !scp ){
			return;
		}

		let execute
			;

		if( this._scpExtraPromise ){
			execute = this._scpExtraPromise;
		}
		else{
			execute = Promise.resolve({});
		}

		execute.then((extParams)=>{
			let params = merge({
					scp
					, bk
					, traceId
					, t: Date.now()
				}, extParams)
				;

			this.sendTrack('/scp.gif', params);
		});
	}
	/**
	 * @summary 发送 tgs.gif
	 * @param   {Object}    [options={}]
	 * */
	trackPage(options={}){
		if( this.disabled ){
			return;
		}

		let execute
			;

		options.type = 1;

		if( this._pageExtraPromise ){
			execute = this._pageExtraPromise;
		}
		else{
			execute = Promise.resolve({});
		}

		execute.then((extParams)=>{
			let params = merge(options, extParams)
				;

			this.sendTrack('/tgs.gif', params);
		});
	}
	/**
	 * @summary 发送 sr.gif
	 * @param   {String}    key         搜索关键字
	 * @param   {Object}    [data={}]
	 * @param   {String}    [data.results]
	 * @param   {String}    [data.whereabouts]
	 * @param   {String}    [data.source]
	 * */
	trackSearch(key, data={}){
		if( this.disabled ){
			return;
		}

		if( !key ){
			return;
		}

		let execute
			;

		if( this._searchExtraPromise ){
			execute = this._searchExtraPromise
		}
		else{
			execute = Promise.resolve({});
		}

		execute.then((extParams)=>{
			let params
				;

			params = merge(data, extParams);
			params = merge({
				url: key
			}, params);

			this.sendTrack('/sr.gif', params);
		});
	}
	/**
	 * @summary 发生 ep.gif
	 * */
	trackEp(){
		let params = {}
			;

		this.sendTrack('ep.gif', params);
	}
}

Model.register('log', LogServiceModel);

export default LogServiceModel;