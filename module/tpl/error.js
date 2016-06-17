'use strict';

var error = require('../error.js')

	, TplError = function(msg){
		this.type = '[TplError]';
		this.message = msg;
	}
	;

TplError.ptototype = new Error;

error.register('TplError', '模板模块 错误');

module.exports = TplError;