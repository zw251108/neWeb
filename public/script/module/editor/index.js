/**
 * @module
 */
require(['../config'], function(config){
	require.config(config);
	require(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		$('#newCode').on('click', function(){
			location.href = 'code?id=0';
		});

		$('#editor').on('click', 'a', function(e){
			e.stopImmediatePropagation();
		});
	});
});