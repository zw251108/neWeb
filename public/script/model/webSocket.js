'use strict';

import Model from './model.js';

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

		this._EVENT_LIST = [];

		if( 'WebSocket' in window ){
			if( this._config.url ){

				socket = new WebSocket( this._config.url );

				// this._conn 为 Promise 类型，会在 resolve 中传入 socket 实例，因为要保证简历连接成功时才可以操作
				this._conn = new Promise((resolve, reject)=>{
					// web socket 建立连接成功
					socket.onopen = ()=>{
						resolve( socket );
					};
					socket.onmessage = e=>this.getData( e );
					socket.onclose = function(e){
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
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		return this._conn.then((socket)=>{
			socket.send(this._stringify({
				key: value
			}));

			return true;
		});
	}
	/**
	 * @desc    获取数据，为服务器端推送过来的数据，将调用 on 传入的回调函数，没有返回值
	 * @param   {Object}    event
	 * */
	getData(event){
		var data = event.data
			;

		try{
			data = JSON.parse( data );
		}
		catch(e){}

		this._EVENT_LIST.reduce((a, d)=>{
			var rs = d( data )
				;

			return a && (rs !== undefined ? rs : true);
		}, true);
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
	 * @return  {Promise}   solve 时
	 * */
	close(){
		return this._conn.then((socket)=>{
			socket.close();

			return true;
		});
	}
	/**
	 * @desc    添加监听回调函数
	 * @param   {Function}  callback
	 * */
	on(callback){
		this._EVENT_LIST.push(callback);
	}
}

WebSocketModel._CONFIG = {
	url: ''
	, protocols: 'ws'
};

Model.register('webSocket', WebSocketModel);

export default WebSocketModel;