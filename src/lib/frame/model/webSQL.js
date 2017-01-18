'use strict';

import Model from './model';

/**
 * @class
 * @extends Model
 * @classdesc   在 Model.factory 工厂方法注册为 webSQL，别名 ws,sql，将可以使用工厂方法生成
 * @example
let webSQLModel = new WebSQLModel()
	, storage = Model.factory('webSQL')
	, ws = Model.factory('ws')
	, sql = Model.factory('sql')
	;
 * */
class WebSQLModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    [config]
	 * @param   {String}    [config.dbName]
	 * @param   {String}    [config.tableName]
	 * @param   {Number}    [config.dbVersion]
	 * @param   {Number}    [config.dbSize] 单位字节
	 * @param   {Object}    [config.sql]
	 * @param   {String}    [config.sql.create] 创建表时执行的 sql 语句
	 * @param   {String}    [config.sql.select] 查询时执行的 sql 语句
	 * @param   {String}    [config.sql.update] 更新时执行的 sql 语句
	 * @param   {String}    [config.sql.insert] 插入时执行的 sql 语句
	 * @param   {String}    [config.sql.delete] 删除时执行的 sql 语句
	 * @param   {String}    [config.sql.clear]  clearData 时执行的 sql 语句
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
	 * 替换表名
	 * @private
	 * @param   {String}    sql
	 * @return  {String}    替换完成的 sql 语句
	 * */
	_replaceTableName(sql){
		return sql.replace('{{tableName}}', this._config.tableName);
	}
	/**
	 * 查询
	 * @private
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的数组
	 * */
	_select(topic){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.select, [topic], function(tx, rs){
						resolve( rs.rows );
					}, function(tx, e){
						console.log( e );
						reject( e );
					});
				});
			});
		});
	}
	/**
	 * 更新
	 * @private
	 * @param   {String}    topic
	 * @param   {String}    value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
	 * */
	_update(topic, value){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.update, [value, topic], function(tx, rs){
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
	 * 新建
	 * @private
	 * @param   {String}    topic
	 * @param   {String}    value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回新插入行 id 的 boolean 值
	 * */
	_insert(topic, value){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.insert, [topic, value], function(tx, rs){
						resolve( !!rs.insertId );
					}, function(tx, e){
						console.log( e );
						reject( e );
					})
				});
			});
		});
	}
	/**
	 * 删除
	 * @private
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
	 * */
	_delete(topic){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.delete, [topic], function(tx, rs){
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
	 * 清空表
	 * @private
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
	 * */
	_clear(){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(this._config.sql.clear, [], function(tx, rs){
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
	 * 设置数据
	 * @param   {String}    topic
	 * @param   {*}         value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
	 * */
	setData(topic, value){
		value = this._stringify( value );

		return this._select( topic ).then((rs)=>{
			let result;

			if( rs && rs.length ){    // topic 已存在
				result = this._update(topic, value);
			}
			else{
				result = this._insert(topic, value);
			}

			return result;
		}).then((rs)=>{
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
		return this._select( topic ).then((rs)=>{
			let value = ''
				;

			if( rs && rs.length ){
				// 只返回第一条数据
				value = rs[0].value;

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
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
	 * */
	removeData(topic){
		return this._delete( topic ).then((rs)=>{
			this._trigger(topic, null);

			return rs;
		});
	}
	/**
	 * 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
	 * */
	clearData(){
		return this._clear();
	}

	/**
	 * 独立执行 sql 方法
	 * @param   {String}    sql
	 * @param   {Array}     [value]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 sql 语句的执行结果
	 * */
	executeSql(sql, value=[]){
		return this._store.then((db)=>{
			return new Promise((resolve, reject)=>{
				db.transaction((tx)=>{
					tx.executeSql(sql, value, function(tx, rs){
						resolve( rs );
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

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('webSQL', WebSQLModel);

/**
 * 注册别名
 * */
Model.registerAlias('webSQL', ['ws', 'sql']);

export default WebSQLModel;