'use strict';

/**
 * @file    对 runtime/url 个别接口基于业务上的重写
 *          changePage、replacePage 重写，添加基于业务的页面跳转，添加路由功能，按如下顺序判断执行：
 *          1.自定义的协议头
 *          2.app 下有该路径原生生页面
 *          3.web 下 router 里有注册模块
 *          4.页面跳转
 * */

import AppPageCode  from '../../../../setting/AppPageCode.json';
import url      from 'url';
import {app}    from '../app/index.js';
import view     from '../view/index.js';
import model    from '../model/index.js';
import router   from '../router/index.js';

const URL_EXPECTED_CODE = [
		'custom'                // 标识是否为电子入口
		, 'uuid'                // 标识电子入口标识
		, 'source_type'         // 标识微信订阅号/服务号
		, 'source_weixin_id'    // 标识微信原始id
		// , 'code'                // 用于微信获取openid
		, 'state'               // 用于微信获取openid
		, 'bd_source_light'     // 百度直达号
		, 'bd_wd'               // 百度直达号
	]
	, GLOBAL_PARAMS = [
		'min'
		, 'air'
		, 'isWeixin'
	]
	;

let cookie = model.factory('c')
	, service = model.factory('s')
	;

url.urlExpectedCode = URL_EXPECTED_CODE;

// 将原接口重命名
url._changePage = url.changePage;
url._replacePage = url.replacePage;

let needRefresh = (is)=>{
		if( is ){
			view.needRefresh();
		}
	}
	, setHistory = (type, href)=>{
		if( type === 'change' ){
			url.pushHistory( href );    // 将目标路径添加到 history
		}
		else if( type === 'replace' ){
			url.replaceHistory( href );
		}
	}
	, setPage = (type, href)=>{ // 页面跳转
		if( type === 'change' ){
			url._changePage( href );
		}
		else if( type === 'replace' ){
			url._replacePage( href );
		}
	}
	, assignPage = (type, href, params={}, isNeedRefresh=false)=>{
		let nowScroll = view.scroll.scrollBar('top').px
			, nowView   // todo
			, targetUrl = url.parseUrl( href )
			, protocol = url.protocol
			, result
			;

		// todo 添加页面滚动条位置参数

		// todo ?
		if( url.port === '8080' ){
			targetUrl = url.parseUrl( href );

			href = targetUrl.relative;
			targetUrl = url.parseUrl( href );
		}

		// 检测特殊参数
		URL_EXPECTED_CODE.forEach((code)=>{
			let expr = new RegExp('(\\?'+ code +'=|&'+ code +'=)')
				;

			if( code in params || expr.test( href ) ){
				alert(code +' 为 url 保留自动，禁止使用，发现请立即修改');
			}
		});

		// 添加全局参数
		GLOBAL_PARAMS.forEach((k)=>{
			if( k in url.params ){
				params[k] = url.params[k];
			}
		});

		targetUrl.changeParams( params );

		href = targetUrl.pack();

		if( ['http', 'https'].indexOf(protocol) === -1 ){   // 自定义协议头
			result = service.getData(targetUrl.origin + targetUrl.path, {
				data: targetUrl.params
			});
		}
		else{   // 页面跳转
			result = cookie.getData('hybrid').then((hybrid)=>{   // app 操作
			// 	if( !hybrid ){
			// 		return Promise.reject();
			// 	}
			//
			// 	// todo
			// }, ()=>{
			//
			// }).then(()=>{   // web 操作
			//
			// });
			//
			// result.then((hybrid)=>{
				let appCode = AppPageCode[targetUrl.path]
					;

				if( hybrid && type === 'change' ){  // APP 添加跳转记录
					app.addTgHistory(url.pack(), String(!!isNeedRefresh));

					needRefresh( isNeedRefresh );
				}

				if( hybrid && appCode ){    // APP 下且有原生页面实现
					app.tgChangePage(appCode, url.pack());
				}
				else{   // 页面路由控制
					// rs = router.get(targetUrl.path);    // 页面路由控制

					if( router.has(targetUrl.path) ){   // 路由中有该路径

						router.get(targetUrl.path, params);

						setHistory(type, targetUrl.pack());
					}
					else{   // 路由中没有该路径，跳转页面
						needRefresh( isNeedRefresh );

						setPage(type, targetUrl.pack());
					}
				}
			});
		}

		return result;
	}
	;


/**
 * @summary     将当前页面替换到目标页面
 * @override
 * @method
 * @memberOf    url
 * @param       {String|Url}        href
 * @param       {Object|Boolean}    [params={}]
 * @param       {Boolean}           [isNeedRefresh=false]
 * @return      {Promise}
 * @desc        按如下优先级：
 *              1.自定义的协议头
 *              2.app 下有该路径原生页面
 *              3.web 下 router 里有注册模块
 *              4.页面跳转
 *
 * */
url.replacePage = function(href, params={}, isNeedRefresh=false){
	return assignPage('replace', href, params, isNeedRefresh);
};
/**
 * @summary     将当前页面切换到目标页面
 * @override
 * @method
 * @memberOf    url
 * @param       {String|Url}        href
 * @param       {Object|Boolean}    [params={}]             当为 Boolean 类型数据时，视为 isNeedRefresh 参数，自身赋值为 {}
 * @param       {Boolean}           [isNeedRefresh=false]
 * @return      {Promise}
 * @desc        按如下优先级：
 *              1.自定义的协议头
 *              2.app 下有该路径原生生页面
 *              3.web 下 router 里有注册模块
 *              4.页面跳转
 * */
url.changePage = function(href, params={}, isNeedRefresh=false){
	return assignPage('change', href, params, isNeedRefresh);
};