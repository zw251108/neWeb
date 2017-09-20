'use strict';

/**
 * @file    业务框架聚合，在基础框架之上添加业务代码
 *          模块聚合关系如下：
<pre>
 +----------------------------------------------------------------------------------------------+
 |                                                                                              |
 |             Tg( index.js )                                                                   |
 |                                                                                              |
 |  +-----------------------------------------------------------+                               |
 |  |                                                           |                               |
 |  |             Maple( base.js )                              |                               |
 |  |                                                           |                               |
 |  |  +-------+  +----------+  +------------+  +------------+  |  +----------+                 |
 |  |  |       |  |          |  |            |  |            |  |  |          |                 |
 |  |  |  url  |  |  device  |  |  listener  |  |  util      |  |  |  domain  |                 |   运行环境检测 & 基础工具函数
 |  |  |       |  |          |  |            |  |            |  |  |          |                 |
 |  |  +-------+  +----------+  +------------+  +------------+  |  +----------+                 |
 |  |                                                           |                               |
---------------------------------------------------------------------------------------------------------------------
 |  |                                                           |                               |
 |  |  +--------------+  +---------------+  +----------------+  |  +-----------+  +----------+  |
 |  |  |              |  |               |  |                |  |  |           |  |          |  |
 |  |  |  model       |  |  view         |  |  router        |  |  |  api      |  |  app     |  |   Model 数据处理 & View 视图处理 & router 路由配置 & 业务接口 & App 交互接口
 |  |  |              |  |               |  |                |  |  |           |  |          |  |
 |  |  +--------------+  +---------------+  +----------------+  |  +-----------+  +----------+  |
 |  |                                                           |                               |
---------------------------------------------------------------------------------------------------------------------
 |  |                                                           |                               |
 |  |  +------------+  +------------+  +----------+             |                               |
 |  |  |            |  |            |  |          |             |                               |
 |  |  |  position  |  |  register  |  |  notify  |             |                               |   浏览器增强功能
 |  |  |            |  |            |  |          |             |                               |
 |  |  +------------+  +------------+  +----------+             |                               |
 |  |                                                           |                               |
 |  +-----------------------------------------------------------+                               |
 |                                                                                              |
---------------------------------------------------------------------------------------------------------------------
 |                                                                                              |
 |  +----------+  +---------+  +-----------+  +----------------------------------------------+  |
 |  |          |  |         |  |           |  |                                              |  |
 |  |  notice  |  |  alert  |  |  confirm  |  |  component...                                |  |   UI 组件
 |  |          |  |         |  |           |  |                                              |  |
 |  +----------+  +---------+  +-----------+  +----------------------------------------------+  |
 |                                                                                              |
---------------------------------------------------------------------------------------------------------------------
 |                                                                                              |
 |  +----------------------------------------------------------------------------------------+  |
 |  |                                                                                        |  |
 |  |                                          biz                                           |  |   可复用业务代码
 |  |                                                                                        |  |
 |  +----------------------------------------------------------------------------------------+  |
 |                                                                                              |
---------------------------------------------------------------------------------------------------------------------
 |                                                                                              |
 |                                       +------------+                                         |
 |                                       |            |                                         |
 |                                       |  pageInit  |                                         |   页面初始化操作
 |                                       |            |                                         |
 |                                       +------------+                                         |
 |                                                                                              |
 +----------------------------------------------------------------------------------------------+
</pre>
 * */

import $        from 'jquery';
import Vue      from 'vue';

import maple    from './base.js';

/**
 * @namespace   tg
 * @borrows     maple.url       as url
 * @borrows     maple.device    as device
 * @borrows     maple.util      as util
 * @borrows     maple.model     as model
 * @borrows     maple.view      as view
 * @borrows     maple.router    as router
 * @borrows     maple.notify    as notify
 * @borrows     maple.position  as position
 * @borrows     maple.register  as register
 * */
let tg = maple
	;

/**
 * ---------- 运行时检测追加 ----------
 * */
// 运行开发状态环境（域名）
import domain   from 'domainConfig';

tg.domain = domain;

/**
 * ---------- 工具类库拓展 ----------
 * */
import vmWatchPromise   from './util/vmWatchPromise.js';

tg.util.vmWatchPromise = vmWatchPromise;

/**
 * ---------- 业务接口模块 ----------
 * */
import * as api from './api/index.js';

// 加载微信业务模块 todo 期望改为根据全局环境动态加载
import './api/wechat.js';

tg.api = api;

/**
 * ---------- APP 交互接口 ----------
 * todo    期望改为根据全局环境动态加载
 * */
import {App, app}   from './app/index.js';

// let app = new App();

/**
 * @todo    期望改为根据全局环境动态加载
 * */
tg.app = app;
tg.App = App;

/**
 * ---------- 加载组件 ----------
 * */
// notice 组件
import notice   from './component/notice/index.js';

tg.notice = notice;

// alert 组件
import alert    from './component/alert/index.js';

tg.alert = alert;

// confirm 组件
import confirm  from './component/confirm/index.js';

tg.confirm = confirm;

/**
 * ---------- Vue 插件安装 ----------
 * */
import './vue-plugin/index.js';

/**
 * ---------- 全局业务执行 ----------
 * */
// 判断 APP 接口注入完成
import appInterfaceReady    from './biz/appInterfaceReady.js';

// // 防止运营商劫持  todo 待验证
// import './biz/preventHijack.js';

