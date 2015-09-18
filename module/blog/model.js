'use strict';

var db = require('../db.js')
	, error = require('../error.js')

	, TABLE_NAME = 'blog'

	, SQL = {
		blogList: 'select Id,title,datetime,tags from '+ TABLE_NAME +' where status=1 order by Id desc'
		, blogPage: 'select Id,title,datetime,tags from '+ TABLE_NAME +' ' +
			//'where status=1 ' +
			'order by Id desc limit :page,:size'
		, blogDetail: 'select Id,title,content,datetime,tags from '+ TABLE_NAME +' where Id=:id'
		, adminBlogList: 'select Id,title,datetime,tags from '+ TABLE_NAME +' order by Id desc limit :page,:size'

		, countBlog: 'select count(*) as count from '+ TABLE_NAME

		, blogAdd: 'insert into '+ TABLE_NAME +'(user_id,title,tags,content) values(:userId,:title,\'\',\'\')'
		, blogSave: 'update '+ TABLE_NAME +' set title=:title,content=:content,tags=:tags where Id=:id'
	}
	, Model = {
		getBlogList: function(page, size){
			return db.handle({
				sql: SQL.blogPage
				, data: {
					page: (page -1) * size
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
		, getAllList: function(page, size){
			return db.handle({
				sql: SQL.adminBlogList
				, data: {
					page: (page-1) * size
					, size: size
				}
			})
		}

		, getCount: function(){
			return db.handle({
				sql: SQL.countBlog
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}

		, addBlog: function(userId, title){
			return db.handle({
				sql: SQL.blogAdd
				, data: {
					userId: userId
					, title: title
				}
			})
		}
		, saveBlog: function(title, content, tags, id){
			return db.handle({
				sql: SQL.blogSave
				, data: {
					id: id
					, title: title
					, content: content
					, tags: tags
				}
			})
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