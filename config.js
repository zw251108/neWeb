import CONFIG from './server_config.js';

// const CONFIG = {}
// 	;

export default Object.assign({
	PORT: '9001'
	, SSL_PORT: '9002'
	, SESSION_SECRET: 'secret'
	, COOKIE_KEY: 'express.sid'
	, UPLOAD_DIR: './upload/'
	, DB: {
		host: 'localhost'
		, port: 3306
		, database: 'destiny'
		, username: 'root'
		, password: 'zw251108'
	}
}, CONFIG);