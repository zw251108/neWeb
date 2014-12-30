var DB_SERVER_HOST = 'localhost'
	, DB_SERVER_PORT = 3306
	, DB_USERNAME = 'root'
	, DB_PASSWORD = 'zw251108'
	, DB_DATABASE = 'destiny'
	, db = require('mysql').createConnection({
		host: DB_SERVER_HOST
		, port: DB_SERVER_PORT
		, user: DB_USERNAME
		, password: DB_PASSWORD
		, database: DB_DATABASE
		, dateStrings: true	// 强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
	});

db.query('select Id,content from document where content like \'%<pre class="brush:%\'', function(e, data){
	if( e ){
		console.log(e);
		return;
	}
	var i = 0
		, j = data.length
		, temp
		;
	for(; i < j; i++ ){
		temp = data[i];

		db.query('update document set content=? where Id=?', [temp.content.replace(/pre/g, 'textarea'), temp.Id], function(){
			console.log(arguments);
		});
	}
});
