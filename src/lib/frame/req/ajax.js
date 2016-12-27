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

		});
		// this._conn = new Promise((resolve, reject)=>{
		// 	if( 'fetch' in self){
		//
		// 	}
		// 	else{
		//
		// 	}
		// });
	}
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
	_toPostBody(options){
		let data = options.data
			, formData
			;

		if( data ){
			formData = new FormData();

			options.body = Object.keys( data ).reduce((all, k)=>{
				all.append(k, data[k]);

				return all;
			}, formData);
		}

		return options;
	}

	/**
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {String}    options.methods
	 * @param   {Object}    options.data
	 * */
	send(options){
		let result
			, type = options.methods || options.type || ''
			;

		switch( type ){
			case 'post':
				options = this._toPostBody( options );
				break;
			case 'get':
			default:
				options = this._toGetQuery( options );
				break;
		}

		if( 'fetch' in self ){
			result = fetch( options.url ).then((res)=>{
				return res.text();
			}).then((text)=>{
				try{
					text = JSON.parse( text );
				}
				catch(e){}

				return text;
			});
		}
		else{
			result = new Promise(function(resolve, reject){
				let xhr = new XMLHttpRequest()
					;

				xhr.open(options.methods, options.url);
				xhr.send( options.body || '' ); // post 时传 body，get 时传空字符串
				xhr.onload = function(){
					if( this.status == 200 && this.readyState === 4 ){
						let value = this.responseText
							;

						try{
							value = JSON.parse( value );
						}
						catch(e){}

						resolve( value );
					}
					else{
						reject(new Error( this.statusText ));
					}
				};
				xhr.onerror = function(){
					reject(new Error( this.statusText ));
				};
			});
		}

		return result
	}
}

AjaxReq._CONFIG = {
	cache: false    // 是否缓存请求
	, cors: true    // 是否跨域
	, jsonp: false  // 是否以 jsonp 的方式发生请求
};

Req.register('ajax', AjaxReq);

export default AjaxReq;