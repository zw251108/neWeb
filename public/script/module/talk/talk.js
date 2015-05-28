/**
 * @module  talk/talk
 * */
define(['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $talk = g.mod('$talk') || $('#talk')
		, timeNodeTmpl = $.template({
			template: 'li.timeNode>a.icon.icon-user+div.message{%content%}>span.datetime{%datetime%}'
			, filter: {
				content: function(data){
					if( data.type === 'blog' ){
						return '发布了文章 <a class="link" href="blog/detail/?id=' + data.Id +
							'">' + data.content +'</a>';
					}
					return data.content;
				}
			}
		})
		, $container = g.$container
		;

	socket.on('getTalkData', function(data){

		$talk.data('deploy', true).find('.module_content').append( '<form action="" method="post">' +
			'<textarea name="content" rows="5" cols="30"></textarea>' +
			'<input type="hidden" name="status" value="1"/> ' +
			'<input type="button" value="保存"/><input type="submit" value="发布"/></form>' +
			'<ul class="timeLine" id="timeLine">' +
			timeNodeTmpl(data).join('') +
			'</ul>' );

		// 数据已加载完成
		$container.triggerHandler('dataReady');
	});

	$talk.on('submit', 'form', function(e){
		var postData = $talk.find('form').serializeArray()
			, i = postData.length
			, data = {}
			;

		while( i-- ){
			if( postData[i].name in data ){
				data[postData[i].name] += ',' + postData[i].value;
			}
			else{
				data[postData[i].name] = postData[i].value;
			}
		}

		// todo 提交表单
		socket.emit('message', data);

		e.preventDefault();
		e.stopImmediatePropagation();
	}).on('click', '.icon-close', function(e){
			// todo 检查是否有需要保存的数据
		});

	return $talk;
});