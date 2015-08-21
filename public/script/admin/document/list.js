require(['../../module/config'], function(config){

	config.requireConfig.baseUrl = location.origin + '/script/';

	var r = require.config(config.requireConfig);
	r(['jquery', 'global'], function($, g){
		var $addPopup = $('#addPopup').on('click', '#addData', function(){
				var title = $addPopup.find('#title').val()
					;
				if( title ){
					$.ajax({
						url: 'add'
						, type: 'POST'
						, data: {
							title: title
						}
						, dataType: 'json'
						, success: function(json){
							if( json.success ){
								$mainList.append('<li data-id="'+ json.id +'"><a href="'+ json.id +'">'+ title +'</a><span class="icon icon-edit"></span></li>');
								$addPopup.trigger('closeDialog');
							}
							else{

							}
						}
					});
				}
			})
			, $add = $('#add').on('click', function(){
				$addPopup.trigger('showDialog');
			})
			, $save = $('#save').on('click', function(){
				$.ajax({
					url: 'save'
					, type: 'POST'
					, data: {
						order: $mainList.children().map(function(){return $(this).data('id');}).get().join()
					}
					, dataType: 'json'
					, success: function(json){

					}
				})
			})
			, $mainList = $('.module-main').find('.module_content ul').on('click', '.icon-up', function(){
				var $that = $(this).parents('li');

				if( !$that.is(':first') ){
					$that.insertBefore( $that.prev() );
				}

			}).on('click', '.icon-down', function(){
				var $that = $(this).parents('li');

				if( !$that.is(':last') ){
					$that.insertAfter( $that.next() );
				}
			})
			;
	});
});