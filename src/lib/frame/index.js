'use strict';

/**
 * @file    框架聚合
 * */


/**
 * 基于 jQuery Deferred 对象简易实现 Promise，主要针对 UC 浏览器
 * @todo    期望改为根据全局环境动态加载
 * */
import './promise.js';

/**
 * ---------- 全局运行时检测 ----------
 * */
// 运行环境
import domain   from './runtime/domain.js';

// 运行参数
import url      from './runtime/url.js';

// 运行设备
import device   from './runtime/device.js';

/**
 * ---------- 通用工具 ----------
 * */
import util     from './util/index.js';

/**
 * ---------- 数据层 ----------
 * */
import Model    from './model/index.js';

/**
 * ---------- 业务接口模块 ----------
 * */
import * as api from './api/index.js';

// 加载微信业务模块 todo 期望改为根据全局环境动态加载
import './api/wechat.js';

/**
 * ---------- APP 交互接口 ----------
 * todo    期望改为根据全局环境动态加载
 * */
import App      from './app/index.js';

let app = new App();

/**
 * ---------- 全局事件 ----------
 * */
// 全局滚动事件
import scroll   from './event/scroll.js';

// 全局 resize 事件
import resize   from './event/resize.js';

let event = {
	scroll
	, resize
};

// 获取地理位置
import location from './location.js';

/**
 * ---------- 全局业务执行 ----------
 * */
// 防止运营商劫持（待验证）
import './biz/preventHijack.js';

// 系统监控
let log = Model.factory('log');

if( domain.env !== 'online' || domain.env !== 'test' ){ // 不为线上或测试环境时禁用埋点功能
	log.setDisabled( true );
}

// 组件埋点
import Vue      from 'vue';
import maple    from 'maple';

import tracker  from './tracker.js';

Vue.use( tracker );

// 防黄牛机制
import 'biz/preventScalper.js'

// 设置页面请求默认业务处理
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
 * @return      {Promise}
 * */
Model.service._CONFIG.errorHandler = function(){
	// console.log( arguments );

	maple.notice('网络好像不给力喔，请检查一下您的网络设置');

	return Promise.reject();
};

// 个人地理位置信息
import positionInfo from './biz/autoPosition.js';

// 个人信息
import mineInfo from './biz/mineInfo.js';

let biz = {
	mineInfo
	, positionInfo
};

// 获取微信用户信息 todo 期望改为根据全局环境动态加载
import wechat   from './biz/wechat.js';

biz.wechat = wechat;

/**
 * ---------- 加载组件 ----------
 * todo
 * */


let newTg = window.newTg = {
	domain
	, url
	, device

	, util

	, model: Model
	, api

	/**
	 * @todo    期望改为根据全局环境动态加载
	 * */
	, app

	, event

	, biz

	, location


	// 实验性功能
	, animate
	, register
	, notify
};

export default newTg;

/**
 * 参数
 *
 * needRefresh      是否回退刷新
 * goToTop          回到顶部按钮
 * useGoTop
 * autoAnalyse      自动统计
 * useWcShare       使用微信分享
 * isWcShare
 * isWcAutoLogin    微信自动登录
 * loadMore         是否可以加载更多数据
 *
 * global           运行环境，从 cookie 中取，若没有则判断 AlipayClient wechat webapp
 *
 * pageInitTime     ? 统计渲染时间？ 存入了 cookie
 * params           url 上的参数
 * params.source_type
 * params.source_weixin_id
 * params.shopid
 * params.js
 * params.JR
 *
 * scrollTop        ?
 * isBack           !!scrollTop
 * backOver         false
 * cityId           城市 id
 * cityName         城市名称
 * hybrid           是否为 app
 * isAndroid
 * isIos
 * isAirMall        ? 空中导购？
 * $body            $('body')
 *
 * 去掉 url 上的 scrollTop
 * 非微信下 replaceState(null, '', url)
 *
 * app 下 body 的 class 上添加 hybrid 和 cookie 中 global 的值
 *
 * 所有 a 标签绑定 click 事件
 * 所有 [data-scp] 绑定 click 事件
 *
 * 回到顶部按钮       使用组件替代
 *
 * 自动统计             发送 trackPage
 *
 * 自动拉起 app
 *
 * 绑定滚动加载更多事件   使用全局事件
 *
 * 加载微信 js-sdk      在 biz/wechat 中实现
 * */



/**
 * todo 实验性功能
 * */

/**
 * ---------- 动画库 ----------
 * */
import * as animate from './animate/index.js';

/**
 * ---------- 注册后台 worker ----------
 * */
import register from './register/index.js';

/**
 * ---------- 桌面通知 ----------
 * */
import notify   from './notify.js';
