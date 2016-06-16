'use strict';

var db  = require('../db.js')
	, error = require('../error.js')

	, SQL = {
		readerByPage: 'select * from reader' +
			' where `show`=1' +
			' order by last_pub desc' +
			' limit :page, :size'
		, readerCount: 'select count(*) as count from reader' +
			' where `show`=1'
		, readerIsExist: 'select * from reader where xml_url like :xmlUrl'
		, readerUpdatePub: 'update reader set last_pub=:lastPub where id=:id'
		, readerAdd: 'insert into reader(`status`,`show`,name,xml_url,html_url,tags)' +
			' select 1,1,:name,:feed,:url,:tags from dual where not exists (select * from reader where xml_url like :feed)'
		, readerSearchName: 'select * from reader' +
			' where' +
				' `show`=1' +
			' and' +
				' name like :keyword' +
			' order by last_pub desc limit :page, :size'
		, readerSearchNameCount: 'select count(*) as count from reader' +
			' where' +
				' `show`=1' +
			' and' +
				' name like :keyword'
		, readerFilterTags: 'select * from reader' +
			' where' +
				' `show`=1' +
			' and' +
				' tags regexp :tags' +
			' order by last_pub desc limit :page, :size'
		, readerFilterTagsCount: 'select count(*) as count from reader' +
			' where' +
				' `show`=1' +
			' and' +
				' tags regexp :tags'

		, userBookmarkByPage: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,tags,mark_datetime as datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where' +
				' urb.user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' rb.id=urb.bookmark_id' +
			' order by rb.id desc' +
			' limit :page,:size'
		, userBookmarkCount: 'select count(*) as count from user_reader_bookmark' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status'

		, bookmarkSearchTitle: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,tags,mark_datetime as datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' urb.title like :keyword' +
			' and' +
				' rb.id=urb.bookmark_id' +
			' order by id desc' +
			' limit :page,:size'
		, bookmarkSearchTitleCount: 'select count(*) as count' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' urb.title like :keyword' +
			' and' +
				' rb.id=urb.bookmark_id'

		, bookmarkSearchUrl: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,tags,mark_datetime as datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' url like :url' +
			' and' +
				' rb.id=urb.bookmark_id' +
			' order by id desc' +
			' limit :page,:size'
		, bookmarkSearchUrlCount: 'select count(*) as count' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' url like :url' +
			' and' +
				' rb.id=urb.bookmark_id'

		, bookmarkFilterTags: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,tags,mark_datetime as datetime,score' +
			' from reader_bookmark as rb,user_reader_bookmark as urb' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' tags regexp :tags' +
			' and' +
				' rb.id=urb.bookmark_id' +
			' order by id desc' +
			' limit :page,:size'
		, bookmarkFilterTagsCount: 'select count(*) as count' +
			' from user_reader_bookmark' +
			' where' +
				' user_id=:userId' +
			' and' +
				' status=:status' +
			' and' +
				' tags regexp :tags'

		, bookmarkIsExist: 'select * from reader_bookmark where url like :url'
		, userBookmarkIsExist: 'select * from user_reader_bookmark where bookmark_id=:bookmarkId and user_id=:userId'

		, bookmarkAdd: 'insert into reader_bookmark(url,title,source,creator_id)' +
			' select :url,:title,:source,:userId from dual' +
				' where not exists (select * from reader_bookmark where url like :url)'
		, userBookmarkAdd: 'insert into user_reader_bookmark(bookmark_id,user_id,title,score,tags,status)' +
			' select :bookmarkId,:userId,:title,:score,:tags,:status from dual' +
				' where not exists (select * from user_reader_bookmark where bookmark_id=:bookmarkId and user_id=:userId)'

		, bookmarkUpdateRead: 'update reader_bookmark set total_score=total_score+:score,num_reader=num_reader+:num where id=:id'
		, userBookmarkUpdateRead: 'update user_reader_bookmark set title=:title,status=:status,tags=:tags,score=:score,read_datetime=now() where id=:id'
		, userBookmarkUpdateInfo: 'update user_reader_bookmark set title=:title,tags=:tags,score=:score where id=:id'

		//, favoriteByPage: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,score,tags,mark_datetime as datetime' +
		//	' from reader_bookmark as rb,user_reader_bookmark as urb' +
		//	' where' +
		//		' user_id=:userId' +
		//	' and' +
		//		' status=1' +
		//	' and' +
		//		' rb.id=urb.bookmark_id' +
		//	' order by score desc,datetime desc' +
		//	' limit :page,:size'
		//, favoriteCount: 'select count(*) as count' +
		//	' from' +
		//		' user_reader_bookmark' +
		//	' where' +
		//		' user_id=:userId' +
		//	' and' +
		//		' status=1'
		//
		//, favoriteSearchTitle: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,score,tags,mark_datetime as datetime' +
		//	' from reader_bookmark as rb,user_reader_bookmark as urb' +
		//	' where' +
		//		' user_id=:userId' +
		//	' and' +
		//		' status=1' +
		//	' and' +
		//		' urb.title like :keyword' +
		//	' and' +
		//		' rb.id=urb.bookmark_id' +
		//	' order by status,id desc' +
		//	' limit :page,:size'
		//, favoriteSearchTitleCount: 'select count(*) as count' +
		//	' from reader_bookmark as rb,user_reader_bookmark as urb' +
		//	' where' +
		//		' user_id=:userId' +
		//	' and' +
		//		' status=1' +
		//	' and' +
		//		' urb.title like :keyword' +
		//	' and' +
		//		' rb.id=urb.bookmark_id'
		//
		//, favoriteFilterTags: 'select urb.id as id,rb.id as bookmarkId,urb.title as title,url,status,tags,score,mark_datetime as datetime' +
		//	' from reader_bookmark as rb,user_reader_bookmark as urb' +
		//	' where' +
		//		' user_id=:userId' +
		//	' and' +
		//		' status=1' +
		//	' and' +
		//		' tags regexp :tags' +
		//	' and' +
		//		' rb.id=urb.bookmark_id' +
		//	' order by status,id desc' +
		//	' limit :page,:size'
		//, favoriteFilterTagsCount: 'select count(*) as count' +
		//	' from user_reader_bookmark' +
		//	' where' +
		//		' user_id=:userId' +
		//	' and' +
		//		' status=1' +
		//	' and' +
		//		' tags regexp :tags'

		// 统计用户每天所标记、所读的文章数量
		, statisticReadMarkByDate: 'select date_format(read_datetime,\'%Y-%m-%d\') as read_date,count(if(status=1,true,null)) as read_count,count(status) as mark_count' +
			' from user_reader_bookmark' +
			' where' +
				' user_id=:userId' +
			' group by' +
				' date_format(read_datetime,\'%Y-%m-%d\')' +
			' order by' +
				' read_date desc'
		, update: 'delete from reader_bookmark where id=:id;\
					update reader_bookmark set id=id-1 where id>:id;\
					alter table reader_bookmark auto_increment=:all;\
					delete from user_reader_bookmark where id=:id;\
					update user_reader_bookmark set id=id-1,bookmark_id=bookmark_id-1 where id>:id;\
					alter table user_reader_bookmark auto_increment=:all;'
	}
	, ReaderModel = {
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


		, getBookmarkByPage: function(userId, status, page, size){
			return db.handle({
				sql: SQL.userBookmarkByPage
				, data: {
					userId: userId
					, status: status
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countBookmark: function(userId, status){
			return db.handle({
				sql: SQL.userBookmarkCount
				, data: {
					userId: userId
					, status: status
				}
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}

		, searchBookmarkByTitle: function(userId, keyword, status, page, size){
			return db.handle({
				sql: SQL.bookmarkSearchTitle
				, data: {
					userId: userId
					, keyword: '%'+ keyword +'%'
					, status: status
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchBookmarkByTitle: function(userId, keyword, status){
			return db.handle({
				sql: SQL.bookmarkSearchTitleCount
				, data: {
					userId: userId
					, status: status
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

		, searchBookmarkByUrl: function(userId, url, status, page, size){
			return db.handle({
				sql: SQL.bookmarkSearchUrl
				, data: {
					userId: userId
					, url: '%'+ url +'%'
					, status: status
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchBookmarkByUrl: function(userId, url, status){
			return db.handle({
				sql: SQL.bookmarkSearchUrlCount
				, data: {
					userId: userId
					, url: '%'+ url +'%'
					, status: status
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

		, filterBookmarkByTags: function(userId, tags, status, page, size){
			return db.handle({
				sql: SQL.bookmarkFilterTags.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				, data: {
					userId: userId
					, status: status
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countFilterBookmarkByTags: function(userId, tags, status){
			return db.handle({
				sql: SQL.bookmarkFilterTagsCount.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				, data: {
					userId: userId
					, status: status
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

		, isExistBookmark: function(url, returnData){
			var result = db.handle({
					sql: SQL.bookmarkIsExist
					, data: {
						url: url
					}
				})
				;

			if( !returnData ){
				result = result.then(function(rs){
					var isExist = false
						;

					if( rs && rs.length ){
						isExist = true;
					}

					return isExist;
				});
			}

			return result;
		}
		, isExistUserBookmark: function(bookmarkId, userId, returnData){
			var result = db.handle({
				sql: SQL.userBookmarkIsExist
				, data: {
					bookmarkId: bookmarkId
					, userId: userId
				}
			})
			//	.then(function(rs){
			//	var result
			//		;
			//
			//	if( rs && rs.length ){
			//		result = Promise.resolve(rs[0]);
			//	}
			//	else{
			//		result = Promise.reject();
			//	}
			//
			//	return result;
			//})
				;

			if( !returnData ){
				result = result.then(function(rs){
					var isExist = false
						;

					if( rs && rs.length ){
						isExist = true;
					}

					return isExist;
				});
			}

			return result;
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
			});
		}

		, updateBookmarkRead: function(id, title, score, num){
			return db.handle({
				sql: SQL.bookmarkUpdateRead
				, data: {
					id: id
					, title: title
					, score: score
					, num: num
				}
			});
		}
		, updateUserBookmarkRead: function(id, title, score, tags, status, isInfo){
			var sql
				;

			if( !isInfo ){
				sql = SQL.userBookmarkUpdateRead;
			}
			else{
				sql =
					SQL.userBookmarkUpdateInfo;
			}
			return db.handle({
				sql: sql
				, data: {
					id: id
					, title: title
					, score: score
					, tags: tags
					, status: status
				}
			});
		}

		, getFavoriteByPage: function(userId, page, size){console.log(page, size);
			return db.handle({
				sql: SQL.favoriteByPage
				, data: {
					userId: userId
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countFavorite: function(userId){
			return db.handle({
				sql: SQL.favoriteCount
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

		, searchFavoriteByTitle: function(userId, keyword, page, size){
			return db.handle({
				sql: SQL.favoriteSearchTitle
				, data: {
					userId: userId
					, keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchFavoriteByTitle: function(userId, keyword){
			return db.handle({
				sql: SQL.favoriteSearchTitleCount
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

		, filterFavoriteByTags: function(userId, tags, page, size){
			return db.handle({
				sql: SQL.favoriteFilterTags.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				, data: {
					userId: userId
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countFilterFavoriteByTags: function(userId, tags){
			return db.handle({
				sql: SQL.favoriteFilterTagsCount.replace(':tags', '\'(^|,)(' + tags.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)').split(',').join(')(,|$)\' and tags regexp \'(^|,)(') + ')(,|$)\'')
				, data: {
					userId: userId
				}
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

		, statisticReadMarkByDate: function(userId){
			return db.handle({
				sql: SQL.statisticReadMarkByDate
				, data: {
					userId: userId
				}
			});
		}
	}
	;

module.exports = ReaderModel;