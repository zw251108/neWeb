'use strict';

import Model from './model.js';
import req from '../req/index.js';
import sync from '../sync/index.js';

/**
 * @class   ServiceModel
 *
 * todo 与服务器建立连接，缓存请求返回的数据
 * */
class ServiceModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		this._syncList = [];

		this._req = req.factory('ajax');
	}
	/**
	 *
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {Object}    options.data
	 * @return  {Promise}
	 * */
	setData(options){
		// Req 对象操作
		return this._req( options ).then(function(){    // 发送请求成功

		}, function(){

		});
	}
	/**
	 * @param   {Object}    options
	 * @param   {String}    options.url
	 * @param   {Object}    options.data
	 * @return  {Promise}
	 * */
	getData(options){
		// Req 对象操作
		return this._req( options ).then(function(){

		}, function(){

		});
	}
	/**
	 * @param   {Model} cacheModel
	 * */
	syncTo(cacheModel){
		let rs
			;

		if( !(cacheModel instanceof ServiceModel) ){
			rs = sync.makeModelSync(this, cacheModel);
			// this._syncList.push( rs );
		}
	}
}

// 缓存
ServiceModel._MODEL_CACHE = {};

/**
 * 注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
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
 * @param   {String}    type
 * @param   {Boolean|Object?}   notCache    为 boolean 类型时表示是否缓存，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object?}   options
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