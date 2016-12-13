'use strict';

import Model from './model.js';

/**
 * @class   CookieModel
 * */
class CookieModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( navigator.cookieEnabled ){
			this._store = Promise.resolve(true);
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 Cookie') );
		}
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @param   {Object|Number|String?} options 相关配置
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value, options){
		this._setIndex( key );

		return this._store.then(()=>{
			if( typeof options !== 'object' ){
				options = {
					expires: options
				};
			}

			if( options.expires ){
				options.expires = CookieModel._transDate( options.expires );
			}

			document.cookie = encodeURIComponent(key) +'='+ encodeURIComponent( this._stringify(value) ) + Object.keys( CookieModel._DEFAULT ).reduce((a, d)=>{    // 整理配置
					if( d in options ){
						a += '; '+ d +'='+ options[d];
					}

					return a;
				}, '');

			this._trigger(key, value);

			return true
		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 value
	 * */
	getData(key){
		this._setIndex( key );

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

				if( key === decodeURIComponent( t[0] ) ){
					value = decodeURIComponent( t[1] );
					break;
				}
			}

			try{
				value = JSON.parse( value );
			}
			catch(e){}

			return value;
		});
	}
	/**
	 * @desc    将数据从缓存中删除，实际为调用 setData 方法，过期时间为负值
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		this._removeIndex( key );

		return this._store.then(()=>{
			this._trigger(key, null);

			return this.setData(key, '', '-1d');
		});
	}
	/**
	 * @desc    清空数据，实际不做任何处理
	 * @return  {Promise}   resolve 时传回空值
	 * */
	clearData(){
		return Promise.resolve();
	}
}

// 默认参数
CookieModel._DEFAULT = {
	path: '/'
	, domain: ''
	, expires: ''
	, secure: ''
};

// 简短时间设置格式
CookieModel._SHORT_TIME_EXPR = /^(-?\d+)(s|m|h|d|y)?$/i;
CookieModel._SHORT_TIME_NUM = {
	s: 1e3
	, m: 6e4
	, h: 36e5
	, d: 864e5
	, y: 31536e6
};

// 转换时间数据格式
CookieModel._transDate = function(date){
	let temp = ''
		;

	if( date instanceof Date){}
	else if( typeof date === 'number' ){
		temp = new Date();
		temp.setTime( +temp + CookieModel._SHORT_TIME_NUM.d *864e5 );
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

Model.register('cookie', CookieModel);

export default CookieModel;