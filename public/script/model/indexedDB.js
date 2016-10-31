'use strict';

import Model from './model.js';

/**
 * @class   IndexedDBModel
 * */
class IndexedDBModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}    config
	 * @param   {String}    config.dbName
	 * @param   {String}    config.tableName
	 * @param   {Number}    config.dbVersion
	 * */
	constructor(config={}){
		super();
		var that = this
			;

		this._config = Object.keys( IndexedDBModel._config ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = IndexedDBModel._config[d];
			}

			return all;
		}, {});

		var indexedDB = window.indexedDB || window.mozIndexedDB || window.webbkitIndexedDB || window.msIndexedDB
			, dbRequest = indexedDB.open(this._config.dbName, this._config.dbVersion)
			;

		// DB 版本设置或升级时回调
		dbRequest.onupgradeneeded = function(e){
			var db = e.target.result
				, store
				;

			// 创建表
			if( !db.objectStoreNames.contains( that._config.tableName) ){

				// 创建存储对象
				store = db.createObjectStore(that._config.tableName, {
					keyPath: 'topic'
				});

				store.createIndex('value', 'value', {
					unique: false
				});
			}
		};

		this._db = new Promise(function(resolve, reject){
			dbRequest.onsuccess = function(e){
				resolve(e.target.result);
			};
			dbRequest.onerror = function(e){
				console.log( e );
				reject(e);
			}
		});
	}
	/**
	 * @desc    查询
	 * @param   {String}    key
	 * */
	_select(key){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				var objectStore = db.transaction([that._config.tableName], 'readwrite').objectStore(that._config.tableName)
					, result = objectStore.get(key)
					;

				result.onsuccess = function(e){
					var rs = e.target.result
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
	 * @desc    新建或更新
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}
	 * */
	_put(key, value){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				var objectStore = db.transaction([that._config.tableName], 'readwrite').objectStore(that._config.tableName)
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
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	_delete(key){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				var objectStore = db.transaction([that._config.tableName], 'readwrite').objectStore(that._config.tableName)
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
	 * */
	_clear(){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				var objectStore = db.transaction([that._config.tableName], 'readwrite').objectStore(that._config.tableName)
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
	 * @return  {Promise}
	 * */
	setData(key, value){
		return this._put(key, value);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		return this._select(key);
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		return this._delete(key);
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		return this._clear();
	}
}

IndexedDBModel._config = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
};

Model.register('indexedDB', IndexedDBModel);

export default IndexedDBModel;