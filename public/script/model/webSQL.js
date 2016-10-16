'use strict';

import Model from './model.js';

/**
 * @class   WebSQLModel
 * */
class WebSQLModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}    config
	 * @param   {String}    config.dbName
	 * @param   {String}    config.tableName
	 * @param   {Number}    config.dbVersion
	 * @param   {Number}    config.dbSize   单位字节
	 * */
	constructor(config={}){
		var that = this
			;

		super();

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
		var db = openDatabase(this._config.dbName, this._config.dbVersion, this._config.dbName, this._config.dbSize);

		this._db = new Promise(function(resolve, reject){
			db.transaction(function(tx){
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
		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('select * from '+ this._config.tableName +' where topic=?', [key], function(tx, rs){
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
	 * @desc    更新
	 * @private
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}
	 * */
	_update(key, value){
		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('update ' + this._config.tableName + ' set value=? where key=?', [value, key], function(tx, rs){
						resolve(!!rs.rowsAffected);
					}, function(tx, e){
						console.log(e);
						reject(e);
					});
				});
			});
		});
	}
	/**
	 * @desc    新建
	 * @param   {String}    key
	 * @param   {String}    value
	 * @return  {Promise}
	 * */
	_insert(key, value){
		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('insert into ' + this._config.tableName + '(topic,value) values(?,?)', [key, value], function(tx, rs){
						resolve(!!rs.insertId);
					}, function(tx, e){
						console.log(e);
						reject(e);
					})
				});
			});
		});
	}
	/**
	 * @desc    删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	_delete(key){
		var db = this._db
			;

		return new Promise(function(resolve, reject){
			db.transaction(function(tx){
				tx.executeSql('delete from '+ this._config.tableName +' where topic=?', [key], function(tx, rs){
					resolve( !!rs.rowsAffected );
				}, function(tx, e){
					console.log( e );
					reject();
				});
			});
		});
	}
	/**
	 * @desc    清空表
	 * @return  {Promise}
	 * */
	_clearTable(){
		return this._db.then(function(db){
			return new Promise(function(resolve, reject){
				db.transaction(function(tx){
					tx.executeSql('delete from ' + this._config.tableName, [], function(tx, rs){
						resolve(rs);
					}, function(tx, e){
						console.log(e);
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

			if( rs.length ){    // key 已存在
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