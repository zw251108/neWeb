/**
 *
 * */

define('bookmarkAdd', ['jquery', 'global', 'socket', 'msgPopup', 'template'], function($, g, socket, msgPopup){
	var $bookmark
		, articleTpl
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

		if( data.msg !== 'Done' ){
			msgPopup.showMsg( data.msg );
			//alert( data.msg );

			$bookmark.find('.module_content article.article[data-target]:eq(0)').remove();
		}
		else{
			// todo 数组
			$.each(data.data, function(i, d){
				$bookmark.find('.module_content article.article[data-target="'+ d.url +'"]').replaceWith( $( articleTpl(d).join('') ).data(d) );
			});
		}
	});

	return function($bm, tpl){
		$bookmark = $bm;

		articleTpl = tpl;

		return $addPopup;
	}
});

require(['../../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'bookmarkAdd', 'bookmarkRead', 'searchBar', 'filterBox', config.dataSource.tag, 'template'], function($, g, socket, bookmarkAdd, bookmarkRead, searchBar, filterBox, tagsData){
		var articleTpl = $.template({
				template: 'article#readerArt%id%.article.reader_article>a[href=%url% title=%url% target=_blank]>h3.article_title{%title%}^hr+a.icon.icon-checkbox%readStatus%[href=read title=%readTitle%]{%readText%}+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
				, filter: {
					title: function(d){
						return d.title || d.url;
					}
					, readStatus: function(d){
						return +d.status > 0 ? '-checked' : '';
					}
					, readTitle: function(d){
						return +d.status > 0 ? '已读' : '未读';
					}
					, readText: function(d){
						return +d.status > 0 ? '已读过' : '读过';
					}
					, tags: function(d){
						return d.tags ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
					}
					, datetime: function(){
						return g.datetime();
					}
				}
			})
			, $bookmark = $('#bookmark').on('click', '.icon-checkbox', function(e){
				e.preventDefault();

				var $that = $(this)
					, $parent = $that.parents('.article')
					, $title = $parent.find('.article_title')
					;

				$readPopup.triggerHandler('setData', [{
					id: $parent.data('id')
					, bookmarkId: $parent.data('bookmarkId')
					, title: $title.html()
					, url: $title.parent().attr('href')
					, tags: $parent.find('div.tagsArea').html()
					, score: $parent.data('score')
					, status: $parent.data('status')
				}]);

				$readPopup.trigger('showDialog');
			})
			, $addPopup = bookmarkAdd( $bookmark, articleTpl)
			, $readPopup
			;

		$('#add').on('click', function(){
			$addPopup.trigger('showDialog');
		});

		tagsData = $.parseJSON( tagsData );

		$readPopup = bookmarkRead($bookmark, tagsData);

		searchBar = searchBar();
		searchBar.submit(function(){
			//var $form = $(this)
			//	, data = $form.serializeJSON()
			//	;
			//
			//socket.emit('data', {
			//	topic: 'reader/bookmark/search'
			//	, query: data
			//});
		});

		filterBox = filterBox( tagsData );
		filterBox.submit(function(){
			// todo 阻止表单提交，改为 web socket 获取数据
		});

		socket.register('reader/bookmark/search', function(data){
			var count = data.count
				;

			data = data.data;

			if( count ){
				$bookmark.find('.module_content').html( articleTpl(data).join('') );
				// todo 重置页码
			}
			else{
				// todo 显示未搜索到结果
			}
		});
	});
});