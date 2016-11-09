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

		this._config = Object.keys( WebSocketModel._CONFIG ).reduce((all, d)=>{

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

		if( 'WebSocket' in window ){
			if( this._config.url ){

				socket = new WebSocket(this._config.url);

				this._conn = new Promise((resolve, reject)=>{
					// web socket 建立连接成功
					socket.onopen = ()=>{
						this._CONN_ON = true;
						resolve( socket );
					};
					socket.onmessage = e=>this._receive(e);
					socket.onclose = function(e){
						console.log( e );
						reject(e);
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
	 *
	 * @return  {Promise}
	 * */
	_receive(event){
		var temp = event.data
			;

		try{
			temp = JSON.parse( temp );
		}
		catch(e){}

		if( typeof temp === 'object' ){
			this._EVENT_LIST[temp.key].reduce((a, d)=>{
				return a && d( temp );
			}, true);
		}
		else{
			this._EVENT_LIST[temp].reduce((a, d)=>{
				return a && d( temp );
			}, true);
		}
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
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
	/**
	 * @desc    删除数据，实际不做任何处理
	 * @return  {Promise}
	 * */
	removeData(key){
		return Promise.resolve(true);
	}
	/**
	 * @desc    清空数据，实际不做任何处理
	 * @return  {Promise}
	 * */
	clearData(){
		return Promise.resolve(true);
	}

	/**
	 * @desc    关闭连接
	 * @return  {Promise}
	 * */
	close(){
		return this._conn.then((socket)=>{
			this._CONN_ON = false;

			socket.close();

			return true;
		});
	}
	on(key, callback){
		if( !(key in this._EVENT_LIST) ){
			this._EVENT_LIST[key] = [];
		}

		this._EVENT_LIST[key].push(callback);
	}
}

WebSocketModel._CONFIG = {
	url: ''
	, protocols: ''
};

Model.register('webSocket', WebSocketModel);

export default WebSocketModel;