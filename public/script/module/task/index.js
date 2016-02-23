require(['../../config'], function(config){
	var r= require.config(config.requireConfig);
	r(['jquery', 'global', 'socket'], function($, g, socket){
		var $task = $('#task')
			;

		$task.on('click', 'input:radio', function(){
			var $that = $(this).parents('.task')
				, id = $that.data('id')
				;

			$that.addClass('task-done');
			this.disabled = true;

			$.ajax({
				url: id +'/done'
				, type: 'POST'
				, success: function(json){

				}
			})
		})
	});
});
