/**
 * @module codeEditorSkin
 * */
define(['jquery', 'socket', 'template'], function($, socket){
	var listTpl = $.template({
			template: 'li.%on%.%sp%[title=%name% data-type=%type%]{%name%}'
		})
		, SKIN_LIST = ['default', '3024-day', '3024-night', 'ambiance', 'base16-dark', 'base16-light', 'blackboard', 'cobalt', 'eclipse', 'elegant', 'erlang-dark', 'lesser-dark', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'rubyblue', 'solarized', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'zenburn']
		, CURRENT_SKIN = 'default'
		, $skinLink = $('<link />', {rel: 'stylesheet'}).appendTo('head')
		, $codeEditorSkin = $('#changeSkin').on({
			click: function(){
				var $that = $(this)
					, $parent = $that.parent()
					, $toolbar = $that.parents('.toolbar')
					, width = $skinList.width()
					, toolbarWidth = $toolbar.width()
					, parentLeft = $parent.offset().left
					;

				if( width === toolbarWidth - 12 ){
					$skinList.css('right', (parentLeft + $that.width() -10+1 - toolbarWidth) + 'px');
					// 10 为 外边距，1 为边框宽度
				}
				else if( parentLeft < width ){
					$skinList.css('right', (parentLeft + 10-1 - width) +'px');
					// 10 为 外边距，1 为边框宽度
				}
				else{
					$skinList.css('right', 0);
				}

				beforeCallback && beforeCallback();

				$skinList.slideToggle().prev().toggle();
			}
			, setSkin: function(e, skin){

				beforeCallback && beforeCallback();

				skin = skin || CURRENT_SKIN;

				$skinLink.attr('href', skin !== 'default' ? BASE_URL +'plugin/codeMirror/theme/'+ skin +'.css' : '');

				CURRENT_SKIN = skin;

				$.each(codeEditorList, function(i, d){
					d.setOption('theme', skin);
				});

				$.ajax({
					url: '/skin'
					, data: {
						skin: skin
					}
					, type: 'POST'
					, success: function(json){
						if( json.success ){
							//CURRENT_SKIN = json.skin;
						}
					}
				});
			}
			//, getSkin: function(){
			//	return CURRENT_SKIN;
			//}
			//, getSkinList: function(){
			//	return SKIN_LIST;
			//}
		})

		, $skinList = $codeEditorSkin.after('<span class="arrow hidden"></span><ul class="list tiny scrollBar skinList hidden"></ul>').nextAll('ul').append( listTpl($.map(SKIN_LIST, function(d){
			var obj = {
				name: d
			};

			if( d === CURRENT_SKIN ){
				obj.on = 'on';
			}

			return obj;
		})).join('') ).on('click', 'li', function(){

			$codeEditorSkin.trigger('setSkin', [this.innerHTML]);

			$(this).addClass('on').siblings('.on').removeClass('on');

			$skinList.slideUp().prev().hide();
		}).on({
			show: function(){
				$skinList.slideDown().prev().show();
			}
			, hide: function(){
				$skinList.slideUp().prev().hide();
			}
			, setSkin: function(){
				$codeEditorSkin.triggerHandler('setSkin');
			}
		})
		, BASE_URL
		, codeEditorList = []
		, beforeCallback

		, skinList = {
			$target: $skinList
			, setSkin: function(skin){
				$codeEditorSkin.triggerHandler('setSkin');
			}
			, show: function(){
				$skinList.slideDown().prev().show();
			}
			, hide: function(){
				$skinList.slideUp().prev().hide();
			}
		}
		;

	$codeEditorSkin.setSkin = function(){

	};

	return function(skin, dir, list, before){
		CURRENT_SKIN = skin;

		BASE_URL = dir;

		codeEditorList = list;

		beforeCallback = before;

		//var t = {
		//	codeEditorList: []
		//	, setSkin: function(skin){
		//
		//	}
		//	, getSkin: function(){
		//		return CURRENT_SKIN;
		//	}
		//	, getSkinList: function(){
		//		return SKIN_LIST;
		//	}
		//};

		return skinList;//$skinList;//$codeEditorSkin;
	}
});