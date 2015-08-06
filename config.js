'use strict';

/**
 * 全局配置参数
 * */
var CONFIG = {
	web: {
		port: 9001
		, uploadDir: './public/image/'
		, cookieSecret: 'secret'
		, cookieKey: 'express.sid'
	}
	, db: {
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'destiny'
		, dateStrings: true
	}
	, docType: {
		html5: '<!DOCTYPE html>'
	}
	, baseUrl: '../'
};
module.exports = CONFIG;