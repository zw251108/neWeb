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
var ERROR = {};


module.exports = {
	register: function(topic, desc){
		if( !(topic in ERROR ) ){
			ERROR[topic] = desc;
			console.log('topic: ', topic, ' 错误类型注册');
		}
		else{
			console.log('ERROR topic: ', topic, ' 重复注册');
		}
	}
	, log: function(e){
		if( typeof e === 'string' ){
			console.log(e, ': ', ERROR[e]);
		}
		else{
			console.log(e.message);
		}
	}
};