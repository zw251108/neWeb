'use strict';

import Sync from './sync.js';

/**
 * @class   WebSocketSync
 * */
class WebSocketSync extends Sync{
	/**
	 * @constructor
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( WebSocketSync._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = WebSocketSync._CONFIG[d];
			}

			return all;
		}, {});

		this._conn = new Promise((resolve, reject)=>{
			let socket
				;

			if( 'WebSocket' in window ){
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
	 * @return  {Promise}   resolve 时传回 true
	 * */
	send(data={}){
		return this._conn.then((socket)=>{
			return socket.send( JSON.stringify(data) );
		});
	}
}

WebSocketSync._CONFIG = {
	url: ''
	, protocols: 'ws'
};

Sync.register('webSocket', WebSocketSync);
// Sync.register('ws', WebSocketSync); // 注册别名

export default WebSocketSync;