'use strict';

import Model from './model.js';
import req from '../req/index.js';
import sync from '../sync/index.js';

/**
 * @class
 * @extends Model
 *
 * @todo 与服务器建立连接，缓存请求返回的数据
 * */
class ServiceModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		this._syncList = null;

		/**
		 *
		 * */
		this._req = req.factory('ajax');
	}
	/**
	 * 设置数据
	 * @param   {String}    topic
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {Object}    options.data
	 * @return  {Promise}
	 * */
	setData(topic, options){
		// Req 对象操作
		return this._req(topic, options ).then(function(){    // 发送请求成功

		}, function(){

		});
	}
	/**
	 * 获取数据
	 * @param   {String}    topic
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {Object}    options.data
	 * @param   {Boolean}   fromLocal   是否优先从本地缓存中读取数据
	 * @return  {Promise}
	 * */
	getData(topic, options={}, fromLocal=true){
		let result
			;

		// todo 优先从本地 syncTo model 中读取数据，若没有则发生请求
		if( fromLocal && this._syncList ){
			// todo 解决多个本地缓存优先级的问题
			result = this._syncList.getData('topic');
		}
		else{
			result = Promise.reject();
		}

		result = result.catch(()=>{
			// todo 本地缓存中未获取到数据，发送请求
			// Req 对象操作
			return this._req.send(topic, options);
		});

		return result;
	}
	/**
	 * 将数据同步到本地存储
	 * @param   {Model}     model
	 * */
	syncTo(model){
		let rs
			;

		if( !(model instanceof ServiceModel) ){
			rs = sync.makeModelSync(this, model);
			this._syncList = model;
		}
	}
}

/**
 * @static
 * @desc    子类对象缓存
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
 * @param   {Boolean|Object}    [notCache]  为 boolean 类型时表示是否缓存，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object}    [options]
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