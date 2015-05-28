/**
 * @module  blog/blog
 * */
define(['jquery', 'global', 'socket', 'tag', 'template'], function($, g, socket, tag){
	var $blog = g.mod('$blog') || $('#blog')
		, tagTmpl = tag.tagTmpl
		, articleTmpl = $.template({
			template:'article#blogArt%Id%.article>a[href=blog/detail?id=%Id%]>h3.article_title{%title%}' +
				'^span.article_date{%datetime%}+div.tagsArea{%tags%}'
			, filter:{
				tags: function(d){
					var data = []
						, tagsId = (d.tags_id || '').split(',')
						, tagsName = (d.tags_name || '').split(',')
						;

					$.each(tagsId, function(i, d){
						data.push({
							Id: d
							, name: tagsName[i]
						});
					});

					return tagTmpl(data).join('');
				}
			}
		})
		, $container = g.$container
		, page = 0
		, pageSize = 20
		;

	socket.register({
		blog: function(data){
			$blog.data('getData', true).find('.module_content').append(articleTmpl(data.data, page, pageSize).join(''));

			// 数据已加载完成
			$container.triggerHandler('dataReady');
		}
		, 'blog/detail': function(data){
			data = data.info;
			$('<div class="article_content">'+ data.content +'</div>').hide()
				.insertAfter( $blog.find('#blogArt'+ data.Id).find('a').data('deploy', true) ).slideDown();
		}
	});

	$blog.on('click', '.icon-close', function(e){
		// todo 检查是否有需要保存的数据
	}).on('click', 'article > a', function(e){// 获得详细内容
			var $self = $(this)
				, isDeploy = $self.data('deploy')
				;

			if( isDeploy ){// 已获取数据
				$self.next().slideToggle();
			}
			else{
				socket.emit('getData', {
					topic: 'blog/detail'
					, query: {
						id: /=(\d*)$/.exec($self.attr('href'))[1]
					}
				});
			}

			e.preventDefault();
			e.stopImmediatePropagation();
		});
});