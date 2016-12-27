'use strict';

import $ from 'jquery';
import Model from './model';

/**
 * @class   AjaxModel
 *
 * todo    目前依赖于 jQuery 的 ajax 方法，未来期望改为使用 fetch，降级使用 ajax 并使用源生 XMLHttpRequest 对象
 * */
class AjaxModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}    options
	 * */
	constructor(options){
		super();

		if( options ){
			$.ajaxSetup( options );
		}
		// // 有 fetch 优先使用 fetch
		// if( 'fetch' in self ){
		// }
		// else{
		//  // 使用源生 XMLHttpRequest 对象
		// 	this._conn = function(url, value, options){
		// 		return $.ajax({
		// 			url: url
		// 			, data: value
		// 		});
		// 	};
		// }
	}

	/**
	 * @desc    设置数据    默认为 post 类型，key 为请求的 url，value 为发送的数据为 JSON 类型，options 与 $.ajax 可配置参数相同
	 * @param   {String}    key
	 * @param   {Object?}   value
	 * @param   {Object?}   options 相关配置    与 $.ajax 参数相同
	 * @return  {Promise}
	 * */
	setData(key, value={}, options={}){

		options.url = key;
		options.data = value;

		if( !('type' in options) ){
			options.type = 'POST';
			options.data._type = 'POST';
		}

		return $.ajax( options ).then((data)=>{
			this._trigger(key, value);

			return data;
		});
		// if( typeof value === 'object' ){
		// 	value._type = 'POST';
		// }
		//
		// options.url = key;
		// options.type = options.type || 'POST';
		// options.data = value;
		//
		// return this._conn(key, value);
	}
	/**
	 * @desc    获取数据    作用与 setData 相同，默认为 get 类型，接口出于语义化的原因存在
	 * @param   {String}    key
	 * @param   {Object?}   value
	 * @param   {Object?}   options
	 * @return  {Promise}
	 * */
	getData(key, value={}, options={}){

		options.url = key;
		options.data = value;

		if( !('type' in options) ){
			options.type = 'GET';
			options.data._type = 'GET';
		}

		return $.ajax( options );
	}
	/**
	 * @desc    删除数据    作用与 setData 相同，默认为 post 类型，接口出于语义化的原因存在，若接口 RESTful 可将类型改为 delete
	 * @param   {String}    key
	 * @param   {Object?}   value
	 * @param   {Object?}   options
	 * @return  {Promise}
	 * */
	removeData(key, value={}, options={}){

		options.url = key;
		options.data = value;

		if( !('type' in options) ){
			options.type = 'POST';
			options.data._type = 'DELETE';
		}

		return $.ajax( options );
	}
	clearData(){

	}
}

AjaxModel.requestType = {
	get: 'GET'
	, post: 'POST'
	, delete: 'POST'
	, put: 'POST'
};

Model.register('ajax', AjaxModel);

export default AjaxModel;