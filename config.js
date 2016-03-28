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
	}
	, docType: {
		html5: '<!DOCTYPE html>'
	}
	, baseUrl: '../'
};
module.exports = CONFIG;