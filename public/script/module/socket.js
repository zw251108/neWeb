/**
 * @module  socket
 * */
//----- web socket 模块 目前基于 socket.io -----
define(['/socket.io/socket.io.js'], function(io){
	var origin = location.origin
		, socket = io( origin )
		, EVENT_LIST = {}
		, EVENT_INDEX_LIST = []
		;

	socket.on('error', function(err){
		console.log(err)
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

		if( data.msg !== 'Done' ){
			// todo 错误
			console.log('socket error: ', data.msg);
		}

		if( topic && topic in EVENT_LIST ){
			EVENT_LIST[topic](data);
		}
		else{
			// todo 未存在主题
		}
	}).on('disconnect', function(err){  // 断开连接
		console.log('与服务器断开连接', err);
	}).on('reconnecting', function(){   // 重连中
		console.log('正在与服务器重新建立连接');
	}).on('reconnect', function(){  // 重连成功
		console.log('与服务器重新建立连接');
	}).on('reconnect_failed', function(err){    // 重连失败
		console.log('与服务器重新建立连接失败', err);
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