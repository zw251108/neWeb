'use strict';

var CONFIG    = require('../../config.js')
	, web         = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserHandler  = require('../user/handler.js')

	, Model = require('./model.js')
	, TagView       = require('./view.js')
	, TagAdminView  = require('./admin.view.js')
	, TagHandler    = require('./handler.js')
	;

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
 * 全局 Web 数据接口 只支持 jsonp 格式，回调函数名为 callback
 *
 * */
web.get('/data/tag', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = Model.getAll().then(function(rs){
			rs = JSON.stringify( rs );

			return callback +'('+ rs +')';
		});
	}
	else{
		execute = TagHandler.getError('不是 jsonp 格式调用');
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
data.push('tag');

/**
 * Web 数据接口
 * */
web.get('/tag/data', function(req, res){
	Model.getAll().catch(function(e){
		console.log( e );

		return [];
	}).then(function(rs){
		rs = JSON.stringify( rs );

		res.send( rs );
		res.end();
	});
});
//web.get('/tag/increase', function(){
//	res.end();
//});

/**
 * Web Socket 数据接口
 * */
socket.register({
	tag: function(socket){
		Model.getAll().catch(function(e){
			console.log( e );

			return [];
		}).then(function(rs){
			socket.emit('data', {
				topic: 'tag'
				, data: rs
			});
		});
	}
	, 'tag/add': function(socket, data){
		var send = {
				topic: 'tag/add'
			}
			, query = data.query || {}
			, name = query.name
			, user = UserHandler.getUserFromSession.fromSocket(socket)
			, execute
			;

		if( name ){
			execute = Model.add({
				name: name
				, userId: user.id
			});
		}
		else{
			execute = TagHandler.getError('缺少参数');
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'tag/increase': function(socket, data){
		var send = {
				topic: 'tag/increase'
			}
			, query = data.query || {}
			, name = query.tagName
			, num = query.num || 1
			, execute
			;

		if( name ){
			execute = Model.increaseByName({
				name: name
				, num: num
			}).then(function(rs){
				var execute;

				if( rs ){
					send.info = {
						name: name
					};

					// 标签数量添加
					if( name in TagHandler.TAG_INDEX ){
						TagHandler.TAG_CACHE[TagHandler.TAG_INDEX[name]] += 1;
					}
					else{
						// todo 加 1
					}
					execute = send;
				}
				else{   // 该标签不存在
					execute = TagHandler.getError(name + ' 标签不存在');
				}

				return execute;
			});
		}
		else{
			execute = TagHandler.getError('缺少参数');
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
});