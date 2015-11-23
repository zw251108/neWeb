/**
 * @module filterBox
 * */
define(['jquery', 'socket', 'tag', 'template'], function($, socket, tag){
	var filterBoxTpl = $.template({
			template: 'div.filterBox.small' +
				'>form#filterForm' +
					'>div.formGroup' +
						'>div.input-tag' +
							'>div.formGroup' +
								'>input.input[type=text name=tag]' +
								'+button.btn.icon.icon-plus.tag_add[type=button]' +
								'+ul.hidden.list.scrollBar.tag_pointOut' +
							'^div.tag_area' +
							'+textarea.hidden[name=tags]' +
					'^^div.btnGroup' +
						'>button.btn.btn-submit[type=submit]{过滤}'
		})
		, $filter = $('#filter').on('click', function(){
			var $that = $(this)
				, $parent = $that.parent()
				, parentWidth = $parent.width()
				, parentLeft = $parent.offset().left

				, width = $filterBox.width()
				, bdL = parseInt($filterBox.css('borderLeftWidth'), 10)
				, bdR = parseInt($filterBox.css('borderRightWidth'), 10)

				, $toolbar = $that.parents('.toolbar')
				, toolbarWidth = $toolbar.width()
				, toolbarLeft = $toolbar.offset().left
				;

			if( width + bdL + bdR === toolbarWidth ){
				$filterBox.css('right', (parentLeft + parentWidth - (toolbarLeft + toolbarWidth) ) + 'px');
			}
			else if( parentLeft < width ){
				$filterBox.css('right', (parentLeft + parentWidth - toolbarLeft - width) +'px');
			}
			else{
				$filterBox.css('right', 0);
			}

			$filterBox.slideToggle().prev().toggle();
		})
		, $filterBox = $filter.after('<span class="arrow hidden"></span>'+ filterBoxTpl({})).nextAll('.filterBox')
		;

	return function(tagsData, submit, prevent){
		tag.setAdd($filterBox, true);

		return $filterBox.on('submit', '#filterForm', function(e){
			prevent && e.preventDefault();

			submit && submit(this);
		});
	};
});