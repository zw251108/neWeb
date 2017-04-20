'use strict';

/**
 * @file    获取我的个人信息
 * */

import model from '../model/index.js';

let cookie = model.factory('cookie')
	, ls = model.factory('ls')
	, member = model.factory('member')
	;

// cookie.getData('isLogin').then()