'use strict';

/**
 * @file    数据上报操作
 * */

/**
 * @function    report
 * @param   {String}    url
 * @param   {Object}    data
 * */
function report(url, data){
	if( url && data ){
		let image = document.createElement('img')
			, items
			, name = 'img_'+ (+new Date())
			;

		items = Object.keys( data ).reduce((all, d)=>{
			all.push( d +'='+ encodeURIComponent(data[d]) );

			return all;
		}, []);

		window[name] = image;

		image.onload = image.onerror = function(){
			// 内存释放
			window[name] = image = image.onload = image.onerror = null;

			delete window[name];
		};
		image.src = url + (url.indexOf('?') < 0 ? '?' : '&') + items.join('&');
	}
}

export default report;