/**
 *
 * */
require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $reader = $('#reader').on('click', '.icon-star-empty', function(e){
				e.preventDefault();

				var $that = $(this)
					, $parent = $that.parents('article')
					;
				$(this).toggleClass('icon-star icon-star-empty').text('已读过');
				socket.emit('getData', {
					topic: 'reader/favor'
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
				socket.emit('getData', {
					topic: 'reader/read'
					, query: {
						id: $parent.data('id')
					}
				});
			}).on('click', '.icon-remove', function(e){
				e.preventDefault();
			})
			, $addPopup = $('#addPopup').on('click', '#addReader', function(){
				if( $url.val() ){
					socket.emit('getData', {
						topic: 'reader/bookmarkAdd'
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
				'^hr+a.icon.icon-checkbox%readStatus%[href=reader/read title=%readTitle%]{%readText%}' +
				'+a.icon.icon-star%favorStatus%[href=reader/favor title=%favorTitle%]{%favorText%}+a.icon.icon-cancel[href=reader/remove title=删除]{删除}'
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
					, favorStatus: function(d){
						return +d.status > 1 ? '' : '-empty';
					}
					, favorTitle: function(d){
						return +d.status > 1 ? '已收藏' : '未收藏';
					}
				}
			})
			;

		$('#add').on('click', function(){
			$addPopup.trigger('showDialog');
		});

		socket.register({
			'reader/bookmarkAdd': function(data){

				if( data.msg !== 'success' ){
					alert( data.msg );
				}
				else{
					data = data.info;
					data.Id = data.id;
					$reader.find('.module_content').prepend( tpl(data) )
				}
			}
			, 'reader/read': function(data){
				if( data.msg === 'success' ){
					$reader.find('#blogArt'+ data.id).find('.icon-checkbox')
						.toggleClass('icon-checkbox icon-checkbox-checked')
						.attr('title', '已读');
				}
			}
			, 'reader/favor': function(data){
				if( data.msg === 'success' ){
					$reader.find('#blogArt'+ data.id)
						.find('.icon-star-empty')
							.toggleClass('icon-star-empty icon-star')
							.attr('title', '已收藏')
						.end().find('.icon-checkbox')
							.toggleClass('icon-checkbox icon-checkbox-checked')
							.attr('title', '已读');
				}
			}
		})
	});
});