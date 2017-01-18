'use strict';

/**
 * @module   req
 * */

import Req from './req';

import './load';
import './ajax';
import './fetch';
import webSocket from './webSocket';
// import '../register/serviceWorker';

/**
 * @function    req 发送请求
 * */
function req(url, options, type){
	// todo 判断类型
}

export default {
	req
	, webSocket
};