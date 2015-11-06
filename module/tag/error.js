'use strict';

var error = require('../error.js')

	, TagError = function(msg){
		this.type = '[Tag Error]';
		this.message = msg;
	}
	;

TagError.prototype = new Error();

error.register('TagError', '标签模块 错误');

module.exports = TagError;