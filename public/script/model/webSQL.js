'use strict';

import Model from './model.js';

/**
 * @class   WebSQLModel
 * */
class WebSQLModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}   config
	 * @param   {String}    config.dbName
	 * @param   {String}    config.tableName
	 * @param   {Number}    config.dbVersion
	 * @param   {Number}    config.dbSize   单位字节
	 * @desc
	 * */
	constructor(config={}){
		super();

		var that = this
			, db
			;

		this._config = Object.keys( WebSQLModel._config ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = WebSQLModel._config[d];
			}

			return all;
		}, {});

		// 打开数据库，若不存在则创建
		db = openDatabase(this._config.dbName, this._config.dbVersion, this._config.dbName, this._config.dbSize);

		// this._db 为 Promise 类型，会在 this._db.then() 中传入 db 实例，因为要保证数据表存在才可以操作
		this._db = new Promise(function(resolve, reject){
			db.transaction(function(tx){
				// 若没有数据表则创建
				tx.executeSql('create table if not exists ' + that._config.tableName + '(id integer primary key autoincrement,topic varchar(255) unique,value text)', [], function(){
					resolve(db);
				}, function(tx, e){
					console.log( e );
					reject(e);
				});
			});
		});
	}
	/**
	 * @desc    查询
	 * @private
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	_select(key){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('select * from '+ that._config.tableName +' where topic=?', [key], function(tx, rs){
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
	 * @return  {Promise}
	 * */
	_update(key, value){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('update ' + that._config.tableName + ' set value=? where topic=?', [value, key], function(tx, rs){
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
	 * @return  {Promise}
	 * */
	_insert(key, value){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('insert into ' + that._config.tableName + '(topic,value) values(?,?)', [key, value], function(tx, rs){
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
	 * @return  {Promise}
	 * */
	_delete(key){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('delete from '+ that._config.tableName +' where topic=?', [key], function(tx, rs){
						resolve( !!rs.rowsAffected );
					}, function(tx, e){
						console.log( e );
						reject();
					});
				});
			});
		});
	}
	/**
	 * @desc    清空表
	 * @private
	 * @return  {Promise}
	 * */
	_clearTable(){
		var that = this
			;

		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('delete from ' + that._config.tableName, [], function(tx, rs){
						resolve(rs);
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
	 * @return  {Promise}
	 * */
	setData(key, value){
		var that = this
			;

		this._setIndex( key );

		return this._select(key).then(function(rs){
			var result;

			if( rs !== undefined ){    // key 已存在
				result = that._update(key, value);
			}
			else{
				result = that._insert(key, value);
			}

			return result;
		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		this._setIndex( key );

		return this._select(key).then(function(rs){
			var result
				;

			if( rs.length ){
				// 只返回第一条数据
				result = Promise.resolve( rs[0].value );
			}
			else{
				result = Promise.resolve('');
			}

			return result;
		});
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		this._removeIndex( key );

		return this._delete(key);
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );
		return this._clearTable();
	}
}

WebSQLModel._config = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
	, dbSize: 2 * 1024 * 1024
};

Model.register('webSQL', WebSQLModel);

export default WebSQLModel;