import express from 'express';
import bodyParser   from 'body-parse';
import cookieParser from 'cookie-parse';
import log4js       from 'log4js';

import Socket       from 'ws';

import web      from './web.js';
import CONFIG   from '../config.js';


log4js.configure({
	appenders: {
		cheese: {
			type: 'file'
			, filename: __dirname +'/log/access.log'
		}
	}
	, categories: {
		default: {
			appenders: ['cheese']
			, level: 'info'
		}
	}
});

let logger = log4js.getLogger('normal')
	, server
	, socket
	;

logger.level = 'INFO';

// ---------- 中间件 ----------
web.use( bodyParser.json() );
web.use( bodyParser.urlencoded({
	extended: true
}) );
web.use( cookieParser() );
web.use( log4js.connectLogger(logger, {
	format: ':method :url :remote-addr'
}) )

// ---------- 静态目录 ----------
web.use('/', express.static('./build'));


web.get('/sse', (req, res)=>{
	res.set('Content-Type', 'text/event-stream');

	req.connection.on('end', function(){
		console.log('浏览器关闭或客户端断开连接');

		res.end();
	});
});


server = web.listen( CONFIG.PORT, ()=>{
	console.log('web server is listening');
} );

socket = new Socket.Server({
	server
}, ()=>{
	console.log('socket server is listener');
});

export default function(){

};