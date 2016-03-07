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
	, TaskError = require('./error.js')

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

	//Promise.all([
	//	Model.getTaskDoingBeforeDate(user.id, date)
	//	, Model.getTaskByStartDate(user.id, date)
	//]).then(function(results){
	//	return results[0].concat( results[1] );
	//})
	Model.getTaskAll( user.id )
		.then( View.taskList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.post('/task/', function(req, res){
	var body = req.body || {}
		, user = User.getUserFromSession.fromReq(req)
		;

	body.taskStartTime = body.taskStartDate +' '+ body.taskStartTime + ':00';
	body.taskEndTime = body.taskEndDate +' '+ body.taskEndTime + ':00';

	Model.add(user.id, body).then(function(rs){
		var result;

		if( rs && rs.insertId ){
			result = body;
			result.id = rs.insertId;

			result = {
				info: result
			}
		}
		else{
			result = Promise.reject( new TaskError('创建任务失败') );
		}

		return result;
	}).catch(function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		};
	}).then(function(send){
		res.send( JSON.stringify(send) );
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