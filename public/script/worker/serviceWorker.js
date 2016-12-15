'use strict';

/**
 * @file    Service Worker 文件
 * */

const CACHE_NAME = 'cache'
	, CACHE_URL = []
	;

self.addEventListener('install', function(event){
	console.log('Service Worker 安装完成，install event', event);

	event.waitUntil(caches.open( CACHE_NAME ).then((cache)=>{
		console.log('cache open');

		return cache.addAll( CACHE_URL ).catch(function(e){
			console.log( e );
			console.log('cache 安装失败');
		}).then( self.skipWaiting() );
	}));
});

self.addEventListener('activate', function(event){
	console.log('Active event,', event);
});

self.addEventListener('fetch', function(event){
	event.respondWith(caches.match( event.request ).then((response)=>{
		return response || fetch( event.request.clone() );  // 克隆该请求，Request 对象是 stream 类型的，只能读取一次
	}).then((response)=>{

		caches.open( CACHE_NAME ).then((cache)=>{   // 将 response 缓存起来
			cache.put(event.request, response.clone());
		});

		return response;
	}));
});

// if( 'serviceWorker' in navigator ){
//
// }

fetch('/data/province?callback=a').then(function(t) {
	var clone = t.clone();

	return caches.open('storage').then(function(cache){
		console.log( cache.put('/data/province?callback=a', clone) )
	}).then(function(){console.log(arguments);
		console.log(t instanceof Request);
		return t.text().catch(function() {
			return t.text();
		})
	})
}).then(function(s) {
	console.log(s)
})


var req = new Request('/data/province?callback=a1');
caches.match( req ).then(function(response){ console.log(response);
	return response || fetch( req );
}).then(function(res){
	console.log(res instanceof Response);
	return res.text().catch(function() {
		return res.text();
	})
}).then(function(s) {
	console.log(s)
})
