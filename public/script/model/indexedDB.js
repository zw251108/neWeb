'use strict';

import Model from './model.js';

/**
 * @class   IndexedDBModel
 * */
class IndexedDBModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}   config
	 * @param   {String?}   config.dbName
	 * @param   {String?}   config.tableName
	 * @param   {Number?}   config.dbVersion
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( IndexedDBModel._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = IndexedDBModel._CONFIG[d];
			}

			return all;
		}, {});

		// this._store 为 Promise 类型，会在 resolve 中传入 db 实例，因为要保证数据库打开成功才可以操作
		this._store = new Promise((resolve, reject)=>{
			let indexedDB = window.indexedDB || window.mozIndexedDB || window.webbkitIndexedDB || window.msIndexedDB || null
				, dbRequest
				;

			if( indexedDB ){
				dbRequest = indexedDB.open(this._config.dbName, this._config.dbVersion);

				// DB 版本设置或升级时回调
				// createObjectStore deleteObjectStore 只能在 onupgradeneeded 事件中使用
				dbRequest.onupgradeneeded = e=>{
					let db = e.target.result
						, store
						;

					// 创建表
					if( !db.objectStoreNames.contains(this._config.tableName) ){

						// 创建存储对象
						store = db.createObjectStore(this._config.tableName, {
							keyPath: 'topic'
						});

						store.createIndex('value', 'value', {
							unique: false
						});
					}

					dbRequest.onsuccess = function(e){
						resolve(e.target.result);
					};
					dbRequest.onerror = function(e){
						console.log( e );
						reject(e);
					};
				};
			}
			else{
				reject(new Error('此数据库不支持 IndexedDB'));
			}
		});
	}
	/**
	 * @desc    查询
	 * @private
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	_select(key){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore(this._config.tableName)
					, result = objectStore.get(key)
					;

				result.onsuccess = function(e){
					let rs = e.target.result
						;

					resolve( rs && rs.value );
				};
				result.onerror = function(e){
					console.log( e );
					reject(e);
				};
			});
		});
	}
	/**
	 * @desc    新建或更新，add 接口要求数据库中不能已经有相同键的对象存在，因此统一使用 put 接口
	 * @private
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	_put(key, value){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore(this._config.tableName)
					, result = objectStore.put({
						topic: key
						, value: value
					})
					;

				result.onsuccess = function(e){
					resolve(!!e.target.result);
				};
				result.onerror = function(e){
					console.log( e );
					reject(e);
				};
			});
		});
	}
	/**
	 * @desc    删除
	 * @private
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	_delete(key){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore(this._config.tableName)
					, result = objectStore.delete(key)
					;

				result.onsuccess = function(e){
					resolve(true);
				};
				result.onerror = function(e){
					console.log( e );
					reject(e);
				};
			});
		});
	}
	/**
	 * @desc    清空
	 * @private
	 * @return  {Promise}   resolve 时传回 true
	 * */
	_clear(){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore(this._config.tableName)
					, result = objectStore.clear()
					;

				result.onsuccess = function(e){
					resolve(true);
				};
				result.onerror = function(e){
					console.log( e );
					reject(e);
				}
			});
		});
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		return this._put(key, this._stringify(value)).then((rs)=>{
			this._trigger(key, value);

			return rs;
		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		return this._select(key).then(function(value){

			value = value || '';

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
		return this._delete(key).then((rs)=>{
			this._trigger(key, null);

			return rs;
		});
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		return this._clear();
	}
}

IndexedDBModel._CONFIG = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
};

Model.register('indexedDB', IndexedDBModel);

export default IndexedDBModel;