'use strict';

var error = require('../error.js')

	, DocumentError = function(msg){
		this.message = '[Document Error]'+ msg;
	}
	;

DocumentError.prototype = new Error();

error.register('DocumentError', '文档模块 错误');

module.exports = DocumentError;