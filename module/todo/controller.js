'use strict';

var CONFIG      = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserHandler   = require('../user/handler.js')

	, TodoView = require('./view.js')
	, TodoAdminView = require('./admin.view.js')
	, TodoHandler = require('./handler.js')
	;

//modules.register({
//	id: 'document'
//	, metroSize: 'tiny'
//	, title: '任务 todo'
//	, icon: 'tasks'
//	, href: 'todo/'
//	, hrefTitle: '待做事项'
//});
//
//menu.register({
//	id: 'todo'
//	, title: '任务 todo'
//	, icon: 'task'
//	, href: 'todo/'
//});

web.get('/todo/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	TodoHandler.getTodoList(user, query).then(TodoView.todoList, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});