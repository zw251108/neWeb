'use strict';

var error = require('../error.js')

	, ProfileError = function(msg){
		this.message = '[Profile Error]'+ msg;
	}
	;

ProfileError.prototype = new Error();

error.register('ProfileError', '个人简历模块 错误');

module.exports = ProfileError;