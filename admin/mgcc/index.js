import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import maple, {ServiceModel} from 'cyan-maple';

import './customize';

import './config.js';
import domain from './runtime/domain.js';

import api, {CODE_TYPE} from './api';

import formItems from './components/formItems/index.vue';
import toolbars  from './components/toolbars/index.vue';
import icons     from './components/icons/index.vue';
import menuItem  from './components/menuItem/index.vue';

import topHeader from './view/topHeader/index.vue';
import sideMenu  from './view/sideMenu/index.vue';
import ancient   from './view/ancient/index.vue';
import virtual   from './view/virtual/index.vue';

import App from './App.vue';

import colTypeJudge, {COL_TYPE} from './mixins/colTypeJudge';
import handleInject             from './mixins/handleInject';

const
	{ auth } = api
	;

export default {
	initApp(appVue){
		return createApp( appVue );
	}
	, initRouter(opts){
		return new maple.Router( opts );
	}
	, initInject(app, router){
		// mgcc 相关（注入接口，注册组件）
		app.use({
			install(app){
				let keys = []
					;

				Object.entries( api ).forEach(([key, value])=>{
					let name = `$${key}`
						;

					keys.push( name );

					app.provide(name, value);
				});

				app.mixin({
					inject: keys
				});

				app.component('icons', icons);
				app.component('formItems', formItems);
				app.component('toolbars', toolbars);
				app.component('menuItem', menuItem);

				app.component('topHeader', topHeader);
				app.component('sideMenu', sideMenu);

				app.component('ancient', ancient);
				app.component('virtual', virtual);
			}
		});

		// maple 相关（注入工具函数，添加拦截器）
		app.use({
			install(app){
				/**
				 * 全局请求拦截器
				 * */
				// 设置请求 headers
				// ServiceModel.interceptor.req.add(({options})=>{
				// 	if( !options.headers ){
				// 		options.headers = {};
				// 	}
				//
				// 	options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				// 	// options.headers.platform = 'backErp';
				// });
				// // 处理 post 请求参数
				// ServiceModel.interceptor.req.add(({options})=>{
				// 	// 处理传参
				// 	if( options.method === 'POST' ){
				// 		// FormData 类型参数不做处理
				// 		if( options.data instanceof FormData ){
				// 			options.data.append('domain', domain.cookie);
				//
				// 			return ;
				// 		}
				// 		else{
				// 			if( !options.data ){
				// 				options.data = {};
				// 			}
				//
				// 			options.data.domain = domain.cookie;
				// 		}
				//
				// 		options.data = new URLSearchParams( options.data );
				// 	}
				// 	else{
				// 		options.data.domain = domain.cookie;
				// 	}
				// });

				/**
				 * 全局响应拦截期
				 * */
				// 处理未登录
				ServiceModel.interceptor.res.add(({res})=>{
					let { code } = res
						;

					if( code === auth.NOT_LOGIN_CODE ){
						maple.url.changePage(`${auth.LOGIN_PATH}?redirect=${encodeURIComponent(location.href)}`);

						return false;
					}
				});

				let provideTarget = {
						$listener: maple.listener
						, $model: maple.model.factory()
						, $service: maple.model.factory('s')
						, $cookie: maple.model.factory('c')
						, $ls: maple.model.factory('ls')
						, $ss: maple.model.factory('ss')
						, $idb: maple.model.factory('idb')  // indexedDB
						, $router: router
						, $url: maple.url
						, $urlParams: ()=>{
							return maple.url.params;
						}
						, $hashParams: ()=>{
							return maple.url.hashParams;
						}
						, $util: maple.util
						, $api: api
						, $domain: domain
					}
					;

				app.mixin({
					inject: Object.keys( provideTarget )
				});

				Object.entries( provideTarget ).forEach(([key, value])=>{
					app.provide(key, value);
				});


				/**
				 * 因为新页面里面有使用 replaceState 方法改变 url 的操作
				 * 造成点击浏览器的前进、后退按钮，只会触发 popstate 事件，不会触发 hashchange 事件
				 * 但当前路由使用 hash 模式，只能添加 popstate 事件，触发路由变化
				 * */
				let timer = null
					;

				maple.url.popState(()=>{
					timer = setTimeout(()=>{
						router.init();
					}, 0);
				});
				maple.url.hashChange(()=>{
					if( timer ){
						clearTimeout( timer );

						timer = null;
					}
				});
			}
		});

		// element 使用
		app.use( ElementPlus );
		// 解决 element 使用全局属性提供方法无法在 setup 模式中使用
		app.use({
			install(app){
				app.provide('$alert', app.config.globalProperties.$alert);
			}
		});
	}
	, initVm(app, selector='#app'){
		return app.mount( selector );
	}
	, registerRouterComponent(router, path, component, vm, app, isExclude){
		let name = component.name
			;

		if( app ){
			app.component(name, component)
		}

		router.register({
			path
			, callback(){
				vm.currentRouter = name;
			}
		});

		if( isExclude ){
			vm.excludeComLive.push( name );
		}
	}
};

export const components = {
	formItems
	, toolbars
	, icons
};
export const view = {
	App
	, topHeader
	, sideMenu
	, ancient
	, virtual
};
export const mixins = {
	colTypeJudge
	, handleInject
};

export {
	App
	, domain
	, api
	, COL_TYPE
	, CODE_TYPE
};