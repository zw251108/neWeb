/**
 *
 */
require(['../../config'], function(config){
	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'searchBar', 'filterBox', 'tag', config.dataSource.tag, 'template',  'layout'], function($, g, socket, searchBar, filterBox, tag, tagsData){
		var $editor = $('#editor')
			, $editorContainer = $editor.find('.module_content')
			, PREVIEW_SIZE = 128
			, editorTpl = $.template({
				template: 'a[href=code?id=%Id%]' +
					'>article.article.editor_article' +
					'>h3.article_title{%name%}' +
					'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]' +
					'+div.tagsArea{%tags%}'
				, filter:{
					width: function(d){
						var w = d.width
							, h = d.height
							, rs
							;
						if( w <= PREVIEW_SIZE && h <= PREVIEW_SIZE ){
							rs = w;
						}
						else if( w >= h ){
							rs = PREVIEW_SIZE;
						}
						else{
							rs = Math.floor( PREVIEW_SIZE/h * w );
						}

						return rs;
					}
					, height: function(d){
						var w = d.width
							, h = d.height
							, rs
							;
						if( w <= PREVIEW_SIZE && h <= PREVIEW_SIZE ){
							rs = h;
						}
						else if( h >= w ){
							rs = PREVIEW_SIZE;
						}
						else{
							rs = Math.floor( PREVIEW_SIZE/w * h );
						}

						return rs;
					}
					, alt: function(d){
						return d.preview ? d.name : '没有预览图片';
					}
					, tags: tag.tagCheckedTpl
				}
			})

			, doc = document.documentElement
			, body = document.body
			, HEIGHT = doc.clientHeight
			, socketTimeout = null
			, page = 1
			, PAGE_SIZE = 20
			, moreData = false
			, space = 10
			, loading = function(){
				$editorContainer.height( $editorContainer.height() + 192 );
				$editorContainer.append('<article class="article article-block"><div class="loading loading-chasing"></div></article>');
			}
			, layout = function(){
				$.layout({
					container: $editorContainer,
					items: 'article',
					left: -1,
					right: -15,
					top: 0,
					bottom: space,
					colSpace: space,
					rowSpace: space
				});
			}
			, search = unescape( location.search )
			, searchObj = {}
			, i, j
			;

		layout();

		if( search ){
			search = search.slice(1);
			search = search.split(/=|&/);

			for( i = 0, j = search.length; i < j; i = i +2 ){
				searchObj[search[i]] = search[i+1];
			}
		}

		searchBar(function(form){
			//var $form = $(form)
			//	, data = $form.serializeJSON()
			//	;
			//
			//socket.emit('data', {
			//	topic: 'editor/search'
			//	, query: data
			//});
		});
console.log(tagsData)
		filterBox(tagsData, function(form){

		});

		$(window).on({
			resize: function(){
				HEIGHT = doc.clientHeight;
				layout();
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
						$editorContainer.append('<article class="article article-block"><div class="loading loading-chasing"></div></article>');
						loading();
					}

					socketTimeout = setTimeout(function(){
						var send = {
								topic: 'editor'
								, query: {
									page: ++page
									, size: PAGE_SIZE
								}
							}
							;

						if( search ){
							if( searchObj.keyword ){
								send.topic = 'editor/search';
								send.query.keyword = searchObj.keyword;
							}
							else if( searchObj.tags ){
								send.topic = 'editor/filter';
								send.query.tags = searchObj.tags
							}
						}

						socket.emit('data', send);

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
					content = '<article class="article article-block article-block-noMore">沒有更多数据了...</article>';
				}

				$editorContainer.find('article.article-block').remove().end().append( content );

				if( data.length ){
					layout();
				}
				else{
					$editorContainer.height( $editorContainer.height() -128);
				}
			}
			, 'editor/search': function(data){
				var content = '';

				data = data.data;

				if( data.length ){
					content = editorTpl( data ).join('');
				}
				else{
					moreData = true;
					content = '<article class="article article-block article-block-noMore">沒有更多数据了...</article>';
				}

				$editorContainer.find('article.article-block').remove().end().append( content );

				if( data.length ){
					layout();
				}
				else{
					$editorContainer.height( $editorContainer.height() -128);
				}
			}
			, 'editor/filter': function(data){
				var content = '';

				data = data.data;

				if( data.length ){
					content = editorTpl( data ).join('');
				}
				else{
					moreData = true;
					content = '<article class="article article-block article-block-noMore">沒有更多数据了...</article>';
				}

				$editorContainer.find('article.article-block').remove().end().append( content );

				if( data.length ){
					layout();
				}
				else{
					$editorContainer.height( $editorContainer.height() -128);
				}
			}
		});

		$editor.on('click', 'a', function(e){
			e.stopImmediatePropagation();
		});
	});
});