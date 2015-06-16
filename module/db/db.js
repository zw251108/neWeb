'use strict';

/**
 * 数据处理接口
 * */
var mysql = require('mysql')
	, config = require('../../config.js')
	, db = mysql.createConnection( config.db )
	;

db.handle = function(args){

	if( args && typeof args === 'object' && args.sql ){

		if( args.data ){
			db.query(args.sql, args.data, function(e, rs){
				if( !e ){
					args.success && args.success( rs );
				}
				else{
					args.error ? args.error( e ) : console.log( e );
				}
			});
		}
		else{
			db.query(args.sql, function(e, rs){
				if( !e ){
					args.success && args.success( rs );
				}
				else{
					args.error && args.error( e );
					console.log(db, '\n', args.sql, '\n', e.message);
				}
			});
		}
	}
};

module.exports = db;