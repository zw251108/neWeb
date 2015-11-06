'use strict';

var error = require('../error.js')

	, ImageError = function(msg){
		this.type = '[Image Error]';
		this.message = msg;
	}
	;

ImageError.prototype = new Error();

error.register('ImageError', '图片模块 错误');

module.exports = ImageError;