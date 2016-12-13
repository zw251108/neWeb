'use strict';

import Model from './model.js';

/**
 * @class   LocalStorageModel
 * */
class LocalStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( 'localStorage' in window ){
			this._store = Promise.resolve( window.localStorage );

			!LocalStorageModel._LISTENER_ON && LocalStorageModel._listen();
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 localStorage') );
		}
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		this._setIndex( key );

		return this._store.then((store)=>{
			store.setItem(key, this._stringify(value));

			this._trigger(key, value);

			return true;
		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		this._setIndex( key );

		return this._store.then((store)=>{
			let value = store.getItem(key)
				;

			if( value === null ){
				value = '';
			}

			try{
				value = JSON.parse( value );
			}
			catch(e){}

			return value;
		});
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		this._removeIndex( key );

		return this._store.then((store)=>{
			store.removeItem(key);

			this._trigger(key, null);

			return true;
		});
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );

		return this._store.then((store)=>{
			store.clear();

			return true;
		});
	}

	/**
	 * @desc    绑定数据监视事件
	 * @param   {Function}  callback    事件触发函数，函数将传入 key,newValue 三个值
	 * */
	on(callback){
		this._eventList.push( callback );

		LocalStorageModel._EVENT_LIST.push( callback );
	}
}

// 保存的事件队列
LocalStorageModel._EVENT_LIST = [];

// 全局 localStorage
LocalStorageModel._LISTENER_ON = false;

// 全局 storage 事件监听，只执行一次，执行后将 LocalStorageModel._LISTENER_ON 设为 true
LocalStorageModel._listen = function(){
	window.addEventListener('storage', function(e){
		let key = e.key
			, newVal = e.newValue
			, oldVal = e.oldValue
			;

		if( key in LocalStorageModel._EVENT_LIST ){

			LocalStorageModel._EVENT_LIST.forEach(d=>d(key, newVal, oldVal));
		}
	});

	LocalStorageModel._LISTENER_ON = true;
};

Model.register('localStorage', LocalStorageModel);

export default LocalStorageModel;