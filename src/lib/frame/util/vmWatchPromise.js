'use strict';

/**
 * @file    对 VM 的 key 进行监控
 * */

/**
 * @summary     对 VM 的 key 进行监控，当值为期望值时 resolve
 * @function    vmWatchPromise
 * @memberOf    maple.util
 * @param       {Vue}       vm
 * @param       {String}    key         监控的数据项
 * @param       {*}         expected    期望值
 * @desc        只进行一次监控
 * */
let vmWatchPromise = (vm, key, expected)=>{
	return new Promise((resolve)=>{

		if( vm.$get(key) === expected ){
			resolve();
		}
		else{
			let unwatch = vm.$watch(key, (newVal)=>{
				if( newVal === expected ){

					unwatch();

					resolve();
				}
			}, {
				deep: true
			});
		}
	});
};

export default vmWatchPromise;