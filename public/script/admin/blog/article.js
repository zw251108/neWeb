/**
 *
 * */
define(['../../config'], function(config){
	config.requireConfig.baseUrl = location.origin +'/script/';

	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket'
		, config.dataSource.skin, 'codeEditor', 'codeEditorSkin'
		, config.dataSource.tag, 'tag'
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
			;

		content = code($codeArea[0], $codeArea.data('codeType'));

		$codeArea.nextAll('.CodeMirror').addClass('edit_CodeMirror');

		skin = $.parseJSON( skin );
		codeSkin = codeSkin(skin.skin, config.requireConfig.baseUrl, [content]);
		codeSkin.setSkin();

		tag( $.parseJSON(tagsData) );
		tag.setAdd( $form );
	});
});
