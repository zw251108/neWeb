'use strict';

import Sync from './sync.js';

/**
 * @class   Ajax
 * */
class Ajax extends Sync{
	/**
	 * @constructor
	 * */
	constructor(options){
		super();

		// this._conn = new Promise((resolve, reject)=>{
		// 	if( 'fetch' in window){
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
			options.url += Object.keys( data ).map((k)=>{
				return encodeURIComponent(k) +'='+ encodeURIComponent(data[k]);
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

		if( 'fetch' in window ){
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

	// /**
	//  * @desc
	//  * */
	// receive(){
	//
	// }

	/**
	 * @desc
	 * */
	on(){}
}

Sync.register('ajax', Ajax);

export default Ajax;