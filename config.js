'use strict';

/**
 * 全局配置参数
 * */
var CONFIG = {
	web: {
		port: 9001
		, uploadDir: './public/upload/'
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
};
module.exports = CONFIG;