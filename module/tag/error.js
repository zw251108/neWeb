'use strict';

var error = require('../error.js')

	, TagError = function(msg){
		this.message = '[Tag Error]'+ msg;
	}
	;

TagError.prototype = new Error();

error.register('TagError', '标签模块 错误');

module.exports = TagError;