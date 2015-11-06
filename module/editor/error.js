'use strict';

var error = require('../error.js')

	, EditorError = function(msg){
		this.type = '[Editor Error]';
		this.message = msg;
	}
	;

EditorError.prototype = new Error();

error.register('EditorError', '开发模块 错误');

module.exports = EditorError;