let Model = tg.model;

let date = new Date()
	, y = date.getFullYear()
	, m = date.getMonth()
	, d = date.getDate()
	, cookie = Model.factory('c')
	;

// 设置版本号 todo 保留？
cookie.setData('tgVersion', 'web/'+ y + m + d);

// 系统监控
let log = Model.factory('log');

if( domain.env !== 'online' && domain.env !== 'test' ){ // 不为线上或测试环境时禁用埋点功能
	log.setDisabled( true );
}

// 错误码处理
import errorCode    from './biz/errorCode.js';

// 设置页面拦截器
import './biz/interceptor.js';

// 对 runtime/url 添加基于业务的页面跳转
import './biz/operatePage.js';

// 渲染 vm
import render       from './biz/render.js';

// 个人地理位置信息
import positionInfo from './biz/autoPosition.js';

// 个人信息
import mineInfo     from './biz/mineInfo.js';

// 去过的门店
import visitStores  from './biz/visitStore.js';

// 旧版去过的门店
import usualShop    from './biz/usualShop.js';

// 本地存储使用
import storeCache   from './biz/tgStoreCache.js';

// 初始化运行环境
import initGlobal   from './biz/initGlobal.js';

// 向 vm 注入公共数据
import injectData   from "./biz/injectData.js";

// 编辑用户信息相关操作
import editUserInfo from './biz/userInfo.js';

// 发现频道操作
import discover     from './biz/discover.js';

// 试衣秀操作
import fittingShow  from './biz/fittingShow.js';

/**
 * @namespace   tg.biz
 * */
let biz = {
	initGlobal
	, injectData
	, appInterfaceReady
	, positionInfo
	, storeCache

	, render

	, errorCode

	, mineInfo
	, visitStores
	, usualShop

	, editUserInfo
	, discover
	, fittingShow
};

// 获取微信用户信息 todo 期望改为根据全局环境动态加载
import wechat       from './biz/wechat.js';

biz.wechat = wechat;

tg.biz = biz;

// ---------- 页面初始化函数 ----------
/**
 * @summary 页面初始化
 * @param   {Boolean}   [isWcAutoLogin=true]    微信是否自动登录
 * @return  {Promise}
 * */
tg.pageInit = (isWcAutoLogin=true)=>{
	return Promise.all([
		initGlobal()
		, cookie.getData('hybrid').catch(()=>{
			return false;
		})
	]).then(([global, hybrid])=>{
		// todo 更好的实现

		return {
			global
			, hybrid
			, isAirMall: global === 'airMall'

			// todo 保留？
			, isAndroid: hybrid && global === 'android'
			, isIos: hybrid && global === 'ios'
		};
	}).then((variable)=>{
		let result
			, device = tg.device
			;

		if( device.weixin ){    // 加载微信 JS SDK
			result = wechat.loadWcSdk();
		}
		else{
			result = Promise.resolve();
		}

		return result.then(()=>{
			return Promise.all([
				// 地理定位
				positionInfo()
				// 微信自动登录
				, wechat.login( isWcAutoLogin )
				// APP 接口加載
				, appInterfaceReady()
			]);
		}).then(()=>{
			return variable;
		});
	});
};

export default tg;

/**
 * 参数
 *
 * needRefresh      是否回退刷新      调用 view.needRefresh 实现
 * goToTop          回到顶部按钮      使用组件实现
 * useGoTop
 * autoAnalyse      自动统计
 * useWcShare       使用微信分享
 * isWcShare
 * isWcAutoLogin    微信自动登录
 * loadMore         是否可以加载更多数据
 *
 * global           运行环境，从 cookie 中取，若没有则判断 AlipayClient wechat webapp      执行 injectData 插入到 vm 中
 *
 * pageInitTime     ? 统计渲染时间？ 存入了 cookie
 *
 * params           url 上的参数    执行 injectData 插入到 vm 中
 * params.source_type
 * params.source_weixin_id
 * params.shopid
 * params.jr
 * params.JR
 *
 * scrollTop        ?
 * isBack           !!scrollTop
 * backOver         false
 * cityId           城市 id         执行 injectData 插入到 vm 中
 * cityName         城市名称        执行 injectData 插入到 vm 中
 * hybrid           是否为 app      执行 injectData 插入到 vm 中
 * isAndroid                        执行 injectData 插入到 vm 中  todo 是否保留？
 * isIos                            执行 injectData 插入到 vm 中  todo 是否保留？
 * isAirMall        ? 空中导购？     执行 injectData 插入到 vm 中
 * $body            $('body')       todo 决定使用保留
 *
 * 去掉 url 上的 scrollTop
 * 非微信下 replaceState(null, '', url)
 *
 * app 下 body 的 class 上添加 hybrid 和 cookie 中 global 的值
 *
 * 所有 a 标签绑定 click 事件           使用 Vue.$tracker 和 LogServiceModel 实现
 * 所有 [data-scp] 绑定 click 事件        使用 Vue.$tracker 和 LogServiceModel 实现
 *
 * 回到顶部按钮                           使用组件实现
 *
 * 自动统计             发送 trackPage    使用 Vue.$tracker 和 LogServiceModel 实现
 *
 * 自动拉起 app                             biz/autoRunApp
 *
 * 绑定滚动加载更多事件                       使用全局事件 view.scroll 实现
 *
 * 加载微信 js-sdk                          在 biz/wechat 中实现
 * */