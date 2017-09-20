'use strict';

/**
 * @file    获取我的个人信息
 * */

import model from '../model/index.js';

let cookie      = model.factory('cookie')
	, ls        = model.factory('ls')
	, member    = model.factory('member')
	;

/**
 * @summary     获取个人信息，微信下且未登录则获取微信信息
 * @function    mineInfo
 * @memberOf    biz
 * @return      {Promise}   若用户已经登录，在 resolve 时返回用户信息，否则 reject
 * @desc        执行后返回一个 Promise 对象，在 resolve 时候传入请求回来的个人信息数据，在 reject 时传入 {msg: '尚未登录'}
 * */
let mineInfo = function(){

	return cookie.getData('isLogin').then((value)=>{
		let exec
			;

		if( value === true ){
			exec = member.mineInfo();
		}
		else{
			exec = Promise.reject();
		}

		return exec;
	}).then((data)=>{
		// 缓存个人信息
		return ls.setData('mineInfo', data).then(()=>{
			return data;
		});
	}).catch(()=>{
		return Promise.reject({
			msg: '尚未登录'
		});
	});
};

export default mineInfo;