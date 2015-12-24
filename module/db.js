'use strict';

/**
 * 数据处理接口
 * */
var mysql = require('mysql')
	, Promise = require('promise')

	, config = require('../config.js')
	, error = require('./error.js')

	, db = mysql.createConnection( config.db )
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
			var type = typeof Value
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
			var type = typeof Value
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

						return r = col + ' regexp \''+ d +'\'';
					}).join(or ? ' and ' : ' or ');
				}
			}

			return ' '+ rs +' ';
		}
	}
	, order = function(col, desc){
		var type = typeof col
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

// 自定义参数格式
db.config.queryFormat = function(sql, values){
	if( !values ) return sql;

	sql = sql.replace(/\:(\w+)/g, function(txt, key){
		return  values.hasOwnProperty(key) ? this.escape( values[key] ) : txt;
	}.bind(this));

	console.log('db 执行 sql: ', sql);

	return sql;
};

/**
 * @method  handle
 * @param   {object}    query
 * @param   {string}    query.sql
 * @param   {array?}    query.data
 * @return  {object}    数据操作的 Promise 对象
 * */
db.handle = function(query){
	var sql
		, data
		;
	query = query || {};
	sql = query.sql;
	data = query.data || [];

	return new Promise(function(resolve, reject){
		if( sql ){
			db.query(sql, data, function(err, rs){
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
	}).then(function(rs){
		return rs;
	}, function(e){
		if( e instanceof DBError){
			console.log('[DBError]', e.message);
		}
		else{
			throw e;
		}
	});
};

module.exports = db;