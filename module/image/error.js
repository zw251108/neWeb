'use strict';

var error = require('../error.js')

	, ImageError = function(msg){
		this.message = '[Image Error]'+ msg;
	}
	;

ImageError.prototype = new Error();

error.register('ImageError', '图片模块 错误');

module.exports = ImageError;