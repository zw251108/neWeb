/**
 *
 * */

require.config({
	paths: {
		jquery: 'lib/jquery.min'
		, template: 'ui/jquery.emmetTpl'
		, socket: 'module/socket'
	}
});
require(['jquery', 'template', 'socket'], function($, tpl, socket){
	var searchRsTpl = tpl({
			template: 'li>span.name{%name%}+span.git{%url%}'
		})
		, $dialog = $('dialog').css({
			width: '200px'
			, height: 'auto'
			, minHeight: '100px'
			, zIndex: 100
		}).prepend('<form action="#" id="bowerSearch"><input type="text"/><input type="submit" value="提交"/></form>').on('submit', function(e){
			e.preventDefault();
			console.log(123123)
			var $form = $(this);

			socket.emit('bower_search', $form.find('input').val());

			//$.ajax({
			//	url: ''
			//	, data: 'name=' + $form.find('input').val()
			//	, success: function(data){
			//		$dialog.find('ul').append( searchRsTpl(data).join('') )
			//	}
			//})
		})
		;

	socket.on('bower_search_result', function(data){console.log(123)
		$dialog.find('ul').append( searchRsTpl(data).join('') );
	});

	$('button').on('click', function(){
		$dialog[0].show()
	});
	$('<button/>', {
		id: 'hide'
		, text: '隐藏'
	}).appendTo('body').on('click', function(){
		$dialog[0].close();
	});
});