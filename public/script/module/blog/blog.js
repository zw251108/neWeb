/**
 * @module  blog/blog
 * */
// define(['jquery', 'global', 'socket', 'tag', 'template'], function($, g, socket, tag){
// 	console.log(0)
// 	var $blog = g.mod('$blog') || $('#blog')
// 		, tagTmpl = tag.tagTmpl
// 		, articleTmpl = $.template({
// 			template:'article#blogArt%Id%.article>a[href=blog/detail?id=%id%]>h3.article_title{%title%}' +
// 				'^time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
// 			, filter:{
// 				tags: function(d){
// 					var data = []
// 						, tagsId = (d.tags_id || '').split(',')
// 						, tagsName = (d.tags || '').split(',')
// 						;
//
// 					$.each(tagsId, function(i, d){
// 						data.push({
// 							id: d
// 							, name: tagsName[i]
// 						});
// 					});
//
// 					return tagTmpl(data).join('');
// 				}
// 			}
// 		})
// 		, $container = g.$container
// 		, page = 0
// 		, pageSize = 20
// 		;
//
// 	socket.register({
// 		blog: function(data){
// 			$blog.data('data', true).find('.module_content').append(articleTmpl(data.data, page, pageSize).join(''));
//
// 			// 数据已加载完成
// 			$container.triggerHandler('dataReady');
// 		}
// 		, 'blog/detail': function(data){
// 			data = data.info;
// 			$('<div class="article_content">'+ data.content +'</div>').hide()
// 				.insertAfter( $blog.find('#blogArt'+ data.id).find('a').data('deploy', true) ).slideDown();
// 		}
// 	});
//
// 	$blog.on('click', '.icon-close', function(e){
// 		// todo 检查是否有需要保存的数据
// 	}).on('click', 'article > a', function(e){// 获得详细内容
// 			var $self = $(this)
// 				, isDeploy = $self.data('deploy')
// 				;
//
// 			if( isDeploy ){// 已获取数据
// 				$self.next().slideToggle();
// 			}
// 			else{
// 				socket.emit('data', {
// 					topic: 'blog/detail'
// 					, query: {
// 						id: /=(\d*)$/.exec($self.attr('href'))[1]
// 					}
// 				});
// 			}
//
// 			e.preventDefault();
// 			e.stopImmediatePropagation();
// 		});
// });

require(['/script/config.js'], function(config){
	var r = require( config )
		;

	r(['jquery', 'global', 'socket', 'text!data-skin', 'codeEditor', 'codeEditorSkin'
		, 'template'
	], function($, g, socket, skin, code, codeSkin){
		var $blog = g.mod('$blog') || $('#blog')

			, $codeArea = $blog.find('textarea')
			, codeList = []
			;

		$codeArea.each(function(i, d){
			codeList.push( code(d, d.dataset.codeType, true) );
		});

		skin = $.parseJSON( skin );
		
		codeSkin(skin.skin, config.baseUrl, codeList);
	});
});