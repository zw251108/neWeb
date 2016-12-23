'use strict';

import Req from './req';

/**
 * @class   ServiceWorker
 * */
class ServiceWorker extends Req{
	/**
	 * @constructor
	 * @param   {Object?}   options
	 * @param   {String}    options.file
	 * */
	constructor(options){
		super();

		this._config = Object.keys( ServiceWorker._CONFIG ).reduce((all, d)=>{
			if( d in options ){
				all[d] = options[d];
			}
			else{
				all[d] = ServiceWorker._CONFIG[d];
			}

			return all;
		}, {});

		if( 'serviceWorker' in navigator ){
			navigator.serviceWorker.register(this._config.file, {
				scope: './'
			}).then((regist)=>{
				let serviceWorker
					;

				if( regist.installing ){
					serviceWorker = regist.installing;
				}
				else if( regist.waiting ){
					serviceWorker = regist.waiting;
				}
				else if( regist.active ){
					serviceWorker = regist.active;
				}

				if( serviceWorker ){
					serviceWorker.addEventListener('statechange', function(e){
						console.log(e);
					});
				}
			}).catch(function(e){
				console.log( e );
			});
		}
	}
}

ServiceWorker._CONFIG = {
	file: 'sw.js'
};

Req.register('serviceWorker', ServiceWorker);
// Req.register('sw', ServiceWorker); // 注册别名

export default ServiceWorker;