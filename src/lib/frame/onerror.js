'use strict';

import report from 'backup/report.js';

/**
 * @file    开启全局错误监控事件，将错误信息发送到
 * 
 * */

/**
 * 
 * */
window.onerror = function(msg, url, line, col, error){
	report('', {
		msg
		, url
		, line
		, col
		, error
	});
};