'use strict';

var error = require('../error.js')

	, TodoError = function(msg){
		this.type = '[Todo Error]';
		this.message = msg;
	}
	;

TodoError.prototype = new Error();

error.register('TodoError', '待做事项模块 错误');

module.exports = TodoError;