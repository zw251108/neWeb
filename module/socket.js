'use strict';

/**
 * Web Socket 服务器
 * */
var socketServer = require('socket.io')()
	, error = require('./error.js')

	, SESSION_LIST          = {}

	, TOPIC_LIST        = {}
	, TOPIC_INDEX_LIST  = []
	;

socketServer.on('connection', function(socket){

	// todo 设置索引
	// todo 应该获取 session
 	var session = socket.handshake.session
		, sessionId = session.id
	    , index
	    ;

	if( sessionId in SESSION_LIST ){
		index = SESSION_LIST[sessionId].push( socket );
	}
	else{
		index = 0;
		SESSION_LIST[sessionId] = [socket];
	}

	console.log('socket: session id ', sessionId, 'connect');

	socket.on('data', function(query){   // 获取数据接口
		var topic = query.topic
			;

		console.log('get data topic:', topic);

		// 判断事件是否存在
		if( topic in TOPIC_LIST ){  // 存在
			TOPIC_LIST[topic](socket, query);
		}
		else{
			error.register('E0001', topic);

			// todo 发送错误信息
			socket.emit('data', {
				msg: topic + ' 是一个未注册的主题'
			});
		}
	}).on('message', function(data){    // 即时通信接口
		console.log('user chat');
	}).on('disconnect', function(){ // 断开连接

		SESSION_LIST[sessionId].splice(index, 1);
		console.log('socket: session id ', sessionId, 'disconnect');
	});
});

module.exports = {
	listen: function(webServer){
		return socketServer.listen( webServer );
	}
	, register: function(topic, event){
		var temp;

		if( typeof topic === 'string' ){
			if( topic in TOPIC_LIST ){
				console.log('web socket: ', topic, ' 事件已存在！');
				return;
			}

			TOPIC_INDEX_LIST.push( topic );
			TOPIC_LIST[topic] = event;

			console.log('web socket: ', topic, ' 事件已加载！')
		}
		else if( typeof topic === 'object' ){
			event = topic;  // 当第一个参数是一个 JSON，放弃第二个参数

			for( topic in event ) if( event.hasOwnProperty(topic) ){
				if( topic in TOPIC_LIST ){
					console.log('web socket: ', topic, ' 事件已存在！');
				}
				else{
					temp = event[topic];

					if( typeof temp === 'function' ){
						TOPIC_INDEX_LIST.push( topic );
						TOPIC_LIST[topic] = event[topic];

						console.log('web socket: ', topic, ' 事件已加载！');
					}
					else{
						console.log(topic, '参数错误，不是一个函数！');
					}
				}
			}
		}
		else{
			console.log('事件注册失败，参数类型不符！');
		}
	}

	, getSession: function(socket){
		return socket.handshake.session || {};
	}

	/**
	 * @method
	 * @desc    对 session 列表中每个 socket 发送数据
	 * @param   sessionList Array   session 列表
	 * @param   send        Object  发送的数据
	 * */
	, sendDataBySession: function(sessionList, send){
		var i = sessionList.length
			, m
			, temp
			, sessionId
			;

		while( i-- ){
			sessionId = sessionList[i];

			if( sessionId in SESSION_LIST ){

				temp = SESSION_LIST[sessionId];

				m = temp.length;

				while( m-- ){
					temp[m].emit('data', send);
				}
			}
			else{
				 console.log('session id '+ sessionId +' 未建立 web socket 连接');
			}
		}
	}
};