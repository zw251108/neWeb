$(function(){
	var $form = $('form')
		, $title = $('#title')
		, $path = $('#path')
		, $params = $('#params')
		, $hashField = $('#hashField')
		, $hash = $('#hash')
		, $ico = $('#ico')
		, $submit = $('#bookmark')
		;

	chrome.tabs.getSelected(function(tab){
		var temp = document.createElement('a')
			;

		temp.href = tab.url;

		$path.val( temp.origin + temp.pathname );

		$params.html( temp.search ? temp.search.slice(1).split('&').map(function(d){
			return `<div class="formGroup">
				<label>
					<input class="input-checkbox" type="checkbox" name="param" value="${d}"/><span>${d}</span>
				</label>
			</div>`;
		}).join('') : '' );

		// $urlSearch.val( temp.search );

		if( !temp.hash ){
			$hashField.hide();
		}
		else{
			$hash.val( temp.hash );
		}

		$title.val( tab.title );
		$ico.val( tab.favIconUrl || '' )
	});

	$form.on('submit', function(e){
		e.preventDefault();

		let $param = $params.find(':checkbox:checked')
			;

		$submit.attr('disabled', 'disabled');

		$.ajax({
			url: this.action
			, type: this.method
			, data: {
				url: $path.val() + ($param.length ? '?'+ $param.map(function(d){
					return d.value;
				}).get().join('&') : '') + $hash.val()
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