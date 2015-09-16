/**
 *
 * */
define(['../../config'], function(config){
	config.requireConfig.baseUrl = location.origin +'/script/';

	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'codeEditor', 'codeEditorSkin', 'msgPopup', 'template'], function($, g, socket, code, codeSkin, msgPopup){
		var $blog = $('#blog').on('click', '.icon-save', function(e){
				content.save();

				var data = $form.serializeJson()
					;

				$.ajax({
					url: form.action
					, type: form.method
					, data: data
					, success: function(json){
						if( json.success ){
							msgPopup.showMsg('保存成功');
						}
					}
				})
			})
			, $form = $blog.find('form')
			, form = $form[0]
			, $codeArea = $blog.find('textarea')
			, content
			, $skinList
			;

		content = code($codeArea[0], $codeArea.data('codeType'));

		$codeArea.nextAll('.CodeMirror').addClass('edit_CodeMirror');

		$skinList = codeSkin(config.requireConfig.baseUrl, [content]);
	});
});
