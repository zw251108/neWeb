/**
 *
 * */
require(['../../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'bookmarkRead', 'searchBar', 'filterBox', config.dataSource.tag, 'template'], function($, g, socket, bookmarkRead, searchBar, filterBox, tagsData){
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
			, $readPopup
			;

		tagsData = $.parseJSON( tagsData );

		$readPopup = bookmarkRead($favorite, tagsData)

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

		filterBox = filterBox( tagsData );
		filterBox.submit(function(e){
			// todo 阻止表单提交，改为 web socket 获取数据
		});
	});
});