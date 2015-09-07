'use strict';

var db = require('../db.js')
	, error = require('../error.js')

	, TABLE_NAME = 'blog'

	, SQL = {
		blogList: 'select Id,title,datetime,tags from '+ TABLE_NAME +' where status=1 order by Id desc'
		, blogPage: 'select Id,title,datetime,tags from '+ TABLE_NAME +' where status=1 order by Id desc limit :page,:size'
		, blogDetail: 'select Id,title,content,datetime,tags from '+ TABLE_NAME +' where Id=:id'
	}
	, Model = {
		getBlogList: function(page, size){
			return db.handle({
				sql: SQL.blogPage
				, data: {
					page: page
					, size: size
				}
			});
		}
		, getContentById: function(id){
			return db.handle({
				sql: SQL.blogDetail
				, data: {
					id: id
				}
			});
		}
	}
	;

module.exports = Model;

//module.exports = function(param){
//	var topic = param.topic
//		;
//
//	if( topic ){
//		if( topic in SQL ){
//			db.handle({
//				sql: SQL[topic]
//			})
//		}
//	}
//};