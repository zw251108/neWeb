'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';

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

		// 各个 model 中 uuid 的 key 值
		this.uuidKey = 'tgs_uuid';

		this.uuid = config.uuid;

		this.disabled = false;  // 是否禁用

		this.cookie = Model.factory('cookie');
		this.localStorage = Model.factory('localStorage');
		this.sessionStoreage = Model.factory('sessionStorage');

		/**
		 * @private [Promise]   _uuid
		 * 获取 uuid，优先级 localStorage > sessionStorage > cookie > 缓存在页面，返回一个 Promise 对象，在 resolve 时传回 uuid
		 * */
		this._uuid = Promise.all([
			this.localStorage.getData( this.uuidKey ).catch(()=>{})
			, this.sessionStoreage.getData( this.uuidKey ).catch(()=>{})
			, this.cookie.getData( this.uuidKey ).catch(()=>{})
		]).then(([localUUID, sessionUUID, cookieUUID])=>{
			let uuid = localUUID || sessionUUID || cookieUUID || this.uuid
				;

			if( uuid !== localUUID ){
				this.localStorage.setData(this.uuidKey, uuid);
			}
			if( uuid !== sessionUUID ){
				this.sessionStoreage.setData(this.uuidKey, uuid);
			}
			if( uuid !== cookieUUID ){
				this.cookie.setData(this.uuidKey, uuid);
			}
			if( uuid !== this.uuid ){
				this.uuid = uuid;
			}

			return uuid;
		});

		/**
		 * @private [Promise]   _global
		 * 从 cookie 中获取 global 参数，失败则传 webapp
		 * */
		this._global = this.cookie.getData('global').catch(()=>{
			return 'webapp';
		});

		/**
		 * @private [Promise]   _memberId
		 * 从 cookie 中获取 memberId
		 * */
		this._memberId = this.cookie.getData('memberId').catch(()=>{});
	}

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

	_makeParam(){
		return Promise.all([
			this._global
			, this._memberId
		]);
	}

	/**
	 * @summary 整合参数
	 * @param   {Object}    params
	 * @return  {Promise}
	 * */
	_setData(params){

		return Promise.all([
			this._global
			, this._memberId
		]).then(([global, memberId])=>{
			return {
				gl: global
				, mi: memberId
			}
		});

		let rs = {

			}
			;
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

		let image = document.createElement('img')
			, timestamp = +new Date()
			, name = 'img_'+ timestamp
			;

		window[name] = image;

		image.onload = image.onerror = function(){
			// 内存释放
			window[name] = image = image.onload = image.onerror = null;

			delete window[name];
		};

		image.src = this._config.baseUrl + url + this._toQueryString( params );
	}
	/**
	 * @summary 发送 scp，发送 scp.gif
	 * @param   {String}    scp
	 * @param   {String}    [bk]
	 * */
	trackSCP(scp, bk){
		if( !scp ){
			return;
		}

		Promise.all([
			this._global
			, this._memberId
			, this._uuid
		]).then(function([global, memberId, uuid]){
			let params = {
					scp
					, bk
					, uu: uuid
					, gl: global
					, mi: memberId
					, t: (+new Date())
				}
				;

			this.sendTrack('/scp.gif', params);
		});
	}
	/**
	 * @summary 发送 tgs.gif
	 * @param   {Object}    [opts={}]
	 * */
	trackPage(opts={}){
		opts.type = 1;

		this.sendTrack('/tgs.gif', opts);
	}
	/**
	 * @summary 发送 sr.gif
	 * @param   {String}    key         搜索关键字
	 * @param   {Object}    [data={}]
	 * */
	trackSearch(key, data={}){
		if( !key ){
			return;
		}

		// data.results;
		// data.whereabouts;
		// data.source;

		this.sendTrack('/sr.gif', {
			url: key
		});
	}
}

Model.register('log', LogServiceModel);

export default LogServiceModel;