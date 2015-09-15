'use strict';

var error = require('../error.js')

	, BlogError = function(msg){
		this.message = '[Blog Error]'+ msg;
	}
	;

BlogError.prototype = new Error();

error.register('BlogError', '博客模块 错误');

module.exports = BlogError;