'use strict';

var db = require('../db.js')
	, error = require('../error.js')

	, TABLE_NAME = 'task'

	, SQL = {
		taskById: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId'
		, taskAll: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where user_id=:userId' +
			' order by exec_start'
		, taskByType: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' type=:type'
		, taskByCreateDate: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' date_format(create_datetime,\'%Y-%m-%d\')=:date'
		, taskDoingBeforeDate: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' exec_status=0 and' +
				' date_format(exec_start,\'%Y-%m-%d\')<:date' +
			' order by exec_start'
		, taskByStartDate: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' date_format(exec_start,\'%Y-%m-%d\')=:date' +
			' order by exec_start'

		, taskAdd: 'insert task(name,exec_start,exec_end,type,user_id) values(:taskName,:taskStartTime,:taskEndTime,:taskType,:userId)'

		, taskDone: 'update '+ TABLE_NAME +' set done_datetime=now(),exec_status=1' +
			' where id=:id'
	}

	, Model = {
		dateFormat: function(date){
			var m = date.getMonth() +1
				, d = date.getDate()
				;

			return date.getFullYear() +'-'+ (m > 9 ? m : '0'+ m) +'-'+ (d > 9 ? d : '0'+ d);
		}
		, getTaskAll: function(userId){
			return db.handle({
				sql: SQL.taskAll
				, data: {
					userId: userId
				}
			});
		}
		, getTaskByStartDate: function(userId, startDate){
			var m
				, d
				;

			if( !startDate ){
				startDate = new Date();
			}

			startDate = this.dateFormat( startDate );

			return db.handle({
				sql: SQL.taskByStartDate
				, data: {
					userId: userId
					, date: startDate
				}
			});
		}
		, getTaskDoingBeforeDate: function(userId, startDate){
			var m
				, d
				;

			if( !startDate ){
				startDate = new Date();
			}

			startDate = this.dateFormat( startDate );

			return db.handle({
				sql: SQL.taskDoingBeforeDate
				, data: {
					userId: userId
					, date: startDate
				}
			});
		}
		, add: function(userId, task){
			task.userId = userId;

			return db.handle({
				sql: SQL.taskAdd
				, data: task
			});
		}
		, doneTask: function(id){
			return db.handle({
				sql: SQL.taskDone
				, data: {
					id: id
				}
			});
		}
	}
	;

module.exports = Model;