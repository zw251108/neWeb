'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, index     = require('../index.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, ReaderError   = require('./error.js')

	, Reader    = require('./reader.js')
	;

// 注册首页 metro 模块
index.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '阅读 reader'
}, {
	id: 'reader/bookmark'
	, type: 'metro'
	, size: 'tiny'
	, title: '书签 bookmark'
});

web.get('/reader/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getReaderByPage(page, size).then(function(rs){
		return Model.countReader().then(function(count){
			return {
				data: rs
				, index: page
				, size: size
				, count: count
				, urlCallback: function(index){
					return '?page='+ index;
				}
			}
		});
	}).then( View.readerList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/bookmark', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getBookmarkByPage(page, size).then(function(rs){
		return Model.countBookmark().then(function(count){
			return {
				data: rs
				, index: page
				, size: size
				, count: count
				, urlCallback: function(index){
					return '?page='+ index;
				}
			};
		});
	}).then( View.bookmarkList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/favorite', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getFavoriteByPage(page, size).then(function(rs){
		return Model.countFavorite().then(function(count){
			return {
				data: rs
				, index: page
				, size: size
				, count: count
				, urlCallback: function(index){
					return '?page='+ index;
				}
			};
		});
	}).then( View.favoriteList).then(function(html){
		res.send( config.docType.html5 + html );
		res.end()
	});
});

socket.register({
	reader: function(socket, data){

	}
	, 'reader/add': function(socket, data){

	}
	, 'reader/feed': function(socket, data){
		var send = {
				topic: 'reader/feed'
			}
			, feed = data.query.feed
			;

		if( feed ){
			//Reader.crawler(  )
		}
	}

	, 'reader/article/bookmark': function(socket, data){}
	, 'reader/bookmark': function(socket, data){}
	, 'reader/bookmark/add': function(socket, data){}

	, 'reader/read': function(socket, data){}
	, 'reader/favorite': function(socket, data){}
});