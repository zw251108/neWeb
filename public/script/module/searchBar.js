/**
 * @module searchBar
 * */
define(['jquery', 'socket', 'template'], function($, socket){
	var searchBarTpl = $.template({
			template: 'div.searchBar.small' +
				'>form#searchForm' +
					'>div.formGroup' +
						'>input.input[type=text name=keyword]' +
						'+button.btn.icon.icon-search[type=submit]'
		})
		, $search = $('#search').on('click', function(){
			var $that = $(this)

				, $parent = $that.parent()
				, parentWidth = $parent.width()
				, parentLeft = $parent.offset().left

				, width = $searchBar.width()
				, bdL = parseInt($searchBar.css('borderLeftWidth'), 10)
				, bdR = parseInt($searchBar.css('borderRightWidth'), 10)

				, $toolbar = $that.parents('.toolbar')
				, toolbarWidth = $toolbar.width()
				, toolbarLeft = $toolbar.offset().left
				;

			if( width + bdL + bdR === toolbarWidth ){
				$searchBar.css('right', (parentLeft + parentWidth - (toolbarLeft + toolbarWidth) ) + 'px');
			}
			else if( parentLeft < width ){
				$searchBar.css('right', (parentLeft + parentWidth - toolbarLeft - width) +'px');
			}
			else{
				$searchBar.css('right', 0);
			}

			$searchBar.slideToggle().prev().toggle();
		})
		, $searchBar = $search.after('<span class="arrow hidden"></span>'+ searchBarTpl({})).nextAll('.searchBar')
		;

	return function(submit, prevent){
		return $searchBar.on('submit', '#searchForm', function(e){
			prevent && e.preventDefault();

			submit && submit(this);
		});
	};
});