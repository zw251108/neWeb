/**
 *
 * */
require(['../../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'bookmarkRead', 'searchBar', config.dataSource.tag, 'template'], function($, g, socket, bookmarkRead, searchBar, tagsData){
		var $favorite = $('#favorite').on('click', '.icon-checkbox-checked', function(e){
			e.preventDefault();
				var $that = $(this)
					, $parent = $that.parents('.article')
					;

				$readPopup.triggerHandler('setData', [{
					id: $parent.data('id')
					, title: $parent.find('h3.article_title').html()
					, tags: $parent.find('div.tagsArea').html()
					, score: $parent.data('score')
				}]);

				$readPopup.trigger('showDialog');
			})
			, $readPopup = bookmarkRead($favorite, tagsData)
			;

		searchBar(function(form){
			//var $form = $(form)
			//	, data = $form.serializeJSON()
			//	;
			//
			//socket.emit('data', {
			//	topic: 'reader/bookmark/search'
			//	, query: data
			//});
		});
	});
});