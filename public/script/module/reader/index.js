/**
 *
 * */
require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'bookmarkRead', config.dataSource.tag, 'template'], function($, g, socket, bookmarkRead, tagsData){
		var $reader = $('#reader')
			, articleTpl = $.template({
				template: 'li.reader_article.article' +
					'>a[href=%url% title=%title% target=_blank]' +
						'>h4.article_title{%title%}' +
					'^hr' +
					'+a.icon.icon-bookmark[href=reader/bookmark title=稍后再读]{添加书签}' +
					'+a.icon.icon-checkbox[href=reader/read title=未读]{读过}' +
					'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}' +
					'+div.article_content{%content%}' +
					'+div.tagsArea{%tags%}'
				, filter:{
					tags: function(d){
						return d.tags ? '<span class="tag">'+ d.tags.split(',').join('</span><span class="tag">') +'</span>' : '';
					}
					, datetime: function(d){
						return g.datetime( d.datetime );
					}
				}
			})
			, $readPopup = bookmarkRead($reader, tagsData)
			;

		$reader.on('click', '.reader_section > a', function(e){
			e.preventDefault();

			var $that = $(this)
				, feed = $that.data('feed')
				, id = $that.data('id')
				;

			if( $that.data('deploy') ){ // 已获取列表
				$that.nextAll('.reader_articleList').slideToggle();
			}
			else{
				$that.nextAll('.reader_articleList').html('<li><div class="loading loading-chasing"></div></li>');
				socket.emit('data', {
					topic: 'reader/feed'
					, query: {
						feed: feed
						, id: id
					}
				});
				$that.data('deploy', true);
			}
			$that.find('.icon').toggleClass('icon-up icon-down');


		}).on('click', '.reader_article > a', function(e){

		}).on('click', '.icon-bookmark', function(e){
			e.preventDefault();

			var id = 'readerArt' + (+new Date())
				, $that = $(this).parents('.article').attr('id', id).find('.article_title').parent()
				;

			socket.emit('data', {
				topic: 'reader/article/bookmark'
				, query: {
					targetId: id
					, url: $that.attr('href')
				}
			});
		}).on('click', '.icon-checkbox', function(e){
			e.preventDefault();

			var  id = 'readerArt' + (+new Date())
				, $that = $(this)
				, $parent = $that.parents('.article').attr('id', id)
				;

			$readPopup.triggerHandler('setData', [{
				id: $parent.data('bookmarkId') || id
				, url: $parent.find('.article_title').parent().attr('href')
				, title: $parent.find('.article_title').html()
				, tags: $parent.find('div.tagsArea').html()
			}]);

			$readPopup.trigger('showDialog');

			//var $that = $(this).toggleClass('icon-checkbox icon-checkbox-checked').parents('.article').find('.article_title').parent();
			//
			//socket.emit('data', {
			//	topic: 'reader/article/bookmark'
			//	, query: {
			//		url: $that.attr('href')
			//	}
			//});
		});

		socket.register({
			'reader/feed': function(data){
				var id;
				if( 'error' in data ){
					alert(data.msg);
				}
				else{
					data = data.info;
					id = data.id;
					data = data.data;

					$reader.find('#reader_'+ id).find('ul').html( articleTpl(data).join('') );
				}
			}
			, 'reader/article': function(data){
				if( 'error' in data ){
					alert(data.msg);
				}
				console.log(data);
			}
			, 'reader/article/bookmark': function(data){
				var info = data.info || {}
					, targetId = info.targetId
					, $target = targetId ? $reader.find('#'+ targetId) : null
					;

				if( $target ){
					$target.data('bookmarkId', info.Id);
					$target.find('.icon-bookmark').toggleClass('icon-bookmark icon-bookmark-full').text('已标记');
					$target.find('div.tagsArea').html(info.tags ? '<span class="tag">'+ info.tags.split(',').join('</span><span class="tag">') +'</span>' : '');
				}

				if( 'error' in data ){
					alert( data.msg );
				}
			}
			, 'reader/artcile/read': function(data){

			}
		})
	});
});