'use strict';

var Handler = require('../handler.js')
	, handler = new Handler()

	, TaskHandler = function(){}
	;

// 扩展接口
handler.extend({
	weekStartDate: function(){
		var date = new Date()
			, month = date.getMonth()
			, day = date.getDate()
			, week = date.getDay()
			;

		day = day - week +1;

		date = new Date(date.getFullYear(), month, day);

		day = date.getDate();
		month = date.getMonth();

		month += 1;
		month = month > 9 ? month : '0'+ month;
		day = day > 9 ? day : '0'+ day;

		return date.getFullYear() +'-'+ month +'-'+ day;
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
		month = month > 9 ? month : '0'+ month;
		day = day > 9 ? day : '0'+ day;

		return date.getFullYear() +'-'+ month +'-'+ day;
	}
});

TaskHandler.prototype = handler;

module.exports = TaskHandler;