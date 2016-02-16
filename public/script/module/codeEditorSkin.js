/**
 * @module codeEditorSkin
 * */
define(['jquery', 'socket', 'storage', 'template'], function($, socket, storage){
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

		, $skinList = $skin.after('<span class="arrow hidden"></span><ul class="list tiny scrollBar skinList hidden" role="listbox" aria-expanded="false"></ul>')			.nextAll('ul').append( listTpl($.map(SKIN_LIST, function(d){
			var obj = {
				name: d
			};

			if( d === CURRENT_SKIN ){
				obj.on = 'active';
			}

			return obj;
		})).join('') )
			.on('click', 'li', function(){

			$skinList.trigger('setSkin', [this.innerHTML]);

			$(this).addClass('active').siblings('.active').removeClass('active');

			skinList.hide();
		}).on({
			setSkin: function(e, skin){
				skin = skin || CURRENT_SKIN;

				if( CURRENT_SKIN !== skin ){
					$skinLink.attr('href', skin !== 'default' ? BASE_URL +'plugin/codeMirror/theme/'+ skin +'.css' : '');

					CURRENT_SKIN = skin;

					socket.emit('data', {
						topic: 'user/skin'
						, query: {
							skin: skin
						}
					});

					storage.setItem('skin', CURRENT_SKIN);

					//$.ajax({
					//	url: '/skin'
					//	, data: {
					//		skin: skin
					//	}
					//	, type: 'POST'
					//	, success: function(json){
					//		if( json.success ){
					//			//CURRENT_SKIN = json.skin;
					//		}
					//	}
					//});
				}

				$.each(codeEditorList, function(i, d){
					d.getOption('theme') !== CURRENT_SKIN && d.setOption('theme', skin);
				});
			}
			, 'mousewheel DOMMouseScroll': function(e){
				var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail
					, $that = $(this)
					, h = $that.height()
					, sch = this.scrollHeight
					, sct = this.scrollTop
					;

				if( h !== sch ){
					if( delta < 0 ){
						if( sct + h >= sch ){
							return false;
						}
					}
					else{
						if( sct === 0 ){
							return false;
						}
					}
				}
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

	socket.register({
		'user/skin': function(data){
			var skin = data.info.skin || 'default';

			skin !== CURRENT_SKIN && skinList.setSkin( skin );
		}
	});

	window.addEventListener('storage', function(e){
		var skin
			;

		if( e.key === 'skin' ){
			skin = e.newValue;

			if( skin !== CURRENT_SKIN ){
				skinList.setSkin( skin );
			}
		}
	});

	$(document).on('click', function(){
		!$skin.hasClass('hover') && skinList.hide();
	});

	return function(skin, dir, list){
		BASE_URL = dir;

		codeEditorList = list;

		skinList.setSkin( skin );

		return skinList;
	};
});