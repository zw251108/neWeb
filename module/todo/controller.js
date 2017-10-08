'use strict';

let CONFIG      = require('../../config.js')
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
	let query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	TodoHandler.getTodoList(user, query).then(TodoView.todoList, function(e){
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

web.get('/todo/data', (req, res)=>{
	let query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	TodoHandler.getTodoList(user, query).then(getDataSucc.bind(null, res), getDataError.bind(null, res));
});