'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl           = require('./emmetTpl/tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, dlTpl         = emmetTpl({
		template: 'dt.icon.icon-right{%title%}+dd{%content%}'
	})
	, sectionTpl    = emmetTpl({
		template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon.icon-minus^dl{%dl%}'
		, filter: {
			dl: function(d){
				return dlTpl(d.dl).join('');
			}
		}
	})

	, Promise = require('promise')

	/**
	 * @namespace   Document
	 * */
	, Document = {
		/**
		 * @namespace   Model
		 * @memberof    Document
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {
			document: 'select title,content,section_title from document order by section_id,`order`'
			, documentSection: 'select title,content,section_title from document where section_id=:sectionId order by `order`'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Document
		 * @desc    数据处理方法集合
		 * */
		, Handler: {
			document: function(rs){
				var data = rs.result
					, document = []
					, tempTitle = ''
					, tempArray
					, i, j
					;

				for(i = 0, j = data.length; i < j; i++){

					if( data[i].section_title !== tempTitle ){
						tempTitle = data[i].section_title;
						tempArray = [];
						document.push({
							section_title: tempTitle
							, dl: tempArray
						});
					}

					tempArray.push( data[i] );
				}
				return document;
			}
		}

		/**
		 * @namespace   View
		 * @memberof    Document
		 * @desc    视图模板集合
		 * */
		, View: {
			document: function(rs){
				return tpl.html('module', {
					title: '前端文档 Document'
					, modules: tpl.mainTpl({
						id: 'document'
						, size: 'large'
						, title: '前端文档 document'
						, content: sectionTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/document/index'
						, src: '../script/lib/require.min.js'
					}
				});
			}
		}
	}
	;

// 注册首页 metro 模块
metro.push({
	id: 'document'
	, type: 'metro'
	, size: 'small'
	, title: '前端文档 document'
});

web.get('/document/', function(req, res){

	db.handle({
		sql: Document.Model.document
	}).then( Document.Handler.document ).then( Document.View.document ).then(function(html){
		res.send( html );
		res.end();
	})
});

web.get('/data/document/', function(req, res){
	var query = req.query || {}
		, sectionId
		, callback = query.callback
		, handle = {}
		;

	if( 'sectionId' in query ){

		// todo 按章节获取数据
		sectionId = query.sectionId;

		handle.sql = Document.Model.documentSection;
		handle.data = {
			sectionId: sectionId
		};
	}
	else{
		handle.sql = Document.Model.document;
	}

	db.handle( handle ).then( Document.Handler.document ).then(function(rs){
		rs = JSON.stringify( rs );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});

socket.register({
	document: function(socket, data){
		var query = data.query || {}
			, sectionId
			, handle = {}
			;

		if( 'sectionId' in query ){
			// todo 按章节获取数据
			sectionId = query.sectionId;

			handle.sql = Document.Model.documentSection;
			handle.data = {
				sectionId: sectionId
			};
		}
		else{
			handle.sql = Document.Model.document;
		}

		db.handle( handle ).then( Document.Handler.document ).then(function(rs){
			rs = JSON.stringify( rs );

			socket.emit('data', {
				topic: 'document'
				, data: rs
			});
		});
	}
});

module.exports = Document;