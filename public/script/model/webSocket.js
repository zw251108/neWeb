'use strict';

import Model from './model';

/**
 * @class   WebSocketModel
 * */
class WebSocketModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    config
	 * @param   {String}    config.url  服务器地址必须
	 * @param   {String|Array?} config.protocols
	 * */
	constructor(config={}){
		super();

		var socket
			;

		this._config = Object( WebSocketModel._CONFIG ).reduce((all, d)=>{

			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = WebSocketModel._CONFIG[d];
			}

			return all;
		}, {});

		this._EVENT_LIST = {};
		this._CONN_ON = false;

		// if( this._config.url ){
		socket = new WebSocket(this._config.url, this._config.protocols);

		this._conn = new Promise((resolve, reject)=>{
				// web socket 建立连接成功
				socket.onopen = function(){

					this.CONN_ON = true;

					socket.onmessage = this._receive;

					resolve( socket );
				};
				socket.onclose = function(e){
					reject(e);
				};
			});
		// }
	}
	/**
	 *
	 * */
	_receive(){

	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * */
	setData(key, value){
		return this._conn.then((socket)=>{
			socket.send( this._stringify({
				key: value
			}) );

			return true;
		});
	}
	/**
	 * @desc    获取数据，实际与 setData 接口相同，并不会返回数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * todo ?
	 * */
	getData(key, value=''){
		return this.setData(key, value);
	}

	removeData(key){}
	clearData(){}

	/**
	 * @desc    关闭连接
	 * */
	close(){
		return this._conn.then((socket)=>{
			this._CONN_ON = false;

			socket.close();
		});
	}
	on(key, callback){

	}
}

WebSocketModel._CONFIG = {
	url: ''
	, protocols: ''
};

Model.register('webSocket', WebSocketModel);

export default WebSocketModel;