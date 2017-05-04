'use strict';

/**
 * @file    获取当前页面路径参数，并提供页面跳转方法
 * */

import app from '../app/index.js';


/**
 * @exports {Object}    url
 * */
export default {
	protocol: location.protocol
	
	, pathname: location.pathname
	, search: location.search
	, hash: location.hash
	, params: ''
	/**
	 * @summary     对没有协议头（以 // 开头）的路径加上协议头
	 * @method
	 * @memberOf    url
	 * @param       {String}    url
	 * @return      {String}
	 * */
	, addProtocol(url){
		return /^\/\//.test( url ) ? location.protocol + url : url;
	}
	/**
	 * @param   {...String}
	 * */
	, removeParam(){}
	/**
	 * @summary     页面跳转
	 * @method
	 * @memberOf    url
	 * @param       {String}    url
	 * @param       {String}    type
	 * @todo        后续添加其它参数
	 * */
	, changePage(url, type){
		// todo 其它参数

		location.href = url;

		// todo     web 下根据参数页面跳转
		// todo     web 下根据参数页面不跳转，切换视图，但是修改 history
		// todo     app 下调用 app 切换
	}
};