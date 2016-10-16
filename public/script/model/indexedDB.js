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

		var indexedDB = window.indexedDB || window.mozIndexedDB || window.webbkitIndexedDB || window.msIndexedDB || null
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
					keyPath: 'id'
				});

				store.createIndex('topic', 'topic', {
					unique: true
				});
				store.createIndex('value', 'value', {
					unique: false
				});
			}
		};

		this._db = new Promise(function(resolve, reject){
			dbRequest.onsuccess = function(e){
				resovle(e.target.result);
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
		return this._db.then(function(db){
			db.get()
		});
	}
	/**
	 * @desc    更新
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}
	 * */
	_update(key, value){

	}
	/**
	 * @desc    新建
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}
	 * */
	_insert(key, value){
		var tableName = this._config.tableName
			, store = this._db.transaction([tableName], 'readwrite').objectStore(tableName)
			;

		return new Promise(function(resolve, reject){
			var result = store.add({
				topic: key
				, value: value
			});

			result.onsuccess = function(e){
				var result = e.target.result
					;

				resolve(result);
			};
			result.onerror = function(e){
				console.log( e );
				reject(e);
			};
		});
	}
	/**
	 * @desc    删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	_delete(key){

	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * */
	setData(key, value){
		var that = this
			;

		return this._select(key).then(function(){

		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){

	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){

	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){

	}
}

IndexedDBModel._config = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
};

Model.register('indexedDB', IndexedDBModel);

export default IndexedDBModel;