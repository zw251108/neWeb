/**
 * @module
 * */
define(['jquery', 'socket', 'tag'], function($, socket, tag){
	var filterBoxTpl = $.template({
			template: 'div.filterBox' +
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
	}
});