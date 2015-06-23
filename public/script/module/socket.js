/**
 * @module  socket
 * */
//----- web socket 模块 目前基于 socket.io -----
define(function(require){
	var io = require('/socket.io/socket.io.js')
		, host = location.host
		, socket = io('http://'+ host)
		, EVENT_LIST = {}
		, EVENT_INDEX_LIST = []
		;

	socket.on('error', function(err){

		if( err === 'session not found' ){
			/**
			 * session 失效
			 *  todo
			 *  断开连接
			 *  提示用户
			 * */
			socket.disconnect();
			console.log('断开连接');
		}
	}).on('data', function(data){
		var topic = data.topic;

		if( 'error' in data ){
			// todo 错误
			console.log('socket error: ', data.msg);
		}

		if( topic && topic in EVENT_LIST ){
			EVENT_LIST[topic](data);
		}
		else{
			// todo 未存在主题
		}
	});

	socket.register = function(topic, event){
		var temp;
		if( typeof topic === 'string' ){
			if( topic in EVENT_LIST ){
				// todo 事件主题已存在
				return;
			}

			// 加载事件
			EVENT_LIST[topic] = event;
			EVENT_INDEX_LIST.push( topic );
		}
		else if( typeof topic === 'object' ){
			event = topic;
			for( topic in event ) if( event.hasOwnProperty(topic) ){

				if( !(topic in EVENT_LIST) && typeof EVENT_LIST[topic] !== 'function' ){
					EVENT_LIST[topic] = event[topic];
					EVENT_INDEX_LIST.push( topic );
				}
			}
		}
	};

	return socket;
});