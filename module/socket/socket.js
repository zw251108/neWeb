'use strict';

/**
 * Web Socket 服务器
 * */
var sio = require('socket.io')()
	, error = require('../error/error.js')

	, CLIENT_LIST       = {}
	, CLIENT_INDEX_LIST = []

	, EVENT_LIST        = {}
	, EVENT_INDEX_LIST  = []
	;

sio.on('connection', function(socket){

	// todo 设置索引
	// todo 应该获取 session
 	var session = socket.handshake.session
		, clientIndex = session.id
	    , i = EVENT_INDEX_LIST.length
	    , temp
	    ;

	CLIENT_LIST[clientIndex] = socket;
	CLIENT_INDEX_LIST.push( clientIndex );

	console.log('socket: session id ', clientIndex, 'connect');

	socket.on('data', function(query){   // 获取数据接口
		var topic = query.topic
			;

		console.log('get data topic:', topic);

		// 判断事件是否存在
		if( topic in EVENT_LIST ){  // 存在
			EVENT_LIST[topic](socket, query);
		}
		else{
			error.register('E0001', topic);

			// todo 发送错误信息
			socket.emit('data', {
				error: 'E0001'
				, msg: topic + '是一个未注册的主题'
			});
		}
	}).on('message', function(data){    // 即时通信接口
		console.log('user chat');
	}).on('disconnect', function(){ // 断开连接
		console.log('socket: session id ', clientIndex, 'disconnect');
	})
//		.on('login', function(user){  // 登录接口
//        var username = user.username
//            , pwd = user.password
//            ;
//
//		console.log('user username: ', username, 'login');
//
////        dbInterface.select('select * from user where email=\'' + username +'\'', function(rs){
////            var userData = rs[0]
////                ;
////
////            if( userData.password = pwd ){
////                delete userData.password;
////                socket.emit('login', userData);
////            }
////            else{
////                console.log('用户密码错误');
////                socket.emit('login', {error: 1});
////            }
////        }, function(){
////            console.log('数据库查询错误');
////            socket.emit('login', {error: 2});
////        });
//    })
	// bower 接口
	//.on('bower_search', function(name){
	//	bower.search(name, function(rs){
	//		socket.emit('bower_search_result', rs);
	//	});
	//}).on('bower_install', function(){
	//
	//})
	;
});
//exports.socket = {
//	listen: function(){
//
//	}
//	, eventRegister: function(){}
//}
//exports.listen = function(webServer, database){
//	db = database;
//	return sio.listen( webServer );
//};
//exports.addEvent = function(topic, data){
//
//};

module.exports = {
	listen: function(webServer){
		return sio.listen( webServer );
	}
	, register: function(topic, event){
		var temp;

		if( typeof topic === 'string' ){
			if( topic in EVENT_LIST ){
				console.log('web socket: ', topic, ' 事件已存在！');
				return;
			}

			EVENT_INDEX_LIST.push( topic );
			EVENT_LIST[topic] = event;

			console.log('web socket: ', topic, ' 事件已加载！')
		}
		else if( typeof topic === 'object' ){
			event = topic;  // 当第一个参数是一个 JSON，放弃第二个参数

			for( topic in event ) if( event.hasOwnProperty(topic) ){
				if( topic in EVENT_LIST ){
					console.log('web socket: ', topic, ' 事件已存在！');
				}
				else{
					temp = event[topic];

					if( typeof temp === 'function' ){
						EVENT_INDEX_LIST.push( topic );
						EVENT_LIST[topic] = event[topic];

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
};