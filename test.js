
var db = require('mysql').createConnection({
	host: 'localhost'
	, port: 3306
	, user: 'root'
	, password: 'zw251108'
	, database: 'destiny'
	, dateStrings: true
});

//db.query('select * from editor where content include_file like \'%jquery%\'')