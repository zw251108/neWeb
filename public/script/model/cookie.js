'use strict';

import $ from 'jquery';
import Model from './model.js';

const pluses = /\+/g;

function encode(s) {
	return config.raw ? s : encodeURIComponent(s);
}

function decode(s) {
	return config.raw ? s : decodeURIComponent(s);
}

function stringifyCookieValue(value) {
	return encode(config.json ? JSON.stringify(value) : String(value));
}

function parseCookieValue(s) {
	if (s.indexOf('"') === 0) {
		// This is a quoted cookie as according to RFC2068, unescape...
		s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	}

	try {
		// Replace server-side written pluses with spaces.
		// If we can't decode the cookie, ignore it, it's unusable.
		// If we can't parse the cookie, ignore it, it's unusable.
		s = decodeURIComponent(s.replace(pluses, ' '));
		return config.json ? JSON.parse(s) : s;
	} catch(e) {}
}

function read(s, converter) {
	let value = config.raw ? s : parseCookieValue(s);
	return $.isFunction(converter) ? converter(value) : value;
}

let config = $.cookie = function (key, value, options) {

	// Write

	if (value !== undefined && !$.isFunction(value)){
		options = $.extend({}, config.defaults, options);

		if (typeof options.expires === 'number') {
			let days = options.expires, t = options.expires = new Date();
			t.setTime(+t + days * 864e+5);
		}

		return (document.cookie = [
			encode(key), '=', stringifyCookieValue(value),
			options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path    ? '; path=' + options.path : '',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		].join(''));
	}

	// Read

	let result = key ? undefined : {};

	// To prevent the for loop in the first place assign an empty array
	// in case there are no cookies at all. Also prevents odd result when
	// calling $.cookie().
	let cookies = document.cookie ? document.cookie.split('; ') : [];

	for (let i = 0, l = cookies.length; i < l; i++) {

		let parts = cookies[i].split('=');
		let name = decode(parts.shift());
		let cookie = parts.join('=');

		if (key && key === name) {
			// If second argument (value) is a function it's a converter...
			result = read(cookie, value);
			//break;
		}

		// Prevent storing a cookie that we couldn't decode.
		if (!key && (cookie = read(cookie)) !== undefined) {
			result[name] = cookie;
		}
	}
	return result;
};

config.defaults = {};

$.removeCookie = function (key, options) {
	if ($.cookie(key) === undefined) {
		return false;
	}

	// Must not alter options, thus extending a fresh object...
	$.cookie(key, '', $.extend({}, options, { expires: -1 }));
	return !$.cookie(key);
};
/*---------- copy jquery.cookie end----------------*/

/**
 * @class   CookieModel
 * */
class CookieModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();
	}

	/**
	 * @desc    设置数据
	 * @override
	 * @variation
	 * @param   {String}    key
	 * @param   {*}         value
	 * @param   {Object|Number|String}  options 相关配置
	 * @return  {Promise}
	 * */
	setData(key, value, options={}){

		if (value !== undefined && !$.isFunction(value)){
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				let days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		Object.keys( CookieModel._defaults ).reduce((a,d)=>{

			if( !(d in options) ){
				a[d] = CookieModel._defaults[d];
			}

			return a;
		}, options);

		$.cookie(key, value, opts);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		return $.cookie( key );
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @override
	 * @param   {String}    key
	 * @param   {Object?}   options
	 * @return  {Promise}
	 * */
	removeData(key, options){

	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){

	}

	/**
	 * @desc
	 * */
	setExpires(){

	}
	/**
	 * @desc    设置 path
	 * */
	setPath(){

	}
	/**
	 * @desc    设置 domain
	 * */
	setDomain(domain){

	}
}

// 默认参数
CookieModel._defaults = {
	path: '/'
	, domain: ''
	, expires: ''
	, secure: ''
};
// 配置
CookieModel._config = {
	raw: true   // 是否编码
	, json: true
};
CookieModel.setRaw = function(){
	CookieModel._config.raw = false;
};

Model.register('cookie', CookieModel);

export default CookieModel;