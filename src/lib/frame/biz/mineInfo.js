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
 * @function
 * @return  {Promise}   若用户已经登录，在 resolve 时返回用户信息，否则 reject
 * */
let mineInfo = function(){

	return cookie.getData('isLogin').then(function(value){
		let exec
			;

		if( value === 'true' ){
			exec = member.mineInfo();
		}
		else{
			exec = Promise.reject();
		}

		return exec;
	}).then(function(data){
		// 缓存个人信息
		return ls.setData('mineInfo', data).then(function(){
			return data;
		});
	}).catch(function(){
		return Promise.reject({
			msg: '尚未登录'
		});
	})
};

/**
 * @exports {Function}  mineInfo
 * @desc    执行后返回一个 Promise 对象，在 resolve 时候传入请求回来的个人信息数据，在 reject 时传入 {msg: '尚未登录'}
 * */
export default mineInfo;