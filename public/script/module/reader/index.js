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

					$addPopup.trigger('closeDialog');
				}
			})
			, $url = $('#url')
			, tpl = $.template({
				template: 'article#blogArt%Id%.article>a[href=%url% title=%url% target=_blank]>h3.article_title{%url%}' +
				'^hr+span.icon.icon-checkbox+span.icon.icon-star-empty+span.icon.icon-cancel'
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
					$reader.find('.module_content').prepend( tpl({
						Id: data.id
						, url: data.url
					}) )
				}
			}
			, 'reader/read': function(data){
				if( data.msg === 'success' ){
					$reader.find('#blogArt'+ data.id).find('.icon-checkbox').toggleClass('icon-checkbox icon-checkbox-checked');
				}
			}
			, 'reader/favor': function(data){
				if( data.msg === 'success' ){
					$reader.find('#blogArt'+ data.id).find('.icon-star-empty').toggleClass('icon-star-empty icon-star');
				}
			}
		})
	});
});