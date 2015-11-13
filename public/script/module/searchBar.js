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
				, $toolbar = $that.parents('.toolbar')
				, width = $searchBar.width()
				, toolbarWidth = $toolbar.width()
				, parentLeft = $parent.offset().left
				;

			if( width === toolbarWidth - 12 ){
				$searchBar.css('right', (parentLeft + $that.width() -10+1 - toolbarWidth) + 'px');
				// 10 为 外边距，1 为边框宽度
			}
			else if( parentLeft < width ){
				$searchBar.css('right', (parentLeft + 10-1 - width) +'px');
				// 10 为 外边距，1 为边框宽度
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