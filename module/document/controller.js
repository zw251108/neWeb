'use strict';

let CONFIG      = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserHandler   = require('../user/handler.js')

	, DocumentView  = require('./view.js')
	, DocumentAdminView = require('./admin.view.js')
	, DocumentHandler   = require('./handler.js')
	;

modules.register({
	id: 'document'
	, metroSize: 'tiny'
	, title: '文档 document'
	, icon: 'document'
	, href: 'document/'
});

menu.register({
	id: 'document'
	, title: '文档 document'
	, icon: 'document'
	, href: 'document/'
});

web.get('/document/', function(req, res){
	let query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	DocumentHandler.getDefaultDocument(user, query).then(DocumentView.document, function(e){
		console.log( e );

		// todo 错误页面
		return '<p class="icon icon-warming msg">'+ e.message +'</p>';
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});


let {getDataSucc , getDataError} = require('../controller.js')
	;

web.get('/document/data', (req, res)=>{
	let query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	DocumentHandler.getDefaultDocument(user, query).then(getDataSucc.bind(null, res), getDataError.bind(null, res));
});

/**
 *
 * */
admin.register({
	id: 'document'
	, metroSize: 'tiny'
	, title: '文档 document'
	, icon: 'document'
	, href: 'document/'
});
web.get('/admin/document/', function(req, res){
	let query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	DocumentHandler.getDocumentList(user, query).then(DocumentAdminView.documentList, function(e){
		console.log( e );

		// todo 错误页面
		return '<p class="icon icon-warming msg">'+ e.message +'</p>';
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});
web.get('/admin/document/:documentId/', function(req, res){
	let param = req.params || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	param.id = param.documentId;

	DocumentHandler.getDocument(user, param).then(DocumentAdminView.document, function(e){
		console.log( e );

		// todo 错误页面
		return '<p class="icon icon-warming msg">'+ e.message +'</p>';
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});

/**
 * post /admin/document/                                    新建文档
 * put  /admin/document/:documentId/                        保存章节排序
 * post /admin/document/:documentId/                        新建章节
 * put  /admin/document/:documentId/:sectionId/             保存内容排序
 * post /admin/document/:documentId/:sectionId/             新建内容
 * put  /admin/document/:documentId/:sectionId/:contentId/  内容详细保存
 * */
web.post(   '/admin/document/', function(req, res){
	let body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	DocumentHandler.newDocument(user, body).then(function(info){
		return {
			info: info
			, msg: 'success'
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
web.put(    '/admin/document/:documentId/', function(req, res){
	let param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.documentId = param.documentId;

	DocumentHandler.saveDocument(user, body).then(function(info){
		return {
			info: info
			, msg: 'success'
		}
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
web.post(   '/admin/document/:documentId/', function(req, res){
	let param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.documentId = param.documentId;

	DocumentHandler.newSection(user, body).then(function(info){
		return {
			info: info
			, msg: 'success'
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
web.put(    '/admin/document/:documentId/:sectionId/', function(req, res){
	let param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.documentId = param.documentId;
	body.sectionId = param.sectionId;

	DocumentHandler.saveSection(user, body).then(function(info){
		return {
			info: info
			, msg: 'success'
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
web.post(   '/admin/document/:documentId/:sectionId/', function(req, res){
	let param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.documentId = param.documentId;
	body.sectionId = param.sectionId;

	DocumentHandler.newContent(user, body).then(function(info){
		return {
			info: info
			, msg: 'success'
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
web.put(    '/admin/document/:documentId/:sectionId/:contentId/', function(req, res){
	let param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.documentId = param.documentId;
	body.sectionId = param.sectionId;
	body.contentId = param.contentId;

	DocumentHandler.saveContent(user, body).then(function(info){
		return {
			info: info
			, msg: 'success'
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