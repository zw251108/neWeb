'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')

	, TagView   = require('../tag/view.js')

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
		template: 'li.task.%statusClass%[data-id=%id% data-status=%status% data-task-id=%taskId% data-type=%type% data-lv=%lv%]' +
				'>span.task_status{%statusText%}' +
				'+span.task_lv{%lvText%}' +
				'+span.task_type{%typeText%}' +
				'+span.task_name{%name%}' +
				'+span.icon.icon-up+{%taskOperate%}' +
			'+table.hidden.task_detail' +
				'>thead' +
					'>tr' +
						'>th' +
						'+th' +
				'^^tbody' +
					'>tr' +
						'>td{创建时间}' +
						'+td{%datetime%}' +
					'^tr' +
						'>td{期望执行时间}' +
						'+td{%hopeStartDate% %hopeStartTime% —— %hopeEndDate% %hopeEndTime%}' +
					'^tr' +
						'>td{预计花费时间}' +
						'+td{%timeConsume%}' +
					'^tr' +
						'>td{可执行次数}' +
						'+td{%times% 次}' +
					'^tr' +
						'>td{任务描述}' +
						'+td{%desc%}' +
			'^^^div.tagsArea{%tags%}'
		, filter: {
			statusClass: function(d){
				var status = d.status || ''
					, result = ''
					;

				if( !status ){  // 未接受
					result = 'task-notReceived';
				}
				else if( status === '0' ){  // 未开始
					result = 'task-notStart'
				}
				else if( status === '1' ){  // 进行中
					result = 'task-doing'
				}
				else if( status === '2' ){  // 已完成
					result = 'task-done'
				}

				return result;
			}
			, statusText: function(d){
				var text = ['未开始', '进行中', '已完成']
					;

				return ('['+ ('status' in d ? text[d.status] : '未接受') +']') || '';
			}
			, lvText: function(d){
				var text = ['系统', '用户']
					;

				return ('['+ text[d.lv] +']') || '';
			}
			, typeText: function(d){
				var text = ['单次', '多次', '每天', '每周']
					;

				return ('['+ text[d.type] +']') || '';
			}
			, taskOperate: function(d){
				var status = d.status
					, result = ''
					;

				if( !status || status === '0' ){  // 未接受 或 未开始
					result = '<button type="button" class="btn task_start">开始</button>';
				}
				else if( status === '1' ){  // 已开始
					result = '<button type="button" class="btn btn-submit task_done">完成</button>';

					if( d.lv === '1' && (d.type === '2' || d.type === '3') ){ // 为用户发布 周期任务
						result = '<button type="button" class="btn task_end">永久结束</button>'+ result;
					}
				}

				return result;
			}
			, hopeStartDate: function(d){
				var date
					, result = ''
					, month, day, week
					;

				if( d.hopeStartDate && d.hopeStartDate !== '0000-00-00' ){
					result = d.hopeStartDate;
				}
				else{
					if( d.type === '2' || d.type === '3' ){
						date = new Date();

						month = date.getMonth();
						day = date.getDate();

						if( d.type === '3' ){
							week = date.getDay();

							day = day - week +1;

							date = new Date(date.getFullYear(), month, day);

							day = date.getDate();
							month = date.getMonth();
						}

						month += 1;
						month = month > 9 ? month : '0'+ month;
						day = day > 9 ? day : '0'+ day;

						result = date.getFullYear() +'-'+ month +'-'+ day;
					}
				}

				return result;
			}
			, hopeStartTime: function(d){
				var result = ''
					;

				if( d.hopeStartTime && d.hopeStartTime !== '00:00:00' ){
					result = d.hopeStartTime;
				}
				else{
					if( d.type === '2' || d.type === '3' ){
						result = '00:00:00';
					}
				}

				return result;
			}
			, hopeEndDate: function(d){
				var date
					, result = ''
					, month, day, week
					;

				if( d.hopeEndDate && d.hopeEndDate !== '0000-00-00' ){
					result = d.hopeEndDate;
				}
				else{
					if( d.type === '2' || d.type === '3' ){
						date = new Date();

						month = date.getMonth();
						day = date.getDate();

						if( d.type === '3' ){
							week = date.getDay();

							day = day - week + 7;

							date = new Date(date.getFullYear(), month, day);

							day = date.getDate();
							month = date.getMonth();
						}

						month += 1;
						month = month > 10 ? month : '0' + month;
						day = day > 10 ? day : '0' + day;

						result = date.getFullYear() + '-' + month + '-' + day;
					}
				}

				return result;
			}
			, hopeEndTime: function(d){
				var result = ''
					;

				if( d.hopeStartTime && d.hopeEndTime !== '00:00:00' ){
					result = d.hopeStartTime;
				}
				else{
					if( d.type === '2' || d.type === '3' ){
						result = '23:59:59';
					}
				}

				return result;
			}
			, times: function(d){
				return d.times === 0 ? '-' : d.times;
			}
			, timeConsume: function(d){
				return d.timeConsume ? (d.timeConsume +' 分钟') : '';
			}
			, tags: function(d){
				return d.tags ? '<span class="tag'+ (d.status > 0 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 0 ? ' tag-checked' : '') +'">') +'</span>' : '';
			}
		}
	})

	, taskAddFormTpl = emmetTpl({
		template: 'form#addTaskForm[action=./ method=post]' +
			'div.formGroup' +
				'>label.label[for=taskName]{请添加任务名称}' +
				'+input#taskName.input[type=text name=name placeholder=任务名称 data-validator=name]' +
			'^div.formGroup' +
				'>label.label[for=taskSelf]{请设置任务目标}' +
				'+div.input.input-pickGroup' +
					'>input#taskSelf[type=radio name=target value=1 checked=checked]' +
					'+label.icon.icon-radio[for=taskSelf]{自己}' +
			'^^div.formGroup' +
				'>label.label[for=taskOnce]{请选择任务类型}' +
				'+div.input.input-pickGroup' +
					'>input#taskOnce[type=radio name=type value=0 checked=checked]' +
					'+label.icon.icon-radio[for=taskOnce]{单次}' +
					'+input#taskMultiply[type=radio name=type value=1]' +
					'+label.icon.icon-radio[for=taskMultiply]{多次}' +
					'+input#taskPerDay[type=radio name=type value=2]' +
					'+label.icon.icon-radio[for=taskPerDay]{每天}' +
					'+input#taskPerWeek[type=radio name=type value=3]' +
					'+label.icon.icon-radio[for=taskPerWeek]{每周}' +
			'^^div.formGroup' +
				'>label.label[for=taskTimes]{请设置任务执行次数}' +
				'+input#taskTimes.input[type=text name=times placeholder=执行次数 data-validator=number]' +
			'^div.formGroup' +
				'>label.label[for=taskTimeConsume]{请设置任务预估耗时}' +
				'+input#taskTimeConsume.input[type=text name=timeConsume placeholder=预估耗时 data-validator=number]' +
			'^div.formGroup.formGroup-half' +
				'>label.label[for=taskHopeStartDate]{请设置任务期望开始日期}' +
				'+input#taskHopeStartDate.input[type=date name=hopeStartDate placeholder=开始日期 data-validator=date]' +
			'^div.formGroup.formGroup-half' +
				'>label.label[for=taskHopeStartTime]{请设置任务期望开始时间}' +
				'+input#taskHopeStartTime.input[type=time name=hopeStartTime placeholder=开始时间 data-validator=time]' +
			'^div.formGroup.formGroup-half' +
				'>label.label[for=taskHopeEndDate]{请设置任务期望结束日期}' +
				'+input#taskhopeEndDate.input[type=date name=hopeEndDate placeholder=结束日期 data-validator=date]' +
			'^div.formGroup.formGroup-half' +
				'>label.label[for=taskHopeEndTime]{请设置任务期望结束时间}' +
				'+input#taskhopeEndTime.input[type=time name=hopeEndTime placeholder=结束时间 data-validator=time]' +
			'^div.formGroup' +
				'>label.label[for=star1]{请评分}' +
				'+div.input-score' +
					'>input#star5[type=radio name=score value=5]' +
					'+label.icon.icon-star[for=star5]' +
					'+input#star4[type=radio name=score value=4]' +
					'+label.icon.icon-star[for=star4]' +
					'+input#star3[type=radio name=score value=3]' +
					'+label.icon.icon-star[for=star3]' +
					'+input#star2[type=radio name=score value=2]' +
					'+label.icon.icon-star[for=star2]' +
					'+input#star1[type=radio name=score value=1]' +
					'+label.icon.icon-star[for=star1]' +
				'^span.score_value' +
			'^' + TagView.tagEditorEmmet +
			'^^div.formGroup' +
				'>label.label[for=taskDesc]{请添加任务描述}' +
				'+textarea#taskDesc.input.input-multiply[name=desc placeholder=任务描述 data-validator=desc]'
	})

	, tabName = [{
		tabName: '全部'}, {
		tabName: '未完成'}, {
		tabName: '已完成'
	}]
	, taskStatus = ['进行中']

	, TaskView = {
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

module.exports = TaskView;