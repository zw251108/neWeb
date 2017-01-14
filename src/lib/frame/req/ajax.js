'use strict';

import Req from './req';

/**
 * @class   AjaxReq
 * */
class AjaxReq extends Req{
	/**
	 * @constructor
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( AjaxReq._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = AjaxReq._CONFIG[d];
			}

			return all;
		}, {});

		// this._config._supportFetch = 'fetch' in self;
		// this._config._supportFormData = 'FormData' in self;

		this._conn = new Promise((resolve, reject)=>{
			if( 'fetch' in self){
				resolve((url, options)=>{

				});
			}
			else{
				resolve((url, options)=>{
					return new Promise((resolve, reject)=>{
						let xhr = new XMLHttpRequest()
							;

						xhr.open(options.methods, url);
						xhr.send( options.body );
						xhr.onload = function(){
							if( this.status === 200 && this.readyState === 4 ){
								let value = this.responseText
									;

								try{
									value = JSON.parse( value );
								}
								catch(e){}
							}
						};
						xhr.onerror = function(e){
							reject( e );
						}
					});
				});
			}
		});
	}

// 私有方法
	/**
	 * GET 请求时将 data 组装成 url 上的参数
	 * @private
	 * @param   {Object}    options 发送请求的参数
	 * @return  {Object}    组装后的 options
	 * */
	_toGetQuery(options){
		let data = options.data
			;

		if( data ){
			options.url += '?'+ Object.keys( data ).map((k)=>{
				return encodeURIComponent( k ) +'='+ encodeURIComponent( data[k] );
			}).join('&').replace(/%20/g, '+');
		}

		return options;
	}
	/**
	 * POST 请求时将 data 放入 FormData 中
	 * @private
	 * @param   {Object}    options
	 * @return  {Object}    组装后的 options
	 * */
	_toPostBody(options){
		let data = options.data
			, formData
			;

		if( data ){
			if( 'FormData' in self ){

			}
			formData = new FormData();

			options.body = Object.keys( data ).reduce((all, k)=>{
				all.append(k, data[k]);

				return all;
			}, formData);
		}

		return options;
	}
	/**
	 * 发送 GET XMLHttpRequest 类型请求
	 * @param   {Object}    options
	 * @return  {Promise}   resolve 时返回结果
	 * */
	_sendGetXHR(options){
		return new Promise((resolve, reject)=>{
			let xhr = new XMLHttpRequest()
				;

			xhr.open('GET', options.url);

			xhr.timeout = this._config.timeout;

			xhr.onload = function(){
				if( this.status === 200 && this.readyState === 4 ){
					let value = this.responseText
						;

					try{
						value = JSON.parse( value );
					}
					catch(e){}

					resolve( value );
				}
			};
			xhr.onerror = function(){
				reject(new Error( this.statusText ));
			};
		});
	}
	/**
	 * 发送 POST XMLHttpRequest 类型请求
	 * @param   {Object}    options
	 * @return  {Promise}   resolve 时返回结果
	 * */
	_sendPostXHR(options){
		return new Promise((resolve, reject)=>{
			let xhr = new XMLHttpRequest()
				;

			xhr.open('POST', options.url);
		});
	}
	/**
	 * 发送 GET fetch 类型请求
	 * @param   {Object}    options
	 * @return  {Promise}   resolve 时返回结果
	 * */
	_sendGetFetch(options){

	}
	/**
	 * 发送 POST fetch 类型请求
	 * @param   {Object}    options
	 * @return  {Promise}   resolve 时返回结果
	 * */
	_sendPostFetch(options){

	}
	/**
	 * 发送 GET 类型的请求
	 * @param   {Object}    options
	 * @return  {Promise}   resolve 时传入返回结果
	 * */
	_sendGetRequest(options){
		let result
			;
		if( AjaxReq._SUPPORT.fetch ){
			result = this._sendGetFetch( options );
		}
		else{
			result = this._sendGetXHR( options );
		}

		return result;
	}
	/**
	 * 发送 POST 类型的请求
	 * @param   {Object}    options
	 * @return  {Promise}   resolve 时传入返回结果
	 * */
	_sendPostRequest(options){
		let result
			;

		if( AjaxReq._SUPPORT.fetch ){
			result = this._sendPostFetch( options );
		}
		else{
			result = this._sendPostXHR( options );
		}

		return result;
	}

// 公用方法
	/**
	 * 发送请求
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {String}    options.methods
	 * @param   {Object}    options.data
	 * @return  {Promise}
	 * */
	send(options){
		let result
			, type = (options.methods || options.type || '').toLowerCase();
			;

		switch( type ){
			case 'post':
				this._toGetQuery( options );
				result = this._sendGetRequest( options );
				break;
			// todo 支持 Restful API

			case 'get':
			default:
				this._toPostBody( options );
				result = this._sendPostRequest( options );
				break;
		}

		return result
	}
}

AjaxReq._CONFIG = {
	cache: false    // 是否缓存请求
	, cors: true    // 是否跨域
	, jsonp: false  // 是否以 jsonp 的方式发生请求
	, timeout: 10000 // 请求超时时间设置
};

AjaxReq._SUPPORT = {
	fetch: 'fetch' in self
	, formData: 'FormData' in self
};

Req.register('ajax', AjaxReq);

export default AjaxReq;