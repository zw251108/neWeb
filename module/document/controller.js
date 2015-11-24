'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, DocumentError = require('./error.js')

	, Promise = require('promise')

	, DOCUMENT_ID = 1
	;

modules.register({
	id: 'document'
	, metroSize: 'tiny'
	, title: '文档 document'
	, icon: 'document'
	, href: 'document/'
});

/**
 *
 * */
web.get('/document/', function(req, res){
	var query = req.query || {}
		, documentId = query.id || DOCUMENT_ID
		;

	Promise.all([Model.getDocumentById( documentId )
		, Model.getSectionByDocumentId( documentId )
		, Model.getContentByDocumentId( documentId )
	]).then(function( documentData ){
		var document = documentData[0]
			, section = documentData[1]
			, content = documentData[2]

			, sectionIndex = {}
			, contentIndex = {}
			, sectionOrder = document.section_order.split(',')
			, contentOrder
			, i, j, t, x
			, m, n

			, result = []
			, obj
			;

		i = content.length;
		while( i-- ){
			t = content[i];

			contentIndex[t.Id] = t;
		}

		i = section.length;
		while( i-- ){
			t = section[i];

			sectionIndex[t.Id] = t;
		}

		for(i = 0, j = sectionOrder.length; i < j; i++ ){
			t = sectionIndex[sectionOrder[i]];

			obj = {
				sectionId: t.Id
				, sectionTitle: t.title
			};

			contentOrder = t.content_order.split(',');

			t = [];
			for(m = 0, n = contentOrder.length; m < n; m++ ){
				x = contentIndex[contentOrder[m]];

				t.push( x );
			}

			obj.sectionList = t;

			result.push( obj );
		}

		return result;
	}).then( View.document ).then(function( html ){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

/**
 *
 * */
web.get('/admin/document/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getDocumentList(page, size).then(function(rs){
		return Model.countDocument().then(function(count){
			return {
				data: rs
				, count: count
				, index: page
				, size: size
				, urlCallback: function(index){
					return '?page='+ index
				}
			}
		});
	}).then( Admin.documentList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/admin/document/:documentId/',function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, execute
		;
	if( documentId && /^\d+$/.test( documentId ) ){
		execute = Promise.all([Model.getDocumentById( documentId )
			, Model.getSectionByDocumentId( documentId )
			, Model.getContentByDocumentId(documentId, true)
		]).then(function( documentData ){
			var document = documentData[0]
				, section = documentData[1]
				, content = documentData[2]

				, sectionIndex = {}
				, contentIndex = {}
				, sectionOrder = document.section_order.split(',')
				, contentOrder
				, i, j, t, x
				, m, n

				, result = []
				, obj
				;

			i = content.length;
			while( i-- ){
				t = content[i];

				contentIndex[t.Id] = t;
			}

			i = section.length;
			while( i-- ){
				t = section[i];

				sectionIndex[t.Id] = t;
			}

			for(i = 0, j = sectionOrder.length; i < j; i++ ){
				t = sectionIndex[sectionOrder[i]];

				obj = {
					sectionId: t.Id
					, sectionTitle: t.title
				};

				contentOrder = t.content_order.split(',');

				t = [];
				for(m = 0, n = contentOrder.length; m < n; m++ ){
					x = contentIndex[contentOrder[m]];

					t.push( x );
				}

				obj.sectionList = t;

				result.push( obj );
			}

			return result;
		}).then( Admin.document );
	}
	else{
		execute = Promise.reject( new DocumentError('缺少参数 documentId') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

//// content 列表
//web.get('/admin/document/:documentId/:sectionId/', function(req, res, next){
//	var param = req.params || {}
//		, documentId = param.documentId
//		, sectionId = param.sectionId
//		;
//
//	if( documentId && /^\d+$/.test( documentId ) && sectionId && /^\d+$/.test( sectionId) ){
//		Model.getContentBySec( sectionId ).then( Admin.contentList ).then(function(html){
//			res.send( html );
//			res.end();
//		});
//	}
//	else{
//		next();
//	}
//});
//// content 详细
//web.get('/admin/document/:documentId/:sectionId/:contentId', function(req, res){
//	var param = req.params || {}
//		, documentId = param.documentId
//		, sectionId = param.sectionId
//		, contentId = param.contentId
//		;
//
//	if( documentId && /^\d+$/.test( documentId ) && sectionId && /^\d+$/.test( sectionId ) && contentId && /^\d+$/.test( contentId ) ){
//		Model.getContentById( contentId ).then( Admin.content ).then(function(html){
//			res.send( html );
//			res.end();
//		});
//	}
//	else{
//		next();
//	}
//});

/**
 * /admin/document/add                                      新建文档
 * /admin/document/:documentId/add                          新建章节
 * /admin/document/:documentId/save                         保存章节排序
 * /admin/document/:documentId/:sectionId/add               新建内容
 * /admin/document/:documentId/:sectionId/save              保存内容排序
 * /admin/document/:documentId/:sectionId/:contentId/save   内容详细保存
 * */
web.post('/admin/document/add', function(req, res){
	var body = req.body || {}
		, title = body.title
		, execute
		;

	if( title ){
		execute = Model.addDocument( body ).then(function(rs){
			var result
				;

			if( rs.insertId ){
				result = {
					success: true
					, id: rs.insertId
				}
			}
			else{
				result = Promise.reject( new DocumentError(title + ' 文档创建失败') );
			}

			return result;
		});
	}
	else{
		execute = Promise.reject( new DocumentError('缺少标题') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/admin/document/:documentId/add', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, body = req.body || {}
		, title = body.title
		, execute
		;

	if( documentId && /^\d+$/.test( documentId ) && title ){

		body.documentId = documentId;

		execute = Model.addSectionByDoc( body ).then(function(rs){
			var result
				, json = {}
				;

			if( rs.insertId ){
				result = {
					success: true
					, id: rs.insertId
				};
			}
			else{
				result = Promise.reject( new DocumentError(title + ' 章节创建失败') );
			}

			return result;
		});
	}
	else{
		execute = Promise.reject( new DocumentError('缺少参数') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/admin/document/:documentId/save', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, body = req.body || {}
		, title = body.title
		, execute
		;

	if( documentId && /^\d+$/.test( documentId ) ){

		body.documentId = documentId;

		execute = Model.updateDocumentOrder({
			documentId: documentId
			, order: body.order
		}).then(function(rs){
			return {
				success: true
			};
		});
	}
	else{
		execute = Promise.reject( new DocumentError('缺少参数') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/admin/document/:documentId/:sectionId/add', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		, body = req.body || {}
		, title = body.title
		, execute
		;

	if( documentId && /^\d+$/.test( documentId ) && sectionId && /^\d+$/.test( sectionId )  && title ){

		body.documentId = documentId;
		body.sectionId = sectionId;

		execute = Model.addContentBySec( body ).then(function(rs){
			var result
				, json = {}
				;
			if( rs.insertId ){
				result = {
					success: true
					, id: rs.insertId
				}
			}
			else{
				result = Promise.reject( new DocumentError(title + ' 内容创建失败') );
			}

			return result;
		});
	}
	else{
		execute = Promise.reject( new DocumentError('缺少参数') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/admin/document/:documentId/:sectionId/save', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		, body = req.body || {}
		, title = body.title
		, execute
		;
	if( documentId && /^\d+$/.test( documentId ) && sectionId && /^\d+$/.test( sectionId ) ){

		body.documentId = documentId;
		body.sectionId = sectionId;

		execute = Model.updateSectionOrder({
			sectionId: sectionId
			, order: body.order
		}).then(function(rs){
			return {
				success: true
			};
		});
	}
	else{
		execute = Promise.reject( new DocumentError('缺少参数') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/admin/document/:documentId/:sectionId/:contentId/save', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		, contentId = param.contentId
		, body = req.body || {}
		, execute
		;

	if( documentId && /^\d+$/.test( documentId ) && sectionId && /^\d+$/.test( sectionId ) && contentId && /^\d+$/.test( contentId ) ){

		body.content = body.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

		execute = Model.updateContent( body ).then(function(rs){
			return {
				success: true
			}
		});
	}
	else{
		execute = Promise.reject( new DocumentError('缺少参数') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});

admin.push('document');