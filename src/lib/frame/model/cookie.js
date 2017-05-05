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

	// ---------- 静态方法 ----------
	/**
	 * @summary 转换时间数据格式
	 * @static
	 * @param   {Date|Number|String}    date 为 Number 类型时默认单位为天
	 * @return  {String}                返回一个 UTC 格式的时间字符串
	 * */
	static _transDate(date){
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
			date.setTime( date.getTime() + Number( temp[1] ) * CookieModel._SHORT_TIME_NUM[temp[2]] );
		}
		else{
			date = '';
		}

		return date && date.toUTCString();
	}

	// ---------- 私有方法 ----------
	/**
	 * @summary 设置 cookie
	 * @protected
	 * @param   {String}                topic
	 * @param   {*}                     value
	 * @param   {Object|Number|String}  [options]           相关配置
	 * @param   {String}                [options.path]
	 * @param   {String}                [options.domain]
	 * @param   {Date|Number|String}    [options.expires]
	 * @param   {String}                [options.secure]
	 * @return  {Promise}               返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    因为设置 cookie 和删除 cookie 使用是相同的代码，只是传入的过期时间不同，所以提出一个共通方法
	 * */
	_setCookie(topic, value, options){
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

			return Promise.resolve( true );
		});
	}
	/**
	 * @summary 当 setData 传入一个 json 时内部调用函数
	 * @override
	 * @protected
	 * @param   {Object}    topic
	 * @param   {Object}    [options]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    因为设置 cookie 时有相关配置，故重写覆盖父类的 _setByObject 方法
	 * */
	_setByObject(topic, options){
		return Promise.all( Object.keys(topic).map((d)=>{
			return this.setData(d, topic[d], options);
		}) ).then((data)=>{
			return !!data;
		});
	}

	// ---------- 公有方法 ----------
	/**
	 * @summary 设置数据
	 * @override
	 * @param   {String|Object}             topic
	 * @param   {*}                         value               当 topic 为 object 类型时被忽略
	 * @param   {Object|Number|String}      [options]           相关配置
	 * @param   {String}                    [options.path]
	 * @param   {String}                    [options.domain]
	 * @param   {Date|Number|String}        [options.expires]
	 * @param   {String}                    [options.secure]
	 * @return  {Promise}                   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    保存值得时候，同时会保持在内存中，当 topic 类型为 object 时，value 会视为 options
	 * */
	setData(topic, value, options){
		let result
			;

		if( typeof topic === 'object' ){
			options = value;

			result = this._setByObject(topic, options);
		}
		else{
			result = super.setData(topic, value).then(()=>{
				return this._setCookie(topic, value, options);
			});
		}

		return result;
	}
	/**
	 * @summary 获取数据
	 * @param   {String|String[]}   topic
	 * @return  {Promise}           返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
	 * @desc    获取数据时会优先从内存中取值，若没有则从 cookie 中取值并将其存入内存中，当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
	 * */
	getData(topic){
		let result
			;

		if( Array.isArray(topic) ){
			result = this._getByArray( topic );
		}
		else{
			result = super.getData( topic ).catch(()=>{  // 内存中不存在该值
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

						// 在内存中保留该值
						super.setData(topic, value);
					}
					else{
						value = Promise.reject( null );
					}

					return value;
				});
			});
		}

		return result
	}
	/**
	 * @summary 将数据从缓存中删除
	 * @param   {String|String[]}   topic
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    调用 _setCookie 方法，过期时间为负值
	 * */
	removeData(topic){
		let result
			;
		if( Array.isArray(topic) ){
			result = this._removeByArray( topic );
		}
		else{
			result = super.removeData( topic ).then(()=>{
				return this._setCookie(topic, '', -1);
			});
		}
		return result;
	}
	/**
	 * @summary 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    只调用了父类的 clearData 方法，清楚了内存中的数据，对 cookie 实际没做任何处理
	 * */
	clearData(){
		return super.clearData();
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
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('cookie', CookieModel);
/**
 * 注册别名
 * */
Model.registerAlias('cookie', 'c');

export default CookieModel;