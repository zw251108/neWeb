/**
 * @module
 * */
define(['jquery', 'socket', 'tag'], function($, socket, tag){
	var filterBoxTpl = $.template({
			template: 'div.filterBox' +
				'>form#filterForm' +
					'>div.formGroup' +
						'>div.tagInput' +
							'>input.input[type=text name=tag]' +
							'+button.btn.icon.icon-plus.addTag[type=button]' +
						'^div.tagsArea' +
						'+textarea.hidden[name=tags]' +
					'^div.btnGroup' +
						'>button.btn.btn-submit[type=submit]{过滤}'
		})
		, $filter = $('#filter').on('click', function(){
			$filterBox.slideToggle().prev().toggle();
		})
		, $filterBox = $filter.after('<span class="arrow hidden"></span>'+ filterBoxTpl({})).nextAll('.filterBox').on('click', '.icon-add', function(){

		})
		, $tag = $filterBox.find(':text')
		;

	return function(tagsData, submit, prevent){
		tag.setAdd($filterBox, true);

		return $filterBox.on('submit', '#filterForm', function(e){
			prevent && e.preventDefault();

			submit && submit(this);
		});
	}
});