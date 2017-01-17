'use strict';

import Req from './req';

/**
 * @class
 * @desc    源生实现 Ajax 接口    //，在支持 fetch 的浏览器中优先使用 fetch 方法，否则回退使用 XMLHttpRequest 对象
 *          参数上兼容 $.ajax 方法的参数
 *              不支持 beforeSend、success、error、complete 等回调函数参数，只能以 Promise 的方式调用
 *              不支持 async 参数，所有请求为异步请求
 *              不支持 cache 参数，所有请求不缓存
 *              不支持 xhr 参数，不考虑兼容，直接使用 XMLHttpRequest 对象
 *          支持监听事件：
 *              ajaxStart   请求发送前
 *              ajaxSend    请求已发送
 *              ajaxSuccess 请求成功返回
 *              ajaxError   请求发送失败、超时或返回错误
 *              ajaxComplete    请求无论成功失败后最后调用的事件
 *
 * @extends Req
 * */
class AjaxReq extends Req{
	/**
	 * @constructor
	 * @param   {Object}    [config]
	 * @param   {Object}    [config.accepts]
	 * @param   {String}    [config.contentType]
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( AjaxReq._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = AjaxReq._CONFIG[d];
			}

			return all;
		}, {});

		// 进行中的请求集合
		this._active = {};
	}

	/**
	 * GET 请求时将 data 组装成 url 上的参数
	 * @private
	 * @param   {Object}    options 发送请求的参数
	 * @return  {Object}    组装后的 options
	 * */
	_toGetQuery(options){
		let data = options.data
			;

		if( data ){
			options.url += '?'+ Object.keys( data ).map((k)=>{
				return encodeURIComponent( k ) +'='+ encodeURIComponent( data[k] );
			}).join('&').replace(/%20/g, '+');
		}

		return options;
	}
	/**
	 * POST 请求时将 data 放入 FormData 中
	 * @private
	 * @param   {Object}    options
	 * @return  {Object}    组装后的 options
	 * */
	_toPostBody(options){
		let data = options.data
			, formData
			;

		if( data ){
			if( 'FormData' in self ){

			}
			formData = new FormData();

			options.body = Object.keys( data ).reduce((all, k)=>{
				all.append(k, data[k]);

				return all;
			}, formData);
		}

		return options;
	}
	/**
	 * 发送 GET XMLHttpRequest 类型请求
	 * @private
	 * @param   {Object}    options
	 * @param   {Object}    [headers]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时返回结果
	 * */
	_sendGetXHR(options, headers={}){
		return new Promise((resolve, reject)=>{
			let xhr = new XMLHttpRequest()
				;

			xhr.open('GET', options.url, true, options.username, options.password);

			if( options.xhrFields ){
				Object.keys( options.xhrFields ).forEach((d)=>{   // 自定义配置，包括 withCredentials
					xhr[d] = options.xhrFields[d];
				});
			}

			if( options.mimeType && xhr.overrideMimeType ){ // 重写 mimeType
				xhr.overrideMimeType( options.mimeType );
			}

			if( !options.crossDomain && (headers && !headers['X-Request-With']) ){
				headers['X-Request-With'] = 'XMLHttpRequest';
			}

			Object.keys( headers ).forEach((d)=>{
				xhr.setRequestHeader(d, headers[d]);
			});

			xhr.timeout = options.timeout || this._config.timeout;

			xhr.onload = function(){
				if( this.status === 200 && this.readyState === 4 ){
					let value = this.responseText
						;

					try{
						value = JSON.parse( value );
					}
					catch(e){}

					resolve( value );
				}
			};
			xhr.onerror = function(e){
				reject(new Error( this.statusText ));
			};
			xhr.onabort = function(){

			}
		});
	}
	/**
	 * 发送 POST XMLHttpRequest 类型请求
	 * @private
	 * @param   {Object}    options
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时返回结果
	 * */
	_sendPostXHR(options){
		return new Promise((resolve, reject)=>{
			let xhr = new XMLHttpRequest()
				;

			xhr.open('POST', options.url);
		});
	}
	/**
	 * 发送 GET fetch 类型请求
	 * @private
	 * @param   {Object}    options
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时返回结果
	 * */
	_sendGetFetch(options){

	}
	/**
	 * 发送
	 * @private
	 * */
	_sendJSONP(options){

	}
	/**
	 * 发送 POST fetch 类型请求
	 * @private
	 * @param   {Object}    options
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时返回结果
	 * */
	_sendPostFetch(options){

	}
	/**
	 * 发送 GET 类型的请求
	 * @private
	 * @param   {Object}    options
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入返回结果
	 * */
	_sendGetRequest(options){
		let result
			;
		if( AjaxReq._SUPPORT.fetch ){
			result = this._sendGetFetch( options );
		}
		else{
			result = this._sendGetXHR( options );
		}

		return result;
	}
	/**
	 * 发送 POST 类型的请求
	 * @private
	 * @param   {Object}    options
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入返回结果
	 * */
	_sendPostRequest(options){
		let result
			;

		if( AjaxReq._SUPPORT.fetch ){
			result = this._sendPostFetch( options );
		}
		else{
			result = this._sendPostXHR( options );
		}

		return result;
	}
	/**
	 * 设置请求头信息
	 * @private
	 * */
	_setHeader(options){
		// todo 处理请求头信息
		return options;
	}

