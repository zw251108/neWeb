/**
 * @module  blog
 */
define(['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $blog = g.mod('$blog') || $('#blog')
		, articleTmpl = $.template({
			template:'article#blogArt%Id%.article>a[href=blog/detail/?id=%Id%]>h3.article_title{%title%}' +
				'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
		})
		, $container = g.$container
		;

	socket.on('getBlogData', function(data){

		$blog.data('getData', true).find('.module_content').append( articleTmpl(data).join('') );

		// 数据已加载完成
		$container.triggerHandler('dataReady');
	}).on('getArticleData', function(data){

			$('<div class="article_content">'+ data.content +'</div>').hide()
				.insertAfter( $blog.find('#blogArt'+ data.id).find('a').data('deploy', true) ).slideDown();
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
					, receive: 'getArticleData'
					, id: /=(\d*)$/.exec($self.attr('href'))[1]
				});
			}

			e.preventDefault();
			e.stopImmediatePropagation();
		});
});