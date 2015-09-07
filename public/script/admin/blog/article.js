/**
 *
 * */
define(['../../module/config'], function(config){
	config.requireConfig.baseUrl = location.origin +'/script/';

	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'codeEditor', 'codeEditorSkin', 'template'], function($, g, socket, code, codeSkin){
		var $blog = $('#blog')
			, $addSectionPopup = $('')
			;
	});
});
