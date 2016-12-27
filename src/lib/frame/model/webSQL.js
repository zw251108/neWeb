'use strict';

import Model from './model';

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
	 * @param   {Object?}   config.sql
	 * @param   {String?}   config.sql.create   创建表时执行的 sql 语句
	 * @param   {String?}   config.sql.select   查询时执行的 sql 语句
	 * @param   {String?}   config.sql.update   更新时执行的 sql 语句
	 * @param   {String?}   config.sql.insert   插入时执行的 sql 语句
	 * @param   {String?}   config.sql.delete   删除时执行的 sql 语句
	 * @param   {String?}   config.sql.clear    clearData 时执行的 sql 语句
	 * @desc    传入 sql 语句时，可用 {{tableName}} 来代替表名
	 * */
	constructor(config={}){
		super();

		let sql = config.sql
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

		if( sql && typeof sql === 'object' ){
			sql = Object.keys( sql ).reduce((all, d) =>{
				if( d in sql ){
					all[d] = sql[d];
				}
				else{
					all[d] = WebSQLModel._CONFIG.sql[d];
				}

				return all;
			}, {});
		}

		Object.keys( this._config.sql ).forEach((d)=>{
			this._config.sql[d] = this._replaceTableName( this._config.sql[d] );
		});

		// this._store 为 Promise 类型，会在 resolve 中传入 db 实例，因为要保证数据表存在才可以操作
		this._store = new Promise((resolve, reject)=>{
			let db
				;

			if( 'openDatabase' in self ){
				// 打开数据库，若不存在则创建
				db = openDatabase(this._config.dbName, this._config.dbVersion, this._config.dbName, this._config.dbSize);

				db.transaction((tx)=>{
					// 若没有数据表则创建
					tx.executeSql(this._config.sql.create, [], function(){
						resolve( db );
					}, function(tx, e){
						console.log( e );
						reject( e );
					});
				});
			}
			else{
				reject(new Error('此浏览器不支持 Web SQL Database'));
			}
		});
	}
	/**
	 * @desc    替换表名
	 * @param   {String}    sql
	 * @return  {String}    替换完成的 sql 语句
	 * */
	_replaceTableName(sql){
		return sql.replace('{{tableName}}', this._config.tableName);
	}
	/**
	 * @desc    查询
	 * @private
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的数组
	 * */
	_select(key){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.select, [key], function(tx, rs){
						resolve(rs.rows);
					}, function(tx, e){
						console.log( e );
						reject( e );
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
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.update, [value, key], function(tx, rs){
						resolve(!!rs.rowsAffected);
					}, function(tx, e){
						console.log( e );
						reject( e );
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
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.insert, [key, value], function(tx, rs){
						resolve(!!rs.insertId);
					}, function(tx, e){
						console.log( e );
						reject( e );
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
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.delete, [key], function(tx, rs){
						resolve( !!rs.rowsAffected );
					}, function(tx, e){
						console.log( e );
						reject( e );
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
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.clear, [], function(tx, rs){
						resolve(!!rs.rowsAffected);
					}, function(tx, e){
						console.log( e );
						reject( e );
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

		return this._select(key).then((rs)=>{
			let result;

			if( rs && rs.length ){    // key 已存在
				result = this._update(key, value);
			}
			else{
				result = this._insert(key, value);
			}

			return result;
		}).then((rs)=>{
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
		this._setIndex( key );

		return this._select(key).then((rs)=>{
			let value = ''
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

		return this._delete(key).then((rs)=>{
			this._trigger(key, null);

			return rs;
		});
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回影响行数的 boolean 值
	 * */
	clearData(){
		this._index.forEach( (d)=>this._removeIndex(d) );

		return this._clear();
	}

	/**
	 * @desc    独立执行 sql 方法
	 * @param   {String}    sql
	 * @param   {Array?}    value
	 * @return  {Promise}   resolve 时传回 sql 语句的执行结果
	 * */
	executeSql(sql, value=[]){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(sql, value, function(tx, rs){
						resolve(rs);
					}, function(e){
						console.log( e );
						reject( e );
					});
				});
			})
		});
	}
}

WebSQLModel._CONFIG = {
	dbName: 'storage'
	, tableName: 'storage'
	, dbVersion: 1
	, dbSize: 2<<20
	, sql: {
		create: 'create table if not exists `{{tableName}}`(id integer primary key autoincrement,topic text unique,value text)'
		, select: 'select * from `{{tableName}}` where topic=?'
		, update: 'update `{{tableName}}` set value=? where topic=?'
		, insert: 'insert into `{{tableName}}`(topic,value) values(?,?)'
		, delete: 'delete from `{{tableName}}` where topic=?'
		, clear: 'delete from `{{tableName}}`'
	}
};

Model.register('webSQL', WebSQLModel);

export default WebSQLModel;