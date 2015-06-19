/**
 *
 * */
require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $bookmark = $('#bookmark').on('click', '.icon-star-empty', function(e){
				e.preventDefault();

				var $that = $(this)
					, $parent = $that.parents('article')
					;
				$(this).toggleClass('icon-star icon-star-empty').text('已读过');
				socket.emit('data', {
					topic: 'reader/bookmark/favor'
					, query: {
						id: $parent.data('id')
					}
				});
			}).on('click', '.icon-checkbox', function(e){
				e.preventDefault();

				var $that = $(this)
					, $parent = $that.parents('article')
					;
				$(this).toggleClass('icon-checkbox icon-checkbox-checked').text('已收藏');
				socket.emit('data', {
					topic: 'reader/bookmark/read'
					, query: {
						id: $parent.data('id')
					}
				});
			}).on('click', '.icon-remove', function(e){
				e.preventDefault();
			})
			, $addPopup = $('#addPopup').on('click', '#addBookmark', function(){
				if( $url.val() ){
					socket.emit('data', {
						topic: 'reader/bookmark/add'
						, query: {
							url: $url.val()
						}
					});

					$addPopup.trigger('closeDialog').find('form')[0].reset();
				}
			})
			, $url = $('#url')
			, tpl = $.template({
				template: 'article#blogArt%Id%.article[data-id=%Id%]>a[href=%url% title=%url% target=_blank]>h3.article_title{%title%}' +
				'^hr+a.icon.icon-checkbox%readStatus%[href=read title=%readTitle%]{%readText%}' +
				'+a.icon.icon-star%favorStatus%[href=favor title=%favorTitle%]{%favorText%}' +
				'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
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
					, favorStatus: function(d){
						return +d.status > 1 ? '' : '-empty';
					}
					, favorTitle: function(d){
						return +d.status > 1 ? '已收藏' : '未收藏';
					}
					, favorText: function(d){
						return +d.status > 1 ? '已收藏' : '收藏';
					}
					, tags: function(d){
						return d.tag_name ? '<span class="tag">'+ d.tag_name.split(',').join('</span><span class="tag">') +'</span>' : '';
						//var data = []
						//	, tagsId = (d.tags_id || '').split(',')
						//	, tagsName = (d.tags_name || '').split(',')
						//	;
						//
						//$.each(tagsId, function(i, d){
						//	data.push({
						//		Id: d
						//		, name: tagsName[i]
						//	});
						//});
						//
						//return tagTmpl(data).join('');
					}
				}
			})
			;

		$('#add').on('click', function(){
			$addPopup.trigger('showDialog');
		});

		socket.register({
			'reader/bookmark/add': function(data){

				if( 'error' in data ){
					alert( data.msg );
				}
				else{
					data = data.info;
					data.Id = data.id;
					$bookmark.find('.module_content').prepend( tpl(data) )
				}
			}
			, 'reader/bookmark/read': function(data){
				if( !('error' in data) ){
					$bookmark.find('#blogArt'+ data.info.id).find('.icon-checkbox')
						.toggleClass('icon-checkbox icon-checkbox-checked')
						.attr('title', '已读')
						.text('已读过');
				}
			}
			, 'reader/bookmark/favor': function(data){
				if( !('error' in data) ){
					$bookmark.find('#blogArt'+ data.info.id)
						.find('.icon-star-empty')
							.toggleClass('icon-star-empty icon-star')
							.attr('title', '已收藏')
							.text('已收藏')
						.end().find('.icon-checkbox')
							.toggleClass('icon-checkbox icon-checkbox-checked')
							.attr('title', '已读')
							.text('已读过');
				}
			}
		})
	});
});