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

	, DOCUMENT_ID = 1
	;

// 注册首页 metro 模块
index.push({
	id: 'document'
	, type: 'metro'
	, size: 'small'
	, title: '前端文档 document'
});

web.get('/document/', function(req, res){

	Model.getAllContent( DOCUMENT_ID ).then( View.document ).then(function( html ){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.get('/admin/document/', function(req, res){
	Model.getAllDoc().then( Admin.documentList ).then(function(html){console.log(html)
		res.send( html );
		res.end();
	});
});
web.get('/admin/document/:documentId/',function(req, res, next){
	var param = req.params || {}
		, documentId = param.documentId
		;
	if( documentId && /^\d*$/.test( documentId ) ){
		Model.getSectionByDoc(documentId).then( Admin.sectionList).then(function(html){
			res.send( html );
			res.end();
		});
	}
	else{
		next();
	}
});
web.get('/admin/document/:documentId/:sectionId/', function(req, res, next){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		;

	if( documentId && /^\d*$/.test( documentId ) && sectionId && /^\d*$/.test( sectionId) ){
		Model.getContentBySec( sectionId ).then( Admin.contentList ).then(function(html){
			res.send( html );
			res.end();
		});
	}
	else{
		next();
	}
});
web.get('/admin/document/:documentId/:sectionId/:contentId', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		, contentId = param.contentId
		;

	if( documentId && /^\d*$/.test( documentId ) && sectionId && /^\d*$/.test( sectionId ) && contentId && /^\d*$/.test( contentId ) ){
		Model.getContentById( contentId ).then( Admin.content ).then(function(html){
			res.send( html );
			res.end();
		});
	}
	else{
		next();
	}
});
web.post('/admin/document/', function(req, res){
	var body = req.body || {}
		, title = body.title
		;
	if( title ){
		Model.addDoc( body ).then(function(rs){
			var json = {};
			if( rs.insertId ){
				json.success = true;
				json.id = rs.insertId;
			}
			else{
				json.success = false;
			}

			res.send( JSON.stringify(json) );
			res.end();
		});
	}
	else{
		res.send( JSON.stringify({
			success: false
			, error: ''
			, msg: '缺少标题'
		}) );
		res.end();
	}
});
web.post('/admin/document/:documentId/',function(req, res, next){
	var param = req.params || {}
		, documentId = param.documentId
		, body = req.body || {}
		, title = body.title
		;
	if( documentId && /^\d*$/.test( documentId ) && title ){

		body.documentId = documentId;

		Model.addSectionByDoc( body ).then(function(rs){
			var json = {};
			if( rs.insertId ){
				json.success = true;
				json.id = rs.insertId;
			}
			else{
				json.success = false;
			}

			res.send( JSON.stringify(json) );
			res.end();
		});
	}
	else{
		res.send( JSON.stringify({
			success: false
			, error: ''
			, msg: '缺少标题'
		}) );
		res.end();
	}
});
web.post('/admin/document/:documentId/:sectionId/', function(req, res, next){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		, body = req.body || {}
		, title = body.title
		;
	if( documentId && /^\d*$/.test( documentId ) && title ){

		body.documentId = documentId;
		body.sectionId = sectionId;
		body.sectionTitle = '';

		Model.addContentBySec( body ).then(function(rs){
			var json = {};
			if( rs.insertId ){
				json.success = true;
				json.id = rs.insertId;
			}
			else{
				json.success = false;
			}

			res.send( JSON.stringify(json) );
			res.end();
		});
	}
	else{
		res.send( JSON.stringify({
			success: false
			, error: ''
			, msg: '缺少标题'
		}) );
		res.end();
	}
});
web.post('/admin/document/:documentId/:sectionId/:contentId/', function(req, res){
	var param = req.params || {}
		, documentId = param.documentId
		, sectionId = param.sectionId
		, contentId = param.contentId
		, body = req.body || {}
		;

	if( documentId && /^\d*$/.test( documentId ) && sectionId && /^\d*$/.test( sectionId ) && contentId && /^\d*$/.test( contentId ) ){

		body.content = body.content.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

		Model.saveContent( body ).then(function(rs){
			res.send( JSON.stringify({
				success: true
			}) );
			res.end()

		});
	}
});

admin.push('document');