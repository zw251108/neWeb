'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, tagTpl        = emmetTpl({
		template: 'span.tag[data-tag-id=%tagId%]{%tagName%}'
	})
	, tagAreaTpl    = emmetTpl({
		template: 'div.tagArea'
	})
	, tagEditorTpl  = emmetTpl({
		template: 'div.formGroup' +
				'>label.label[for=tags]{请设置标签}' +
				'+div.tagInput' +
				'>input#tag.input[type=text name=tag placeholder=请输入标签 data-validator=tag]' +
				'+button#addTag.btn[type=button]{添加}' +
				'^div.tagsArea{%tagSpan%}' +
				'+textarea#tags.hidden[name=tags]{%tags%}'
		, filter: {
			tags: function(d){
				return d.tags_name || '';
			}
			, tagSpan: function(d){
				return d.tags_name ? d.tags_name.split(',').map(function(d){
					return '<span class="tag tag-checked">'+ d +'</span>';
				}).join('') : '';
			}
		}
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
			tag: 'select name,num from tag order by num'
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
		, View: {
			tagEditor: function(rs){
				rs = rs || {};

				return tagEditorTpl(rs);
			}
		}

		, data: []
		, index: {}
	}
	;

db.handle({
	sql: Tag.Model.tag
}).then(function(rs){
	rs = rs.result;

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
		rs = JSON.stringify( rs.result );

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
				, data: [name, name]
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

module.exports = Tag;