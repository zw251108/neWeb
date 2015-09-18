'use strict';

var error = require('../error.js')

	, ReaderError = function(msg){

	}
	;

ReaderError.prototype = new Error();

error.register('ReaderError', '阅读模块 错误');

module.exports = ReaderError;