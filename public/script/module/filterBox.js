/**
 * @module filterBox
 * */
define(['jquery', 'tag', 'template'], function($, tag){
	var filterBoxTpl = $.template({
			template: 'div.filterBox.small' +
				'>form#filterForm' +
					'>div.formGroup' +
						'>div.input.input-tag' +
							'>div.formGroup' +
								'>input.tag_name[type=text name=tag]' +
								'+button.btn.icon.icon-plus.tag_add[type=button]' +
								'+ul.hidden.list.list-inline.scrollBar.tag_pointOut' +
							'^div.tag_area' +
							'+textarea.hidden[name=tags]' +
					'^^div.btnGroup' +
						'>button.btn.btn-submit[type=submit]{过滤}'
		})
		, $filter = $('#filter').on({
			click: function(){
				var $that = $(this)
					, $parent = $that.parent()
					, parentWidth = $parent.width()
					, parentLeft = $parent.offset().left
					, parentPaddingL = parseInt($parent.css('paddingLeft'), 10)
					, parentPaddingR = parseInt($parent.css('paddingRight'), 10)

					, width = $filterBox.width()
					, bdL = parseInt($filterBox.css('borderLeftWidth'), 10)
					, bdR = parseInt($filterBox.css('borderRightWidth'), 10)

					, $toolbar = $that.parents('.toolbar')
					, toolbarWidth = $toolbar.width()
					, toolbarLeft = $toolbar.offset().left
					;

				if( width + bdL + bdR === toolbarWidth ){ console.log(parentLeft, parentWidth, toolbarLeft, toolbarWidth)
					$filterBox.css('right', (parentLeft + parentWidth + parentPaddingL + parentPaddingR - toolbarLeft - toolbarWidth) + 'px');
				}
				else if( parentLeft < width ){
					$filterBox.css('right', (parentLeft + parentWidth + parentPaddingL + parentPaddingR - toolbarLeft - width) +'px');
				}
				else{
					$filterBox.css('right', 0);
				}

				filterBox.toggle();
			}
			, mouseover: function(){
				$filter.addClass('hover');
			}
			, mouseout: function(){
				$filter.removeClass('hover');
			}
		})
		, $filterBox = $filter.after('<span class="arrow hidden"></span>'+ filterBoxTpl({}))
			.nextAll('.filterBox')
			.on('click', function(e){
			e.stopPropagation();
		})
		, filterBox = {
			$target: $filterBox
			, toggle: function(){
				$filterBox.slideToggle().prev().toggle();
			}
			, show: function(){
				$filterBox.slideDown().prev().show();
			}
			, hide: function(){
				$filterBox.slideUp().prev().hide();
			}
			, submit: function(func){
				$filterBox.on('submit', 'form', func);
			}
		}
		;

	// 点击过滤盒子外的任意位置收起过滤盒子
	$(document).on('click', function(){
		!$filter.hasClass('hover') && filterBox.hide();
	});

	return function(tagsData){
		tag( tagsData );
		tag.setAdd($filterBox, true);

		return filterBox;
	};
});