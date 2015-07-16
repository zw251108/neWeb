'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, tagTpl        = emmetTpl({
		template: 'span.tag[data-tag-id=%tagId%]{tagName}'
	})
	, tagAreaTpl    = emmetTpl({
		template: 'div.tagArea'
	})
	, tagAddTpl     = emmetTpl({
		template: 'div.formGroup' +
				'>label.label[for=tag]{请输入标签}' +
				'+input#tag.input[type=text name=tag placeholder=请输入标签 data-validator=tag]' +
				'+button#addTag.btn[type=button]{添加}' +
			'^div.formGroup' +
				'>label.label[for=tags]{请选择标签}' +
				'+div.tagsArea' +
				'textarea#tags.hidden[name=tags]'
	})

	//, Event     = require('events').EventEmitter
	//, tag       = new Event()

	/**
	 * @namespace   Tag
	 * */
	, Tag = {
		/**
		 * @namespace   Model
		 * @memberof    Tag
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {
			tag: 'select * from tag'
			, tagAdd: 'insert into tag(name) select ? from dual where not exists (select * from tag where name like ?)'
			, tagIncrease: 'update tag set num=num+? where name=?'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Tag
		 * @desc    数据处理方法集合
		 * */
		, Handler: {

		}

		/**
		 * @namespace   View
		 * @memberof    Tag
		 * @desc    视图模板集合
		 * */
		, View: {}

		, tag: 'select * from tag'
		, 'tag/add':{
			sql: 'insert into tag(name) select ? from dual where not exists (select * from tag where name like ?)'
			, handle: function(data, rs){
				var r;
				if( rs.insertId ){
					// todo
				}
				else{
					// todo 数据库已存在该数据
				}
			}
		}
		, 'tag/num': {
			sql: 'update tag set num=? where name=?'
			, handle: function(data, rs){
				var r;
				if( rs.changedRows ){
					// todo
				}
				else{
					// todo 数据不存在
				}
			}
		}
	}
	;

//tag.on('data', function(topic, next, args, data){
//
//});

web.get('data/tag', function(req, res){
	db.handle({
		sql: Tag.Model.tag
	}).then(function(rs){
		rs = rs.result;

		res.send( JSON.stringify(rs) );
		res.end();
	});
});

socket.register({
	tag: function(socket, data){
		db.handle({
			sql: Tag.Model.tag
		}).then(function(rs){
			rs = rs.result;

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
			, name = query.tagName
			;

		if( name ){
			db.handle({
				sql: Tag.Model.tagAdd
				, data: [name]
			}).then(function(rs){
				rs = rs.result;

				if( !rs.insertId ){
					send.info = {
						id: rs.insertId
						, name: name
					}
				}
				else{
					send.error = '';
					send.msg = '缺少参数'
				}

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
	, 'tag/increase': function(socket, data){
		var send = {
				topic: 'tag/increase'
			}
			, query = data.query || {}
			, name = query.tagName
			;

		if( name ){
			db.handle({
				sql: Tag.Model.tagIncrease
				, data: [1, name]
			}).then(function(rs){
				rs = rs.result;

				if( rs.changedRows ){
					send.info = {
						name: name
					};
				}
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
});

module.exports = function(){
	//var editor = Tag;
	//
	//socket.register({
	//    'tag': function(){
	//
	//    }
	//	, 'tag/add': function(){
	//
	//	}
	//});
};