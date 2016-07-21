'use strict';

var CONFIG      = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserHandler  = require('../user/handler.js')

	, TagAdminView  = require('./admin.view.js')
	, TagHandler    = require('./handler.js')
	;


/**
 * Web 数据接口
 * */
web.get('/tag/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	TagHandler.getTagList( user ).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
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
 * 后台管理
 * */
admin.register({
	id: 'tag'
	, metroSize: 'tiny'
	, title: '标签 tag'
	, icon: 'tags'
	, href: 'tag/'
});
web.get('/admin/tag/', function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		;

	TagAdminView.tag( user ).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});


/**
 * Web Socket 数据接口
 * */
socket.register({
	tag: function(socket){
		var topic = 'tag'
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		TagHandler.getTagList( user ).then(function(rs){
			return {
				topic: topic
				, data: rs
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
	, 'tag/add': function(socket, data){
		var topic = 'tag/add'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		TagHandler.newTag(user, query).then(function(data){
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
			socket.sendDataBySession(UserHandler.getUserAllSession( user.id ), json);
			// socket.emit('data', json);
		});
	}
	, 'tag/increase': function(socket, data){
		var topic = 'tag/increase'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		TagHandler.increaseTag(user, query).then(function(data){
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
});

/**
 * 全局 Web 数据接口 只支持 jsonp 格式，回调函数名为 callback
 *
 * */
data.push('tag');
web.get('/data/tag', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		, user = UserHandler.getUserFromSession.fromReq( req )
		, execute
		;

	if( callback ){
		execute = TagHandler.getTagList( user );
	}
	else{
		execute = TagHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
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