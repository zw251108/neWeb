'use strict';

var error = require('../error.js')

	, BlogError = function(msg){
		this.type = '[Blog Error]';
		this.message = msg;
	}
	;

BlogError.prototype = new Error();

error.register('BlogError', '博客模块 错误');

module.exports = BlogError;