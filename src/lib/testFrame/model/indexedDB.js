'use strict';

import Model from './model.js';

/**
 * @class
 * @extends Model
 * @classdesc   对 IndexedDB 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 indexedDB，别名 idb，将可以使用工厂方法生成
 * @example
let indexedDBModel = new IndexedDBModel()
	, storage = Model.factory('indexedDB')
	, idb = Model.factory('idb')
	;
 * */
class IndexedDBModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * @param   {String}    [config.dbName]
	 * @param   {String}    [config.tableName]
	 * @param   {Number}    [config.dbVersion]
	 * @param   {String}    [config.keyPath]
	 * @param   {Object[]}  [config.index]
	 * @param   {String}    config.index[].name
	 * @param   {String}    [config.index[].keyPath]    未设置时默认使用 name
	 * @param   {Boolean}   [config.index[].unique=false]   默认值 false
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
			let indexedDB
				, dbRequest
				;

			indexedDB = self.indexedDB || self.mozIndexedDB || self.webbkitIndexedDB || self.msIndexedDB || null;

			if( indexedDB ){
				dbRequest = indexedDB.open(this._config.dbName, this._config.dbVersion);

				/**
				 * DB 版本设置或升级时回调
				 * createObjectStore deleteObjectStore 只能在 onupgradeneeded 事件中使用
				 * */
				dbRequest.onupgradeneeded = (e)=>{
					let db = e.target.result
						, store
						;

					// 创建表
					if( !db.objectStoreNames.contains(this._config.tableName) ){

						// 创建存储对象
						store = db.createObjectStore(this._config.tableName, {
							keyPath: this._config.keyPath
						});

						this._config.index.forEach((d)=>{
							store.createIndex(d.name, d.keyPath || d.name, {
								unique: d.unique || false
							});
						});
					}

					dbRequest.onsuccess = function(e){
						resolve( e.target.result );
					};
					dbRequest.onerror = function(e){
						console.log( e );
						reject( e );
					};
				};
			}
			else{
				reject( new Error('此数据库不支持 IndexedDB') );
			}
		});
	}
	/**
	 * 查询
	 * @private
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的 value
	 * */
	_select(topic){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore( this._config.tableName )
					, result = objectStore.get( topic )
					;

				result.onsuccess = function(e){
					resolve( e.target.result );
				};
				result.onerror = function(e){
					console.log( e );
					reject( e );
				};
			});
		});
	}
	/**
	 * 新建或更新，add 接口要求数据库中不能已经有相同键的对象存在，因此统一使用 put 接口
	 * @private
	 * @param   {String}    topic
	 * @param   {String}    value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	_put(topic, value){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore( this._config.tableName )
					, result = objectStore.put({
						topic: topic
						, value: value
					})
					;

				result.onsuccess = function(e){
					resolve( !!e.target.result );
				};
				result.onerror = function(e){
					console.log( e );
					reject( e );
				};
			});
		});
	}
	/**
	 * 删除
	 * @private
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	_delete(topic){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore( this._config.tableName )
					, result = objectStore.delete( topic )
					;

				result.onsuccess = function(e){
					resolve( true );
				};
				result.onerror = function(e){
					console.log( e );
					reject( e );
				};
			});
		});
	}
	/**
	 * 清空
	 * @private
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	_clear(){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				let objectStore = db.transaction([this._config.tableName], 'readwrite').objectStore( this._config.tableName )
					, result = objectStore.clear()
					;

				result.onsuccess = function(e){
					resolve( true );
				};
				result.onerror = function(e){
					console.log( e );
					reject( e );
				}
			});
		});
	}

	/**
	 * 设置数据
	 * @param   {String}    topic
	 * @param   {*}         value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(topic, value){
		return this._put(topic, this._stringify(value)).then((rs)=>{
			this._trigger(topic, value);

			return rs;
		});
	}
	/**
	 * 获取数据
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
	 * */
	getData(topic){
		return this._select( topic ).then((value)=>{

			if( value ){

				try{
					value = JSON.parse( value );
				}
				catch(e){}
			}
			else{
				value = Promise.reject( null );
			}

			return value;
		});
	}
	/**
	 * 将数据从缓存中删除
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(topic){
		return this._delete( topic ).then((rs)=>{
			this._trigger(topic, null);

			return rs;
		});
	}
	/**
	 * 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		return this._clear();
	}
}

/**
 * 默认配置
 * @const
 * @static
 * */
IndexedDBModel._CONFIG = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
	, keyPath: 'topic'
	, index: [{
		name: 'value'
		, keyPath: 'value'
		, unique: false
	}]
};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('indexedDB', IndexedDBModel);

/**
 * 注册别名
 * */
Model.registerAlias('indexedDB', 'idb');

export default IndexedDBModel;