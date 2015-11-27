'use strict';

var error = require('../error.js')
	, UserError = function(msg){
		this.type = '[User Error]';
		this.message = msg;
	}
	;

UserError.prototype = new Error();

error.register('UserError', '用户中心 错误');

module.exports = UserError;