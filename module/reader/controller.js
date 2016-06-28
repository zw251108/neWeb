'use strict';

var CONFIG      = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserHandler   = require('../user/handler.js')

	, ReaderView    = require('./view.js')
	, ReaderAdminView   = require('./admin.view.js')
	, ReaderHandler     = require('./handler.js')
	;

modules.register({
	id: 'reader'
	, metroSize: 'tiny'
	, title: '阅读 reader'
	, icon: 'reader'
	, href: 'reader/'
}, {
	id: 'bookmark'
	, metroSize: 'tiny'
	, title: '书签 bookmark'
	, icon: 'bookmark'
	, href: 'reader/bookmark'
}, {
	id: 'favorite'
	, metroSize: 'tiny'
	, title: '收藏 favorite'
	, icon: 'star'
	, href: 'reader/favorite'
});

menu.register({
	id: 'reader'
	, title: '阅读 reader'
	, icon: 'reader'
	, href: 'reader/'
}, {
	id: 'bookmark'
	, title: '书签 bookmark'
	, icon: 'bookmark'
	, href: 'reader/bookmark'
}, {
	id: 'favorite'
	, title: '收藏 favorite'
	, icon: 'star'
	, href: 'reader/favorite'
});

web.get('/reader/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	ReaderHandler.getReaderList(user, query).then(ReaderView.readerList, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/bookmark', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	// 设置状态为未读
	query.status = 0;

	ReaderHandler.getBookmarkList(user, query).then(ReaderView.bookmarkList, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/favorite', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	// 设置状态为已读
	query.status = 1;

	ReaderHandler.getBookmarkList(user, query).then(ReaderView.favoriteList, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});

socket.register({
	reader: function(){}
	, 'reader/add': function(socket, data){
		var topic = 'reader/add'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		ReaderHandler.newReader(user, query).then(function(data){
			return {
				topic: topic
				, data: [data]
				, msg: 'Done'
			}
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'reader/feed': function(socket, data){
		var topic = 'reader/feed'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		ReaderHandler.getFeedList(user, query).then(function(data){
			return {
				topic: topic
				, data: [data]
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'reader/search': function(socket, data){
		var topic = 'reader/search'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		ReaderHandler.getReaderList(user, query).then(function(rs){
			return {
				data: rs.data
				, count: data.count
			}
		}).then(function(data){
			return {
				topic: topic
				, data: data.data
				, msg: 'Done'
			};
		}).then(function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}

	, 'reader/bookmark': function(){}
	, 'reader/bookmark/add': function(socket, data){
		var topic = 'reader/bookmark/add'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		console.log('bookmark add url: ' + query.url);

		ReaderHandler.addBookmark(user, query).then(function(data){
			return {
				topic: topic
				, data: [data]
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			}
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'reader/bookmark/read': function(socket, data){
		var topic = 'reader/bookmark/read'
			, query = data.query
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			//, send = {
			//	topic: 'reader/bookmark/read'
			//}
			//, id = query.id
			//, bookmarkId = query.bookmarkId
			//, url = query.url
			//, tags = query.tags || ''
			//, score = query.score || 0
			//, oldScore = query.oldScore || 0
			//, oldStatus = query.oldStatus || 0
			//, title = query.title || ''
			//, bookmark
			//, execute
			;

		ReaderHandler.updateBookmarkRead(user, query).then(function(data){
			return {
				topic: topic
				, data: [data]
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});

		//// 检测 user
		////if( UserHandler.isGuest(user) ){
		//// 判断是否已有 id
		//if( id ){
		//	if( /^\d+$/.test( id ) ){
		//		// 合法数据库 id
		//		// user_reader_bookmark 表中已有数据 操作为更新数据
		//		// 更新 reader_bookmark 表 total_score num_reader 字段
		//
		//		execute = Promise.all([
		//			Model.updateBookmarkRead(bookmarkId, title, score - oldScore, +oldStatus? 0 : 1)
		//			, Model.updateUserBookmarkRead(id, title, score, tags, 1, +oldStatus)
		//		]).then(function(rs){
		//			var r1 = rs[0]
		//				, r2 = rs[1]
		//				, result
		//				;
		//
		//			if( r1 && r1.changedRows && r2 && r2.changedRows ){
		//				result = {
		//					id: id
		//					, bookmarkId: bookmarkId
		//					, userId: user.id
		//					, url: url
		//					, title: title
		//					, tags: tags
		//					, score: score
		//					, status: 1
		//				};
		//			}
		//			else{
		//				result = Promise.reject( new ReaderError('该文章已被读过') );
		//			}
		//
		//			return result;
		//		}).then(function(data){
		//			send.info = data;
		//
		//			return send;
		//		});
		//	}
		//	else if( url ){ // id 为 tempId，使用 url
		//		source = Url.parse(url);
		//		source = source.protocol + '//' + source.host;
		//
		//		bookmark = {
		//			url: url
		//			, title: title
		//			, source: source
		//			, tags: tags
		//			, userId: user.id
		//			, score: score
		//			, status: 1
		//		};
		//
		//		// 判断 reader_bookmark 表中是否存在该 url
		//		if( bookmarkId ){   // 已存在
		//			data.bookmarkId = bookmarkId;
		//
		//			execute = Promise.resolve( bookmark );
		//		}
		//		else{   // 没有相关数据 添加到 reader_bookmark 表中
		//			execute = Model.addBookmark( bookmark ).then(function(rs){
		//				var result
		//					;
		//
		//				if( rs && rs.insertId ){
		//					bookmark.bookmarkId = rs.insertId;
		//
		//					result = bookmark;
		//				}
		//				else{
		//					result = Promise.reject( new ReaderError('保存失败') );
		//				}
		//
		//				return result;
		//			});
		//		}
		//
		//		execute = execute.then(function(bookmark){ // 添加到 user_reader_bookmark
		//			return Model.addUserBookmark( bookmark ).then(function(rs){
		//				var result
		//					;
		//
		//				if( rs && rs.insertId ){
		//					data.id = rs.insertId;
		//
		//					result = data;
		//				}
		//				else{
		//					result = Promise.reject( new ReaderError('数据保存失败') );
		//				}
		//
		//				return result;
		//			});
		//		}).then(function(data){ // 处理返回信息
		//			send.info = data;
		//
		//			return send;
		//		});
		//	}
		//	else{
		//		execute = Promise.reject( new ReaderError('缺少参数') );
		//	}
		//}
		//else{
		//	execute = Promise.reject( new ReaderError('缺少参数') );
		//}
		////}
		////else{
		////	execute = Promise.reject( new ReaderError('用户尚未登录') );
		////}
		//
		////Promise.all( tags.split(',').map(function(d){
		////	return TagModel.increaseByName(d, 1);
		////}) );
		//
		//execute.catch(function(e){
		//	console.log( e );
		//
		//	send.error = '';
		//	send.msg = e.message;
		//
		//	return send;
		//}).then(function(send){
		//	socket.emit('data', send);
		//});
	}
	, 'reader/bookmark/search': function(socket, data){
		var topic = 'reader/bookmark/search'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( req )
			;

		// 设置状态为未读
		query.status = 0;

		ReaderHandler.getBookmarkList(user, query).then(function(data){
			return {
				topic: topic
				, data: data.data
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'reader/bookmark/filter': function(){}

	, 'reader/favorite': function(){}
});

/**
 *
 * */
admin.register({
	id: 'bookmark'
	, metroSize: 'tiny'
	, title: '书签 bookmark'
	, icon: 'bookmark'
	, href: 'reader/bookmark'
});
web.get('/admin/reader/bookmark', function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		;

	ReaderAdminView.bookmark( user ).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});

web.get('/reader/bookmark/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	ReaderHandler.getBookmarkReadPerDay( user ).catch(function(e){
		console.log( e );

		return [];
	}).then(function(rs){
		rs = JSON.stringify( rs );

		res.send( rs );
		res.end();
	});
});