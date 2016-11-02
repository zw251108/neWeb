'use strict';

import Model from './model';

/**
 * @class   LocalStorageModel
 * */
class LocalStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		this.localStorage = window.localStorage;

		!LocalStorageModel._LISTENER_ON && LocalStorageModel._listen();
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * */
	setData(key, value){
		this._setIndex( key );

		return Promise.resolve( this.localStorage.setItem(key, this._stringify(value)) );
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		var value = this.localStorage.getItem(key)
			;

		this._setIndex( key );

		try{
			value = JSON.parse(value);
		}
		catch(e){}

		return Promise.resolve( value );
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		this._removeIndex( key );

		return Promise.resolve( this.localStorage.removeItem(key) );
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );
		this.localStorage.clear();
	}

	/**
	 * @desc    绑定数据监视事件
	 * @param   {String}    key 数据键值
	 * @param   {Function}  callback    事件触发函数
	 * */
	on(key, callback){
		if( !(key in LocalStorageModel._EVENT_LIST) ){
			LocalStorageModel._EVENT_LIST[key] = [];
		}

		LocalStorageModel._EVENT_LIST[key].push( callback );
	}
}

// 保存的事件队列
LocalStorageModel._EVENT_LIST = {};

// 全局 localStorage
LocalStorageModel._LISTENER_ON = false;

// todo 全局 storage 事件监听
LocalStorageModel._listen = function(){
	window.addEventListener('storage', function(e){
		var key = e.key
			, newVal = e.newValue
			, oldVal = e.oldValue
			, rs = true
			;

		if( key in this._EVENT_LIST ){
			rs = this._EVENT_LIST[key].reduce((a, d)=>{
				return a && d(newVal, oldVal);
			}, rs);
		}

		return rs;
	});

	LocalStorageModel._LISTENER_ON = true;
};

Model.register('localStorage', LocalStorageModel);

export default LocalStorageModel;