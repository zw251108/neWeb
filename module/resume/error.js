'use strict';

var error = require('../error.js')

	, ResumeError = function(msg){
		this.type = '[Resume Error]';
		this.message = msg;
	}
	;

ResumeError.prototype = new Error();

error.register('ResumeError', '个人简历模块 错误');

module.exports = ResumeError;