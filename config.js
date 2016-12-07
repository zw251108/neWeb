'use strict';

/**
 * 全局配置参数
 * */
var CONFIG = {
	web: {
		//ip: '127.0.0.1'
		//,
		port: 9001
		, uploadDir: './public/image/'
		, cookieSecret: 'secret'
		, cookieKey: 'express.sid'
	}
	, db: {
		host: '127.0.0.1'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'destiny'
		, dateStrings: true
		, dataTablePrefix: ''
		, queryFormat: function(sql, values){
			if( !values ) return sql;

			sql = sql.replace(/\:(\w+)/g, function(txt, key){
				return  values.hasOwnProperty(key) ? this.escape( values[key] ) : txt;
			}.bind(this));

			console.log('db 执行 sql: ', sql);

			return sql;
		}
	}
	, docType: {
		html5: '<!DOCTYPE html>'
	}
	, baseUrl: '../'

	, params: {
		PAGE_SIZE: 20
		, COUNTRY_DEFAULT_CODE: 1
		, DOCUMENT_DEFAULT_ID: 1
	}
	, modules: [
		'user'
		, 'blog'
		, 'document'
		, 'code'
		, 'bower'
		, 'reader'
		, 'task'
		, 'tag'
		//, 'image'
		, 'basedata'
	]
	, works: []
};

module.exports = CONFIG;