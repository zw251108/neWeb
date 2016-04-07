/**
 * @module searchBar
 * */
define(['jquery', 'template'], function($){
	var searchBarTpl = $.template({
			template: 'div.searchBar.small' +
				'>form#searchForm' +
					'>div.formGroup' +
						'>input.input[type=text name=keyword]' +
						'+button.btn.icon.icon-search[type=submit]'
		})
		, $search = $('#search').on({
			click: function(){
				var $that = $(this)

					, $parent = $that.parent()
					, parentWidth = $parent.width()
					, parentLeft = $parent.offset().left
					, parentPaddingL = parseInt($parent.css('paddingLeft'), 10)
					, parentPaddingR = parseInt($parent.css('paddingRight'), 10)

					, width = $searchBar.width()
					, bdL = parseInt($searchBar.css('borderLeftWidth'), 10)
					, bdR = parseInt($searchBar.css('borderRightWidth'), 10)

					, $toolbar = $that.parents('.toolbar')
					, toolbarWidth = $toolbar.width()
					, toolbarLeft = $toolbar.offset().left
					;

				if( width + bdL + bdR === toolbarWidth ){console.log(parentLeft, parentWidth, toolbarLeft, toolbarWidth)
					$searchBar.css('right', (parentLeft + parentWidth + parentPaddingL + parentPaddingR - toolbarLeft - toolbarWidth) + 'px');
				}
				else if( parentLeft < width ){
					$searchBar.css('right', (parentLeft + parentWidth + parentPaddingL + parentPaddingR - toolbarLeft - width) + 'px');
				}
				else{
					$searchBar.css('right', 0);
				}

				searchBar.toggle();
			}
			, mouseover: function(){
				$search.addClass('hover');
			}
			, mouseout: function(){
				$search.removeClass('hover');
			}
		})
		, $searchBar = $search.after('<span class="arrow hidden"></span>'+ searchBarTpl({}))
			.nextAll('.searchBar')
			.on('click', function(e){
				e.stopPropagation();
			})
		, searchBar = {
			$target: $searchBar
			, toggle: function(){
				$searchBar.slideToggle().find('input').focus().end().prev().toggle();
			}
			, show: function(){
				$searchBar.slideDown().find('input').focus().end().prev().show();
			}
			, hide: function(){
				$searchBar.slideUp().prev().hide();
			}
			, submit: function(func){
				$searchBar.on('submit', 'form', func);
			}
		}
		;

	// 点击搜索条外的任意位置收起搜索条
	$(document).on('click', function(){
		!$search.hasClass('hover') && searchBar.hide();
	});

	return function(){

		return searchBar;
	};
});