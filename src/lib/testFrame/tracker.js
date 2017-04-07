'use strict';

// import Vue          from 'vue';
import report       from './report.js';
import scpConfig    from './scp.config.json';

/**
 * @file    开启全局 scp 监听事件
 * @desc    以 Vue 插件的形式实现
 *          将 Vue.component 重命名为 Vue._$component
 *          在注册组件事件对传入参数中的 methods 中的方法封装
 *          所有方法重命名为 _$ + 函数名
 *          所有方法添加发送 scp 操作
 * @todo    同时发送点击时的屏幕坐标、页面坐标
 * */

/**
 * 封装替换组件注册中的 methods 方法集合，将方法添加 _$ 前缀重命名
 * 原名为新定义方法
 *      将自身方法名和组件名及向上遍历父组件的组件名收集起来作为参数发送请求
 *      然后调用 _$ 前缀的同名方法
 * */
let methodsBindScp = function(methods){
	Object.keys( methods ).forEach((d)=>{
		console.log(d);
		methods['_$'+ d] = methods[d];
		methods[d] = function(){
			let componentName = [this.componentName]
				, $temp
				;

			if( !this.$children.length ){

				for($temp = this.$parent; $temp && $temp !== this.$root; $temp = $temp.$parent){

					componentName.unshift( $temp.componentName );
				}

				// todo 根据 componentName d 到 scpConfig 替换对应 C 和 D
				report('//log.test.66buy.com.cn/tgs.gif', componentName.join('-') +'.'+ d);
			}

			return methods['_$'+ d].apply(this, arguments);
		}
	});
};

/**
 * 封装替换组件注册中的 ready 方法，将原 ready 替换为 _$ready
 * ready 替换为新方法，在数据中添加 componentName，为自身组件名，为驼峰格式
 * */
let readyBindComponentName = function(def, id){
	def._$ready = def.ready || function(){};
	def.ready = function(){

		this.$set('componentName', id.replace(/(-)([a-z])/ig, function($, $1, $2){
			return $2.toUpperCase();
		}));
		
		def._$ready.apply(this, arguments);
	};
};

let tracker = {
	install(Vue){

		Vue._$component = Vue.component;

		Vue.component = function(id, def){
			let argc = arguments.length
				, temp
				;

			if( argc > 1 ){

				readyBindComponentName(def, id);

				// def._$ready = def.ready || function(){};
				// def.ready = function(){
				// 	// console.log(this, id)
				// 	this.$set('componentName', id.replace(/(-)([a-z])/ig, function($, $1, $2){
				// 		return $2.toUpperCase();
				// 	}));
				// 	                      // console.log(this.componentName)
				// 	def._$ready.apply(this, arguments);
				// };

				methodsBindScp(def.methods || {}, id);

				// 局部组件
				temp = def.components || {};
				Object.keys( temp ).forEach((d)=>{

					readyBindComponentName(temp[d], d);

					// temp[d]._$ready = temp[d].ready || function(){};
					// temp[d].ready = function(){
					// 	this.$set('componentName', d.replace(/(-)([a-z])/ig, function($, $1, $2){
					// 		return $2.toUpperCase();
					// 	}));
					//
					// 	def._$ready.apply(this, arguments);
					// };

					// temp[d]._$data = temp[d].data || function(){return {};};
					// temp[d].data = function(){
					// 	this.$set('$componentName', d);
					//
					// 	let t = temp[d]._$data.apply(this, arguments);
					//
					// 	if( t ){
					// 		return t;
					// 	}
					// };

					methodsBindScp( temp[d].methods || {} );
				});

				Vue._$component(id, def);
			}
			else if( argc === 1 ){
				return Vue._$component( id );
			}
		};

		tracker.installed = true;
	}
};

// todo 利用事件捕获机制对全局操作键盘，保存事件触发时屏幕的坐标，页面坐标
// window.addEventListener('click', function(e){
// 	let target = e.target
// 		;
//
// 	if( target.dataset && target.dataset.scp ){
// 		report('', {
// 			scp: target.dataset.scp
// 			, clientX: e.clientX
// 			, clientY: e.clientY
// 			, pageX: e.pageX
// 			, pageY: e.pageY
// 		});
// 	}
// }, true);

export default tracker;

