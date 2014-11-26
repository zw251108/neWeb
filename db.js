/**
 * MySQL 数据库
 */
	// 数据库
var mysql = require('mysql')
	, conn = mysql.createConnection({
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'coding4fun'
		, dateStrings: true	// 强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
	})
	//----- 定义数据库统一接口 -----
	, dbInterface = {
		select: function(sql, data, callback, errorHandler){
			if( typeof data === 'function' ){
				errorHandler = callback;
				callback = data;
			}
			conn.query(sql, function(e, rs, field){
				if( e ){
					console.log('\n', '数据库出错：', sql, e.message);
					errorHandler && errorHandler();
				}
				else{
					callback( rs );
				}
			});
		}
		, insert: function(){}
		, update: function(){}
		, 'delete': function(){}
	}
	;

exports.dbInterface = dbInterface;