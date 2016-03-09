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

	//, Promise   = require('promise')
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

	Promise.all([
		Model.getCycleTask(user.id)
		, Model.getTaskAll(user.id)
	]).then(function(results){
		var rs = results[0]
			;

		rs = rs.concat( results[1] );

		return rs;
	}).then( View.taskList).catch(function(e){
		console.log(e)
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.post('/task/', function(req, res){
	var body = req.body || {}
		, user = User.getUserFromSession.fromReq(req)
		;

	Model.addTaskByUser(user.id, body).then(function(rs){
		var result;

		if( rs && rs.insertId ){

			body.taskId = rs.insertId;

			if( body.type === '2' || body.type === '3' ){
				result = rs;
			}
			else{
				result = Model.addUserTask(user.id, rs.insertId).then(function(rs){
					var result;

					if( rs && rs.insertId ){
						body.id = rs.insertId;
						body.status = 0;
						result = rs;
					}
					else{
						result = Promise.reject( new TaskError('用户任务创建失败') );
					}

					return result;
				});
			}
		}
		else{
			result = Promise.reject( new TaskError('创建任务失败') );
		}

		return result;
	}).then(function(rs){
		var result;

		if( rs && rs.insertId ){
			result = {
				success: true
				, info: body
			};
		}
		else{
			result = Promise.reject( new TaskError('用户任务创建失败') );
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

web.post('/task/:taskId/start', function(req, res){
	var param = req.params || {}
		, body = req.body || {}
		, id = body.id
		, type = body.type
		, taskId = param.taskId
		, user = User.getUserFromSession.fromReq( req )
		, result
		;

	// 判断是否有 id 是否为周期类型任务
	if( id && !(type === '2' || type === '3') ){
		result = Model.execTask( id );
	}
	else{
		result = Model.addUserTask(user.id, taskId).then(function(rs){
			var result;

			if( rs && rs.insertId ){
				id = rs.insertId;
				result = Model.execTask( rs.insertId );
			}
			else{
				result = Promise.reject( new TaskError('用户任务创建失败') );
			}

			return result;
		});
	}

	result.then(function(rs){
		var result;

		if( rs && rs.changedRows ){
			result = {
				success: true
				, info: {
					id: id
					, status: 1
				}
			};
		}
		else{
			result = Promise.reject( new Error('用户任务接受失败') );
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
		, body = req.body || {}
		, id = body.id
		, type = body.type
		, taskId = param.taskId
		;

	Model.doneTask( id ).then(function(rs){
		var result;

		if( rs && rs.changedRows ){

			if( type === '0' ){
				result = Model.unableTask(taskId);
			}
			if( type === '1' ){
				result = Model.minusTaskTimes(taskId);
			}
			else{
				result = Promise.resolve(rs);
			}
		}
		else{
			result = Promise.reject( new TaskError('完成任务失败') );
		}

		return result;
	}).then(function(rs){
		var result;

		if( rs && rs.changedRows ){
			result = {
				success: true
				, info: {
					id: id
				}
			};
		}
		else{
			result = Promise.reject( new TaskError('数据库错误') );
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

web.post('/task/:taskId/end', function(req, res){
	var param = req.params || {}
		, body = req.body || {}
		, id = body.id
		, taskId = param.taskId
		;

	Model.doneTask( id ).then(function(rs){
		var result;

		if( rs && rs.changedRows ){
			result = Model.unableTask(taskId);
		}
		else{
			result = Promise.reject( new TaskError('完成任务失败') );
		}

		return result;
	}).then(function(rs){
		var result;

		if( rs && rs.changedRows ){
			result = {
				success: true
				, info: {
					id: id
				}
			};
		}
		else{
			result = Promise.reject( new TaskError('结束周期任务失败') );
		}

		return result;
	}).catch(function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		}
	}).then(function(send){
		res.send( JSON.stringify(send) );
		res.end();
	});
});