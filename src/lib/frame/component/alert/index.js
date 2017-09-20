'use strict';

/**
 * @file    alert 组件
 * @todo
 * */

import Vue      from 'vue';
import options  from './index.vue';

import merge    from '../../util/merge.js';

Vue.component('tg-alert', options);

const defaults = {
		showClose: false
		, title: ''
		, content: ''
		, theme: ''
		, okText: '确定'
	}
	;

let currentVM = null
	, alert = (options)=>{
		options = merge(options, defaults);

		if( currentVM ){
			currentVM.$destroy( true );
		}

		currentVM = new Vue({
			// el:
		});
	}
	;

export default alert;