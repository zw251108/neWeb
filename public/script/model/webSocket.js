'use strict';

import Model from './model';

/**
 * @class   WebSocketModel
 * */
class WebSocketModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    config
	 * @param   {String}    config.url
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

		socket = new WebSocket(this._config.url, this._config.protocols);

		this._db = new Promise(function(resolve, reject){
			socket.onopen = function(socket){
				resolve( socket );
			};
			socket.onclose = function(e){
				reject(e);
			};
		});
	}
	setData(key, value){

	}
	getData(key){

	}
	clearData(){

	}
}

WebSocketModel._CONFIG = {
};

Model.register('webSocket', WebSocketModel);

export default WebSocketModel;