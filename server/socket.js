import WebSocket    from 'ws';
import cookie       from 'cookie';
import cookieParser from 'cookie-parser';

import CONFIG       from '../config.js';

const SESSION_LIST = {}

	, TOPIC_LIST        = {}
	, TOPIC_INDEX_LIST  = []
	;

let webSocketServer = null
	;

export default {
	listen(server, sessionStore){
		if( webSocketServer ){
			return webSocketServer;
		}

		if( arguments.length < 4 ){
			return null;
		}

		webSocketServer = new WebSocket.Server({
			server
		});

		webSocketServer.on('connection', (socket, req)=>{
			if( !(req && req.headers && req.headers.cookie) ){
				console.log(req, '异常');
				return ;
			}

			let cookies = cookie.parse( req.headers.cookie )
				, sid = cookieParser.signedCookie(cookies[CONFIG.COOKIE_KEY], CONFIG.SESSION_SECRET)
				;

			if( !(sid in SESSION_LIST) ){
				SESSION_LIST[sid] = [];
			}
			SESSION_LIST[sid].push( socket );

			sessionStore.get(sid, (err, ss)=>{
				if( err ){
					return ;
				}

				sessionStore.createSession(req, ss);
			});


			socket.req = req;

			socket._send = socket.send;
			socket.send = function(info){
				if( typeof info !== 'string' ){
					try{
						info = JSON.stringify( info );
					}
					catch(e){}
				}

				this._send( info );
			};

			socket.on('message', (message)=>{
				try{
					message = JSON.parse( message );
				}
				catch(e){
					message = {
						topic: 'message'
						, data: message
					}
				}

				let {topic, data} = message
					;

				if( topic in TOPIC_LIST ){
					TOPIC_LIST[topic](socket, data);
				}
				else{
					socket.send( JSON.stringify({
						topic: 'error'
						, msg: `${topic} 是一个未注册的主题`
					}) );
				}
			});

			socket.on('error', (e)=>{

			});
			socket.on('close', (e)=>{
				
			});
		});

		return webSocketServer;
	}
};