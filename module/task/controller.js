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
	, TodoError = require('./error.js')

	, User      = require('../user/user.js')

	, Promise   = require('promise')
	;

modules.register({
	id: 'task'
	, metroSize: 'tiny'
	, title: '任务 task'
	, icon: 'tasks'
	, href: 'task/'
	, hrefTitle: '待做任务'
});

web.get('/task/', function(req, res){
	var query = req.query || {}
		, date = query.date || ''
		, user = User.getUserFromSession.fromReq(req)
		;

	Model.getTaskByStartDate(user.id, date).then( View.taskList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.post('/task/:taskId/done', function(req, res){
	var param = req.params || {}
		, taskId = param.taskId
		;

	Model.doneTask(taskId).then(function(){
		var json = {
			success: true
		};

		res.send( JSON.stringify(json) );
		res.end();
	});
});