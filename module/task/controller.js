'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, Controller    = require('../controller.js')
	, controller    = new Controller()

	, TaskModel = require('./model.js')
	, TaskView  = require('./view.js')
	, Admin = require('./admin.view.js')
	, TaskError = require('./error.js')
	, TaskHandler = require('./handler.js')
	, taskHandler = new TaskHandler()

	, TaskController = function(){}
	, taskController = {
		'/task/': {
			get: function(req, res){
				var query = req.query || {}
					, user = UserHandler.getUserFromSession.fromReq(req)
					;

				Promise.all([
					TaskModel.getCycleTask(user.id)
					, TaskModel.getTaskAll(user.id)
				]).then(function(results){
					var rs = results[0]
						;

					rs = rs.concat( results[1] );

					return rs;
				}).then( TaskView.taskList ).catch(function(e){
					console.log(e)
				}).then(function(html){
					res.send( config.docType.html5 + html );
					res.end();
				});
			}
			, post: function(req, res){
				var body = req.body || {}
					, user = UserHandler.getUserFromSession.fromReq(req)
					;

				TaskModel.addTaskByUser(user.id, body).then(function(rs){
					var result;

					if( rs && rs.insertId ){

						body.taskId = rs.insertId;

						if( body.type === '2' || body.type === '3' ){
							result = rs;
						}
						else{
							result = TaskModel.addUserTask(user.id, rs.insertId).then(function(rs){
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
			}
		}
		, '/task/:taskId/start':{
			post: function(req, res){
				var param = req.params || {}
					, body = req.body || {}
					, id = body.id
					, type = body.type
					, taskId = param.taskId
					, user = UserHandler.getUserFromSession.fromReq( req )
					, result
					;

				// 判断是否有 id 是否为周期类型任务
				if( id && !(type === '2' || type === '3') ){
					result = TaskModel.execTask( id );
				}
				else{
					result = TaskModel.addUserTask(user.id, taskId).then(function(rs){
						var result;

						if( rs && rs.insertId ){
							id = rs.insertId;
							result = TaskModel.execTask( rs.insertId );
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
			}
		}
		, '/task/:taskId/done': {
			post: function(req, res){
				var param = req.params || {}
					, body = req.body || {}
					, id = body.id
					, type = body.type
					, taskId = param.taskId
					;

				TaskModel.doneTask( id ).then(function(rs){
					var result;

					if( rs && rs.changedRows ){

						if( type === '0' ){
							result = TaskModel.unableTask(taskId);
						}
						if( type === '1' ){
							result = TaskModel.minusTaskTimes(taskId);
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
			}
		}
		, '/task/:taskId/end': {
			post: function(req, res){
				var param = req.params || {}
					, body = req.body || {}
					, id = body.id
					, taskId = param.taskId
					;

				TaskModel.doneTask( id ).then(function(rs){
					var result;

					if( rs && rs.changedRows ){
						result = TaskModel.unableTask(taskId);
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
			}
		}
	}

	, UserHandler      = require('../user/handler.js')

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

menu.register({
	id: 'task'
	, title: '任务 task'
	, icon: 'tasks'
	, href: 'task/'
});

taskController.prototype = controller;

web.get('/task/', function(req, res){
	var query = req.query || {}
		, date = query.date || ''
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	Promise.all([
		TaskModel.getCycleTask(user.id)
		, TaskModel.getTaskAll(user.id)
	]).then(function(results){
		var rs = results[0]
			, temp = results[1]
			;

		rs = rs.filter(function(d){
			var i = temp.length
				, t
				, s, e
				;

			while( i-- ){
				t = temp[i];

				if( (t.type === '2' || t.type === '3') && d.taskId === +t.taskId && t.status ){ // 判断为周期任务且任务 taskId 相同

					if( t.type === '3' ){
						s = taskHandler.weekStartDate() +' 00:00:00';
						e = taskHandler.weekEndDate() +' 23:59:59';
					}
					else if( t.type === '2' ){
						s = taskHandler.todayDate();
						e = s +' 23:59:59';
						s += ' 00:00:00';
					}

					if( s <= t.start && e >= t.start ){
						break;
					}
				}
			}

			return i === -1;
		});

		rs = rs.concat( temp );

		return rs;
	}).then( TaskView.taskList ).catch(function(e){
		console.log(e)
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.post('/task/', function(req, res){
	var body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	TaskModel.addTaskByUser(user.id, body).then(function(rs){
		var result;

		if( rs && rs.insertId ){

			body.taskId = rs.insertId;

			if( body.type === '2' || body.type === '3' ){
				result = rs;
			}
			else{
				result = TaskModel.addUserTask(user.id, rs.insertId).then(function(rs){
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
		, user = UserHandler.getUserFromSession.fromReq( req )
		, result
		;

	// 判断是否有 id 是否为周期类型任务
	if( id && !(type === '2' || type === '3') ){
		result = TaskModel.execTask( id );
	}
	else{
		result = TaskModel.addUserTask(user.id, taskId).then(function(rs){
			var result;

			if( rs && rs.insertId ){
				id = rs.insertId;
				result = TaskModel.execTask( rs.insertId );
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

	TaskModel.doneTask( id ).then(function(rs){
		var result;

		if( rs && rs.changedRows ){

			if( type === '0' ){
				result = TaskModel.unableTask(taskId);
			}
			if( type === '1' ){
				result = TaskModel.minusTaskTimes(taskId);
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

	TaskModel.doneTask( id ).then(function(rs){
		var result;

		if( rs && rs.changedRows ){
			result = TaskModel.unableTask(taskId);
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


module.exports = TaskController;