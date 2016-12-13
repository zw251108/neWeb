'use strict';

import Sync from './sync.js';

/**
 * @class   WebSocket
 * */
class WebSocket extends Sync{
	/**
	 * @constructor
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( WebSocket._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = WebSocket._CONFIG[d];
			}

			return all;
		});

		if( 'WebSocket' in window ){
			if( this._config.url ){
				this._conn = new Promise((resolve, reject)=>{
					let socket = new WebSocket(this._config.url, this._config.protocols);

					socket.onopen = ()=>resolve( socket );
					socket.onmessage = e=>this._receive( e );
					socket.onclose = e=>{
						console.log( e );
						reject( e );
					};
				});
			}
			else{
				this._conn = Promise.reject(new Error('缺少参数 url'));
			}
		}
		else{
			this._conn = Promise.reject(new Error('此浏览器不支持 Web Socket'));
		}
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

		this
	}

	/**
	 * @desc    发送数据
	 * @param   {Object}    data
	 * @return  {Promise}   resolve 时传回 true
	 * */
	send(data={}){
		return this._conn.then((socket)=>{
			socket.send( JSON.stringify(data) );

			return true;
		});
	}

	//
	on(){}
}

WebSocket._CONFIG = {
	url: ''
	, protocols: 'ws'
};

Sync.register('webSocket', WebSocket);
// Sync.register('ws', WebSocket); // 注册别名

export default WebSocket;