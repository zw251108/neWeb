'use strict';

var CONFIG = require('../../config.js')
	, db = require('../db.js')

	, TABLE_NAME = CONFIG.db.dataTablePrefix +'blog'

	// todo 表结构
	, Table = {
		name: 'article'
		, column: {
			title: {
				type: 'varchar'
				, size: 255
				, isRequired: true
			}
		}
	}

	, SQL = {
		blogByPage: 'select id,title,datetime,tags from '+ TABLE_NAME +
			' where' +
				' user_id=:userId' +
			' order by id desc' +
			' limit :page,:size'
		, countBlog: 'select count(*) as count from '+ TABLE_NAME +
			' where' +
				' user_id=:userId'

		, blogSearchTitle: 'select id,title,datetime,tags from '+ TABLE_NAME +
			' where' +
				' user_id=:userId' +
			' and' +
				' title like :keyword' +
			' order by id desc' +
			' limit :page,:size'
		, blogSearchTitleCount: 'select count(*) as count from '+ TABLE_NAME +
			' where' +
				' user_id=:user_id' +
			' and' +
				' title like :keyword'
		, blogFilterTags: 'select id,title,datetime,tags from '+ TABLE_NAME +
			' where' +
				' user_id=:userId' +
			' and' +
				' tags regexp :tags' +
			' order by id desc' +
			' limit :page,:size'
		, blogFilterTagsCount: 'select count(*) as count from '+ TABLE_NAME +
		' where' +
		' user_id=:user_id' +
		' and' +
		' tags regexp :tags'

		, blogById: 'select id,title,content,datetime,tags from '+ TABLE_NAME +'' +
		' where' +
		' id=:id'

		//, adminBlogByPage: 'select id,title,datetime,tags from '+ TABLE_NAME +' order by Id desc limit :page,:size'

		, blogAdd: 'insert into '+ TABLE_NAME +'(user_id,title,tags,content) values(:userId,:title,\'\',\'\')'
		, blogSave: 'update '+ TABLE_NAME +' set title=:title,content=:content,tags=:tags where id=:id'
	}

	, BlogModel = {
		getBlogByPage: function(userId, page, size){
			return db.handle({
				sql: SQL.blogByPage
				, data: {
					page: (page -1) * size
					, size: size
					, userId: userId
				}
			});
		}
		, countBlog: function(userId){
			return db.handle({
				sql: SQL.countBlog
				, data: {
					userId: userId
				}
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}

		, searchBlogByTitle: function(userId, keyword, page, size){
			return db.handle({
				sql: SQL.blogSearchTitle
				, data: {
					userId: userId
					, keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchBlogByTitle: function(userId, keyword){
			return db.handle({
				sql: SQL.blogSearchTitleCount
				, data: {
					userId: userId
					, keyword: '%'+ keyword +'%'
				}
			}).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = +rs[0].count;
				}
				else{
					result = 0
				}

				return result;
			});
		}

		, filterBlogByTags: function(userId, tags, page, size){
			return db.handle({
				sql: SQL.blogFilterTags.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				, data: {
					userId: userId
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countFilterBlogByTags: function(userId, tags){
			return db.handle({
				sql: SQL.blogFilterTagsCount.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				, data: {
					userId: userId
				}
			}).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = +rs[0].count;
				}
				else{
					result = 0;
				}

				return result;
			});
		}

		, getBlogById: function(id){
			return db.handle({
				sql: SQL.blogById
				, data: {
					id: id
				}
			});
		}

		, addBlog: function(userId, title){
			return db.handle({
				sql: SQL.blogAdd
				, data: {
					userId: userId
					, title: title
				}
			});
		}

		, updateBlog: function(title, content, tags, id){
			return db.handle({
				sql: SQL.blogSave
				, data: {
					id: id
					, title: title
					, content: content
					, tags: tags
				}
			});
		}
	}
	;

module.exports = BlogModel;