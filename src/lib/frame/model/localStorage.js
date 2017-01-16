'use strict';

import Model from './model';

/**
 * @class
 * @extends Model
 * */
class LocalStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( 'localStorage' in self ){
			this._store = Promise.resolve( self.localStorage );

			!LocalStorageModel._LISTENER_ON && LocalStorageModel._listen();
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 localStorage') );
		}
	}

	/**
	 * 设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(key, value){
		return this._store.then((store)=>{
			store.setItem(key, this._stringify(value));

			this._trigger(key, value);

			return true;
		});
	}
	/**
	 * 获取数据
	 * @param   {String}    key
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的 value
	 * */
	getData(key){
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
	 * 将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(key){
		return this._store.then((store)=>{
			store.removeItem(key);

			this._trigger(key, null);

			return true;
		});
	}
	/**
	 * 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		return this._store.then((store)=>{
			store.clear();

			return true;
		});
	}

	/**
	 * 绑定数据监视事件
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
	self.addEventListener('storage', function(e){
		let key = e.key
			, newVal = e.newValue
			, oldVal = e.oldValue
			;

		if( key in LocalStorageModel._EVENT_LIST ){

			LocalStorageModel._EVENT_LIST.forEach((d)=>d(key, newVal, oldVal));
		}
	});

	LocalStorageModel._LISTENER_ON = true;
};

Model.register('localStorage', LocalStorageModel);

export default LocalStorageModel;