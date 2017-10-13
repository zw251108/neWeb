'use strict';

/**
 * @file    首页
 * */

import $        from 'jquery';

import Vue      from 'vue';
import z        from 'z';

import zModule   from '../component/module/index.vue';
import zMetro    from '../component/metro/index.vue';
import zDialog   from '../component/dialog/index.vue';

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
			zModule
			, zMetro
			, zDialog
		}
	})
	;

service.getData('/modules').then((data)=>{

	vm.modules =data.modules.map((d)=>{
		d.size = d.metroSize;
		
		return d;
	});
}).catch( e=>console.log(e) );

ls.getData('user').then((user)=>{
	
}).catch( e=>console.log('用户尚未登录') );