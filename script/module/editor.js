/**
 * @module editor
 */
define(['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $editor = g.mod('$editor') || $('#editor')
		, codeTagTmpl = $.template({
			template:'a[href=edit.php?id=%Id%]' +
				'>article.article.editor_article[data-tagsid=%tagsId%]' +
				'>h3.article_title{%name%}' +
				'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]',
			filter:{
				alt:function(data, index){
					return data.preview ? data.name : '没有预览图片';
				}
			}
		})
		, $container = g.$container
		;

	socket.on('getEditorData', function(data){
		$editor.data('getData', true).find('.module_content').append( codeTagTmpl('data').join('') );

		$container.triggerHandler('dataReady');
	}).on('getCodeData', function(data){
//		$('')
	});

	$editor.on('click', '.icon-close', function(e){

	}).on('click', '', function(e){

	})
});