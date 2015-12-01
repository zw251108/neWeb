/**
 * @module codeEditorSkin
 * */
define(['jquery', 'socket', 'template'], function($, socket){
	var listTpl = $.template({
			template: 'li.%on%.%sp%[title=%name% data-type=%type%]{%name%}'
		})

		, SKIN_LIST = ['default', '3024-day', '3024-night', 'ambiance', 'base16-dark', 'base16-light', 'blackboard', 'cobalt', 'dracula', 'eclipse', 'elegant', 'erlang-dark', 'icecoder', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'rubyblue', 'seti', 'solarized', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn']
		, CURRENT_SKIN = 'default'

		, $skinLink = $('<link />', {rel: 'stylesheet'}).appendTo('head')
		, $skin = $('#changeSkin').on({
			click: function(){
				var $that = $(this)
					, $parent = $that.parent()
					, parentWidth = $parent.width()
					, parentLeft = $parent.offset().left

					, width = $skinList.width()
					, bdL = parseInt($skinList.css('borderLeftWidth'), 10)
					, bdR = parseInt($skinList.css('borderRightWidth'), 10)

					, $toolbar = $that.parents('.toolbar')
					, toolbarWidth = $toolbar.width()
					, toolbarLeft = $toolbar.offset().left
					;

				if( width + bdL + bdR === toolbarWidth ){
					$skinList.css('right', (parentLeft + parentWidth - (toolbarLeft + toolbarWidth) ) + 'px');
				}
				else if( parentLeft < width ){
					$skinList.css('right', (parentLeft + parentWidth - toolbarLeft - width) +'px');
				}
				else{
					$skinList.css('right', 0);
				}

				skinList.toggle();
			}
			, mouseover: function(){
				$skin.addClass('hover');
			}
			, mouseout: function(){
				$skin.removeClass('hover');
			}
		})

		, $skinList = $skin.after('<span class="arrow hidden"></span><ul class="list tiny scrollBar skinList hidden"></ul>')
			.nextAll('ul').append( listTpl($.map(SKIN_LIST, function(d){
			var obj = {
				name: d
			};

			if( d === CURRENT_SKIN ){
				obj.on = 'on';
			}

			return obj;
		})).join('') )
			.on('click', 'li', function(){

			$skinList.trigger('setSkin', [this.innerHTML]);

			$(this).addClass('on').siblings('.on').removeClass('on');

			skinList.hide();
		}).on({
			setSkin: function(e, skin){
				skin = skin || CURRENT_SKIN;

				var curr = $skinLink.data('skin');

				if( curr !== skin ){
					$skinLink.attr('href', skin !== 'default' ? BASE_URL +'plugin/codeMirror/theme/'+ skin +'.css' : '').data('skin', skin);

					CURRENT_SKIN = skin;

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

				$.each(codeEditorList, function(i, d){
					d.setOption('theme', skin);
				});
			}
		})
		, BASE_URL
		, codeEditorList = []

		, skinList = {
			$target: $skinList
			, toggle: function(){
				$skinList.slideToggle().prev().toggle();
			}
			, show: function(){
				$skinList.slideDown().prev().show();
			}
			, hide: function(){
				$skinList.slideUp().prev().hide();
			}
			, setSkin: function(skin){
				$skinList.triggerHandler('setSkin', [skin]);
			}
		}
		;

	$(document).on('click', function(){
		!$skin.hasClass('hover') && skinList.hide();
	});

	return function(skin, dir, list){
		CURRENT_SKIN = skin;

		BASE_URL = dir;

		codeEditorList = list;

		return skinList;
	}
});