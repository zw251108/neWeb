require(['../../config'], function(config){
	var r= require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $task = $('#task')
			, $taskList = $task.find('#taskList')
			, taskTpl = $.template({
				template: 'li.task[data-id=%id% data-status=%status% data-start=%taskStartTime% data-end=%taskEndTime%]' +
					'>label.task_name' +
						'>input[type=radio]' +
						'+span.icon.icon-radio{ %taskName%}' +
					'^div.task_deadline{%taskStartTime% —— %taskEndTime%}'
			})
			, $addTaskPopup = $('#addTaskPopup')
			, $addTaskForm = $addTaskPopup.find('#addTaskForm')
			;

		$task.on('click', 'input:radio', function(){
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
