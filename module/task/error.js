'use strict';

var error = require('../error.js')

	, TaskError = function(msg){
		this.type = '[Task Error]';
		this.message = msg;
	}
	;

TaskError.prototype = new Error();

error.register('TaskError', '任务模块 错误');

module.exports = TaskError;