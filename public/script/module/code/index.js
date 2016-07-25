/**
 *
 */
require(['/script/config.js'], function(config){
	var r = require.config( config );
	r(['jquery', 'global', 'socket', 'searchBar', 'filterBox', 'tag', 'text!data-tag', 'template',  'layout'], function($, g, socket, searchBar, filterBox, tag, tagsData){
		var $editor = $('#code')
			, $editorContainer = $editor.find('.module_content')
			, PREVIEW_SIZE = 128
			, editorTpl = $.template({
				template: 'a[href=editor?id=%id%]' +
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
				$editorContainer.height( $editorContainer.height() + 82 );
				$editorContainer.append('<article class="article article-block"><div class="loading loading-chasing"></div></article>');
			}
			, layout = function(){
				$.layout({
					container: $editorContainer,
					items: 'article',
					left: 0,
					right: -15,
					top: 0,
					bottom: space,
					colSpace: space,
					rowSpace: space
				});
			}
			, NO_MORE = '<article class="article article-block article-block-noMore"><p class="msg">沒有更多数据了...</p></article>'
			, search = decodeURI( location.search )
			, searchObj = {}
			, i, j
			, $win
			;

		layout();

		if( search ){
			search = search.slice(1);
			search = search.split(/=|&/);

			for( i = 0, j = search.length; i < j; i = i +2 ){
				searchObj[search[i]] = search[i+1];
			}
		}

		searchBar = searchBar();
		searchBar.submit(function(){
			//var $form = $(this)
			//	, data = $form.serializeJSON()
			//	;
			//
			//socket.emit('data', {
			//	topic: 'code/search'
			//	, query: data
			//});
		});

		filterBox = filterBox( $.parseJSON(tagsData).data || [] );
		filterBox.submit(function(){
			// todo 阻止表单提交，改为 web socket 获取数据
		});

		$win = $(window).on({
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
								send.topic = 'code/search';
								send.query.keyword = searchObj.keyword;
							}
							else if( searchObj.tags ){
								send.topic = 'code/filter';
								send.query.tags = searchObj.tags
							}
						}

						socket.emit('data', send);

						socketTimeout = null;
					}, 300);
				}
			}
		});

		if( $editorContainer.height() < HEIGHT ){
			if( !search ){
				$win.trigger('scroll');
			}
		}

		socket.register({
			code: function(data){
				var content = '';

				data = data.data;

				if( data.length ){
					content = editorTpl( data ).join('');
				}
				else{
					moreData = true;
					content = NO_MORE;
				}

				$editorContainer.find('article.article-block').remove().end().append( content );

				if( data.length ){
					layout();
				}
			}
			, 'code/search': function(data){
				var content = '';

				data = data.data;

				if( data.length ){
					content = editorTpl( data ).join('');
				}
				else{
					moreData = true;
					content = NO_MORE;
				}

				$editorContainer.find('article.article-block').remove().end().append( content );

				if( data.length ){
					layout();
				}
			}
			, 'code/filter': function(data){
				var content = '';

				data = data.data;

				if( data.length ){
					content = editorTpl( data ).join('');
				}
				else{
					moreData = true;
					content = NO_MORE;
				}

				$editorContainer.find('article.article-block').remove().end().append( content );

				if( data.length ){
					layout();
				}
			}
		});

		$editor.on('click', 'a', function(e){
			e.stopImmediatePropagation();
		});
	});
});