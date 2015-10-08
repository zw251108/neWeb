'use strict';

var db  = require('../db.js')
	, error = require('../error.js')

	, SQL = {
		readerByPage: 'select * from reader' +
			' where `show`=1' +
			' limit :page, :size'
		, readerCount: 'select count(*) as count from reader' +
			' where `show`=1'
		, readerIsExist: 'select * from reader where xml_url like :xmlUrl'
		, readerUpdatePub: 'update reader set last_pub=:lastPub where Id=:id'

		, bookmarkByPage: 'select Id,title,url,status,tags,datetime,score from reader_bookmark order by status,Id desc limit :page,:size'
		, bookmarkCount: 'select count(*) as count from reader_bookmark'
		, bookmarkIsExist: 'select * from reader_bookmark where url like :url'
		, bookmarkAdd: 'insert into reader_bookmark(url,title,source,tags,datetime,status) select :url,:title,:source,:tags,now(),:status from dual where not exists (select * from reader_bookmark where url like :url)'
		, bookmarkUpdateRead: 'update reader_bookmark set status=2,title=:title,tags=:tags,score=score+:score where Id=:id'

		, favoriteByPage: 'select * from reader_bookmark where status=2 order by score dsc,datetime desc'
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

		, addBookmark: function(data){
			return db.handle({
				sql: SQL
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