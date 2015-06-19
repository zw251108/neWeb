/**
 *
 * */
require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', 'template', config.dataSource.json], function($, g, socket, a, json){
		console.log($.parseJSON( json ) );

		var $reader = $('#reader')
			, articleTpl = $.template({
				template:'li.reader_article.article>a[href=%url% target=_blank]>h4.article_title{%title%}^div.article_content{%content%}' +
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
				$that.nextAll('.reader_articleList').html('<li><div class="spinner chasing"><div class="dot1"></div><div class="dot2"></div></div></li>')
				socket.emit('data', {
					topic: 'reader/feed'
					, query: {
						feed: feed
						, id: id
					}
				});
				$that.data('deploy', true);
			}
			$that.find('.icon').toggleClass('icon-plus icon-minus');


		}).on('click', '.reader_article > a', function(e){
		}).on('click', '.icon-segment', function(){
			e.preventDefault();

			var $that = $(this);

			socket.emit('data', {
				topic: 'reader/article'
				, query: {
					url: this.href
				}
			});
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
		})
	});
});