'use strict';

/**
 * 错误信息配置
 * */
var error = {
	E0001: 'socket 事件未注册'
	, E0002: '数据库错误'
	, E0003: ''
	, E0004: '缺少参数'
};
module.exports = function(e, msg){
	if( typeof e === 'string' ){
		console.log(e, ': ', error[e]);
		msg && console.log(msg);
	}
	else{
		console.log(e);
	}
};