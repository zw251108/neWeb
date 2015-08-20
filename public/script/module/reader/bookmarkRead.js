define(['jquery', 'global', 'socket', 'tag', 'template'], function($, g, socket, tag){
	var $bookmark
		, $readPopup = $('#readPopup').on('setData', function(e, data){

			$bookmarkId.val( data.id );
			$bookmarkUrl.val( data.url );
			$bookmarkTitle.val( data.title );

			$readPopup.find('div.tagsArea').html( data.tags );

		}).on('click', '#readBookmark', function(){

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
				query.url = query.bookmarkUrl;
				query.score = +query.score;

				socket.emit('data', {
					topic: 'reader/read'
					, query: query
				});

				$bookmark
					.find('#'+ (/^\d+$/.test(query.id) ? 'readerArt' + query.id : query.id) )
					.find('div.tagsArea').html( '<span class="tag tag-checked">'+ query.tags.split(',').join('</span><span class="tag tag-checked">') +'</span>')
					.end().find('.article_title').html( $bookmarkTitle.val() );
				$readPopup.trigger('closeDialog').find('form')[0].reset();
			}
			else{
				// todo 替换为自定义弹窗
				alert('请至少添加一个标签，以方便管理！');
			}
		})

		, $readForm = $readPopup.find('#readForm')
		, $bookmarkId = $readPopup.find('#bookmarkId')
		, $bookmarkUrl = $readPopup.find('#bookmarkUrl')
		, $bookmarkTitle = $readPopup.find('#bookmarkTitle')
		, $tag = $readPopup.find('#tag')
		, $tags = $readPopup.find('#tags')
		;

	tag.setAdd( $readPopup );

	socket.register('reader/read', function(data){
		var info = data.info || {}
			, targetId = info.targetId
			, id = info.id
			;

		if( !('error' in data) ){
			$bookmark
				.find('#'+ (targetId || 'readerArt'+ id)).data('bookmarkId', id).attr('id', 'readerArt'+ id)
				.find('.icon-checkbox').toggleClass('icon-checkbox icon-checkbox-checked').attr('title', '已读').text('已读过')
				.end().find('.icon-bookmark').toggleClass('icon-bookmark icon-bookmark-full').text('已标记');
		}
	});

	return function($bm, tagsData){
		$bookmark = $bm;

		tag( $.parseJSON( tagsData ) );

		return $readPopup;
	}
});