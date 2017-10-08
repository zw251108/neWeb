'use strict';

/**
 * @file    首页
 * */

import $        from 'jquery';

import Vue      from 'vue';
import z        from 'z';

console.log($)
console.log(Vue)

import module   from '../component/module/index.vue';
import metro    from '../component/metro/index.vue';
import dialog   from '../component/dialog/index.vue';

let ls = z.model.factory('ls')
	, service = z.model.factory('s')
	, vm = new Vue({
		el: '#main'
		, data: {
			userAvatar: ''
			, nickname: ''
			, modules: []
			, sns: [{
				icon: 'renren'
				, url: '#'
			}, {
				icon: 'qq'
				, url: '#'
			}, {
				icon: 'wechat'
			}, {
				icon: 'weibo'
				, url: 'http://weibo.com/2707826454/profile'
			}, {
				icon: 'github'
				, url: 'https://github.com/zw251108'
			}]
		}
		, components: {
			zModule: module
			, zMetro: metro
			, zDialog: dialog
		}
	})
	;

service.getData('/modules').then((res)=>{
	                            console.log(res.data.modules)
	vm.modules =res.data.modules.map((d)=>{
		d.size = d.metroSize;
		
		return d;
	});
});