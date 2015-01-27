'use strict';

/**
 * Web Socket 服务器
 * */
var sio = require('socket.io')()
	, CLIENT_LIST = {}
	, CLIENT_INDEX_LIST = []
	, db
	, bower = require('./bower.js').bower
	, eventList = {}
	;

sio.on('connection', function(socket){

	// todo 设置索引
	// todo 应该获取 session
 	var session = socket.handshake.session
		, clientIndex = session.id
	    ;
	CLIENT_LIST[clientIndex] = socket;
	CLIENT_INDEX_LIST.push( clientIndex );

	console.log('socket: session id ', clientIndex, 'connect');

	socket.on('login', function(user){  // 登录接口
        var username = user.username
            , pwd = user.password
            ;

		console.log('user username: ', username, 'login');

//        dbInterface.select('select * from user where email=\'' + username +'\'', function(rs){
//            var userData = rs[0]
//                ;
//
//            if( userData.password = pwd ){
//                delete userData.password;
//                socket.emit('login', userData);
//            }
//            else{
//                console.log('用户密码错误');
//                socket.emit('login', {error: 1});
//            }
//        }, function(){
//            console.log('数据库查询错误');
//            socket.emit('login', {error: 2});
//        });
    }).on('getData', function(query){   // 获取数据接口
		var topic = query.topic
			, receive = query.receive
			, data = []
			;

		console.log('get data topic:', topic);

		switch( topic ){
			case 'blog/detail':
				data.push( query.id );
				break;
			default:
				break;
		}

		db.query(topic, data, function(rs){
			socket.emit(receive, rs);
		}, function(){
			socket.emit(receive, {});
		});
	}).on('message', function(data){    // 即时通信接口
		console.log('user chat');
	}).on('disconnect', function(){ // 断开连接
		console.log('socket: session id ', clientIndex, 'disconnect');
	})
	// bower 接口
	.on('bower_search', function(name){
		bower.search(name, function(rs){
			socket.emit('bower_search_result', rs);
		});
	}).on('bower_install', function(){

	})
	;
});
exports.socket = {
	listen: function(){

	}
	, eventRegister: function(){}
}
exports.listen = function(webServer, database){
	db = database;
	return sio.listen( webServer );
};
exports.addEvent = function(topic, data){

};