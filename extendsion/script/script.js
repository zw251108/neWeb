$(function(){
	var $form = $('form')
		, $title = $('#title')
		, $urlPath = $('#urlPath')
		, $urlSearch = $('#urlSearch')
		, $urlHash = $('#urlHash')
		, $ico = $('#ico')
		, $submit = $('#bookmark')
		;

	chrome.tabs.getSelected(function(tab){
		var temp = document.createElement('a')
			;

		temp.href = tab.url;

		$urlPath.val( temp.origin + temp.pathname );
		$urlSearch.val( temp.search );
		$urlHash.val( temp.hash );
		$title.val( tab.title );
		$ico.val( tab.favIconUrl || '' )
	});

	$form.on('submit', function(e){
		e.preventDefault();

		$submit.attr('disabled', 'disabled');

		$.ajax({
			url: this.action
			, type: this.method
			, data: {
				url: $urlPath.val() + $urlSearch.val() + $urlHash.val()
				, title: $title.val()
				, ico: $ico.val()
				, email: 'zw150026@163.com'
				, password: 'zw251108'
			}
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
});