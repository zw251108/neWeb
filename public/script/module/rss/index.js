/**
 *
 * */
require(['../config'], function(config){
	var r = require(config);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $rss = $('#rss')
			, articleTpl = $.template({
				template:'li.rss_article.article>a[href=%url% target=_blank]>h3.article_title{%title%}^div.article_content{%content%}' +
				'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
				, filter:{
					tags: function(d){
						return '<span class="tag">'+ d.tags.split(',').join('</span><span class="tag">') +'</span>';
						//var data = []
						//	, tagsId = (d.tags_id || '').split(',')
						//	, tagsName = (d.tags_name || '').split(',')
						//	;
						//
						//$.each(tagsId, function(i, d){
						//	data.push({
						//		Id: d
						//		, name: tagsName[i]
						//	});
						//});
						//
						//return tagTmpl(data).join('');
					}
				}
			})
			;

		$rss.on('click', '.rss_section > a', function(e){
			e.preventDefault();

			var $that = $(this)
				, feed = $that.data('feed')
				, id = $that.data('id')
				;

			if( $that.data('deploy') ){ // 已获取列表
				$that.next().slideToggle();
			}
			else{
				$that.next().html('<li><div class="spinner chasing"><div class="dot1"></div><div class="dot2"></div></div></li>')
				socket.emit('getData', {
					topic: 'rss/feedList'
					, query: {
						feed: feed
						, id: id
					}
				});
				$that.data('deploy', true);
			}
			$that.find('.icon').toggleClass('icon-plus icon-minus');


		}).on('click', '.rss_article > a', function(e){
			e.preventDefault();

			var $that = $(this);

			socket.emit('getData', {
				topic: 'rss/article'
				, query: {
					url: this.href
				}
			});
		});

		socket.register({
			'rss/feedList': function(data){
				var id;
				if( 'error' in data ){
					alert(data.msg);
				}
				else{
					id = data.id;
					data = data.data;

					$rss.find('#rss_'+ id).find('ul').html( articleTpl(data).join('') );
				}
			}
			, 'rss/article': function(data){
				if( 'error' in data ){
					alert(data.msg);
				}
				console.log(data);
			}
		})
	});
});