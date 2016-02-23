'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
//, pagination    = require('../pagination.js')

//, tagView   = require('../tag/view.js')

	, tabTpl    = emmetTpl({
		template: 'a.tab{%tabName%}'
	})

	, taskTpl = emmetTpl({
		template: 'li.task.%status%[data-id=%id% data-status=%status% data-start=%start% data-end=%end%]>label.task_name>input[type=radio %checked%]+span.icon.icon-radio{ %name%}^div.task_deadline{%start% —— %end%}'
		, filter: {
			status: function(d){
				return +d.status ? 'task-done' : '';
			}
			, checked: function(d){
				return +d.status ? ' checked="checked" disabled="disabled"' : ''
			}
		}
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
						, title: '待做任务'
						, content: '<div class="tabWrap">'+ tabTpl(tabName).join('') +'</div>' +
							'<ul class="taskList">'+ taskTpl(rs).join('') +'</ul>'
					}
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