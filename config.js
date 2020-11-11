export default {
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
};

export const TAG_CONTENT_TYPE = {
	blog: 1
	, document: 2
	, editor: 3
	, todo: 4
	, reader: 5
	, bookmark: 6
	, image: 7
	, book: 8
	, movie: 9
	, game: 10
};