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
		, readerUpdatePub: 'update reader set last_pub=:lastPub where id=:id'
		, readerAdd: 'insert into reader(`status`,`show`,name,xml_url,html_url,tags)' +
			' select 1,1,:name,:feed,:url,:tags from dual where not exists (select * from reader where xml_url like :feed)'
		, readerSearchName: 'select * from reader' +
			' where' +
				' `show`=1 and' +
				' name like :keyword' +
			' order by last_pub desc limit :page, :size'
		, readerSearchNameCount: 'select count(*) as count from reader' +
			' where' +
				' `show`=1 and' +
				' name like :keyword'
		, readerFilterTags: 'select * from reader' +
			' where' +
				' `show`=1 and' +
				' tags regexp :tags' +
			' order by last_pub desc limit :page, :size'
		, readerFilterTagsCount: 'select count(*) as count from reader' +
			' where' +
				' `show`=1 and' +
				' tags regexp :tags'

		, userBookmarkByPage: 'select rb.id as id,title,url,status,tags,mark_datetime as datetime' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where urb.user_id=:userId' +
				' and rb.id=urb.bookmark_id' +
			' order by status,rb.id desc' +
			' limit :page,:size'
		, userBookmarkCount: 'select count(*) as count from user_reader_bookmark where user_id=:userId'

		, bookmarkSearchTitle: 'select rb.id,title,url,status,tags,datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and title like :keyword' +
				' and rb.id=urb.bookmark_id' +
			' order by status,id desc' +
			' limit :page,:size'
		, bookmarkSearchTitleCount: 'select count(*) as count' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and title like :keyword' +
				' and rb.id=urb.bookmark_id'

		, bookmarkFilterTags: 'select rb.id,title,url,status,tags,datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and tags regexp :tags' +
				' and rb.id=urb.bookmark_id' +
			' order by status,id desc' +
			' limit :page,:size'
		, bookmarkFilterTagsCount: 'select count(*) as count' +
			' from user_reader_bookmark' +
			' where user_id=:userId' +
				' and tags regexp :tags'

		, bookmarkIsExist: 'select * from reader_bookmark where url like :url'
		, userBookmarkIsExist: 'select * from user_reader_bookmark where bookmark_id=:bookmarkId and user_id=:userId'

		, bookmarkAdd: 'insert into reader_bookmark(url,title,source,create_user_id)' +
		' select :url,:title,:source,:userId from dual' +
		' where not exists (select * from reader_bookmark where url like :url)'
		, userBookmarkAdd: 'insert into user_reader_bookmark(bookmark_id,user_id,score,tags,status)' +
		' select :bookmarkId,:userId,:score,:tags,:status from dual' +
		' where not exists (select * from user_reader_bookmark where bookmark_id=:bookmark_id and user_id=:userId)'

		, bookmarkUpdateRead: 'update reader_bookmark set status=1,title=:title,tags=:tags,total_score=total_score+:score,num_reader=num_reader+1 where id=:id'
		, userBookmarkUpdateRead: 'update user_reader_bookmark set status=1,tags=:tags,score=:score where id=:id'
		, userBookmarkUpdateInfo: 'update user_reader_bookmark set tags=:tags,score=:score where id=:id'

		, favoriteByPage: 'select rb.id as id,title,url,status,tags,mark_datetime as datetime' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and status=1' +
				' and rb.id=urb.bookmark_id' +
			' order by score desc,datetime desc' +
			' limit :page,:size'
		, favoriteCount: 'select count(*) as count' +
			' from user_reader_bookmark' +
			' where status=1'

		, favoriteSearchTitle: 'select rb.id,title,url,status,tags,datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and status=1' +
				' and title like :keyword' +
				' and rb.id=urb.bookmark_id' +
			' order by status,id desc' +
			' limit :page,:size'
		, favoriteSearchTitleCount: 'select count(*) as count' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and status=1' +
				' and title like :keyword' +
				' and rb.id=urb.bookmark_id'

		, favoriteFilterTags: 'select rb.id,title,url,status,tags,datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where user_id=:userId' +
				' and status=1' +
				' and tags regexp :tags' +
				' and rb.id=urb.bookmark_id' +
			' order by status,id desc' +
			' limit :page,:size'
		, favoriteFilterTagsCount: 'select count(*) as count' +
			' from user_reader_bookmark' +
			' where user_id=:userId' +
				' and status=1' +
				' and tags regexp :tags'
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
		, filterReaderByTag: function(tags, page, size){
			return db.handle({
				sql: SQL.readerFilterTags.replace(':page', (page -1) * size).replace(':size', size).replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				//, data: {
				//	tags: '(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join('|') + ')(,|$)'
				//	, page: (page -1) * size
				//	, size: size
				//}
			});
		}
		, countFilterReaderByTag: function(tags){
			return db.handle({
				sql: SQL.readerFilterTagsCount.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				//, data: {
				//	tags: '(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join('|') + ')(,|$)'
				//}
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

		, getBookmarkByPage: function(userId, page, size){
			return db.handle({
				sql: SQL.userBookmarkByPage
				, data: {
					userId: userId
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countBookmark: function(userId){
			return db.handle({
				sql: SQL.userBookmarkCount
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
		, searchBookmarkByTitle: function(userId, keyword, page, size){
			return db.handle({
				sql: SQL.bookmarkSearchTitle
				, data: {
					userId: userId
					, keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchBookmarkByTitle: function(userId, keyword){
			return db.handle({
				sql: SQL.bookmarkSearchTitleCount
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
		, filterBookmarkByTags: function(userId, tags, page, size){
			return db.handle({
				sql: SQL.bookmarkFilterTags.replace(':page', (page -1) * size).replace(':size', size).replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				//, data: {
				//	userId: userId
				//	, tags: '(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join('|') + ')(,|$)'
				//	, page: (page -1) * size
				//	, size: size
				//}
			});
		}
		, countFilterBookmarkByTags: function(userId, tags){
			return db.handle({
				sql: SQL.bookmarkFilterTagsCount.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				//, data: {
				//	tags: '(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join('|') + ')(,|$)'
				//}
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
		, isExistUserBookmark: function(bookmarkId, userId){
			return db.handle({
				sql: SQL
				, data: {
					bookmarkId: bookmarkId
					, userId: userId
				}
			})
		}
		, addBookmark: function(data){
			return db.handle({
				sql: SQL.bookmarkAdd
				, data: data
			});
		}
		, addUserBookmark: function(data){
			return db.handle({
				sql: SQL.userBookmarkAdd
				, data: data
			})
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
		, updateUserBookmarkRead: function(id, title, score, tags){
			return db.handle({
				sql: SQL.userBookmarkUpdateRead
				, data: {
					id: id
					, score: score
					, tags: tags
				}
			})
		}

		, getFavoriteByPage: function(userId, page, size){
			return db.handle({
				sql: SQL.favoriteByPage
				, data: {
					userId: userId
					, page: (page -1) * size
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
		, searchFavoriteByTitle: function(keyword, page, size){
			return db.handle({
				sql: SQL.favoriteSearchTitle
				, data: {
					keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchFavoriteByTitle: function(keyword){
			return db.handle({
				sql: SQL.favoriteSearchTitleCount
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
		, filterFavoriteByTags: function(tags, page, size){
			return db.handle({
				sql: SQL.favoriteFilterTags.replace(':page', (page -1) * size).replace(':size', size).replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				//, data: {
				//	tags: '(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join('|') + ')(,|$)'
				//	, page: (page -1) * size
				//	, size: size
				//}
			})
		}
		, countFilterFavoriteByTags: function(tags){
			return db.handle({
				sql: SQL.favoriteFilterTagsCount.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				//, data: {
				//	tags: '(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join('|') + ')(,|$)'
				//}
			}).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = +rs[0].length;
				}
				else{
					result = 0;
				}

				return result;
			});
		}
	}
	;

module.exports = Model;