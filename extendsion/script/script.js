$(function(){
	var $form = $('form')
		, $title = $('#title')
		, $path = $('#path')
		, $params = $('#params')
		, $hashField = $('#hashField')
		, $hash = $('#hash')
		, $hashContent = $('#hashContent')
		, $ico = $('#ico')
		, $submit = $('#bookmark')
		;

	chrome.tabs.getSelected(function(tab){
		var temp = document.createElement('a')
			;

		temp.href = tab.url;

		$path.val( temp.origin + temp.pathname );

		if( !temp.search ){
			$params.hide();
		}
		else{
			$params.append( temp.search.slice(1).split('&').map(function(d, i){
				return `
				<label class="forCheckbox">
					<input class="input-checkbox" type="checkbox" id="param${i}" name="param" value="${d}"/><span>${d}</span>
				</label>`;
			}).join('') );
		}

		if( !temp.hash ){
			$hashField.hide();
		}
		else{
			$hash.val( temp.hash ).prop('checked', true);
			$hashContent.html( temp.hash );
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
				url: $path.val() + ($param.length ? '?'+ $param.map(function(i, d){
					return d.value;
				}).get().join('&') : '') + ($hash.prop('checked') ? $hash.val() : '')
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