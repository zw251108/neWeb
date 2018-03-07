'use strict';

let CONFIG  = require('../../config.js')
	, web   = require('../web.js')
	, socket    = require('../socket.js')

	, counter = 0
	;

web.get('/test/sse', function(req, res){
	res.set('Content-Type', 'text/event-stream');

	let loop = setInterval(function(){
			counter++;

			res.write('data:' + JSON.stringify({
				topic: 'test'
				, data: {
					timestamp: Date.now()
					, counter: counter
				}
			}) +'\n\n' );
		}, 5000)
		;

	req.connection.on('end', function(){
		console.log('浏览器关闭或客户端断开连接');
		clearInterval( loop );

		res.end();
	});
});

socket.register({
	'/test/socket': function(socket, data){
		console.log( data );

		socket.send({
			topic: '/test/socket'
			, data
		});
	}
});