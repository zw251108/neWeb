/**
 *
 */
require.config({
	paths: {
		jquery: 'lib/jquery.min'
		, css: 'lib/css'

		, global: 'module/global'
		, socket: 'module/socket'
		, codeEditor: 'module/codeEditor'
		, template: 'ui/jquery.emmetTpl'
	}
	, baseUrl: '../script/'
});
require(['jquery', 'global', 'socket', 'template'], function($, g, socket){

	$('#newCode').on('click', function(){
		location.href = 'code?id=0';
	});

	$('#editor').on('click', 'a', function(e){
		e.stopImmediatePropagation();
	});
});