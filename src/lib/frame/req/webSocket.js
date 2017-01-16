'use strict';

import Req from './req';

/**
 * @class
 * @extends Req
 * */
class WebSocketReq extends Req{
	/**
	 * @constructor
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( WebSocketReq._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = WebSocketReq._CONFIG[d];
			}

			return all;
		}, {});

		this._conn = new Promise((resolve, reject)=>{
			let socket
				;

			if( 'WebSocket' in self ){
				if( this._config.url ){
					socket = new WebSocket(this._config.url, this._config.protocols);

					socket.onopen = ()=>resolve( socket );
					socket.onmessage = (e)=>this._receive( e );
					socket.onclose = (e)=>{
						console.log( e );
						reject( e );
					}
				}
				else{
					reject( new Error('缺少参数 url') );
				}
			}
			else{
				reject( new Error('此浏览器不支持 Web Socket') );
			}
		});
	}
	/**
	 * @desc    接收数据
	 * @private
	 * @param   {Object}    event
	 * @return  {Promise}
	 * */
	_receive(event){
		let data = event.data
			;

		try{
			data = JSON.parse( data );
		}
		catch(e){}

		this._trigger( data );

		return Promise.resolve( true );
	}

	/**
	 * @desc    发送数据
	 * @param   {Object}    data
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	send(data={}){
		return this._conn.then((socket)=>{
			return socket.send( JSON.stringify(data) );
		});
	}
}

WebSocketReq._CONFIG = {
	url: ''
	, protocols: 'ws'
};

Req.register('webSocket', WebSocketReq);
// Req.register('ws', WebSocketReq); // 注册别名

export default WebSocketReq;