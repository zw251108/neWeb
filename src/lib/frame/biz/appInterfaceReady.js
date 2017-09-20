'use strict';

/**
 * @file    循环判断 APP 接口注入完成
 * */

import Model    from '../model/index.js';

let cookie = Model.factory('cookie')
	;

/**
 * @summary     检测 APP 接口注入
 * @function    appInterfaceReady
 * @memberOf    tg.biz
 * @return      {Promise}
 * */
let appInterfaceReady = function(){
	// todo 其它方案
	return cookie.getData('hybrid', 'global').then(({hybrid, global})=>{
		let exec
			;

		if( hybrid === true && global !== 'airmall' ){
			exec = new Promise((resolve)=>{
				let startTime = Date.now()
					, interval = setInterval(()=>{
						let currentTime = Date.now()
							;

						if( typeof window.app === 'function' || typeof window.app === 'object' || currentTime - startTime > 2000 ){
							clearInterval( interval );
							interval = null;

							resolve();
						}
					}, 50)
					;
			});
		}
		else{
			console.log('非 APP 环境');

			exec = Promise.resolve();
		}

		return exec;
	});
};

export default appInterfaceReady;
