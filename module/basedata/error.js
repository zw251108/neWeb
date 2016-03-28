'use strict';

var error = require('../error.js')

	, BaseDataError = function(msg){
		this.type = '[BaseData Error]';
		this.message = msg;
	}
	;

BaseDataError.prototype = new Error();

error.register('BaseDataError', '公共数据模块 错误');

module.exports = BaseDataError;