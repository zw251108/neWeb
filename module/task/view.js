'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')

	, dateFormat = function(date){
		var m = date.getMonth() +1
			, d = date.getDate()
			;

		return date.getFullYear() +'-'+ (m > 9 ? m : '0'+ m) +'-'+ (d > 9 ? d : '0'+ d)
	}

	, tabTpl    = emmetTpl({
		template: 'a.tab{%tabName%}'
	})

	, taskTpl = emmetTpl({
		template: 'li.task.%status%[data-id=%id% data-status=%status% data-start=%start% data-end=%end%]' +
			'>label.task_name' +
				'>input[type=radio %checked%]' +
				'+span.icon.icon-radio{ %name%}' +
			'^div.task_deadline{%start% —— %end%}'
		, filter: {
			status: function(d){
				var date = new Date();
				return +d.status ? 'task-done' : (d.end < dateFormat(date) ? 'task-delay' : '');
			}
			, checked: function(d){
				return +d.status ? ' checked="checked" disabled="disabled"' : ''
			}
		}
	})

	, taskAddFormTpl = emmetTpl({
		template: 'form#addTaskForm[action=./ method=post]' +
			'div.formGroup' +
				'>label.label[for=taskName]{请添加任务名称}' +
				'+input#taskName.input[type=text name=taskName placeholder=任务名称 data-validator=name]' +
			'^div.formGroup' +
				'>label.label[for=taskStartDate]{请设置任务开始时间}' +
				'+div.input-datetime' +
					'>input#taskStartDate.input[type=date name=taskStartDate placeholder=开始日期 data-validator=date]' +
					'+input#taskStartTime.input[type=time name=taskStartTime placeholder=开始时间 data-validator=time]' +
			'^^div.formGroup' +
				'>label.label[for=taskEndTime]{请设置任务结束时间}' +
				'+div.input-datetime' +
					'>input#taskEndDate.input[type=date name=taskEndDate placeholder=结束日期 data-validator=date]' +
					'+input#taskEndTime.input[type=time name=taskEndTime placeholder=结束时间 data-validator=time]' +
			'^^div.formGroup' +
				'>label.label{请选择任务类型}' +
				'+div.input.input-pickGroup' +
					'>input#taskOnce[type=radio name=taskType value=0]' +
					'+label.icon.icon-radio[for=taskOnce]{一次}' +
					'+input#taskPerDay[type=radio name=taskType value=1]' +
					'+label.icon.icon-radio[for=taskPerDay]{每天}' +
					'+input#taskPerWeek[type=radio name=taskType value=2]' +
					'+label.icon.icon-radio[for=taskPerWeek]{每周}'
	})

	, tabName = [{
		tabName: '全部'}, {
		tabName: '未完成'}, {
		tabName: '已完成'
	}]
	, taskStatus = ['进行中']

	, View = {
		taskList: function(rs){
			return tpl({
				title: '任务 task'
				, main: {
					moduleMain: {
						id: 'task'
						, title: '待做任务 task'
						, toolbar: [{
							type: 'button', id: 'add', icon: 'plus', title: '添加任务'
						}]
						, content: '<div class="tabWrap">'+ tabTpl(tabName).join('') +'</div>' +
							'<ul class="taskList" id="taskList">'+ taskTpl(rs).join('') +'</ul>'
					}
					, modulePopup: [{
						id: 'addTaskPopup'
						, size: 'normal'
						, content: taskAddFormTpl({})
						, button: '<button type="button" id="addTask" class="btn btn-submit">确定</button>'
					}]
				}
				, footer: {
					nav: modules.current('task')
				}
				, script: {
					main: '../script/module/task/index'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;