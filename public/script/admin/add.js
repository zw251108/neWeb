require(['../module/config'], function(config){

	config.requireConfig.baseUrl = 'http://'+ location.host + '/script/';

	var r = require.config(config.requireConfig);
	r(['jquery', 'global'], function($, g){
		var $addPopup = $('#addPopup').on('click', '#addData', function(){
				var title = $addPopup.find('#title').val()
					, order = $mainList.children().length +1
					;
				if( title ){
					$.ajax({
						url: location.href
						, type: 'POST'
						, data: {
							title: title
							, order: order
						}
						, dataType: 'json'
						, success: function(json){
							if( json.success ){
								$('.module-main').find('.module_content ul').append('<li><a href="'+ json.id +'">'+ title +'</a><span class="icon icon-edit"></span></li>');
								$addPopup.trigger('closeDialog');
							}
							else{

							}
						}
					});
				}
			})
			//, $$addForm = $addPopup.find('form')
			, $add = $('#add').on('click', function(){
				$addPopup.trigger('showDialog');
			})
			, $mainList = $('.module-main').find('.module_content ul')
			;
	});
});