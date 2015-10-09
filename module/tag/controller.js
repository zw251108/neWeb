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

	, TAG_INDEX = {}
	, TAG_CACHE = []
	;

/**
 * 后台管理
 * */
web.get('/admin/tag', function(req, res){
	Admin.tag().then(function( html ){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
admin.push('tag');

/**
 * 全局 Web 数据接口 只支持 jsonp 格式，回调函数名为 callback
 * */
web.get('/data/tag', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		, result
		;
	if( callback ){
		result = Model.getAll().then(function(rs){
			rs = JSON.stringify( rs );

			return callback +'('+ rs +')';
		});
	}
	else{
		result = Promise.reject( new TagError('不是 jsonp 格式调用') );
	}

	result.then(function(rs){
		return rs;
	}, function(e){
		console.log(e);

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
	Model.getAll().then(function(rs){
		rs = JSON.stringify( rs );

		res.send( rs );
		res.end();
	});
});
web.get('/tag/increase', function(){
	res.end();
});

/**
 * Web Socket 数据接口
 * */
socket.register({
	tag: function(socket){
		Model.getAll().then(function(rs){
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
			, result
			;

		if( name ){
			result = Model.add( name ).then(function(rs){
				var result;

				if( !rs.insertId ){
					send.info = {
						id: rs.insertId
						, name: name
					};

					result = send;
				}
				else{
					result = Promise.reject( new TagError(name + ' 标签已存在') );
				}

				return result;
			});
		}
		else{
			result = Promise.reject( new TagError('缺少参数') );
		}

		result.then(function(send){
			return send;

		}, function(e){
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
			, result
			;

		if( name ){
			result = Model.increaseByName(name, num).then(function(rs){
				var result;

				if( rs.changedRows ){
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
					result = send;
				}
				else{
					result = Promise.reject( new TagError('缺少参数') );
				}

				return result;
			});
		}
		else{
			result = Promise.reject( new TagError('缺少参数') );
		}

		result.then(function(send){
			return send;
		}, function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
});