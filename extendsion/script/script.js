$(function(){
	var $form = $('form')
		, $title = $('#title')
		, $url = $('#url')
		, $ico = $('#ico')
		, $submit = $('#bookmark')
		;

	chrome.tabs.getSelected(function(tab){
		$title.val( tab.title );
		$url.val( tab.url );
		$ico.val( tab.favIconUrl || '' )
	});

	$form.on('submit', function(e){
		e.preventDefault();

		$submit.attr('disabled', 'disabled');

		$.ajax({
			url: this.action
			, type: this.method
			, data: $form.serialize()
			, dataType: 'json'
			, success: function(json){
				if( json.msg !== 'Done' ){
					$('body').html('<p class="error">'+ json.msg +'</p>');
				}
				else{
					$('body').html('<p class="success">添加成功</p>')
				}
			}
		});
	});

	// $('#bookmark').on('click', function(){
	//
	// 	chrome.tabs.getSelected(function(tab){
	// 		$.ajax({
	// 			url: 'http://localhost:9001/data/reader/bookmark'
	// 			, type: 'POST'
	// 			, data: {
	// 				url: tab.url
	// 				, title: tab.title
	// 				, ico: tab.favIconUrl || ''
	// 				, email: 'zw150026@163.com'
	// 				, password: 'zw251108'
	// 			}
	// 			, dataType: 'json'
	// 			, success: function(json){
	// 				if( json.msg !== 'Done' ){
	// 					$('body').html('<p class="error">'+ json.msg +'</p>');
	// 				}
	// 				else{
	// 					$('body').html('<p class="success">添加成功</p>')
	// 				}
	// 			}
	// 		});
	// 	});
	// });
});