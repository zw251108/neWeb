define(['jquery', 'global', 'socket', 'tag', 'msgPopup', 'template'], function($, g, socket, tag, msgPopup){
	var $bookmark
		, $readPopup = $('#readPopup').on('setData', function(e, data){

			$ubId.val( data.id );
			$bookmarkId.val( data.bookmarkId );
			$bookmarkUrl.val( data.url );
			$bookmarkTitle.val( data.title );

			$oldScore.val( data.score );
			$oldStatus.val( data.status );

			data.score && $readPopup.find('#star'+ data.score).prop('checked', true);

			$readPopup.find('div.tag_area').html( data.tags );
			$tags.val( $(data.tags).filter('.tag-checked').map(function(){return this.innerHTML;}).get().join() );

		}).on('click', '#readBookmark', function(){

			var query = $readForm.serializeJSON()
				;

			if( query.tags !== '' ){
				//query.id = query.bookmarkId;
				query.url = query.bookmarkUrl;
				query.score = +query.score;

				socket.emit('data', {
					topic: 'reader/bookmark/read'
					, query: query
				});

				$bookmark
					.find('#'+ (/^\d+$/.test(query.id) ? 'readerArt' + query.id : query.id) )
					.find('div.tagsArea').html( '<span class="tag tag-checked">'+ query.tags.split(',').join('</span><span class="tag tag-checked">') +'</span>')
					.end().find('.article_title').html( $bookmarkTitle.val() );
				$readPopup.trigger('closeDialog').find('form')[0].reset();
			}
			else{
				msgPopup.showMsg('请至少添加一个标签，以方便管理！');
			}
		})

		, $readForm = $readPopup.find('#readForm')
		, $ubId = $readPopup.find('#ubId')
		, $bookmarkId = $readPopup.find('#bookmarkId')
		, $bookmarkUrl = $readPopup.find('#bookmarkUrl')
		, $bookmarkTitle = $readPopup.find('#bookmarkTitle')
		, $oldScore = $readPopup.find('#oldScore')
		, $oldStatus = $readPopup.find('#oldStatus')
		, $tags = $readPopup.find('[name="tags"]')
		;

	tag.setAdd( $readPopup );

	socket.register('reader/bookmark/read', function(data){
		var info = data.info || {}
			, tempId = info.tempId
			, id = info.id
			;

		if( data.msg !== 'Done' ){

		}
		else{
			$bookmark
				.find('#'+ (tempId || 'readerArt'+ id)).data('bookmarkId', id).attr('id', 'readerArt'+ id)
				.find('.icon-checkbox').toggleClass('icon-checkbox icon-checkbox-checked').attr('title', '已读').text('已读')
				.end().find('.icon-bookmark').toggleClass('icon-bookmark icon-bookmark-full').text('已加书签');
		}
	});

	return function($bm, tagsData){
		$bookmark = $bm;

		tag( tagsData );

		return $readPopup;
	};
});