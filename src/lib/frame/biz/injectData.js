'use strict';

/**
 * @file    注入公共数据
 *          向 vm 添加：global, hybrid, isAirMall, isAndroid, isIos, cityId, cityName, storeId, isLogin, memberId, isWeixin, tgAppVersion 等数据
 *          未来可拓展
 * */

import device   from 'device';
import url      from 'url';
import Model    from '../model/index.js';
import {app}    from '../app/index.js';
import merge    from '../util/merge.js';

let cookie = Model.factory('c')
	;

/**
 * @param   {Vue}       vm
 * @param   {Object}    variable    全局参数
 * @return  {Promise}
 * */
let injectData = (vm, variable)=>{
	return Promise.all([    // 获取公共参数
		cookie.getData('cityId', 'cityName', 'storeId', 'isLogin', 'memberId')
		, device.weixin
		, app.getTgAppVersion()
	]).then(([{cityId, cityName, storeId, isLogin, memberId}, isWeixin, tgAppVersion])=>{
		return merge({
			cityId
			, cityName
			, storeId
			, isLogin
			, memberId
			, isWeixin
			, tgAppVersion
			, params: url.params
		}, variable);
	}).then((data)=>{
		Object.keys( data ).forEach((key)=>{
			vm.$set(key, data[key]);
		});
	});
};

export default injectData;