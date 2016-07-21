/**
 *
 * */
define(['/script/config.js'], function(config){
	var r = require(config);
	r(['jquery', 'global', 'socket'
		, 'text!data-skin', 'codeEditor', 'codeEditorSkin'
		, 'text!data-tag', 'tag'
		, 'msgPopup'
		, 'template'
	], function($, g, socket, skin, code, codeSkin, tagsData, tag, msgPopup){
		var $blog = $('#blog').on('click', '.icon-save', function(){
				content.save();

				var data = $form.serializeJSON()
					;

				$.ajax({
					url: form.action
					, type: form.method
					, data: data
					, success: function(json){
						if( json.msg === 'Done' ){
							msgPopup.showMsg('保存成功');
						}
					}
				})
			})
			, $form = $blog.find('form')
			, form = $form[0]
			, $codeArea = $blog.find('textarea')
			, content
			;

		content = code($codeArea[0], $codeArea.data('codeType'));

		$codeArea.nextAll('.CodeMirror').addClass('edit_CodeMirror');

		skin = $.parseJSON( skin );
		codeSkin = codeSkin(skin.skin, config.baseUrl, [content]);

		tag( $.parseJSON(tagsData).data || [] );
		tag.setAdd( $form );
	});
});
