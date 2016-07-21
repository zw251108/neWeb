/**
 *
 * */
require(['/script/config.js'], function(config){
	var r = require( config );
	r(['jquery', 'global', 'socket', 'bookmarkRead', 'searchBar', 'filterBox', 'tag', 'text!data-tag', 'msgPopup', 'pagination', 'template'], function($, g, socket, bookmarkRead, searchBar, filterBox, tag, tagsData, msgPopup, pagination){
		var $reader = $('#reader')
			, articleTpl = $.template({
				template: 'li.reader_article.article' +
					'>a[href=%url% title=%title% target=_blank]' +
						'>h4.article_title.icon.icon-document{%title%}' +
					'^hr' +
					'+div.article_score.%article_score_value%{%article_score%}' +
					'+a.icon.icon-bookmark[href=bookmark/add title=稍后再读]{添加书签}' +
					'+a.icon.icon-checkbox[href=bookmark/read title=读过]{读过}' +
					'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}' +
					'+div.article_content{%content%}' +
					'+div.tagsArea{%tags%}'
				, filter:{
					datetime: function(d){
						return g.datetime( d.datetime );
					}
					, article_score: function(d){
						var i = 0
							, j = 5
							, h = []
							;
						for(; i < j; i++){
							h.push('<i class="icon icon-star'+ ( i < d.score ? '-full' : '' ) +'"></i>');
						}

						return h.join('');
					}
					, article_score_value: function(d){
						return +d.status ? 'article_score_value' : '';
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
					'>a[href=%url% data-feed=%feed% data-id=%id%]' +
						'>h3.section_title{%name%}' +
							'>i.icon.icon-up' +
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

		$readPopup = bookmarkRead($reader, tagsData.data || []);

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

		filterBox = filterBox( tagsData.data || [] );
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
					tempId: id
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

				if( data.msg !== 'Done' ){
					msgPopup.showMsg( data.msg );
				}
				else{
					// todo 数组
					$.each(data.data, function(i, d){
						$reader.find('[data-feed="'+ d.feed +'"]').replaceWith( feedTpl(d).join('') );
					});
				}
			}
			, 'reader/feed': function(data){

				if( data.msg !== 'Done' ){
					msgPopup.showMsg( data.msg );
				}
				else{
					// todo 数组
					$.each(data.data, function(i, d){
						$reader.find('#reader_'+ d.id).find('ul').html( articleTpl(d.data).join('') );
					});
				}
			}
			, 'reader/search': function(data){

				if( data.msg !== 'Done' ){
					msgPopup.showMsg( data.msg );
				}
				else{
					// todo 数组
					$reader.find('.module_content').html( feedTpl(data.data).join('') );
				}
			}
			, 'reader/bookmark/add': function(data){
				var tempId
					, $target
					;

				if( data.msg !== 'Done' ){
					msgPopup.showMsg( data.msg );
				}
				else{
					// todo 数组
					$.each(data.data, function(i, d){
						tempId = d.tempId;
						$target = tempId ? $reader.find('#'+ tempId) : null;

						if( $target ){
							$target.data( d ).attr('id', 'readerArt'+ d.id)
								.find('.icon-bookmark').toggleClass('icon-bookmark icon-bookmark-full').text('已加书签')
								.end()
								.find('div.tagsArea').html(d.tags ? '<span class="tag">'+ d.tags.split(',').join('</span><span class="tag">') +'</span>' : '');
						}
					});
				}
			}
		});
	});
});