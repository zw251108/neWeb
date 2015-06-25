'use strict';

/**
 * 数据处理接口
 * */
var mysql = require('mysql')
	, config = require('../../config.js')
	, db = mysql.createConnection( config.db )
	, Promise = require('promise')
	;

db.handle = function(sql, data){
	var promise;

	if( sql ){
		promise = new Promise(function(resolve, reject){
			db.query(sql, data, function(err, rs){
				if( !err ){
					resolve(rs);
				}
				else{
					reject(err);
				}
			});
		});
	}
	else{
		promise = null;
	}

	return promise
};

module.exports = db;