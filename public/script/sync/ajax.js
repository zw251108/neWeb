'use strict';

import Sync from './sync.js';

class Ajax extends Sync{
	/**
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {String}    options.methods
	 * */
	send(options){
		let result
			;

		if( 'fetch' in window ){
			result = fetch( options.url ).then(function(res){
				return res.text();
			}).then(function(text){
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
				xhr.send();
				xhr.onload = function(){
					if( this.status == 200 ){
						resolve( this.response );
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