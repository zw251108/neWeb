'use strict';

var db = require('../db.js')
	, error = require('../error.js')

	, SQL = {
		blogList: 'select Id,title,datetime,tags from blog where status=1 order by Id desc'
		, blogPage: 'select Id,title,datetime,tags from blog where status=1 order by Id desc limit :page,:size'
		, blogDetail: 'select Id,title,content,datetime,tags from blog where Id=:id'
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