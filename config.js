// import CONFIG from './config.json' assert {type: 'json'};

const CONFIG = {}
	;

export default Object.assign({
	PORT: '9001'
	, SESSION_SECRET: 'secret'
	, COOKIE_KEY: 'express.sid'
	, DB: {
		host: 'localhost'
		, port: 3306
		, database: 'destiny'
		, username: 'root'
		, password: 'zw251108'
	}
}, CONFIG);