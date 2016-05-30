'use strict';

var db = require('../db.js')
	, config    = require('../../config.js')
	, error = require('../error.js')

	, TABLE_NAME = 'task'
	, USER_TASK = 'user_task'

	, task = {
		taskId: ''
		, name: ''
		, creatorId: ''
		, score: ''
		, type: ''
		, times: ''
		, timeConsume: ''
		, hopeStartDate: ''
		, hopeStartTime: ''
		, hopeEndDate: ''
		, hopeEndTime: ''
		, target: ''
		, tags: ''
		, desc: ''
		, lv: ''
		, enable: ''
	}

	, userTask = {
		userId: ''
		, taskId: ''
		, execStart: ''
		, execEnd: ''
		, status: ''
	}

	, SQL = {
		taskByCycleType: 'select id as taskId,' +
				'name,' +
				'create_datetime as datetime,' +
				'score,' +
				'type,' +
				'times,' +
				'time_consume as timeConsume,' +
				'hope_start_date as hopeStartDate,' +
				'hope_start_time as hopeStartTime,' +
				'hope_end_date as hopeEndDate,' +
				'hope_end_time as hopeEndTime,' +
				'target,' +
				'tags,' +
				'`desc`,' +
				'lv' +
			' from task' +
			' where creator_id=:userId' +
			' and' +
				' target=\'1\'' +
			' and' +
				' (' +
					'type=\'2\'' +
				' or' +
					' type=\'3\'' +
				')' +
			' and enable=\'0\'' +
			' order by create_datetime desc'

		, userTaskAll: 'select ut.id as id,' +
				'ut.task_id as taskId,' +
				'name,' +
				'create_datetime as datetime,' +
				'score,' +
				'type,' +
				'times,' +
				'time_consume as timeConsume,' +
				'hope_start_date as hopeStartDate,' +
				'hope_start_time as hopeStartTime,' +
				'hope_end_date as hopeEndDate,' +
				'hope_end_time as hopeEndTime,' +
				'target,' +
				'tags,' +
				'`desc`,' +
				'lv,' +
				'exec_start as start,' +
				'exec_end as end,' +
				'status' +
			' from task,user_task as ut' +
			' where' +
				' user_id=:userId' +
			' and' +
				' task.id=ut.task_id' +
			' order by status,id desc'

		, taskAdd: 'insert task(' +
				'name,' +
				'creator_id,' +
				'score,' +
				'type,' +
				'times,' +
				'time_consume,' +
				'hope_start_date,' +
				'hope_start_time,' +
				'hope_end_date,' +
				'hope_end_time,' +
				'target,' +
				'tags,' +
				'`desc`,' +
				'lv)' +
			' values(:name,:userId,:score,:type,:times,:timeConsume,:hopeStartDate,:hopeStartTime,:hopeEndDate,:hopeEndTime,:target,:tags,:desc,:lv)'

		, userTaskAdd: 'insert user_task(task_id,user_id) values(:taskId,:userId)'

		, taskUnable: 'update task set enable=\'1\' where id=:taskId'
		, taskMinusTimes: 'update task set times=times-1 where id=:taskId'

		, userTaskStart: 'update user_task set exec_start=now(),status=\'1\' where id=:id'
		, userTaskEnd: 'update user_task set exec_end=now(),status=\'2\' where id=:id'
	}

	, TaskModel = {
		dateFormat: function(date){
			var m = date.getMonth() +1
				, d = date.getDate()
				;

			return date.getFullYear() +'-'+ (m > 9 ? m : '0'+ m) +'-'+ (d > 9 ? d : '0'+ d);
		}

		/**
		 * 获取周期性任务
		 * */
		, getCycleTask: function(userId){
			return db.handle({
				sql: SQL.taskByCycleType
				, data: {
					userId: userId
				}
			});
		}
		, getTaskAll: function(userId){
			return db.handle({
				sql: SQL.userTaskAll
				, data: {
					userId: userId
				}
			});
		}

		, addTaskByUser: function(userId, task){
			task.userId = userId;
			task.lv = 1;
			task.score = task.score || 0;

			return db.handle({
				sql: SQL.taskAdd
				, data: task
			});
		}
		, addTaskByAdmin: function(){}

		, unableTask: function(taskId){
			return db.handle({
				sql: SQL.taskUnable
				, data: {
					taskId: taskId
				}
			});
		}
		, minusTaskTimes: function(taskId){
			return db.handle({
				sql: SQL.taskMinusTimes
				, data: {
					taskId: taskId
				}
			});
		}

		, addUserTask: function(userId, taskId){
			return db.handle({
				sql: SQL.userTaskAdd
				, data: {
					userId: userId
					, taskId: taskId
				}
			});
		}

		, execTask: function(id){
			return db.handle({
				sql: SQL.userTaskStart
				, data: {
					id: id
				}
			});
		}
		, doneTask: function(id){
			return db.handle({
				sql: SQL.userTaskEnd
				, data: {
					id: id
				}
			});
		}
	}
	;

//db.handle({
//	sql: 'show columns from '+ TABLE_NAME +' from destiny'
//}).then(function(rs){
//	console.log(rs)
//})

module.exports = TaskModel;