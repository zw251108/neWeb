'use strict';

/**
 * @file    自动拉起 APP
 * */

import CONFIG       from '../config.js';
import AppPageCode  from '../../../../setting/AppPageCode.json';

import device   from 'device'
import url      from 'url';

import model    from '../model/index.js';

const APP_URL = 'tgou://m.51tiangou.com'
	;

let cookie = model.factory('cookie')
	;

/**
 * @summary     自动拉起 APP
 * @function    autoRunApp
 * @memberOf    tg.biz
 * @return      {Promise}
 * */
let autoRunApp = function(){
	cookie.getData('hybrid', 'global', 'goApp').then(({hybrid, global, goApp})=>{
		let exec
			;

		if( hybrid === true && global === 'airMall' && goApp && device.weixin ){
			exec = Promise.reject();
		}
		else{
			exec = new Promise((resolve)=>{
				let code = AppPageCode[url.pathname]
					, iframe = document.createElement('iframe', CONFIG.ceKey)
					, timestamp = +new Date()
					, name = 'iframe_'+ timestamp
					;

				window[name] = iframe;

				iframe.onload = iframe.onerror = function(){

					// 设置 cookie 保证只跳转一次 APP
					iframe.remove();

					window[name] = iframe = iframe.onload = iframe.onerror = null;

					delete window[name];

					resolve();
				};
				iframe.style.cssText = 'display:none;height:0px;width:0px;';

				// todo 添加 url 上的 params
				iframe.src = APP_URL + url.pathname + '';

				document.body.appendChild( iframe );

				cookie.setData('goApp', true);
			});
		}

		return exec;
	})
};

export default autoRunApp;