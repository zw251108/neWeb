'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, TaskView  = require('./view.js')
	, TaskAdminView = require('./admin.view.js')
	, TaskHandler   = require('./handler.js')

	, UserHandler   = require('../user/handler.js')
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

web.get('/task/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	TaskHandler.getTaskList(user, query).then(TaskView.taskList, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});

	//Promise.all([
	//	TaskModel.getCycleTask(user.id)
	//	, TaskModel.getTaskAll(user.id)
	//]).then(function(results){
	//	var rs = results[0]
	//		, temp = results[1]
	//		;
	//
	//	rs = rs.filter(function(d){
	//		var i = temp.length
	//			, t
	//			, s, e
	//			;
	//
	//		while( i-- ){
	//			t = temp[i];
	//
	//			if( (t.type === '2' || t.type === '3') && d.taskId === +t.taskId && t.status ){ // 判断为周期任务且任务 taskId 相同
	//
	//				if( t.type === '3' ){
	//					s = taskHandler.weekStartDate() +' 00:00:00';
	//					e = taskHandler.weekEndDate() +' 23:59:59';
	//				}
	//				else if( t.type === '2' ){
	//					s = taskHandler.todayDate();
	//					e = s +' 23:59:59';
	//					s += ' 00:00:00';
	//				}
	//
	//				if( s <= t.start && e >= t.start ){
	//					break;
	//				}
	//			}
	//		}
	//
	//		return i === -1;
	//	});
	//
	//	rs = rs.concat( temp );
	//
	//	return rs;
	//}).then( TaskView.taskList ).catch(function(e){
	//	console.log(e)
	//}).then(function(html){
	//	res.send( config.docType.html5 + html );
	//	res.end();
	//});
});

web.post('/task/', function(req, res){
	var body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	TaskHandler.newTask(user, body).then(function(info){
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

	//TaskModel.addTaskByUser(user.id, body).then(function(rs){
	//	var result;
	//
	//	if( rs && rs.insertId ){
	//
	//		body.taskId = rs.insertId;
	//
	//		if( body.type === '2' || body.type === '3' ){
	//			result = rs;
	//		}
	//		else{
	//			result = TaskModel.addUserTask(user.id, rs.insertId).then(function(rs){
	//				var result;
	//
	//				if( rs && rs.insertId ){
	//					body.id = rs.insertId;
	//					body.status = 0;
	//					result = rs;
	//				}
	//				else{
	//					result = TaskHandler.getError('用户任务创建失败');
	//				}
	//
	//				return result;
	//			});
	//		}
	//	}
	//	else{
	//		result = TaskHandler.getError('创建任务失败');
	//	}
	//
	//	return result;
	//}).then(function(rs){
	//	var result;
	//
	//	if( rs && rs.insertId ){
	//		result = {
	//			info: body
	//			, msg: 'success'
	//		};
	//	}
	//	else{
	//		result = TaskHandler.getError('用户任务创建失败');
	//	}
	//
	//	return result;
	//}).catch(function(e){
	//	console.log( e );
	//
	//	return {
	//		msg: e.message
	//	};
	//}).then(function(send){
	//	res.send( JSON.stringify(send) );
	//	res.end();
	//});
});

web.post('/task/:taskId/start', function(req, res){
	var param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.taskId = param.taskId;

	TaskHandler.updateTaskStart(user, body).then(function(info){
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

	//// 判断是否有 id 是否为周期类型任务
	//if( id && !(type === '2' || type === '3') ){
	//	result = TaskModel.execTask( id );
	//}
	//else{
	//	result = TaskModel.addUserTask(user.id, taskId).then(function(rs){
	//		var result;
	//
	//		if( rs && rs.insertId ){
	//			id = rs.insertId;
	//			result = TaskModel.execTask( rs.insertId );
	//		}
	//		else{
	//			result = TaskHandler.getError('用户任务创建失败');
	//		}
	//
	//		return result;
	//	});
	//}
	//
	//result.then(function(rs){
	//	var result;
	//
	//	if( rs && rs.changedRows ){
	//		result = {
	//			info: {
	//				id: id
	//				, status: 1
	//			}
	//			, msg: 'success'
	//		};
	//	}
	//	else{
	//		result = Promise.reject( new Error('用户任务接受失败') );
	//	}
	//
	//	return result;
	//}).catch(function(e){
	//	console.log( e );
	//
	//	return {
	//		msg: e.message
	//	};
	//}).then(function(send){
	//	res.send( JSON.stringify(send) );
	//	res.end();
	//});
});

web.post('/task/:taskId/done', function(req, res){
	var param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.taskId = param.taskId;

	TaskHandler.updateTaskDone(user, body).then(function(info){
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

	//TaskModel.doneTask( id ).then(function(rs){
	//	var result;
	//
	//	if( rs && rs.changedRows ){
	//
	//		if( type === '0' ){
	//			result = TaskModel.unableTask(taskId);
	//		}
	//		if( type === '1' ){
	//			result = TaskModel.minusTaskTimes(taskId);
	//		}
	//		else{
	//			result = Promise.resolve(rs);
	//		}
	//	}
	//	else{
	//		result = TaskHandler.getError('完成任务失败');
	//	}
	//
	//	return result;
	//}).then(function(rs){
	//	var result;
	//
	//	if( rs && rs.changedRows ){
	//		result = {
	//			info: {
	//				id: id
	//			}
	//			, msg: 'success'
	//		};
	//	}
	//	else{
	//		result = TaskHandler.getError('数据库错误');
	//	}
	//
	//	return result;
	//}).catch(function(e){
	//	console.log( e );
	//
	//	return {
	//		msg: e.message
	//	};
	//}).then(function(send){
	//	res.send( JSON.stringify(send) );
	//	res.end();
	//});
});

web.post('/task/:taskId/end', function(req, res){
	var param = req.params || {}
		, body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.taskId = param.taskId;

	TaskHandler.updateTaskEnd(user, body).then(function(info){
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

	//TaskModel.doneTask( id ).then(function(rs){
	//	var result;
	//
	//	if( rs && rs.changedRows ){
	//		result = TaskModel.unableTask(taskId);
	//	}
	//	else{
	//		result = TaskHandler.getError('完成任务失败');
	//	}
	//
	//	return result;
	//}).then(function(rs){
	//	var result;
	//
	//	if( rs && rs.changedRows ){
	//		result = {
	//			info: {
	//				id: id
	//			}
	//			, msg: 'success'
	//		};
	//	}
	//	else{
	//		result = TaskHandler.getError('结束周期任务失败');
	//	}
	//
	//	return result;
	//}).catch(function(e){
	//	console.log( e );
	//
	//	return {
	//		msg: e.message
	//	}
	//}).then(function(send){
	//	res.send( JSON.stringify(send) );
	//	res.end();
	//});
});

web.post('/task/:taskId/', function(req, res){

});

web.put('/task/:taskId/:checkitemId/', function(req, res){

});


//module.exports = TaskController;