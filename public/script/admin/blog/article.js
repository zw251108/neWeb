/**
 *
 * */
define(['../../module/config'], function(config){
	config.requireConfig.baseUrl = location.origin +'/script/';

	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'codeEditor', 'codeEditorSkin', 'template'], function($, g, socket, code, codeSkin){
		var $blog = $('#blog').on('click', '.icon-save', function(){

			})
			, $codeArea = $blog.find('textarea')
			, $addSectionPopup = $('')

			, $skinList
			;


		$skinList = codeSkin(config.requireConfig.baseUrl, [$codeArea[0]]);

		code($codeArea[0], $codeArea.data('codeType'));
	});
});
