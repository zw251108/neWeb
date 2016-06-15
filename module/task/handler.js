'use strict';

var CONFIG = require('../../config.js')
	, UserHandler   = require('../user/handler.js')

	, Tools = require('../tools.js')

	, TaskModel = require('./model.js')
	, TaskError = require('./error.js')
	, TaskHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new TaskError(msg) );
		}

		// 时间格式处理
		, dateFormat: Tools.dateFormat
		, weekStartDate: function(){
			var date = new Date()
				, month = date.getMonth()
				, day = date.getDate()
				, week = date.getDay()
				;

			day = day - week + 1;

			date = new Date(date.getFullYear(), month, day);

			day = date.getDate();
			month = date.getMonth();

			month += 1;
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;

			return date.getFullYear() + '-' + month + '-' + day;
		}
		, weekEndDate: function(){
			var date = new Date()
				, month = date.getMonth()
				, day = date.getDate()
				, week = date.getDay()
				;

			day = day - week + 7;

			date = new Date(date.getFullYear(), month, day);

			day = date.getDate();
			month = date.getMonth();

			month += 1;
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;

			return date.getFullYear() + '-' + month + '-' + day;
		}
		, todayDate: function(d){
			var date = new Date()
				, month = date.getMonth()
				, day = date.getDate()
				;
			month += 1;
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;

			return date.getFullYear() + '-' + month + '-' + day;
		}

		, getTaskList: function(user, query){
			var execute
				, keyword = query.keyword
				, tags = query.tags
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				execute = Promise.all([
					TaskModel.getCycleTask( user.id )
					, TaskModel.getTaskAll( user.id )
				]).then( TaskHandler.mergeTaskData );
			}

			return execute;
		}
		, mergeTaskData: function(taskData){
			var cycle = taskData[0]
				, all = taskData[1]
				, weekStart = TaskHandler.weekStartDate() + ' 00:00:00'
				, weekEnd = TaskHandler.weekEndDate() + ' 23:59:59'
				, today = TaskHandler.todayDate()
				, todayStart = today + ' 00:00:00'
				, todayEnd = today + ' 23:59:59'
				;

			cycle = cycle.filter(function(d){
				var i = all.length
					, t
					, s, e
					;

				while( i-- ){
					t = all[i];

					if( (t.type === '2' || t.type === '3') && d.taskId === +t.taskId && t.status ){ // 判断为周期任务且任务 taskId 相同

						if( t.type === '3' ){
							s = weekStart;
							e = weekEnd;
						}
						else if( t.type === '2' ){
							s = todayStart;
							e = todayEnd;
						}

						if( s <= t.start && e >= t.start ){
							break;
						}
					}
				}

				return i === -1;
			});


			cycle = cycle.concat( all );

			return cycle;
		}

		, getTaskByType: function(user, query){

		}

		, getTaskById: function(user, query){

		}

		, newTask: function(user, data){
			var name = data.name
				, execute
				;

			if( name ){
				execute = TaskModel.addTaskByUser(user.id, data).then(function(rs){
					var result
						;

					if( rs.insertId ){

						data.taskId = rs.insertId;

						if( data.type === '2' || data.type === '3' ){
							result = data;
						}
						else{
							result = TaskModel.addUserTask(user.id, rs.insertId).then(function(rs){
								var result
									;

								if( rs.insertId ){
									data.id = rs.insertId;
									data.status = 0;

									result = data;
								}
								else{
									result = Promise.reject( new TaskError(name + ' 任务接受失败') );
								}

								return result;
							});
						}
					}
					else{
						result = Promise.reject( new TaskError(name + ' 任务创建失败') );
					}

					return result;
				//}).then(function(){
				//
				//}, function(data){
				//	// 为周期任务
				//
				//	return data;
				//}).then(function(data){
				//	return data;
				});
			}
			else{
				execute = Promise.reject( new TaskError('缺少参数 name') );
			}

			return execute;
		}
		, saveTask: function(user, data){

		}

		, updateTaskStart: function(user, data){
			var id = data.id
				, type = data.type
				, taskId = data.taskId
				, execute
				;

			// 判断是否有 id 是否为周期类型任务
			if( id && !(type === '2' || type === '3') ){
				execute = Promise.resolve( id );
				//	TaskModel.execTask( id ).then(function(rs){
				//	var result
				//		;
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
				//		result = Promise.reject( new TaskError('任务接受失败') );
				//	}
				//
				//	return result;
				//});
			}
			else{
				execute = TaskModel.addUserTask(user.id, taskId).then(function(rs){
					var result;

					if( rs && rs.insertId ){
						id = rs.insertId;
						result = Promise.resolve( rs.insertId );
					}
					else{
						result = Promise.reject( new TaskError('用户任务创建失败') );
					}

					return result;
				});
			}

			execute = execute.then(function(id){
				return TaskModel.execTask( id ).then(function(rs){
					var result
						;

					if( rs && rs.changedRows ){
						result = {
							info: {
								id: id
								, status: 1
							}
							, msg: 'success'
						};
					}
					else{
						result = Promise.reject( new TaskError('任务接受失败') );
					}

					return result;
				});
			});

			return execute;
		}
		, updateTaskDone: function(user, data){
			var id = data.id
				, type = data.type
				, taskId = data.taskId
				, execute
				;

			execute = TaskModel.doneTask( id ).then(function(rs){
				var result
					;

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
						info: {
							id: id
						}
						, msg: 'success'
					};
				}
				else{
					result = Promise.reject( new TaskError('数据库错误') );
				}

				return result;
			});

			return execute;
		}
		, updateTaskEnd: function(user, data){
			var id = data.id
				, type = data.type
				, taskId = data.taskId
				, execute
				;

			execute = TaskModel.doneTask( id ).then(function(rs){
				var result
					;

				if( rs && rs.changedRows ){
					result = TaskModel.unableTask( taskId );
				}
				else{
					result = Promise.reject( new TaskError('完成任务失败') );
				}

				return result;
			}).then(function(rs){
				var result;

				if( rs && rs.changedRows ){
					result = {
						info: {
							id: id
						}
						, msg: 'success'
					};
				}
				else{
					result = Promise.reject( new TaskError('结束周期任务失败') );
				}

				return result;
			});

			return execute;
		}

		, newCheckitem: function(user, data){

		}
		, saveCheckitem: function(user, data){

		}
	}
	;

module.exports = TaskHandler;