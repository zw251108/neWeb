'use strict';

/**
 * MySQL 数据库
 * */
var
	SQL = {
		blog: {
			sql: 'select Id,title,datetime,tags_id,tags_name from blog where status=1 order by Id desc'
			, detail: {
				sql: 'select Id,content from blog where Id=?'
				, handler: function(rs){
					return rs[0];
				}
			}
		}
		, document: {
			sql: 'select title,content,section_title from document order by section_id,`order`'
			, handler: function(rs){
				var document = []
					, tempTitle = ''
					, tempArray
					, i, j
					;

				for(i = 0, j = rs.length; i < j; i++){
					if( rs[i].section_title !== tempTitle ){
						tempTitle = rs[i].section_title;
						tempArray = [];
						document.push({
							section_title: tempTitle
							, dl: tempArray
						});
					}

					tempArray.push( rs[i] );
				}
				return document;
			}
		}
		, editor: {
			sql: 'select editor.Id,editor.name,preview,tags_id,tags_name,width,height ' +
				'from editor,image where editor.preview=image.src order by editor.Id'
			, code: {
				sql: 'select Id,name,tags_id,tags_name,include_file,html,css,js from editor where Id=?'
				, handler: function(rs){
					return rs[0];
				}
			}
		}
		, talk: {
			sql: 'select Id,title as content, \'blog\' as type, datetime from blog ' +
				'union all ' +
				'select Id,content, \'message\' as type,datetime from message'
		}
		, tag: {
			sql: 'select Id,name from tag'
		}
	}
	,
	mysql = require('mysql')
	, conn = mysql.createConnection({
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'destiny'
		, dateStrings: true	// 强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
	})
	//----- 定义数据库统一接口 -----
	, db = {
		query: function(topic, data, callback, errorHandler){
			var i, j, temp;

			temp = topic.split('/');
			topic = SQL;
			for(i = 0, j = temp.length; i < j; i++){
				topic = topic[temp[i]];
			}

			conn.query(topic.sql, data, function(e, rs, field){
				if( e ){
					console.log('\n', '数据库出错：', topic.sql, e.message);
					errorHandler && errorHandler();
				}
				else{
					topic.handler && ( rs = topic.handler(rs) );

					callback( rs );
				}
			})
		}
	}
	;

exports.db = db;