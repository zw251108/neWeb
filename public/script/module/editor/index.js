/**
 *
 */
require(['../config'], function(config){
	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'tag', config.dataSource.tag, 'template'], function($, g, socket, tag, tagData){
		var $editor = $('#editor')
			, $editorContainer = $editor.find('.module_content')
			, editorTpl = $.template({
				template: 'a[href=code?id=%Id%]' +
					'>article.article.editor_article' +
					'>h3.article_title{%name%}' +
					'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]' +
					'+div.tagsArea{%tags%}'
				, filter:{
					alt:function(data, index){
						return data.preview ? data.name : '没有预览图片';
					}
					, tags: tag.tagTpl
				}
			})

			, doc = document.documentElement
			, body = document.body
			, HEIGHT = doc.clientHeight
			, socketTimeout = null
			, page = 1
			, PAGE_SIZE = 20
			, moreData = false
			;

		$(window).on({
			resize: function(){
				HEIGHT = doc.clientHeight;
			}
			, scroll: function(){
				var scrollTop = doc.scrollTop || body.scrollTop
					, scrollHeight = doc.scrollHeight || body.scrollHeight
					;

				if( moreData ) return;

				if( scrollTop + HEIGHT >= scrollHeight -100 ){

					if( socketTimeout ){
						clearTimeout(socketTimeout);
					}
					else{
						$editorContainer.append('<article class="article article-block"><div class="loading loading-chasing"></div></article>')
					}

					socketTimeout = setTimeout(function(){
						socket.emit('data', {
							topic: 'editor'
							, query: {
								page: ++page
								, size: PAGE_SIZE
							}
						});
						socketTimeout = null;
					}, 300);
				}
			}
		});

		socket.register({
			editor: function(data){
				var content = '';

				data = data.data;

				if( data.length ){
					content = editorTpl( data ).join('');
				}
				else{
					moreData = true;
					content = '<article class="article article-block">沒有更多数据了...</article>';
				}

				$editorContainer.find('article.article-block').remove().end().append( content );
			}
		});

		$editor.on('click', 'a', function(e){
			e.stopImmediatePropagation();
		});
	});
});