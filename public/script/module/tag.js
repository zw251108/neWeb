/**
 * @module  tag
 * @desc    标签 Tag 相关操作
 * */
//-----  -----
define(['jquery', 'socket', 'template'], function($, socket, tpl){
	var Tag = function(tagsData){
			TAG_DATA = tagsData;
		}
		, tagTpl = function(d){
			return d.tags ? '<span class="tag">'+ d.tags.split(',').join('</span><span class="tag">') +'</span>' : '';
		}
		, tagCheckedTpl = function(d){
			return d.tags ? '<span class="tag tag-checked">'+ d.tags.split(',').join('</span><span class="tag tag-checked">') +'</span>' : '';
		}
		, TAG_DATA = []
		;
	//socket.emit('data', {
	//	topic: 'tag'
	//	, receive: 'getTagData'
	//});

	//socket.on('getTagData', function(data){
	//	Tag.data = data;
	//}).on('addTag', function(){
	//	socket.emit('addTag', {
	//		name: ''
	//	});
	//});

	socket.register({
		'tag/add': function(data){
			var id;

			if( 'error' in data ){

			}
			else{
				id = data.info.id;

				// todo
			}
		}
		, 'tag/increase': function(data){

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
			, $tagPointOut = $target.find('#pointOut')
			, tagTimeout = null
			;

		$target.on('keyup', '#tag', function(){
			var that = this
				, val = $.trim( this.value )
				, expr
				;

			tagTimeout && clearTimeout( tagTimeout );
			if( val ){
				expr = new RegExp(val, 'i');

				tagTimeout = setTimeout(function(){
					var rs = []
						, i, j, t
						;
					for( i = 0, j = TAG_DATA.length; i < j; i++ ){
						t = TAG_DATA[i];

						if( expr.test(t.name ) ){
							rs.push( t );
						}
					}
					                 console.log(rs);
					if( rs.length ){
						$tagPointOut.html($.map(rs, function(d){
							return '<li><span class="tag">'+ d.name + '</span></li>';
						}).join('')).slideDown();
					}
					else{
						$tagPointOut.hide()
					}

					tagTimeout = null;
				}, 500);
			}
			else{
				$tagPointOut.slideUp();
				tagTimeout = null;
			}
		}).on('mousewheel DOMMouseScroll', '#pointOut', function(e){
			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail
				, $that = $(this)
				;

			if( delta < 0 ){
				if( this.scrollTop + $that.height() >= this.scrollHeight ){
					return false;
				}
				else{
					e.stopImmediatePropagation();
				}
			}
			else{
				if( this.scrollTop === 0 ){
					return false;
				}
				else{
					e.stopImmediatePropagation();
				}
			}
		}).on('click', '#pointOut .tag', function(){
			var tags = $tags.val();

			$tagsArea.prepend('<span class="tag tag-checked">'+ this.innerHTML +'</span>');
			$tags.val( tags ? tags +',' + this.innerHTML : this.innerHTML);
			$tagPointOut.slideUp();
			$tag.val('').focus();
		}).on('click', '#addTag', function(){
			var tag = $tag.val()
				, tags = $tags.val()
				;

			if( tag !== '' ){
				$tag.val('');
				$tags.val( tags ? tags +',' + tag : tag);
				$tagsArea.prepend('<span class="tag tag-checked">'+ tag +'</span>');
				$tagPointOut.slideUp();

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
	Tag.tagTpl = tagTpl;
	Tag.tagCheckedTpl = tagCheckedTpl;

	return Tag;
});