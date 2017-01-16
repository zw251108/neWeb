'use strict';

/**
 * @file    框架聚合
 * */

// 数据缓存
import model from './model/index';

// 网络请求
import req from './req/index';

// 数据同步
import sync from './sync/index';

// 请求代理
import proxy from './proxy/index.js';

// 注册后台 worker
import register from './register/index';


// 动画库
import animate from './animate/index';

// 桌面通知， 目前仅支持 PC 端
import notify from './notify';

export default {
	model
	, proxy
	, register
	, req
	, sync

	, animate
	, notify
};