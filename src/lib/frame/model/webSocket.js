'use strict';

import Model from './model';

/**
 * @class   WebSocketModel
 * @desc    WebSocketModel 仅有 setData 接口为继承来的，其余继承接口都失效
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

		let socket
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

		if( 'WebSocket' in window ){
			if( this._config.url ){

				socket = new WebSocket(this._config.url, this._config.protocols);

				// this._conn 为 Promise 类型，会在 resolve 中传入 socket 实例，因为要保证建立连接成功时才可以操作
				this._conn = new Promise((resolve, reject)=>{
					// web socket 建立连接成功
					socket.onopen = ()=>resolve( socket );
					socket.onmessage = (e)=>this.receiveData( e );
					socket.onclose = (e)=>{
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
			let send = {}
				;

			send[key] = value;

			socket.send(this._stringify(send));

			return true;
		});
	}
	/**
	 * @desc    获取数据，实际不做任何处理
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		return Promise.resolve(true);
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
	 * @desc    接收数据，为服务器端推送过来的数据，将调用 on 传入的回调函数，没有返回值
	 * */
	receiveData(event){
		let data = event.data
			;

		try{
			data = JSON.parse( data );
		}
		catch(e){}

		this._eventList.forEach( (d)=>d(data) );
	}
	/**
	 * @desc    关闭连接
	 * @return  {Promise}   resolve 时传回 true
	 * */
	close(){
		return this._conn.then((socket)=>{
			socket.close();

			return true;
		});
	}
}

WebSocketModel._CONFIG = {
	url: ''
	, protocols: 'ws'
};

Model.register('webSocket', WebSocketModel);

export default WebSocketModel;