require(['../../config'], function(config){
	var r= require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $task = $('#task')
			, $taskList = $task.find('#taskList')
			, taskTpl = $.template({
				template: 'dt.task.%statusClass%[data-id=%id% data-status=%status% data-task-id=%taskId% data-type=%type% data-lv=%lv%]' +
						'>span.task_status{%statusText%}' +
						'+span.task_lv{%lvText%}' +
						'+span.task_type{%typeText%}' +
						'+span.task_name{%name%}+{%taskOperate%}' +
					'^dd.hidden.task_detail' +
						'>div.task_datetime{创建时间：%datetime%}' +
						'+div.task_deadline{期望执行时间：%hopeStartDate% %hopeStartTime% —— %hopeEndDate% %hopeEndTime%}' +
						'+div.task_timeConsume{预计花费时间：%timeConsume% 分钟}' +
						'+div.task_times{可执行次数：%times% 次}' +
						'+div.task_desc{%desc%}'
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
						var text = ['未开始', '进行中', '已结束']
							;

						return ('['+ (d.status ? text[d.status] : '未接受') +']') || '';
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
							result = '<button type="button" class="btn task_done">结束</button>';

							if( d.lv === '1' && (d.type === '2' || d.type === '3') ){ // 为用户发布 周期任务
								result += '<button type="button" class="btn task_end">永久结束</button>';
							}
						}

						return result;
					}
				}
			})
			, $addTaskPopup = $('#addTaskPopup')
			, $addTaskForm = $addTaskPopup.find('#addTaskForm')
			;

		$task.on('click', '.icon-up', function(){
			var $that = $(this)
				, $parent = $that.parents('.task')
				;

			$that.toggleClass('icon-up icon-down');
			$parent.next().slideDown();
		}).on('click', '.icon-down', function(){
			var $that = $(this)
				, $parent = $that.parents('.task')
				;

			$that.toggleClass('icon-up icon-down');
			$parent.next().slideUp();
		}).on('click', 'input:radio', function(){
			var $that = $(this).parents('.task')
				, id = $that.data('id')
				;

			$that.addClass('task-done').removeClass('task-delay');
			this.disabled = true;

			$.ajax({
				url: id +'/done'
				, type: 'POST'
				, success: function(json){

				}
			})
		});

		$('#add').on('click', function(){
			$addTaskPopup.trigger('showDialog');
		});

		$addTaskPopup.on('click', '#addTask', function(){
			var formData = $addTaskForm.serializeJSON()
				;

			$.ajax({
				url: $addTaskForm.attr('action')
				, type: $addTaskForm.attr('method')
				, data: formData
				, success: function(json){
					if( 'error' in json ){

					}
					else{
						$taskList.prepend( taskTpl(json.info).join() );
						$addTaskForm.get(0).reset();
					}
				}
			});

			$addTaskPopup.trigger('closeDialog');
		});
	});
});
