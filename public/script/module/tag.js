/**
 * @module  tag
 * @desc    标签 Tag 相关操作
 * */
//-----  -----
define(['jquery', 'global', 'socket', 'text!data-tag'], function($, g, socket, TAG_DATA){
	var Tag = function(tagsData){
			TAG_DATA = tagsData;
		}
		, tagTpl = function(d){
			return d.tags ? '<span class="tag">'+ d.tags.split(',').join('</span><span class="tag">') +'</span>' : '';
		}
		, tagCheckedTpl = function(d){
			return d.tags ? '<span class="tag tag-checked">'+ d.tags.split(',').join('</span><span class="tag tag-checked">') +'</span>' : '';
		}
		;

	TAG_DATA = $.parseJSON( TAG_DATA );

	socket.register({
		'tag/add': function(data){

			if( data.msg === 'Done' ){

				// todo
				TAG_DATA.push.apply(TAG_DATA, data.data);
			}
		}
		, 'tag/increase': function(data){

			if( data.msg === 'Done' ){

				// todo
			}
		}
	});

	Tag.setAdd = function($target, notSave){
		var $tag = $target.find('[name="tag"]')
			, $tags = $target.find('[name="tags"]')
			, $tagsArea = $target.find('.tag_area')
			, $tagPointOut = $target.find('.tag_pointOut')
			, tagTimeout = null
			;

		$target.on('keyup', '[name="tag"]', function(){
			var that = this
				, val = $.trim( this.value )
				, expr
				;

			val = val.replace('.', '\\\.').replace('(', '\\\(').replace(')', '\\\)');

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
		}).on('mousewheel DOMMouseScroll', '.tag_pointOut', function(e){
			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail
				, $that = $(this)
				, h = $that.height()
				, sch = this.scrollHeight
				, sct = this.scrollTop
				;

			if( delta < 0 ){
				if( sct + h >= sch ){
					return false;
				}
				else{
					e.stopImmediatePropagation();
				}
			}
			else{
				if( sct === 0 ){
					return false;
				}
				else{
					e.stopImmediatePropagation();
				}
			}
		}).on('click', '.tag_pointOut .tag', function(){
			var tags = $tags.val();

			$tagsArea.prepend('<span class="tag tag-checked">'+ this.innerHTML +'</span>');
			$tags.val( tags ? tags +',' + this.innerHTML : this.innerHTML);
			$tagPointOut.slideUp();
			$tag.val('').focus();
		}).on('click', '.tag_add', function(){
			var tag = $tag.val()
				, tags = $tags.val()
				;

			if( tag !== '' ){
				$tag.val('');
				$tags.val( tags ? tags +',' + tag : tag);
				$tagsArea.prepend('<span class="tag tag-checked">'+ tag +'</span>');

				$tagPointOut.slideUp();

				// todo 将标签添加到数据库
				!notSave && socket.emit('data', {
					topic: 'tag/add'
					, query: {
						name: tag
					}
				});
			}
		}).on('click', '.tag_area .tag', function(){
			var $that = $(this).toggleClass('tag-checked')
				, tag = this.innerHTML
				, tags = $tags.val()
				;

			if( $that.hasClass('tag-checked') ){
				$tags.val( tags ? tags +',' + tag : tag );
			}
			else{
				$tags.val( tags ? (','+tags+',').replace(','+ tag +',', ',').replace(/^,/, '').replace(/,$/, '') : '' );
			}
		});
	};
	Tag.tagTpl = tagTpl;
	Tag.tagCheckedTpl = tagCheckedTpl;

	return Tag;
});