import maple from 'cyan-maple';

import mgcc, {App} from '../mgcc';

import {midway} from './api';

import componentTree from './components/componentTree/index.vue';

import topHeader from './view/topHeader/index.vue';
import sideMenu  from './view/sideMenu/index.vue';

import beNew  from './view/be/new.vue';
import beCode from './view/be/code.vue';

import blogEdit from './view/blog/edit.vue';

import documentEdit  from './view/document/edit.vue';
import documentSort from './view/document/sort.vue';

import picUpload from './view/pic/upload.vue';

import newsEdit from './view/news/edit.vue';

import menuList from './menu.json';

let app = mgcc.initApp( App )
	, vm
	, router = mgcc.initRouter({
		mode: 'hash'
		, routers: [{
			path: '/'
		}]
		, fallback(url){
			let currentActive = url.path.slice(1)
				;

			if( vm.active === currentActive && vm.currentRouter === 'virtual' ){  // 当前为路由页面
				return ;
			}

			midway.pageGet({
				path: url.path
			}).then(({data={}})=>{
				let { config } = data
					;

				try{
					config = JSON.parse( config )
				}
				catch(e){
					config = {};
				}

				vm.pageConfig = config;
				vm.currentRouter = 'virtual';
				vm.active = currentActive;
			}, ()=>{
				// todo 调用老项目页面
			});
		}
	})
	, init = true
	;

mgcc.initInject(app, router);

app.component('componentTree', componentTree);

app.component('topHeader', topHeader);
app.component('sideMenu', sideMenu);

app.component('beNew', beNew);

vm = mgcc.initVm(app, '#app');

mgcc.registerRouterComponent(router, '/be/code', beCode, vm, app, true);
mgcc.registerRouterComponent(router, '/manage/blog/edit', blogEdit, vm, app, true);
mgcc.registerRouterComponent(router, '/manage/doc/edit', documentEdit, vm, app, true);
mgcc.registerRouterComponent(router, '/manage/doc/sort', documentSort, vm, app, true);
mgcc.registerRouterComponent(router, '/manage/pic/upload', picUpload, vm, app, true);
mgcc.registerRouterComponent(router, '/manage/news/edit', newsEdit, vm, app, true);

vm.headerHeight = '0';
vm.excludeComLive.push('beNew', 'beCode', 'blogEdit', 'documentEdit', 'documentSort', 'picUpload', 'newsEdit');

// 注册路由
menuList.forEach(({children})=>{
	children.forEach((item)=>{
		router.register(item.name, ()=>{
			vm.active = item.name;
			vm.currentRouter = item.component;
		});
	});
});

// 发送请求，获取菜单
midway.pageList({
	project: 'middleground'
	, size: 100
}).then(({data=[]})=>{
	data.forEach(({path, menu})=>{
		let pathList = path.slice(1).split('/')
			, currentPath
			, currentParent = {
				children: menuList
			}
			, t
			;

		while( pathList.length ){
			currentPath = pathList.shift();

			let tName = currentParent.name ? `${currentParent.name}/${currentPath}` : currentPath
				;

			if( currentParent.children ){
				t = currentParent.children.find(({name})=>{
					return name === tName;
				});

				if( !t ){
					currentParent.children.push({
						name: tName
						, component: currentPath
						, icon: 'document'
						, title: menu
					});

					t = currentParent.children[currentParent.children.length -1];
				}
			}
			else{
				currentParent.children = [{
					name: tName
					, component: currentPath
					, icon: 'document'
					, title: menu
				}];

				t = currentParent.children[0];
			}

			currentParent = t;
		}
	});

	// 生成菜单
	vm.menuList = menuList;

	router.on((e, from, to)=>{
		maple.log(`router change
from ${from.url}
to ${to.url}`);

		if( !init ){
			let fromUrl = maple.url.parseUrl( from.url )
				;

			if( !router.has(fromUrl.hash) ){
				// 路由跳转，清空 url 上的参数
				maple.url.clearParams();
			}
		}
		else{
			// 初始化 router.init() 触发第一次路由改变，不清除 url 上的参数
			init = false;
		}
	});

	// 路由初始化
	router.init();
});

window.app = app;
window.vm = vm;
window.maple = maple;
window.router = router;