'use strict';

/**
 * 数据处理接口
 * */
var mysql = require('mysql')
	, config = require('../../config.js')
	, db = mysql.createConnection( config.db )
	, Promise = require('promise')
	;

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
					resolve({
						result: rs
						, data: data
					});
				}
				else{
					reject( err );
				}
			});
		}
		else{
			reject( new Error('缺少 SQL 语句') );
		}
	});
};

module.exports = db;