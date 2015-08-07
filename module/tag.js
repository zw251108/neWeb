'use strict';

var db          = require('./db.js')
	, web       = require('./web.js')
	, socket    = require('./socket.js')
	, error     = require('./error.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, tagEditorEmmet = 'div.formGroup' +
		'>label.label[for=tags]{请设置标签}' +
		'+div.tagInput' +
			'>input#tag.input[type=text name=tag placeholder=请输入标签 data-validator=tag]' +
			'+button#addTag.btn[type=button]{添加}' +
		'^div.tagsArea{%tagsArea%}' +
		'+textarea#tags.hidden[name=tags]{%tags%}'
	, tagEditorFilter = {
		tags: function(d){
			return d.tags || ''
		}
		, tagsArea: function(d){
			return d.tags ? d.tags.split(',').map(function(d){
				return '<span class="tag tag-checked">'+ d +'</span>';
			}).join('') : '';
		}
	}

	, tagTpl        = function(d){
		return d.tags ? '<span class="tag tag-checked">'+ d.tags.split(',').join('</span><span class="tag tag-checked">') +'</span>' : '';
	}
	, tagAreaTpl    = emmetTpl({
		template: 'div.tagsArea'
	})
	, tagEditorTpl  = emmetTpl({
		template: tagEditorEmmet
		, filter: tagEditorFilter
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
			, tagLink: 'select * from tag'
			, tagAdd: 'insert into tag(name) select :name from dual where not exists (select * from tag where name like :name)'
			, tagIncrease: 'update tag set num=num+:increase where name=:name'
			, tagIsExist: 'select * from tag where name=:name'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Tag
		 * @desc    数据处理方法集合
		 * */
		, Handler: {
			tagIsExist: function(rs){
				rs = rs.result;

				return !!(rs && rs.length);
			}
		}

		/**
		 * @namespace   View
		 * @memberof    Tag
		 * @desc    视图模板集合
		 * */
		, View: {
			tagEditor: function(rs){
				rs = rs || {};

				return tagEditorTpl(rs);
			}
		}

		, tagIncrease: function(name, num){
			db.handle({
				sql: Tag.Model.tagIsExist
				, name: name
			}).then( Tag.Handler.tagIsExist ).then(function(rs){
				var handle = {};

				if( rs ){
					handle.sql = Tag.Model.tagIncrease;
					handle.data = {
						name: name
						, num: 1
					}
				}
				else{
					handle.sql = Tag.Model.tagAdd;
					handle.data = {
						name: name
					};
				}

				db.handle( handle )
			});
		}

		, tagEditorEmmet: tagEditorEmmet
		, tagEditorFilter: tagEditorFilter

		, data: []
		, index: {}
	}
	;

db.handle({
	sql: Tag.Model.tag
}).then(function(rs){
	//rs = rs.result;

	var index = {}
		;

	rs.forEach(function(d, i){
		index[d.name] = i;
	});

	Tag.data = rs;
	Tag.index = index;

	//console.log(rs)
	//console.log(index)
});

//tag.on('data', function(topic, next, args, data){
//
//});

web.get('/data/tag', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		;

	// todo 返回 Tag.data ?

	db.handle({
		sql: Tag.Model.tag
	}).then(function(rs){
		rs = JSON.stringify( rs );//.result );

		res.send( callback ? callback +'('+ rs + ')' : rs );
		res.end();
	});
});

socket.register({
	tag: function(socket){

		// todo 返回 Tag.data

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
			, name = query.name
			;

		if( name ){
			db.handle({
				sql: Tag.Model.tagAdd
				, data: {
					name: name
				}
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
					send.msg = '该标签已存在';
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
				, data: {
					name: name
					, increase: 1
				}
			}).then(function(rs){
				rs = rs.result;

				if( rs.changedRows ){
					send.info = {
						name: name
					};
				}

				// 标签数量添加
				if( name in Tag.index ){
					Tag.data[Tag.index[name]] += 1;
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

var config = require('../config.js')
	, admin = require('./tag/admin.view.js');

web.get('/admin/tag', function(req, res){

	admin.tag().then(function( html ){
		res.send( config.docType.html5 + html );
		res.end();
	});

	//db.handle({
	//	sql: Tag.Model.tagLink
	//}).then(function(rs){
	//	rs = rs.result;
	//
	//	res.send( tagHTML.replace('/*=tag_data*/', '='+ JSON.stringify(rs)) );
	//	res.end();
	//});
});

module.exports = Tag;