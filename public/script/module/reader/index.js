/**
 *
 * */
require(['../../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'bookmarkRead', 'searchBar', 'filterBox', 'tag', config.dataSource.tag, 'msgPopup', 'pagination', 'template'], function($, g, socket, bookmarkRead, searchBar, filterBox, tag, tagsData, msgPopup, pagination){
		var $reader = $('#reader')
			, articleTpl = $.template({
				template: 'li.reader_article.article' +
					'>a[href=%url% title=%title% target=_blank]' +
						'>h4.article_title{%title%}' +
					'^hr' +
					'+a.icon.icon-bookmark[href=bookmark/add title=稍后再读]{添加书签}' +
					'+a.icon.icon-checkbox[href=bookmark/read title=读过]{读过}' +
					'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}' +
					'+div.article_content{%content%}' +
					'+div.tagsArea{%tags%}'
				, filter:{
					datetime: function(d){
						return g.datetime( d.datetime );
					}
					, tags: tag.tagTpl
					, content: function(d){
						var content = '<div>'+ d.content +'</div>'
							, img = content.match(/<img.*?>/g) || []
							, srcExpr = /src=('|")?http/
							, i, j, t
							, rs = -1
							;

						for(i = 0, j = img.length; i < j; i++){
							t = img[i];

							if( srcExpr.test( t ) ){
								rs = i;
							}
							else{
								content = content.replace(t, '');
							}
						}

						return (rs !== -1 ? $(img[rs]).attr({
								style: ''
								, width: ''
								, height: ''
							})[0].outerHTML : '') + '<p>' + $(content).text().slice(0, 500).replace(/</g, '&lt;') + ' <a class="link" href="'+ d.url +'" target="_blank">查看更多</a></p>';
					}
				}
			})
			, feedTpl = $.template({
				template: 'section#reader_%id%.reader_section.section' +
					'>a[href=%html_url% data-feed=%xml_url% data-id=%id%]' +
						'>h3.section_title{%name%}' +
							'>span.icon.icon-up' +
					'^^hr' +
					'+ul.reader_articleList' +
					'+div.tagsArea{%tags%}'
				, filter:{
					tags: tag.tagTpl
				}
			})
			, $addPopup = $('#addPopup').on('click', '#addFeed', function(){
				var query = $addFeedForm.serializeJSON();

				if( query.url && query.feed && query.name ){
					$reader.find('.module_content').prepend('<section class="reader_section section" data-feed="'+ query.feed +'"><div class="loading loading-chasing"></div></section>');

					$addPopup.trigger('closeDialog');
					$addFeedForm[0].reset();

					socket.emit('data', {
						topic: 'reader/add'
						, query: query
					});
				}
			})
			, $addFeedForm = $addPopup.find('form')
			, $readPopup
			;

		tagsData = $.parseJSON(tagsData);

		$readPopup = bookmarkRead($reader, tagsData);

		$('#add').on('click', function(){
			$addPopup.trigger('showDialog');
		});

		searchBar = searchBar();
		searchBar.submit(function(){
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
		filterBox.submit(function(){
			// todo 阻止表单提交，改为 web socket 获取数据
		});

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
				$that.nextAll('.reader_articleList').html('<li class="article"><div class="loading loading-chasing"></div></li>');
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
		}).on('click', '.article .icon-bookmark', function(e){
			e.preventDefault();

			var $parent = $(this).parents('.article')
				, id = $parent.attr('id') || 'readerArt' + (+new Date())
				, $title = $parent.find('.article_title')
				, href = $title.parent().attr('href')
				, tags = $parent.find('.tagsArea .tag')
				;

			$parent.attr('id', id);
			tags = tags.length ? tags.map(function(){
				return this.innerHTML;
			}).get().join() : '';

			socket.emit('data', {
				//topic: 'reader/article/bookmark'
				topic: 'reader/bookmark/add'
				, query: {
					targetId: id
					, url: href
					, tags: tags
					, title: $title.html()
				}
			});
		}).on('click', '.icon-checkbox', function(e){
			e.preventDefault();

			var $parent = $(this).parents('.article')
				, id = $parent.data('id') || 'readerArt' + (+new Date())
				, $title = $parent.find('.article_title')
				;

			!$parent.attr('id') && $parent.attr('id', id);

			$readPopup.triggerHandler('setData', [{
				id: $parent.data('id') || id
				, bookmarkId: $parent.data('bookmarkId')
				, title: $title.html()
				, url: $title.parent().attr('href')
				, tags: $parent.find('div.tagsArea').html()
				, score: $parent.data('score')
				, status: $parent.data('status')
			}]);

			$readPopup.trigger('showDialog');
		});

		socket.register({
			'reader/add': function(data){

				if( 'error' in data ){
					msgPopup.showMsg( data.msg );
				}
				else{
					$reader.find('[data-feed="'+ data.info.xml_url +'"]').replaceWith( feedTpl(data.info).join('') );
				}
			}
			, 'reader/feed': function(data){
				var id
					;

				if( 'error' in data ){
					msgPopup.showMsg( data.msg );
				}
				else{
					data = data.info;
					id = data.id;
					data = data.data;

					$reader.find('#reader_'+ id).find('ul').html( articleTpl(data).join('') );
				}
			}
			, 'reader/search': function(data){
				var count = data.count
					;

				data = data.data;

				if( count ){
					$reader.find('.module_content').html( feedTpl(data).join('') );
					// todo 重置页码
				}
				else{
					// todo 显示未搜索到结果
				}
			}
			//, 'reader/article/bookmark': function(data){
			//	var info = data.info || {}
			//		, targetId = info.targetId
			//		, $target = targetId ? $reader.find('#'+ targetId) : null
			//		;
			//
			//	if( $target ){
			//		$target.data('bookmarkId', info.id).attr('id', 'readerArt'+ info.id);
			//		$target.find('.icon-bookmark').toggleClass('icon-bookmark icon-bookmark-full').text('已加书签');
			//		$target.find('div.tagsArea').html(info.tags ? '<span class="tag">'+ info.tags.split(',').join('</span><span class="tag">') +'</span>' : '');
			//	}
			//
			//	if( 'error' in data ){
			//		msgPopup.showMsg( data.msg );
			//	}
			//}
			, 'reader/bookmark/add': function(data){
				var info = data.info
					, targetId
					, $target
					;

				if( info ){
					targetId = info.targetId;
					$target = targetId ? $reader.find('#'+ targetId) : null;

					if( $target ){
						$target.data( info ).attr('id', 'readerArt'+ info.id)
							.find('.icon-bookmark').toggleClass('icon-bookmark icon-bookmark-full').text('已加书签')
							.end()
							.find('div.tagsArea').html(info.tags ? '<span class="tag">'+ info.tags.split(',').join('</span><span class="tag">') +'</span>' : '');
					}
				}

				if( 'error' in data ){
					msgPopup.showMsg( data.msg );
				}
			}
		});
	});
});