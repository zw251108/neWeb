'use strict';

/**
 * 数据处理接口
 * */
let mysql = require('mysql')

	, config = require('../config.js')
	, error = require('./error.js')

	, pool = mysql.createPool( config.db , function(){console.log(arguments)})
	// , db = mysql.createConnection( config.db )
	// , connect = function(){
	// 	return new Promise(function(resolve, reject){
	// 		db.connect(function(e){
	// 			if( !e ){
	// 				console.log('数据库连接 id:'+ db.threadId);
	// 				resolve( db );
	// 			}
	// 			else{
	// 				console.log( e );
	// 				reject( e );
	// 			}
	// 		});
	// 	});
	// }
	, exec
	, DBError = function(msg){
		this.type = '[DB Error]';
		this.message = msg;
	}

	, DBBaseType = {
		int: []
		, string: []
		, text: []
		, boolean: []
		, datetime: []
	}
	, SQL = {
		select: 'select :column from :table :where :order :group'
		, update: 'update :table set :update :where'
		, insert: 'insert into :table:column values(:values)'
	}

	, where = {
		eq: function(col, value){

		}
		, lt: function(col, value, eq){}
		, gt: function(col, value, eq){}

		, like: function(col, value, or){
			let type = typeof Value
				, rs = ''
				;

			if( type === 'string' ){
				rs = col + ' like \'%'+ value + '%\'';
			}
			else if( type === 'object' ){
				if( Array.isArray(value) ){
					rs = value.map(function(d){
						return col + ' like \'%'+ d +'%\'';
					}).join(or ? ' and ' : ' or ');
				}
			}

			return ' '+ rs +' ';
		}
		, regexp: function(col, value, or){
			let type = typeof Value
				, rs = ''
				;

			if( type === 'string' ){
				rs = col + ' regexp \''+ value + '\'';
			}
			else if( type === 'object' ){
				if( Array.isArray(value) ){
					rs = value.map(function(d){

						if( d instanceof RegExp ){
							d = d.toString().slice(1, -1);
						}

						return rs = col + ' regexp \''+ d +'\'';
					}).join(or ? ' and ' : ' or ');
				}
			}

			return ' '+ rs +' ';
		}
	}
	, order = function(col, desc){
		let type = typeof col
			, rs = ''
			;

		if( type === 'string' ){
			rs = col + (desc ? ' desc' : '')
		}
		else if( type === 'object' ){
			if( Array.isArray(col) ){
				rs = col.map(function(d){
					return d.col + (d.desc ? ' desc' : '');
				}).join();
			}
		}
		return ' order by '+ rs +' ';
	}
	, sql = ['select', {
		table: ['editor', 'image']
		, column: {
			editor: [{

			}]
		}
		, where: [{
			'editor.preview': ['eq', 'image.url']
			, '': ''
		}]
	}]
	;

DBError.prototype = new Error();

error.register('DBError', '数据库错误');

// todo 改成 pool
// // 数据库建立连接操作
// exec = connect().then(function(db){
// 	return db;
// }, function(e){
// 	console.log( e );
//
// 	return exec = connect();
// });
exec = function(){
	return new Promise(function(resolve, reject){
		pool.getConnection(function(err, connection){
			if( !err ){
				resolve( connection );
			}
			else{
				console.log( err );
				reject( err );
			}
		});
	});
};

pool.on('connection', function(connection){
	console.log('pool 新建立一个连接：'+ connection.threadId);
});
// pool.on('disconnection', function(connection){
// 	console.log('')
// });
pool.on('enqueue', function(){
	console.log('等待可用连接');
});
// pool.on('error', function(e){
// 	console.log(111);
// 	console.log( e );
//
// 	// exec = connect();
// });

// // 自定义参数格式
// pool.config.queryFormat = function(sql, values){
// 	if( !values ) return sql;
//
// 	sql = sql.replace(/\:(\w+)/g, function(txt, key){
// 		return  values.hasOwnProperty(key) ? this.escape( values[key] ) : txt;
// 	}.bind(this));
//
// 	console.log('db 执行 sql: ', sql);
//
// 	return sql;
// };

exec().then(function(db){
	db.release();
	console.log('连接池建立成功');
}, function(e){
	console.log( e );
});

module.exports = {
	/**
	 * @method  handle
	 * @param   {Object}    query
	 * @param   {String}    query.sql
	 * @param   {Array}     [query.data]
	 * @return  {Object}    数据操作的 Promise 对象
	 * */
	handle: function(query){
		let sql
			, data
			;
		query = query || {};
		sql = query.sql;
		data = query.data || [];

		return exec().then(function(db){
			let rs = new Promise(function(resolve, reject){
				if( sql ){
					db.query(sql, data, function(err, rs){
						db.release();   // 释放连接
						console.log('pool 释放连接 '+ db.threadId);

						if( !err ){
							resolve( rs );
						}
						else{
							reject( err );
						}
					});
				}
				else{
					reject( new DBError('缺少 SQL 语句') );
				}
			});

			return rs.then(function(rs){
				return rs;
			}, function(e){
				console.log( e );

				return [];
			});
		}, function(e){ // 数据库连接失败
			console.log('数据库连接失败', e.code, e.fatal);
		});
	}
};