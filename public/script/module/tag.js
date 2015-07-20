/**
 * @module  tag
 * */
//----- 标签数据 Tag -----
define(['jquery', 'socket', 'template'], function($, socket, tpl){
	var Tag = function(tagsData){

		}
		, tagTpl =$.template({
			template: 'span.tag[data-tag-id=%Id%]{%name%}'
		})
		;
	socket.emit('data', {
		topic: 'tag'
		, receive: 'getTagData'
	});

	socket.on('getTagData', function(data){
		Tag.data = data;
	}).on('addTag', function(){
		socket.emit('addTag', {
			name: ''
		});
	});

	socket.register({
		'tag/add': function(socket, data){
			var id;

			if( 'error' in data ){

			}
			else{
				id = data.info.id;

				// todo
			}
		}
		, 'tag/increase': function(socket, data){

			if( 'error' in data ){

			}
			else{
				// todo
			}
		}
	});

	Tag.setAdd = function( $target ){
		var $tag = $target.find('#tag')
			, $tags = $target.find('#tags')
			, $tagsArea = $target.find('.tagsArea')
			;

		$target.on('click', '#addTag', function(){
			var tag = $tag.val()
				, tags = $tags.val()
				;

			if( tag !== '' ){
				$tag.val('');
				$tags.val( tags ? tags +',' + tag : tag);
				$tagsArea.prepend('<span class="tag tag-checked">'+ tag +'</span>');

				// todo 将标签添加到数据库
				socket.emit('data', {
					topic: 'tag/add'
					, query: {
						name: tag
					}
				});
			}
		}).on('click', '.tagsArea .tag', function(){
			var $that = $(this).toggleClass('tag-checked')
				, tag = this.innerHTML
				, tags = $tags.val()
				;

			if( $that.hasClass('tag-checked') ){
				$tags.val( tags ? tags +',' + tag : tag );
			}
			else{
				$tags.val( tags ? (','+tags+',').replace(','+ tag +',', '').replace(/^,/, '').replace(/,$/, '') : '' );
			}
		});
	};

	return Tag;
});