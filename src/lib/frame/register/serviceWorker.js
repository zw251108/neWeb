'use strict';

/**
 * @desc    注册 Service Worker
 * @param   {Object?}   options
 * @param   {String}    options.file
 * @return  {Promise}   在 resolve 时传入 true
 * */
function registerServiceWorker(options={}){
	let rs
		, config = Object.keys( registerServiceWorker._CONFIG ).reduce((all, d)=>{
		if( d in options ){
			all[d] = options[d];
		}
		else{
			all[d] = registerServiceWorker._CONFIG[d];
		}

		return all;
	}, {});

	if( 'serviceWorker' in navigator ){
		rs = navigator.serviceWorker.register(config.file, {
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
	else{
		rs = Promise.reject( new Error('该浏览器不支持 Service Worker') );
	}

	return rs;
}

registerServiceWorker._CONFIG = {
	file: 'sw.js'
};

export default registerServiceWorker;