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
				, $toolbar = $that.parents('.toolbar')
				, width = $filterBox.width()
				, toolbarWidth = $toolbar.width()
				, parentLeft = $parent.offset().left
				;

			if( width === toolbarWidth - 12 ){
				$filterBox.css('right', (parentLeft + $that.width() -10+1 - toolbarWidth) + 'px');
				// 10 为 外边距，1 为边框宽度
			}
			else if( parentLeft < width ){
				$filterBox.css('right', (parentLeft + 10-1 - width) +'px');
				// 10 为 外边距，1 为边框宽度
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