	/**
	 * 发送请求
	 * @param   {String|Object} url
	 * @param   {Object}    [options]   参数完全兼容 $.ajax 方法的参数
	 * @param   {String}    options.url
	 * @param   {String}    options.method
	 * @param   {Object}    options.data
	 * @param   {Object}    options.dataType
	 * @return  {Promise}
	 * */
	send(url, options={}){
		let result
			, type
			;

		if( typeof url === 'object' ){
			options = url;
			url = options.url || '';
		}

		type = (options.method || options.type || '').toLowerCase();

		switch( type ){
			// todo 支持 Restful API
			case 'put': // 用来更新一个已有的实体
				break;
			case 'delete':  // 删除资源
				break;
			case 'trace':   // 会返回你发送的内容
				break;
			case 'head':    // 返回响应的头部
				break;
			case 'options': // 请求一个服务所支持的请求方法
				break;
			case 'connect': // 建立一个对资源的网络连接
				break;
			case 'post':    // 请求通常用来创建一个实体
				this._toGetQuery( options );
				result = this._sendGetRequest( options );
				break;
			case 'get': // 从服务器取回数据
			default:    // 默认为 GET 请求
				this._toPostBody( options );
				result = this._sendPostRequest( options );
				break;
		}

		return result
	}
	/**
	 * 发送 GET 请求
	 * @param   {String}    url
	 * @param   {Object}    [options]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入返回结果
	 * */
	get(url, options={}){
		options.method = 'get';

		this._setHeader( options );

		return this._sendGetRequest( options );
	}
	/**
	 * 发送 POST 请求
	 * @param   {String}    url
	 * @param   {Object}    [options]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入返回结果
	 * */
	post(url, options={}){
		options.method = 'post';

		this._setHeader( options );

		return this._sendPostRequest( options );
	}
	/**
	 * 终止请求
	 * */
	abort(id){

	}
	/**
	 * 事件监听
	 * @param   {String}    eventType   事件类型：ajaxStart,ajaxSend,ajaxSuccess,ajaxError,ajaxComplete
	 * @param   {Function}  callback    事件回调
	 * */
	on(eventType, callback){

	}

	/**
	 * 设置默认配置
	 * @param   {Object}    options
	 * @return  {Object}
	 * */
	setting(options){
		this._default = options;
	}
}

/**
 * 默认配置
 * @static
 * */
AjaxReq._CONFIG = {
	cache: false    // 是否缓存请求
	// , cors: true    // 是否跨域
	// , jsonp: false  // 是否以 jsonp 的方式发生请求
	, timeout: 10000 // 请求超时时间设置
	, maxNumRequest: 5  // 最大请求连接数
};

/**
 * 默认参数
 * @static
 * */
AjaxReq._DEFAULT = {
	accepts: {  // 发送请求头信息通知服务器该请求需要接受何种类型的返回结果，需配合 converters 使用
		'*': '*/*'
		, text: 'text/plain'
		, html: 'text/html'
		, xml: 'application/xml, text/xml'
		, json: 'application/json, text/javascript'
	}
	// 仅支持异步请求
	// , async: true
	// 不支持函数参数
	// , beforeSend: function(){}
	// 不支持缓存
	// , cache: true
	// 不支持函数参数
	// , complete: function(){}
	, content: {}
	, contentType: ''
	, context: {}
	, converters: {
		'* text': String  // 任何类型转化为文本
		, 'text html': true // 将文本转化为 html
		, 'text json': JSON.parse
		, 'text xml': ''
	}
	, crossDomain: false
	, data: {}
	, dataFilter: function(){}
	// 不支持函数参数
	// , error: function(){}
	, global: true
	, headers: {}
	, ifModified: false
	, isLocal: true
	//
	, jsonp: false
	, jsonpCallback: function(){}
	, method: 'GET'
	, mimeType: ''
	, password: ''
	, proccessData: true
	, scriptCharset: ''
	, statusCode: {}
	// 不支持函数参数
	// , success: function(){}
	, timeout: 5000
	, traditional: true
	, type: 'GET'
	, url: ''
	, username: ''
	// 使用 XMLHttpRequest 对象
	// , xhr: function(){}
	, xhrFields: {}

	// , responseFields: {
	// 	xml: 'responseXML'
	// 	, text: 'responseText'
	// 	, json: 'responseJSON'
	// }
	// , cors: false
};

/**
 * 支持
 * @static
 * */
AjaxReq._SUPPORT = {
	cors: 'withCredentials' in new XMLHttpRequest()
	, fetch: 'fetch' in self
	, formData: 'FormData' in self
	, header: 'Header' in self
};

Req.register('ajax', AjaxReq);

export default AjaxReq;