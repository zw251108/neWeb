'use strict';

import Model from './model.js';
// import req from '../req/index.js';

/**
 * 目前数据请求依赖于 jQuery.ajax 方法
 * @todo 替换为自开发请求类库
 * */
import $ from 'jquery';

/**
 * @class
 * @classdesc   对服务器接口进行封装，与 Model 统一接口，隔离数据与数据来源的问题，在 Model.factory 工厂方法注册为 service，别名 s，将可以使用工厂方法生成
 * @extends     Model
 *
 * @todo 支持 RESTful API
 * @todo 通道功能，一个 topic 一次只能发送一条，其余保存在队列中，等待当前发送的返回，再发送下一条
 * @todo 限制同时发送的请求的最大数量
 * */
class ServiceModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * @param   {String}    [config.baseUrl]
	 * @param   {Boolean}   [config.isCrossDomain]
	 // * @param   {Function}  [config.beforeSendHandler]
	 * @param   {Function}  [config.successHandler]
	 * @param   {Function}  [config.errorHandler]
	 * @param   {Number}    [config.timeout]
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( ServiceModel._CONFIG ).reduce((all, d)=>{
			
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = ServiceModel._CONFIG[d];
			}

			return all;
		}, {});

		this._syncTo = null;

		// // 设置默认前置处理
		// if( !this._config.beforeSendHandler ){
		// 	this._config.beforeSendHandler = function(){
		//
		// 	};
		// }

		// 设置默认成功处理
		if( !this._config.successHandler ){
			this._config.successHandler = function(rs){
				return rs;
			};
		}

		// 设置默认错误处理
		if( !this._config.errorHandler ){
			this._config.errorHandler = function(e){
				return Promise.reject( e );
			};
		}

		// // 任务队列
		// this._task = {};

		// /**
		//  * 判断是否使用 jsonp 方式发送数据
		//  * */
		// if( this._config.jsonp ){
		// 	this._req = req.jsonp;
		// }
		// else{
		// 	this._req = req.ajax;
		// }

		// this._req = req.factory('ajax');
	}
	/**
	 *
	 * */
	_setDefault(options){

	}
	/**
	 * 对 setData 和 getData 的 options 添加跨域参数
	 * @param   {Object}    options setData 和 getData 的 options 参数
	 * @return  {Object}
	 * */
	_setCrossDomain(options){
		if( this._config.isCrossDomain && !('xhrFields' in options) ){
			options.xhrFields = {
				withCredentials: true
			};
		}

		return options;
	}

	/**
	 * 设置数据，默认视为发送 POST 请求到服务器，不会将返回结果保存到本地缓存
	 * @param   {String|Object} topic    字符串类型为请求 url，对象类型为所有参数，其中 url 为必填
	 * @param   {Object}        [options={}]
	 * @param   {Object}        [options.data]
	 * @param   {String}        [options.method]
	 * @param   {Boolean}       [needSeckey=false]
	 * @return  {Promise}
	 * */
	setData(topic, options={}, needSeckey=false){
		let result
			;

		if( typeof topic === 'object' ){
			options = topic;
			topic = options.url
		}

		topic = this._config.baseUrl + topic;
		options.method = options.method || 'POST';
		options.dataType = options.dataType || 'json';

		if( this._config.isCrossDomain ){
			options = this._setCrossDomain( options );
		}

		if( topic ){
			result = $.ajax(topic, options).then(this._config.successHandler, this._config.errorHandler);
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 获取数据，默认视为发送 GET 请求到服务器，可以将返回结果保存到本地缓存
	 * @param   {String|Object}     topic   字符串类型为请求 url，对象类型为所有参数，其中 url 为必填
	 * @param   {Object|Boolean}    [options={}]    对象类型为 ajax 参数，Boolean 类型时将其赋值给 isCache，自身设置为 {}
	 * @param   {Object}            [options.data]
	 * @param   {String}            [options.method]
	 * @param   {Boolean}           [isCache=false]   是否优先从本地缓存中读取数据，同时发送请求后数据是否同步到本地缓存，默认为 false
	 * @param   {Boolean}           [needSeckey=false]  是否需要
	 * @return  {Promise}
	 * @todo    优先从本地 syncTo model 中读取数据，若没有则发送请求
	 * */
	getData(topic, options={}, isCache=false, needSeckey=false){
		let result
			;

		if( typeof options === 'boolean' ){
			isCache = options;
			options = {};
		}

		if( typeof topic === 'object' ){
			options = topic;
			topic = options.url;
		}

		if( topic ){
			// 判断是否设置了本地缓存以及是否从本地缓存中读取数据
			if( isCache && this._syncTo ){
				// todo 解决多个本地缓存优先级的问题
				result = this._syncTo.getData( topic );
			}
			else{
				result = Promise.reject();

				topic = this._config.baseUrl + topic;
				options.method = options.method || 'GET';
				options.dataType = options.dataType || 'json';

				if( this._config.isCrossDomain ){
					options = this._setCrossDomain( options );
				}
			}

			// 当从本地缓存时未找到期望的数据会 reject，或者不从缓存中获取数据时也会 reject
			result = result.catch(()=>{
				// console.log(options)
				
				// 发送请求，从服务器获取数据
				// return this._req.send(topic, options)
				return $.ajax(topic, options)
					.then((data)=>{
						let result
							;

						if( isCache && this._syncTo ){  // 如果有设置缓存，则将请求返回的数据存入本地缓存
							result = this._syncTo.setData(topic, data).then(function(){
								return data;
							}, function(e){
								console.log( e );

								return data;
							});
						}
						else{
							result = data;
						}

						return result;
					}).then(this._config.successHandler, this._config.errorHandler);
			});
		}
		else{   // topic 无值不做任何处理
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 删除数据
	 * @param   {String|Object} topic
	 * @param   {Object}        [options]
	 * @return  {Promise}
	 * @todo    可以考虑支持 RESTful API，发送 delete 类型的请求
	 * */
	removeData(topic, options){

		return Promise.resolve( true );
	}
	/**
	 * 清空数据，实际不做任何处理
	 * */
	clearData(){
		return Promise.resolve( true );
	}
	/**
	 * 将数据同步到本地存储，一次只能设置一个本地缓存
	 * @override
	 * @param   {Model}     model
	 * @todo    目前只能将数据同步到一个本地缓存中，是否考虑可以同步到多个本地缓存，亦或由本地缓存之间设置同步
	 * */
	syncTo(model){

		// 判断 model 是继承自 Model 的类但并不继承字 ServiceModel
		if( (model instanceof Model) && !(model instanceof ServiceModel) ){
			this._syncTo = model;
		}
	}

	// /**
	//  * 处理返回结果
	//  * @param   {Object}    res 从服务器返回的统一格式数据
	//  * @return  {Promise}
	//  * */
	// handleResponse(res){
	// 	let result
	// 		;
	//
	// 	if( res.success ){
	// 		result = Promise.resolve( res.data );
	// 	}
	// 	else{
	// 		result = Promise.reject( res );
	// 	}
	//
	// 	return result;
	// }
}

/**
 * 默认配置
 * @static
 * */
ServiceModel._CONFIG = {
	baseUrl: ''
	, isCrossDomain: true
	, task: false
	, jsonp: false
	, timeout: 10000
	// , beforeSendHandler: null
	, successHandler: null
	, errorHandler: null
};

/**
 * 子类对象缓存
 * @static
 * */
ServiceModel._MODEL_CACHE = {};

/**
 * 注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
 * @static
 * @param   {String}    type
 * @param   {Model}     model
 * */
ServiceModel.register = function(type, model){
	if( type in ServiceModel && type in ServiceModel._MODEL_CACHE ){
		console.log('type', ' 重复注册，并已生成实例，不能覆盖');
	}
	else{
		ServiceModel[type] = model;
	}
};

/**
 * 注册子类的别名
 * @static
 * @param   {String}            type        已注册的子类名
 * @param   {String|String[]}   aliasName   该子类的别名
 * */
ServiceModel.registerAlias = function(type, aliasName){

	if( !Array.isArray(aliasName) ){
		aliasName = [aliasName];
	}

	aliasName.forEach((d)=>{
		if( !(d in ServiceModel._MODEL_ALIAS) ){
			ServiceModel._MODEL_ALIAS[d] = type;
		}
		else{
			console.log(d, ' 已经存在');
		}
	});
};

/**
 * 获取或生成 type 类型的 ServiceModel 子类的实例或 ServiceModel 类的实例
 * @static
 * @param   {String}            type
 * @param   {Boolean|Object}    [notCache=false]    为 boolean 类型时表示是否缓存，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object}            [options={}]
 * @return  {Model}             当 type 有意义的时候，为 ServiceModel 子类的实例，否则为 ServiceModel 类的实例
 * */
ServiceModel.factory = function(type, notCache=false, options={}){
	let model
		;

	if( typeof notCache === 'object' ){
		options = notCache;
		notCache = false;
	}

	if( type in ServiceModel ){
		if( !notCache && type in ServiceModel._MODEL_CACHE ){
			model = ServiceModel._MODEL_CACHE[type];
		}
		else{
			model = new ServiceModel[type](options);
			ServiceModel._MODEL_CACHE[type] = model;
		}
	}
	else{
		model = new ServiceModel(options);
	}

	return model;
};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('service', ServiceModel);

/**
 * 注册别名
 * */
Model.registerAlias('service', 's');

export default ServiceModel;