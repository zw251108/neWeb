'use strict';

/**
 * @file    框架聚合
 * */

// 数据缓存
import model from './model/index.js';

// 网络请求
import req from './req/index.js';

// // 数据同步
// import sync from './sync/index.js';

// // 请求代理
// import proxy from './proxy/index.js';

// 通用工具类
import util from './util/index.js';


/**
 * @todo    期望改为根据全局环境动态加载
 * */
// 动画库
import animate from './animate/index.js';

// 桌面通知， 目前仅支持 PC 端
import notify from './notify.js';

// 注册后台 worker
import register from './register/index.js';

// 数据提交
import report from './report.js';

// 全局 error 事件监听
import './onerror.js';

// 全局监控
import './tracker.js';

export default {
	model
	// , proxy
	, req
	// , sync

	, location

	, util

	// 实验性功能
	, animate
	, register
	, notify

	, report
};