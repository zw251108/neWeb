'use strict';

var error = require('../error.js')

	, CodeError = function(msg){
		this.type = '[Editor Error]';
		this.message = msg;
	}
	;

CodeError.prototype = new Error();

error.register('CodeError', '开发模块 错误');

module.exports = CodeError;