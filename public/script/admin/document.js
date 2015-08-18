require(['../module/config'], function(config){

	config.requireConfig.baseUrl = 'http://'+ location.host + '/script/';

	var r = require.config(config.requireConfig);
	r(['jquery', 'codeEditor'], function($, codeEditor){
		var $form = $('form').on('submit', function(e){
				e.preventDefault();

				code.save();

				$.ajax({
					url: location.href
					, type: 'POST'
					, data: {
						id: $id.val()
						, content: $content.val()
					}
					, dataType: 'json'
					, success: function(json){
						if( json.success ){
							console.log('保存成功');
						}
					}
				});
			})
			, $id = $form.find('#id')
			, $content = $form.find('#content')
			, code = codeEditor($content[0], 'html')
			;
	});
});