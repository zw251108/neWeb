'use strict';

import url          from 'url';
import merge        from '../util/merge.js';
import {listener}   from '../listener.js';
import view     from '../view/index.js';

/**
 * @summary     路由回调函数
 * @callback    RouterEvent
 * @param       {Object}
 * @param       {Object}    params
 * */

/**
 * @class
 * @classdesc
 * @desc        路由配置类
 * */
class Router{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		this.listener = listener(this, 'routerChange', (e, newUrl, oldUrl)=>{

		});

		this.routers = [];

		if( 'routers' in config && Array.isArray(config.routers) ){
			config.routers.forEach((route)=>{
				this.register( route );
			});
		}
	}

	// ---------- 公有方法 ----------
	/**
	 * @summary 注册路径
	 * @param   {Object|String|RegExp}  route           当 route 为 Object 类型时且不为 RegExp 视为路由配置对象
	 * @param   {String|RegExp}         route.path
	 * @param   {Function}              route.callback
	 * @param   {Array}                 [route.children]
	 * @param   {RouterEvent}           [callback]      当 route 为 String 或 RegExp 类型时有效
	 * @desc    path 以 / 开始视为根目录开始，否则以当前路径目录下，不能带参数和 hash(? #)
	 *          可以配置动态路由，参数名以 :name 的形式
	 *          解析出来的路由参数将以组合到出入 RouterEvent 函数的参数 params 中
	 *          若存在同名属性则覆盖
	 * */
	register(route, callback){
		let paramNames = []
			, pattern = null
			, path = ''
			;

		// 处理 path
		if( typeof route === 'object' && !(route instanceof RegExp) ){
			path = route.path;
			callback = route.callback;
		}
		else{
			path = route;
		}

		// 处理 pattern
		if( typeof path === 'object' && (path instanceof RegExp) ){
			pattern = path;
		}
		else if( typeof path === 'string' ){

			if( !/^\//.test(path) ){    // 当前目录下
				path = url.dir + path;  // 添加根目录
			}

			pattern = path.replace(/:([^\/]*)/g, (str, paramName)=>{
				paramNames.push( paramName );

				return '([^\\\/]+)';
			});

			pattern = new RegExp('^'+ pattern +'$');
		}

		// 添加到 routers
		if( pattern ){
			this.routers.push({
				pattern
				, paramNames
				, callback
			});
		}

		// todo 子路由
		if( typeof router === 'object' && ('children' in router) ){
			// this.children = new Router({
			// 	routers: router.children
			// });
		}
	}
	/**
	 * @summary 跳转到路径
	 * @param   {String}            path
	 * @param   {Object|Boolean}    [params={}]
	 * @desc
	 * */
	get(path, params={}){
		let tempUrl = url.parseUrl( path )
			;

		path = tempUrl.path;

		return this.routers.map((route)=>{
			let result = route.pattern.exec( path )
				, temp
				;

			if( result ){    // 存在匹配 path
				// 解析 url 中的参数
				temp = result.slice(1).reduce((all, d, i)=>{
					all[route.paramNames[i]] = d;

					return all;
				}, {});

				temp = merge(temp, params);

				try{
					// 执行路由程序
					if( 'context' in route ){   // 设置了 callback 执行上下文（即 this）
						route.callback.call(route.context, params);
					}
					else{
						route.callback( temp );
					}

					// todo ? 设置 history
					// history.pushState(null, '', tempUrl.pack());
					// this.listener.trigger(url.pack(), tempUrl.pack());
				}
				catch(e){
					console.log(path, '路由执行错误', e);
				}
			}

			return !!result;
		}).some(d=>d);
	}
	// /**
	//  * @summary 更新当前浏览器路径
	//  * @param   {String}    href
	//  * @return  {Router}    this
	//  * */
	// update(href){
	// 	history.pushState(null, '', href);
	// 	return this;
	// }
	// back(href){
	// 	let tempUrl = url.parseUrl( href )
	// 		, path = tempUrl.path
	// 		;
	//
	// 	return this;
	// }
}

let temp = {
	pushState(){}
	, replaceState(){}
	, go(){}
	, forward(){}
	, back(){}

	, assign(){}
	, replace(){}
	, reload(){}
};

let router = new Router();

url.popState.add(()=>{
	let rs = router.back( location.href )
		;
	
	if( !rs ){
		console.log('router 中不存在', location.href);
	}
});

// /**
//  * @exports router
//  * */
// export default router;

export default router;