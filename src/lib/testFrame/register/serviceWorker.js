'use strict';

/**
 * 注册 Service Worker
 * @function    registerServiceWorker
 * @param   {Object}    [options={}]
 * @param   {String}    options.file
 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入 true
 * */
function registerServiceWorker(options={}){
	let config = Object.keys( registerServiceWorker._CONFIG ).reduce((all, d)=>{
		if( d in options ){
			all[d] = options[d];
		}
		else{
			all[d] = registerServiceWorker._CONFIG[d];
		}

		return all;
	}, {});

	return new Promise((resolve, reject)=>{
		if( 'serviceWorker' in navigator ){
			if( !(config.file in registerServiceWorker._CACHE) ){
				registerServiceWorker._CACHE[config.file] = navigator.serviceWorker.register(config.file, {
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

					return true;
				}).catch(function(e){
					console.log( e );
				});
				navigator.serviceWorker.ready.then((reg)=>{
					reg.pushManager.getSubscription().then((res)=>{
						if( !res ){
							reg.pushManager.subscribe({
								userVisibleOnly: true
							}).then((sub)=>{
								console.log('Subscribed! Endpoint', sub.endpoint);
							});
						}
						else{
							console.log('remain endpoint', res.endpoint);
						}
					});
				});
			}

			resolve( registerServiceWorker._CACHE[config.file] );
		}
		else{
			reject( new Error('该浏览器不支持 Service Worker') );
		}
	});

	// return result;
}

registerServiceWorker._CACHE = {};

registerServiceWorker._CONFIG = {
	file: 'sw.js'
};

export default registerServiceWorker;