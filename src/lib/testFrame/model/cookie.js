'use strict';

import Model from './model.js';

/**
 * @class
 * @classdesc   对 cookie 的使用进行封装，统一调用接口，在 Model.factory 工厂方法注册为 cookie，别名 c，将可以使用工厂方法生成
 * @extends     Model
 * @example
let cookieModel = new CookieModel()
	, cookie = Model.factory('cookie')
    , c = Model.factory('c')
	;

console.log( cookie === c );    // 因为将对象实例进行了缓存，所以结果为 true

cookie.set('memberId', 1, '30d');   // 将 memberId 放入 cookie 中，过期时间 30 天
 * */
class CookieModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( navigator.cookieEnabled ){
			this._store = Promise.resolve( true );
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 Cookie') );
		}
	}

	/**
	 * 设置数据
	 * @param   {String}                topic
	 * @param   {*}                     value
	 * @param   {Object|Number|String}  [options]   相关配置
	 * @return  {Promise}               返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(topic, value, options){
		return this._store.then(()=>{
			
			if( typeof options !== 'object' ){
				options = {
					expires: options
				};
			}

			if( options.expires ){
				options.expires = CookieModel._transDate( options.expires );
			}

			document.cookie = encodeURIComponent( topic ) +'='+
				encodeURIComponent( this._stringify(value) ) +
				Object.keys( CookieModel._DEFAULT ).reduce((a, d)=>{    // 整理配置
					if( d in options ){
						a += '; '+ d +'='+ options[d];
					}

					return a;
				}, '');

			this._trigger(topic, value);

			return true
		});
	}
	/**
	 * 获取数据
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
	 * */
	getData(topic){
		return this._store.then(()=>{
			let cookies = document.cookie
				, i = 0, l
				, value = ''
				, t
				;

			if( cookies ){
				cookies = cookies.split('; ');
			}
			else{
				cookies = [];
			}

			for(l = cookies.length; i < l; i++ ){
				t = cookies[i].split('=');

				if( topic === decodeURIComponent( t[0] ) ){
					value = decodeURIComponent( t[1] );
					break;
				}
			}

			if( value ){
				try{
					value = JSON.parse( value );
				}
				catch(e){}
			}
			else{
				value = Promise.reject( null );
			}

			return value;
		});
	}
	/**
	 * 将数据从缓存中删除，实际为调用 setData 方法，过期时间为负值
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(topic){
		return this._store.then(()=>{
			this._trigger(topic, null);

			return this.setData(topic, '', '-1d');
		});
	}
	/**
	 * 清空数据，实际不做任何处理
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		return Promise.resolve( true );
	}
}

/**
 * 默认参数
 * @const
 * @static
 * */
CookieModel._DEFAULT = {
	path: '/'
	, domain: ''
	, expires: ''
	, secure: ''
};

/**
 * 简短时间设置格式
 * @const
 * @static
 * */
CookieModel._SHORT_TIME_EXPR = /^(-?\d+)(s|m|h|d|y)?$/i;
/**
 * 时间单位对应的毫秒数
 * @const
 * @static
 * */
CookieModel._SHORT_TIME_NUM = {
	s: 1e3
	, m: 6e4
	, h: 36e5
	, d: 864e5
	, y: 31536e6
};

/**
 * 转换时间数据格式
 * @static
 * @param   {Date|Number|String}    date
 * @return  {String}    返回一个 UTC 格式的时间字符串
 * */
CookieModel._transDate = function(date){
	let temp = ''
		;

	if( date instanceof Date){}
	else if( typeof date === 'number' ){
		temp = new Date();
		temp.setTime( +temp + CookieModel._SHORT_TIME_NUM.d * date );
		date = temp;
	}
	else if( temp = CookieModel._SHORT_TIME_EXPR.exec( date ) ){
		date = new Date();
		date.setTime( +date + Number( temp[1] ) * CookieModel._SHORT_TIME_NUM[temp[2]] );
	}
	else{
		date = '';
	}

	return date && date.toUTCString();
};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('cookie', CookieModel);

/**
 * 注册别名
 * */
Model.registerAlias('cookie', 'c');

export default CookieModel;