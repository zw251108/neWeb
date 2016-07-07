require(['../../config'], function(config){
	var r= require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'tag', config.dataSource.tag, 'template'], function($, g, socket, tag, tagsData){
		var $task = $('#task')
			, $taskList = $task.find('#taskList')
			, taskTpl = $.template({
				template: 'li.task.%statusClass%[data-id=%id% data-status=%status% data-task-id=%taskId% data-type=%type% data-lv=%lv%]' +
					'>span.task_status{%statusText%}' +
					'+span.task_lv{%lvText%}' +
					'+span.task_type{%typeText%}' +
					'+span.task_name{%name%}' +
					'+i.icon.icon-up+{%taskOperate%}' +
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
			, $addTaskPopup = $('#addTaskPopup')
			, $addTaskForm = $addTaskPopup.find('#addTaskForm')
			;

		$task.on('click', '.tab', function(){
			var $that = $(this)
				, tab = $that.data('tab')
				, $taskList = $task.find('.task')
				;

			$that.addClass('active').siblings('.active').removeClass('active');

			switch( tab ){
				case 'taskCycle':
					$taskList.filter('.task-cycle').show();
					$taskList.not('.task-cycle').hide();
					break;
				case 'taskNotStart':
					$taskList.filter('.task-notStart').show();
					$taskList.not('.task-notStart').hide();
					break;
				case 'taskDoing':
					$taskList.filter('.task-doing').show();
					$taskList.not('.task-doing').hide();
				    break;
				case 'taskDone':
					$taskList.filter('.task-done').show();
					$taskList.not('.task-done').hide();
					break;
				case 'taskAll':
				default:
					$taskList.show();
					break;
			}

		}).on('click', '.icon-up,.icon-down', function(){
			var $that = $(this)
				, $parent = $that.parents('.task')
				;

			$that.toggleClass('icon-up icon-down');
			$parent.find('.task_detail').toggle();
		}).on('click', '.task_start', function(){
			var $parent = $(this).parents('.task')
				, id = $parent.data('id')
				, taskId = $parent.data('taskId')
				, type = $parent.data('type')
				;

			$parent.addClass('task-doing').removeClass('task-notReceived task-notStart').find('.btn').replaceWith((type=== '2' || type === '3' ? '<button type="button" class="btn task_end">永久结束</button>' : '') +'<button type="button" class="btn btn-submit task_done">完成</button>');

			$.ajax({
				url: taskId +'/start'
				, type: 'POST'
				, data: {
					id: id
					, type: type
				}
				, success: function(json){

					if( json.msg === 'success' ){
						$parent.data( json.info );
					}
				}
			});
		}).on('click', '.task_done', function(){
			var $parent = $(this).parents('.task')
				, id = $parent.data('id')
				, taskId = $parent.data('taskId')
				, type = $parent.data('type')
				;

			$parent.addClass('task-done').removeClass('task-doing').find('.btn').remove();

			$.ajax({
				url: taskId +'/done'
				, type: 'POST'
				, data: {
					id: id
					, type: type
				}
				, success: function(json){
				}
			});
		}).on('click', '.task_end', function(){
			var $parent = $(this).parents('.task')
				, id = $parent.data('id')
				, taskId = $parent.data('taskId')
				, type = $parent.data('type')
				;

			$parent.addClass('task-done').find('.btn').remove();

			$.ajax({
				url: taskId +'/end'
				, type: 'POST'
				, data: {
					id: id
					, type: type
				}
				, success: function(json){
				}
			});
		});

		$task.find('.tab:first').addClass('active');

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
					if( json.msg === 'success' ){
						$taskList.prepend( taskTpl(json.info).join() );
						$addTaskForm.get(0).reset();
						$addTaskForm.find('.tag_area').empty();
					}
				}
			});

			$addTaskPopup.trigger('closeDialog');
		});

		tagsData = $.parseJSON(tagsData);

		tag( tagsData.data || [] );
		tag.setAdd( $addTaskPopup );
	});
});
