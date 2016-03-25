'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, TagError = require('./error.js')

	, User  = require('../user/user.js')

	, Promise = require('promise')

	, TAG_INDEX = {}
	, TAG_CACHE = []
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
	Admin.tag().then(function(html){
		res.send( config.docType.html5 + html );
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
		execute = Promise.reject( new TagError('不是 jsonp 格式调用') );
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
			, user = User.getUserFromSession.fromSocket(socket)
			, execute
			;

		if( name ){
			execute = Model.add({
				name: name
				, userId: user.id
			});
		}
		else{
			execute = Promise.reject( new TagError('缺少参数') );
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
					if( name in TAG_INDEX ){
						TAG_CACHE[TAG_INDEX[name]] += 1;
					}
					else{
						// todo 加 1
					}
					execute = send;
				}
				else{   // 该标签不存在
					execute = Promise.reject( new TagError(name + ' 标签不存在') );
				}

				return execute;
			});
		}
		else{
			execute = Promise.reject( new TagError('缺少参数') );
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