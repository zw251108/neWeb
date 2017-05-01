'use strict';

/**
 * @file    获取当前页面路径参数，并提供页面跳转方法
 * */


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
	 * @todo        后续添加其它参数
	 * */
	, changePage(url){
		// todo 其它参数

		location.href = url;
	}
};