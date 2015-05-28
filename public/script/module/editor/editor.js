/**
 * @module editor/editor
 * */
define('code', [
	'plugin/codeMirror/lib/codemirror'
	, 'plugin/codeMirror/mode/xml/xml'
	, 'plugin/codeMirror/mode/htmlmixed/htmlmixed'
	, 'plugin/codeMirror/mode/javascript/javascript'
	, 'plugin/codeMirror/mode/css/css'
	, 'plugin/codeMirror/addon/comment/comment'
	, 'plugin/codeMirror/addon/comment/continuecomment'
	, 'plugin/codeMirror/addon/fold/foldcode'
	, 'plugin/codeMirror/addon/fold/foldgutter'
	, 'plugin/codeMirror/addon/fold/brace-fold'
	, 'plugin/codeMirror/addon/fold/xml-fold'
], function(cm){
	window.CodeMirror = cm;
});

define(['jquery', 'global', 'socket', 'tag', 'template'], function($, g, socket, tag){
	var $editor = g.mod('$editor') || $('#editor')
		, tagTmpl = tag.tagTmpl
		, editorTmpl = $.template({
			template:
				'article.article.editor_article[data-tagsid=%tagsId%]' +
				'>a[href=editor/code?id=%Id%]' +
				'>h3.article_title{%name%}' +
				'^img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]+div.tagsArea{%tags%}',
			filter:{
				alt:function(data, index){
					return data.preview ? data.name : '没有预览图片';
				}
				, tags: function(d){
					var data = []
						, tagsId = (d.tags_id || '').split(',')
						, tagsName = (d.tags_name || '').split(',')
						;

					$.each(tagsId, function(i, d){
						data.push({
							Id: d
							, name: tagsName[i]
						});
					});

					return tagTmpl(data).join('');
				}
			}
		})
		, $container = g.$container
		, page = 0
		, pageSize = 20
		;

	socket.register({
		editor: function(data){
			$editor.data('getData', true).find('.module_content').append( editorTmpl(data.data, page, pageSize).join('') );

			$container.triggerHandler('dataReady');
		}
		, 'editor/code': function(){
			$editor.find('#editor.Detail')
		}
	});

	$editor.on('click', '.icon-close', function(e){

	}).on({
		'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd': function(){

		}
	}, '.module_content').on('click', 'article > a', function(e){
		var $self = $(this)
			, isDeploy = $self.data('deploy')
			;

		if( isDeploy ){// 已获取数据
			//$self.next().slideToggle();
		}
		else{
			socket.emit('getData', {
				topic: 'editor/code'
				, query: {
					id: /=(\d*)$/.exec($self.attr('href'))[1]
				}
			});

			require(['code'], function(cm){
				require(['plugin/codeMirror/emmet/emmet.min']);
			})
		}

		e.preventDefault();
		e.stopImmediatePropagation();
	});
});