/**
 * @module editor
 */
define(['jquery', 'global', 'socket', 'tag', 'template'], function($, g, socket, tag){
	var $editor = g.mod('$editor') || $('#editor')
		, tagTmpl = tag.tagTmpl
		, codeTagTmpl = $.template({
			template:
//				'a[href=edit.php?id=%Id%]>' +
				'article.article.editor_article[data-tagsid=%tagsId%]' +
				'>h3.article_title{%name%}' +
				'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]',
			filter:{
				alt:function(data, index){
					return data.preview ? data.name : '没有预览图片';
				}
			}
		})
		, $container = g.$container
		, page = 0
		, pageSize = 20
		;

	socket.on('getEditorData', function(data){
		$editor.data('getData', true).find('.module_content').append( codeTagTmpl(data, page, pageSize).join('') );

		$container.triggerHandler('dataReady');
	}).on('getCodeData', function(data){
//		$('')
	});

	$editor.on('click', '.icon-close', function(e){

	}).on({
		'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd': function(){

		}
	}, '.module_content').on('click', 'article', function(e){

	})
});