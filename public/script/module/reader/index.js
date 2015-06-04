/**
 *
 * */
require(['../config'], function(config){
	var r = require(config);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $reader = $('#reader').on('click', '.icon-star-empty', function(){
				var $that = $(this)
					, $parent = $that.parents('article')
					;
				$(this).toggleClass('icon-star icon-star-empty');
				socket.emit('getData', {
					topic: 'reader/favor'
					, query: {
						id: $parent.data('id')
					}
				});
			}).on('click', '.icon-checkbox', function(){
				var $that = $(this)
					, $parent = $that.parents('article')
					;
				$(this).toggleClass('icon-checkbox icon-checkbox-checked');
				socket.emit('getData', {
					topic: 'reader/read'
					, query: {
						id: $parent.data('id')
					}
				});
			})
			, $addPopup = $('#addPopup').on('click', '#addReader', function(){
				if( $url.val() ){
					socket.emit('getData', {
						topic: 'reader/add'
						, query: {
							url: $url.val()
						}
					});

					$addPopup.trigger('closeDialog').find('form')[0].reset();
				}
			})
			, $url = $('#url')
			, tpl = $.template({
				template: 'article#blogArt%Id%.article[data-id=%Id%]>a[href=%url% title=%url% target=_blank]>h3.article_title{%url%}' +
				'^hr+span.icon.icon-checkbox%readStatus%[title=%readTitle%]+span.icon.icon-star%favorStatus%[title=%favorTitle%]+span.icon.icon-cancel'
				, filter: {
					readStatus: function(d){
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
			'reader/add': function(data){

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