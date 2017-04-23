'use strict';

/**
 * @file    首页
 * */

import Vue from 'vue';
import z from '../lib/frame/index.js';

import '../component/index.js';

let ls = z.model.factory('ls')
	// , cookie = z.model.factory('c')
	, service = z.model.factory('s')
	, vm = new Vue({
		el: '#app'
	})
	;

service.getData('/index').then(function(data){
	vm.$set('moduleList', data.data);
});