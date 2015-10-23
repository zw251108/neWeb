/**
 * @module searchBar
 * */
define(['jquery', 'socket', 'template'], function($, socket){
	var searchBarTpl = $.template({
			template: 'div.searchBar' +
				'>form#searchForm' +
					'>div.formGroup' +
						'>input.input[type=text name=keyword]' +
						'+button.btn.icon.icon-search[type=submit]'
		})
		, $search = $('#search').on('click', function(){
			$searchBar.slideToggle().prev().toggle();
		})
		, $searchBar = $search.after('<span class="arrow hidden"></span>'+ searchBarTpl({})).nextAll('.searchBar')
		;

	return function(submit, prevent){
		return $searchBar.on('submit', '#searchForm', function(e){console.log(123123)
			prevent && e.preventDefault();

			submit && submit(this);
		});
	}
});