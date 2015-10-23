'use strict';

var db  = require('../db.js')
	, error = require('../error.js')

	, SQL = {
		readerByPage: 'select * from reader' +
			' where `show`=1' +
			' order by last_pub desc limit :page, :size'
		, readerCount: 'select count(*) as count from reader' +
			' where `show`=1'
		, readerIsExist: 'select * from reader where xml_url like :xmlUrl'
		, readerUpdatePub: 'update reader set last_pub=:lastPub where Id=:id'
		, readerAdd: 'insert into reader(`status`,`show`,name,xml_url,html_url,tags)' +
			' select 1,1,:name,:feed,:url,:tags from dual where not exists (select * from reader where xml_url like :feed)'
		, readerSearchName: 'select * from reader' +
			' where name like :keyword' +
				' and `show`=1' +
			' order by last_pub desc limit :page, :size'
		, readerSearchNameCount: 'select count(*) as count from reader' +
			' where name like :keyword' +
				' and `show`=1'

		, bookmarkByPage: 'select Id,title,url,status,tags,datetime,score from reader_bookmark order by status,Id desc limit :page,:size'
		, bookmarkCount: 'select count(*) as count from reader_bookmark'
		, bookmarkIsExist: 'select * from reader_bookmark where url like :url'
		, bookmarkAdd: 'insert into reader_bookmark(url,title,source,tags,datetime,status) select :url,:title,:source,:tags,now(),:status from dual where not exists (select * from reader_bookmark where url like :url)'
		, bookmarkUpdateRead: 'update reader_bookmark set status=2,title=:title,tags=:tags,score=score+:score where Id=:id'
		, bookmarkSearchTitle: 'select Id,title,url,status,tags,datetime,score from reader_bookmark where title like :keyword order by status,Id desc limit :page,:size'
		, bookmarkSearchTitleCount: 'select count(*) as count from reader_bookmark where title like :keyword'

		, favoriteByPage: 'select * from reader_bookmark where status=2 order by score desc,datetime desc'
		, favoriteCount: 'select count(*) as count from reader_bookmark where status=2'

	}
	, Model = {
		getReaderByPage: function(page, size){
			return db.handle({
				sql: SQL.readerByPage
				, data: {
					page: (page -1) * size
					, size: size
				}
			});
		}
		, countReader: function(){
			return db.handle({
				sql: SQL.readerCount
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count
				}

				return count;
			});
		}
		, isExistReader: function(url){
			return db.handle({
				sql: SQL.readerIsExist
				, data: {
					xmlUrl: url
				}
			}).then(function(rs){
				var isExist = false;

				if( rs && rs.length ){
					isExist = true;
				}

				return isExist;
			});
		}
		, searchReaderByName: function(keyword, page, size){
			return db.handle({
				sql: SQL.readerSearchName
				, data: {
					keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchReaderByName: function(keyword){
			return db.handle({
				sql: SQL.readerSearchNameCount
				, data: {
					keyword: '%'+ keyword +'%'
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
		, addReader: function(data){
			return db.handle({
				sql: SQL.readerAdd
				, data: data
			});
		}
		, updateReaderPubById: function(lastPub, id){
			return db.handle({
				sql: SQL.readerUpdatePub
				, data: {
					lastPub: lastPub
					, id: id
				}
			});
		}

		, getBookmarkByPage: function(page, size){
			return db.handle({
				sql: SQL.bookmarkByPage
				, data: {
					page: (page -1) * size
					, size: size
				}
			});
		}
		, countBookmark: function(){
			return db.handle({
				sql: SQL.bookmarkCount
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}
		, isExistBookmark: function(url){
			return db.handle({
				sql: SQL.bookmarkIsExist
				, data: {
					url: url
				}
			//}).then(function(rs){
			//	var isExist = false;
			//
			//	if( rs && rs.length ){
			//		isExist = true;
			//	}
			//
			//	return isExist;
			})
		}
		, searchBookmarkByTitle: function(keyword, page, size){
			return db.handle({
				sql: SQL.bookmarkSearchTitle
				, data: {
					keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchBookmarkByTitle: function(keyword){
			return db.handle({
				sql: SQL.bookmarkSearchTitleCount
				, data: {
					keyword: '%'+ keyword +'%'
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
		, addBookmark: function(data){
			return db.handle({
				sql: SQL.bookmarkAdd
				, data: data
			});
		}
		, updateBookmarkRead: function(id, title, score, tags){
			return db.handle({
				sql: SQL.bookmarkUpdateRead
				, data: {
					id: id
					, title: title
					, score: score
					, tags: tags
				}
			});
		}

		, getFavoriteByPage: function(page, size){
			//var query = req.query || {}
			//	, page = query.page || 1
			//	, size = query.size || 20
			//	;

			return db.handle({
				sql: SQL.favoriteByPage
				, data: {
					page: (page -1) * size
					, size: size
				}
			});
		}
		, countFavorite: function(){
			return db.handle({
				sql: SQL.favoriteCount
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}
	}
	;

module.exports = Model;