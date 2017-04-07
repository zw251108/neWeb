'use strict';

/**
 * @file    框架聚合
 * */

import Vue from 'vue';

import maple from 'maple';

// 全局监控
import tracker from './tracker.js';

// Vue 调用全局监控
Vue.use( tracker );

/**
 * @todo    期望改为根据全局环境动态加载
 * */
// 基于 jQuery Deferred 对象简易实现 Promise，主要针对 UC 浏览器
import 'promise.js';



// 数据层
import Model from 'model/index.js';

// 业务模块
import * as api from 'biz/index.js';

/**
 *
 * */
let secKeyModel = new Model();

/**
 * 设置页面请求默认业务处理
 * */
// /**
//  * 在请求发送前置预处理
//  * @method      beforeSendHandler
//  * @memberOf    Model.service._CONFIG
//  * @param       {Object}    options
//  * @return      {Promise}
//  * @todo    是否需要?
//  * */
// Model.service._CONFIG.beforeSendHandler = function(options){
// 	return api.member.secKey().then(function(){
//
// 	});
// };
/**
 * 对发送请求成功时的返回值进行预处理
 * @method      successHandler
 * @memberOf    Model.service._CONFIG
 * @param       {Object}    res
 * @return      {Promise}
 * */
Model.service._CONFIG.successHandler = function(res){
	let secKey = res.secKey
		, timestamp = res.timestamp
		, execute
		;

	if( secKey && timestamp ){

		// 设置时间戳
		execute = Promise.all([
			secKeyModel.setData('secKey', secKey)
			, secKeyModel.setData('timestamp', timestamp)
		]);
	}
	else{
		execute = Promise.resolve();
	}

	execute = execute.then(function(){
		let result
			;

		if( res.success ){  //
			result = res.data;
		}
		else{
			if( res.code === 888 ){
				// 未登录
				maple.pageIns && maple.pageIns.changePage('../login/login.html');
			}
			else{
				if( res && res.message && res.message !== 'undefined' ){
					maple.notice( res.message );
				}
				else{
					maple.notice('网络好像不给力喔，请检查一下您的网络设置');
				}
			}

			result = Promise.reject( res );
		}

		return result;
	});

	return execute;
};
/**
 * 对发送请求失败时进行预处理
 * @method      errorHandler
 * @memberOf    Model.service._CONFIG
 * @return  {Promise}
 * */
Model.service._CONFIG.errorHandler = function(){
	console.log( arguments );

	maple.notice('网络好像不给力喔，请检查一下您的网络设置');

	return Promise.reject();
};

// 网络请求
import req from 'req/index.js';
//
// // 数据同步
// import sync from './sync/index.js';
//
// // 请求代理
// import proxy from './proxy/index.js';

// 通用工具类
import util from 'util/index.js';

/**
 * @todo    期望改为根据全局环境动态加载
 * */
// 与 APP 交互接口
import App from 'app/index.js';

let app = new App();

import domain from 'domain.js';

// 获取地理位置
import location from 'location.js';

/**
 * todo 实验性功能
 * */
// 动画库
import * as animate from 'animate/index.js';

// 注册后台 worker
import register from 'register/index.js';

// 桌面通知， 目前仅支持 PC 端
import notify from 'notify.js';

let newTg = window.newTg = {
	model: Model
	// , proxy
	, req
	// , sync
	, domain
	, api

	/**
	 * @todo    期望改为根据全局环境动态加载
	 * */
	, app

	, location

	, util

	// 实验性功能
	, animate
	, register
	, notify
};

export default newTg;

/**
 * 对 document.createElement 重写，要求最后一个参数为验证参数，若验证未通过则返回空对象
 * */
document._createElement = document.createElement;
document.createElement = function(){
	let argc = arguments.length
		, rs
		;

	if( argc > 1 && arguments[argc -1] === '' ){    // 最后一个参数为验证
		rs = document._createElement.apply(document, Array.prototype.slice.call(arguments, 0, argc -1));	}
	else{   // 未通过验证
		rs = {};
	}

	return rs;
};

///^(13\d)|(14[0-35-9])|(18[05-9])\d{8}$/