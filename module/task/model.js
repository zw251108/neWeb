'use strict';

var db = require('../db.js')
	, error = require('../error.js')

	, TABLE_NAME = 'task'

	, SQL = {
		taskById: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId'
		, taskByType: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' type=:type'
		, taskByCreateDate: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' date_format(create_datetime,\'%Y-%m-%d\')=:date'
		, taskByStartDate: 'select id,name,create_datetime as datetime,exec_start as start,exec_end as end,exec_status as status,type from '+ TABLE_NAME +
			' where' +
				' user_id=:userId and' +
				' date_format(exec_start,\'%Y-%m-%d\')=:date'

		, taskDone: 'update '+ TABLE_NAME +' set done_datetime=now(),exec_status=1' +
			' where id=:id'
	}

	, Model = {
		getTaskByStartDate: function(userId, startDate){
			var m
				, d
				;

			if( !startDate ){
				startDate = new Date();

				m = startDate.getMonth() +1;
				d = startDate.getDate();

				startDate = startDate.getFullYear() +'-'+ (m > 9 ? m : '0'+ m) +'-'+ (d > 9 ? d : '0'+ d);
			}

			return db.handle({
				sql: SQL.taskByStartDate
				, data: {
					userId: userId
					, date: startDate
				}
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