'use strict';

import $ from 'jquery';
import Model from './model.js';

/**
 * @class   AjaxModel
 * */
class AjaxModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		// 有 fetch 优先使用 fetch
		if( 'fetch' in window ){
			this._conn = fetch;
		}
		else{
			// todo 封装 XMLHttpRequest 对象
			this._conn = function(url, value, options){
				return $.ajax({
					url: url
					, data: value
				});
			}
		}
	}

	/**
	 * @desc    设置数据
	 * @param   {String}        key
	 * @param   {String|Object} value
	 * @param   {Object?}   options 相关配置
	 * @param   {String}    options.method  请求类型
	 * @param   {Object}    options.headers 请求头信息
	 * @param   {String}    options.mode    请求的模式
	 * @param   {String}    options.cache   请求的缓存模式
	 * @param   {String}    options.credentials
	 * @return  {Promise}
	 * */
	setData(key, value, options={}){

		if( typeof value === 'object' ){
			value._type = 'POST';
		}

		options.url = key;
		options.type = options.type || 'POST';
		options.data = value;

		return this._conn(key, value);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){

	}
	clearData(){

	}
}

Model.register('ajax', AjaxModel);

export default AjaxModel;