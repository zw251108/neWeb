/**
 *
 * */
require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'tag', config.dataSource.tag, 'template'], function($, g, socket, tag, tagsData){
		var $bookmark = $('#bookmark').on('click', '.icon-checkbox', function(e){
				e.preventDefault();

				var $that = $(this)
					, $parent = $that.parents('article')
					;

				$bookmarkId.val( $parent.data('id') );
				$bookmarkTitle.val( $parent.find('h3.article_title').html() );

				$readPopup.find('div.tagsArea').html( $parent.find('div.tagsArea').html() );
				$readPopup.trigger('showDialog');
			}).on('click', '.icon-remove', function(e){
				e.preventDefault();
			})
			, $addPopup = $('#addPopup').on('click', '#addBookmark', function(){

				if( $url.val() ){
					$bookmark.find('.module_content').prepend('<article class="article" data-target="'+ $url.val() +'">' +
							'<div class="loading loading-chasing"></div>' +
						'</article>');

					socket.emit('data', {
						topic: 'reader/bookmark/add'
						, query: {
							url: $url.val()
						}
					});

					$addPopup.trigger('closeDialog').find('form')[0].reset();
				}
			})
			, $readPopup = $('#readPopup').on('click', '#readBookmark', function(){

				var data = $readForm.serializeArray()
					, query = {}
					;

				$.each(data, function(i, d){
					if( d.name in query ){
						query[d.name] += ','+ d.value;
					}
					else{
						query[d.name] = d.value;
					}
				});

				if( query.tags !== '' ){
					query.id = query.bookmarkId;
					query.score = +query.score;

					socket.emit('data', {
						topic: 'reader/bookmark/read'
						, query: query
					});
					$bookmark
						.find('#readerArt'+ $bookmarkId.val())
							.find('div.tagsArea').html( '<span class="tag tag-checked">'+ query.tags.split(',').join('</span><span class="tag tag-checked">') +'</span>')
						.end().find('h3.article_title').html( $bookmarkTitle.val() );
					$readPopup.trigger('closeDialog').find('form')[0].reset();
				}
				else{
					// todo 替换为自定义弹窗
					alert('请至少添加一个标签，以方便管理！');
				}
			})

			, $url = $('#url')
			, $bookmarkId = $readPopup.find('#bookmarkId')
			, $bookmarkTitle = $readPopup.find('#bookmarkTitle')
			, $readForm = $readPopup.find('#readForm')
			, $tag = $readPopup.find('#tag')
			, $tags = $readPopup.find('#tags')
			, tpl = $.template({
				template: 'article#readerArt%Id%.article[data-id=%Id%]>a[href=%url% title=%url% target=_blank]>h3.article_title{%title%}^hr+a.icon.icon-checkbox%readStatus%[href=read title=%readTitle%]{%readText%}+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
				, filter: {
					title: function(d){
						return d.title || d.url;
					}
					, readStatus: function(d){
						return +d.status > 1 ? '-checked' : '';
					}
					, readTitle: function(d){
						return +d.status > 1 ? '已读' : '未读';
					}
					, readText: function(d){
						return +d.status > 1 ? '已读过' : '读过';
					}
					, tags: function(d){
						return d.tags ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
					}
					, datetime: function(){
						return datetime;
					}
				}
			})
			, today = new Date()
			, y = today.getFullYear()
			, m = today.getMonth() +1
			, d = today.getDate()
			, h = today.getHours()
			, mm = today.getMinutes()
			, s = today.getSeconds()
			, datetime
			;
		m = m > 10 ? '0' + m : m;
		d = d > 10 ? '0' + d : d;
		h = h > 10 ? '0' + h : h;
		mm = mm > 10 ? '0' + mm : mm;
		s = s > 10 ? '0' + s : s;
		datetime = y +'-'+ m +'-'+ d +' '+ h +':'+ mm +':'+ s;

		tag( $.parseJSON( tagsData ) );
		tag.setAdd( $readPopup );

		$('#add').on('click', function(){
			$addPopup.trigger('showDialog');
		});

		socket.register({
			'reader/bookmark/add': function(data){

				if( 'error' in data ){
					alert( data.msg );

					$bookmark.find('.module_content article.article[data-target]:eq(0)').remove();
				}
				else{
					data = data.info;
					data.Id = data.id;

					$bookmark.find('.module_content article.article[data-target="'+ data.url +'"]').replaceWith( tpl(data) );
				}
			}
			, 'reader/bookmark/read': function(data){
				if( !('error' in data) ){
					$bookmark.find('#readerArt'+ data.info.id)
						.find('.icon-checkbox')
						.toggleClass('icon-checkbox icon-checkbox-checked')
						.attr('title', '已读')
						.text('已读过');
				}
			}
		});
	});
});