/**
 *
 * */

define('bookmarkAdd', ['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $bookmark
		, articleTpl = $.template({
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
					return g.datetime();
				}
			}
		})
		, $addPopup = $('#addPopup').on('click', '#addBookmark', function(){

			if( $addUrl.val() ){
				$bookmark.find('.module_content').prepend('<article class="article" data-target="'+ $addUrl.val() +'">' +
					'<div class="loading loading-chasing"></div>' +
					'</article>');

				socket.emit('data', {
					topic: 'reader/bookmark/add'
					, query: {
						url: $addUrl.val()
					}
				});

				$addPopup.trigger('closeDialog').find('form')[0].reset();
			}
		})
		, $addUrl = $addPopup.find('#url')
		;

	socket.register('reader/bookmark/add', function(data){

		if( 'error' in data ){
			alert( data.msg );

			$bookmark.find('.module_content article.article[data-target]:eq(0)').remove();
		}
		else{
			data = data.info;
			data.Id = data.id;

			$bookmark.find('.module_content article.article[data-target="'+ data.url +'"]').replaceWith( articleTpl(data) );
		}
	});

	return function($bm){
		$bookmark = $bm;

		return $addPopup;
	}
});

require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'bookmarkAdd', 'bookmarkRead', config.dataSource.tag, 'template'], function($, g, socket, bookmarkAdd, bookmarkRead, tagsData){
		var $bookmark = $('#bookmark').on('click', '.icon-checkbox', function(e){
				e.preventDefault();

				var $that = $(this)
					, $parent = $that.parents('.article')
					;

				$readPopup.triggerHandler('setData', [{
					id: $parent.data('id')
					, title: $parent.find('h3.article_title').html()
					, tags: $parent.find('div.tagsArea').html()
				}]);

				$readPopup.trigger('showDialog');
			})
			, $addPopup = bookmarkAdd( $bookmark )
			, $readPopup = bookmarkRead($bookmark, tagsData)
			;

		$('#add').on('click', function(){
			$addPopup.trigger('showDialog');
		});
	});
});