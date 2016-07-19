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

	ReaderHandler.getBookmarkReadPerDay( user).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		}
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});

/**
 *
 * */
web.get('/data/reader/bookmark/add', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		, session = req.session
		, user = UserHandler.getUserFromSession.fromReq( req )
		, isGuest = UserHandler.isGuest( user )
		, execute = Promise.resolve( user )
		;

	if( callback ){
		if( isGuest ){
			execute = UserHandler.userLogin(query, true).then(function(rs){

				// todo 处理 session
				// 将 user 放入 session
				user.id = rs.id;
				UserHandler.setUserToSession(user, session);

				return user;
			});
		}

		execute = execute.then(function(user){    // 登录成功
			return ReaderHandler.addBookmark(user, query);
		});
	}
	else{
		execute = ReaderHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		var json = {
				topic: 'reader/bookmark/new'
				, data: [rs]
				, msg: 'Done'
			}
			;

		socket.sendDataBySession(UserHandler.getUserAllSession( user.id ), json);
		console.log('通过 chrome 插件添加了一条 bookmark，', body.url);

		return json;
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});