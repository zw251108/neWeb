'use strict';

/**
 * @class
 * */
class Sync{
	/**
	 * @constructor
	 * */
	constructor(){
		this._eventList = [];
	}
	/**
	 * @desc    触发绑定的监控事件
	 * @param   {Object|String}     data
	 * */
	_trigger(data){
		setTimeout(()=>{
			this._eventList.forEach( (d)=>d(data) );
		}, 0);
	}

	/**
	 * @desc    接收数据
	 * */
	send(){}
	/**
	 * @desc    绑定监控事件
	 * @param   {Function}  callback    事件触发函数，函数将传入 data
	 * */
	on(callback){
		this._eventList.push( callback );
	}
}

/**
 * @desc    注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
 * @param   {String}    type
 * @param   {Model}     conn
 * */
Sync.register = function(type, conn){

	if( type in Sync && type in Sync._CONN_CACHE ){
		console.log('type', ' 重复注册，并已生成实例，不能覆盖');
	}
	else{
		Sync[type] = conn;
	}
};

// 缓存
Sync._CONN_CACHE = {};

/**
 * @desc    获取或生成 type 类型的 model 对象
 * @param   {String}    type
 * @param   {Boolean|Object?}   notCache    为 boolean 类型时表示是否缓存，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object?}   options
 * @return  {Sync}
 * */
Sync.factory = function(type, notCache=false, options={}){
	let conn
		;

	if( typeof notCache === 'object' ){
		options = notCache;
		notCache = false;
	}

	if( type in Sync ){
		if( !notCache && type in Sync._CONN_CACHE ){
			conn = Sync._CONN_CACHE[type];
		}
		else{
			conn = new Sync[type](options);
			Sync._CONN_CACHE[type] = conn;
		}
	}
	else{
		conn = new Sync(options);
	}

	return conn;
};

export default Sync;