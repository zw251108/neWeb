'use strict';

/**
 * @file    获取我的个人信息
 * */

import model from '../model/index.js';

let cookie = model.factory('cookie')
	, ls = model.factory('ls')
	, member = model.factory('member')
	, mineInfo = cookie.getData('isLogin').then(function(value){
		let rs
			;

		if( value === 'true' ){
			rs = member.mineInfo();
		}
		else{
			rs = Promise.reject();
		}

		return rs;
	}).catch(function(){
		return Promise.reject({
			msg: '尚未登录'
		});
	})
	;

/**
 * @exports {Promise}   在 resolve 时候传入请求回来的个人信息数据，在 reject 时传入 {msg: '尚未登录'}
 * */
export default mineInfo;