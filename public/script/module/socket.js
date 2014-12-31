/**
 * @module  socket
 * */
//----- web socket 模块 目前基于 socket.io -----
define(['/socket.io/socket.io.js'], function(io){
	var socket = io('http://localhost:9001');

	socket.on('error', function(err){

		if( err === 'session not found' ){
			/**
			 * session 失效
			 *  todo
			 *  断开连接
			 *  提示用户
			 * */
			socket.disconnect();
			console.log('断开连接')
		}
	});

	return socket;
});