'use strict';

var error   = require('../error.js')

	, BowerError = function(msg){
		this.type = '[Bower Error]';
		this.message = msg;
	}
	;

BowerError.prototype = new Error();

error.register('BowerError', '组件模块 错误');

module.exports = BowerError;