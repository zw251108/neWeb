'use strict';

import Sync from './sync.js';

/**
 * @class   ServiceWorker
 * */
class ServiceWorker extends Sync{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( 'serviceWorker' in navigator ){
			navigator.serviceWorker.register('service-worker.js', {
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

Sync.register('serviceWorker', ServiceWorker);
// Sync.register('sw', ServiceWorker); // 注册别名

export default ServiceWorker;