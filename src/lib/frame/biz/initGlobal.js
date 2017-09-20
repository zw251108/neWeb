'use strict';

/**
 * 初始化运行环境
 * */

import device   from 'device';
import Model    from '../model/index.js';

let cookie = Model.factory('c')
	;

/**
 * @summary     初始化参数
 * @function    initGlobal
 * @memberOf    biz
 * @return      {Promise}
 * */
let initGlobal = function(){
	return cookie.getData('global').catch(()=>{
		let global
			;

		if( device.alipay ){
			global = 'AlipayClient';
		}
		else if( device.weixin ){
			global = 'wechat';
		}
		else{
			global = 'webapp';
		}

		return global;
	}).then((global)=>{
		cookie.setData('global', global);

		return global;
	});
};

export default initGlobal;