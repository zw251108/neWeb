'use strict';

/**
 * @file    开启全局错误监控事件，将错误信息发送
 * */

import model    from './model/index.js';

let log = model.factory('log')
	;

/**
 *
 * */
window.onerror = function(msg, source, line, col, e){

	// todo 发送请求
	log.setData('', {
		data: {
			msg
			, source
			, line
			, col
			, error: e.message
			, stack: e.stack
		}
	});
};