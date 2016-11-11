'use strict';

import Model from './model.js';

/**
 * @class   WebSQLModel
 * */
class WebSQLModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}   config
	 * @param   {String?}   config.dbName
	 * @param   {String?}   config.tableName
	 * @param   {Number?}   config.dbVersion
	 * @param   {Number?}   config.dbSize   单位字节
	 * @desc
	 * */
	constructor(config={}){
		super();

		var db
			;

		this._config = Object.keys( WebSQLModel._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = WebSQLModel._CONFIG[d];
			}

			return all;
		}, {});

		if( 'openDatabase' in window ){
			// 打开数据库，若不存在则创建
			db = openDatabase(this._config.dbName, this._config.dbVersion, this._config.dbName, this._config.dbSize);

			// this._store 为 Promise 类型，会在 resolve 中传入 db 实例，因为要保证数据表存在才可以操作
			this._store = new Promise((resolve, reject)=>{
				db.transaction(tx=>{
					// 若没有数据表则创建
					tx.executeSql('create table if not exists ' + this._config.tableName + '(id integer primary key autoincrement,topic varchar(255) unique,value text)', [], function(){
						resolve(db);
					}, function(tx, e){
						console.log( e );
						reject(e);
					});
				});
			});
		}
		else{
			this._store = Promise.reject(new Error('此浏览器不支持 Web SQL Database'));
		}
	}
	/**
	 * @desc    查询
	 * @private
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的数组
	 * */
	_select(key){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				db.transaction(tx=>{
					tx.executeSql('select * from '+ this._config.tableName +' where topic=?', [key], function(tx, rs){
						resolve(rs.rows);
					}, function(tx, e){
						console.log( e );
						reject(e);
					});
				});
			});
		});
	}
	/**
	 * @desc    更新
	 * @private
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	_update(key, value){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				db.transaction(tx=>{
					tx.executeSql('update ' + this._config.tableName + ' set value=? where topic=?', [value, key], function(tx, rs){
						resolve(!!rs.rowsAffected);
					}, function(tx, e){
						console.log( e );
						reject(e);
					});
				});
			});
		});
	}
	/**
	 * @desc    新建
	 * @private
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}   resolve 时传回新插入行 id 的 boolean 值
	 * */
	_insert(key, value){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				db.transaction(tx=>{
					tx.executeSql('insert into ' + this._config.tableName + '(topic,value) values(?,?)', [key, value], function(tx, rs){
						resolve(!!rs.insertId);
					}, function(tx, e){
						console.log( e );
						reject(e);
					})
				});
			});
		});
	}
	/**
	 * @desc    删除
	 * @private
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	_delete(key){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				db.transaction(tx=>{
					tx.executeSql('delete from '+ this._config.tableName +' where topic=?', [key], function(tx, rs){
						resolve( !!rs.rowsAffected );
					}, function(tx, e){
						console.log( e );
						reject(e);
					});
				});
			});
		});
	}
	/**
	 * @desc    清空表
	 * @private
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	_clear(){
		return this._store.then(db=>{
			return new Promise((resolve, reject)=>{
				db.transaction(tx=>{
					tx.executeSql('delete from ' + this._config.tableName, [], function(tx, rs){
						resolve(!!rs.rowsAffected);
					}, function(tx, e){
						console.log( e );
						reject(e);
					});
				});
			});
		});
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	setData(key, value){
		this._setIndex( key );

		value = this._stringify(value);

		return this._select(key).then(rs=>{
			var result;

			if( rs && rs.length ){    // key 已存在
				result = this._update(key, value);
			}
			else{
				result = this._insert(key, value);
			}

			return result;
		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		this._setIndex( key );

		return this._select(key).then(function(rs){
			var value = ''
				;

			if( rs && rs.length ){
				// 只返回第一条数据
				value = rs[0].value;
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
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	removeData(key){
		this._removeIndex( key );

		return this._delete(key);
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );

		return this._clear();
	}
}

WebSQLModel._CONFIG = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
	, dbSize: 2 * 1024 * 1024
};

Model.register('webSQL', WebSQLModel);

export default WebSQLModel;