/**
 *
 * */
require(['/script/config.js'], function(config){
	var r = require( config );
	r(['jquery', 'global', 'socket', 'bookmarkRead', 'searchBar', 'filterBox', 'text!data-tag', 'template'], function($, g, socket, bookmarkRead, searchBar, filterBox, tagsData){
		var $favorite = $('#favorite').on('click', '.icon-checkbox-checked', function(e){
			e.preventDefault();
				var $that = $(this)
					, $parent = $that.parents('.article')
					, $title = $parent.find('.article_title')
					;

				$readPopup.triggerHandler('setData', [{
					id: $parent.data('id')
					, bookmarkId: $parent.data('bookmarkId')
					, title: $title.find('div').html()
					, url: $title.parent().attr('href')
					, tags: $parent.find('div.tagsArea').html()
					, score: $parent.data('score')
					, status: $parent.data('status')
				}]);

				$readPopup.trigger('showDialog');
			})
			, $readPopup
			;

		tagsData = $.parseJSON( tagsData );

		$readPopup = bookmarkRead($favorite, tagsData.data || []);

		searchBar = searchBar();
		searchBar.submit(function(e){
			//var $form = $(this)
			//	, data = $form.serializeJSON()
			//	;
			//
			//socket.emit('data', {
			//	topic: 'reader/bookmark/search'
			//	, query: data
			//});
		});

		filterBox = filterBox( tagsData.data || [] );
		filterBox.submit(function(e){
			// todo 阻止表单提交，改为 web socket 获取数据
		});
	});
});