import express  from 'express';
import bodyParser   from 'body-parser';
import cookie       from 'cookie';
import cookieParser from 'cookie-parser';
import session      from 'express-session'

import cors from 'cors';
// import log4js       from 'log4js';
import Socket       from 'ws';

import CONFIG   from '../config.js';

let web = express()
	, store = new session.MemoryStore()
	;

// log4js.configure({
// 	appenders: {
// 		cheese: {
// 			type: 'file'
// 			, filename: __dirname +'/log/access.log'
// 		}
// 	}
// 	, categories: {
// 		default: {
// 			appenders: ['cheese']
// 			, level: 'info'
// 		}
// 	}
// });
//
// let logger = log4js.getLogger('normal')
// 	;
//
// logger.level = 'INFO';

// ---------- 中间件 ----------
web.use( bodyParser.json() );
web.use( bodyParser.urlencoded({
	extended: true
}) );
web.use( cookieParser() );
web.use( session({
	store
	, secret: CONFIG.SESSION_SECRET
	, key: CONFIG.COOKIE_KEY
	, resave: false
	, saveUninitialized: true
}) );
// web.use( log4js.connectLogger(logger, {
// 	format: ':method :url :remote-addr'
// }) );

web.use( cors({
	credentials: true
	, origin: true
}) );

// ---------- 静态目录 ----------
web.use('/', express.static('./build'));

web.use('/upload', express.static('./upload'));

web.use('/image/valhalla', express.static('./upload/valhalla'));

web.use('/manage', express.static('./admin/dist'));

web.use((req, res, next)=>{
	next();
});

// ---------- Server Send Event ----------
// let sse = {
// 		list: []
// 	}
// 	;
//
// web.get('/sse', (req, res)=>{
// 	res.set('Content-Type', 'text/event-stream');
//
// 	req.connection.on('end', function(){
// 		console.log('浏览器关闭或客户端断开连接');
//
// 		res.end();
// 	});
// });

let server = web.listen(CONFIG.PORT, ()=>{
		console.log('web server is listening');
	})
	;

// // ---------- Web Socket ----------
// let socketServer = new Socket.Server({
// 		server
// 	}, (e)=>{
// 		if( e ){
// 			console.log( e );
// 			return ;
// 		}
//
// 		console.log('socket server is listener');
// 	})
// 	;
//
// socketServer.on('connection', (ws, req)=>{
// 	console.log('浏览器建立连接');
//
// 	ws.req = req;
//
// 	let cookies = cookie.parse( req.headers.cookie )
// 		, sid = cookieParser.signedCookie(cookies[CONFIG.COOKIE_KEY], CONFIG.SESSION_SECRET)
// 	;
//
// 	store.get(sid, (err, ss)=>{
// 		if( err ){
// 			return ;
// 		}
//
// 		store.createSession(req, ss);
// 	});
// });
// socketServer.on('message', (message)=>{
//
// });
//
// let socket = {
// 		// installed: false
// 		// , server: null
// 		// , init(server){
// 		//
// 		// }
// 		broadcast(){
// 			socketServer.clients.forEach((client)=>{
// 				if( client.readyState === '' ){
//
// 				}
// 			});
// 		}
// 		, send(){
//
// 		}
// 	}
// 	;

export default web;

function createController(web, dir='', methodList={}, methodType={}){
	Object.entries( methodList ).forEach(([path, method])=>{
		let type = methodType[path] || 'get'
			;

		web[type](`/${dir ? `${dir}/` : ''}${path}`, (req, res)=>{
			let data
				;

			if( type === 'post' ){
				data = req.body;
			}
			else{
				data = req.query;
			}

			// todo 增加 creatorId

			method( data ).then((data)=>{
				res.send( JSON.stringify({
					code: 0
					, data
				}) );
				res.end();
			}, (e)=>{
				console.log(`${path}`, e);

				res.send({
					code: -1
					, msg: ''
				});
				res.end();
			});
		});
	});
}

export {
	createController
};

// export {
// 	sse
// 	, socket
// };

web.get('/wish', (req, res)=>{
	res.send('果园，大家都很想念你，e r p 也很想念你，seller 也很想念你，英雄联盟也很想念你，艾泽拉斯也很想念你，为了部落，啊，你是联盟，对不起，打扰了。。。');
	res.end();
});