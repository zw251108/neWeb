'use strict';

import maple from 'maple';

/**
 * @file    框架聚合
 * */

/**
 * @todo    期望改为根据全局环境动态加载
 * */
// 基于 jQuery Deferred 对象简易实现 Promise，主要针对 UC 浏览器
import './promise.js';

// 数据层
import model from './model/index.js';

/**
 * 设置页面
 * */
model.service._CONFIG.successHandler = function(res){
	let secKey = res.secKey
		, timestamp = res.timestamp
		, result
		;

	if(secKey && timestamp){
		// todo 设置时间戳

		// setSec(secKey);
		// setTimestamp(timestamp);
	}

	if( res.success ){
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
};
model.service._CONFIG.errorHandler = function(e){
	
};

// 业务模块
import * as api from './biz/index.js';

// 网络请求
import req from './req/index.js';
//
// // 数据同步
// import sync from './sync/index.js';
//
// // 请求代理
// import proxy from './proxy/index.js';

// 通用工具类
import util from './util/index.js';

/**
 * @todo    期望改为根据全局环境动态加载
 * */
// 与 APP 交互接口
import App from './app/index.js';

let app = new App();

import domain from './domain.js';

// 获取地理位置
import location from './location.js';

/**
 * todo 实验性功能
 * */
// 动画库
import * as animate from './animate/index.js';

// 注册后台 worker
import register from './register/index.js';

// 桌面通知， 目前仅支持 PC 端
import notify from './notify.js';

export default {
	model
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