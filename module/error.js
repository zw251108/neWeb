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

		//var type = typeof errCode
		//	, key
		//	, t
		//	;
		//if( type === 'string' ){
		//	if( errCode in ERROR ){
		//		console.log(errCode, ' 已存在，错误信息：', ERROR[errCode]);
		//	}
		//	else{
		//		ERROR[errCode] = errMsg;
		//	}
		//}
		//else if( type === 'object' ){
		//	for( key in errCode ) if( errCode.hasOwnProperty(key) ){
		//
		//		if( key in ERROR ){
		//			console.log(key, ' 已存在，错误信息：', ERROR[key]);
		//		}
		//		else{
		//			ERROR[key] = errCode[key];
		//		}
		//	}
		//}
		//else{
		//	console.log('errCode 未知的参数类型');
		//}
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