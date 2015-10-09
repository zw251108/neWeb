'use strict';

var error = require('../error.js')

	, DataError = function(msg){
		this.message = '[Data Error]'+ msg;
	}
	;

DataError.prototype = new Error();

error.register('DataError', '公共数据模块 错误');

module.exports = DataError;