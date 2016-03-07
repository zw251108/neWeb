'use strict';

var Handler = require('../handler.js')
	, handler = new Handler()

	, TaskHandler = function(){}
	;

// 扩展接口
handler.extend({

});

TaskHandler.prototype = handler;

module.exports = TaskHandler;