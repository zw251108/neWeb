'use strict';

import Model from './model.js';
import req from '../req/index.js';

/**
 * @class
 * @classdesc   对服务器接口进行封装，与 Model 统一接口，隔离数据与数据来源的问题
 * @extends Model
 *
 * @todo 支持 RESTful API
 * */
class ServiceModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    [options={}]
	 * @param   {String}    [options.baseUrl]
	 * */
	constructor(options={}){
		super();

		this._config = Object.keys( ServiceModel._CONFIG ).reduce((all, d)=>{
			
			if( d in options ){
				all[d] = options[d];
			}
			else{
				all[d] = ServiceModel._CONFIG[d];
			}

			return all;
		}, {});

		this._syncTo = null;

		/**
		 * 生成 ajax 实例
		 * */
		this._req = req.factory('ajax');
	}
	/**
	 * 设置数据，默认视为发送 POST 请求到服务器，不会将返回结果保存到本地缓存
	 * @param   {String|Object}    topic    字符串类型为请求 url，对象类型为所有参数
	 * @param   {Object}    [options]
	 * @param   {String}    [options.url]
	 * @param   {Object}    [options.data]
	 * @return  {Promise}
	 * */
	setData(topic, options){
		if( typeof topic === 'object' ){
			options = topic;
			topic = options.url
		}

		topic = this._config.baseUrl + topic;
		options.method = options.method || 'POST';

		// Req 对象操作
		return this._req(topic, options).then(function(){    // 发送请求成功

		}, function(){

		});
	}
	/**
	 * 获取数据，默认视为发送 GET 请求到服务器，可以返回结果保存到本地缓存
	 * @param   {String}    topic
	 * @param   {Object}    [options={}]    ajax 参数
	 * @param   {String}    [options.url]
	 * @param   {Object}    [options.data]
	 * @param   {String}    [options.method]
	 * @param   {Boolean}   [isCache=false]   是否优先从本地缓存中读取数据，同时发送请求后数据是否同步到本地缓存，默认为 false
	 * @return  {Promise}
	 * @todo    优先从本地 syncTo model 中读取数据，若没有则发送请求
	 * */
	getData(topic, options={}, isCache=false){
		let result
			;

		// 判断是否设置了本地缓存以及是否从本地缓存中读取数据
		if( isCache && this._syncTo ){
			// todo 解决多个本地缓存优先级的问题
			result = this._syncTo.getData( topic );
		}
		else{
			result = Promise.reject();
		}

		// 当从本地缓存时未找到期望的数据会 reject，或者不从缓存中获取数据时也会 reject
		result = result.catch(()=>{
			// 发送请求，从服务器获取数据
			return this._req.send(topic, options).then((data)=>{
				let result
					;

				if( isCache && this._syncTo ){  // 如果有设置缓存，则将请求返回的数据存入本地缓存
					result = this._syncTo.setData(topic, data).then(function(){
						return data;
					});
				}
				else{
					result = data;
				}

				return result;
			});
		});

		return result;
	}

	/**
	 * 删除数据
	 * @param   {String|Object} topic
	 * @param   {Object}    [options]
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
}

/**
 * 默认配置
 * @static
 * */
ServiceModel._CONFIG = {
	baseUrl: ''
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
 * 获取或生成 type 类型的 model 对象
 * @static
 * @param   {String}    type
 * @param   {Boolean|Object}    [notCache=false]    为 boolean 类型时表示是否缓存，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object}    [options={}]
 * @return  {Model}
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
			model = Model._MODEL_CACHE[type];
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

export default ServiceModel;