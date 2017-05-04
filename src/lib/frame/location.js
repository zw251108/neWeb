'use strict';

/**
 * @file    对地理定位接口进行封装
 * */

/**
 * @summary     获取定位信息
 * @function    location
 * @param       {Object}    [options]
 * @return      {Promise}
 * */
let location = function(options={}){
	let result
		;

	if( 'geolocation' in navigator ){
		result = new Promise(function(resolve, reject){
			let opts = Object.keys( location._CONFIG ).reduce((all, d)=>{

				if( d in options ){
					all[d] = options[d];
				}
				else{
					all[d] = location._CONFIG[d];
				}

				return all;
			}, {});

			navigator.geolocation.getCurrentPosition(resolve, reject, opts);
		});
	}
	else{
		result = Promise.reject( new Error('您的浏览器不支持地理定位功能') );
	}

	return result;
};

location._CONFIG = {
	// 指示浏览器获取高精度的位置，默认为false
	enableHighAccuracy: true
	// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
	, timeout: 2000
	// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置
	, maximumAge: 5000
};

/**
 * @exports location
 * */
export default location;