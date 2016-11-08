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
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		this._setIndex( key );

		this.localStorage.setItem(key, this._stringify(value));

		return Promise.resolve(true);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		var value = this.localStorage.getItem(key)
			;

		this._setIndex( key );

		try{
			value = JSON.parse(value);
		}
		catch(e){}

		return Promise.resolve(value);
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		this._removeIndex( key );

		this.localStorage.removeItem(key);

		return Promise.resolve(true);
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );

		this.localStorage.clear();

		return Promise.resolve(true);
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

// 全局 storage 事件监听，只执行一次，执行后将 LocalStorageModel._LISTENER_ON 设为 true
LocalStorageModel._listen = function(){
	window.addEventListener('storage', function(e){
		var key = e.key
			, newVal = e.newValue
			, oldVal = e.oldValue
			, rs = true
			;

		if( key in LocalStorageModel._EVENT_LIST ){

			rs = LocalStorageModel._EVENT_LIST[key].reduce((a, d)=>{

				return a && d(newVal, oldVal);
			}, rs);
		}

		return rs;
	});

	LocalStorageModel._LISTENER_ON = true;
};

Model.register('localStorage', LocalStorageModel);

export default LocalStorageModel;