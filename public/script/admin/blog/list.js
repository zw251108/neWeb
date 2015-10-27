require(['../../config'], function(config){
	config.requireConfig.baseUrl = location.origin + '/script/';

	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'adminAddDataPopup', 'template'], function($, g, addPopup, template){
		var $blog = $('#blog')

			, $addPopup = addPopup(function(data){
				return !!data.title;
			}, function(data, json){
				if( json.success ){
					$blog.find('.module_content').prepend('<article class="article" data-id="'+ json.id +'"><a href="./'+ json.id +'/"><h3 class="article_title">'+ data.title +'</h3></a></article>');
					$addPopup.trigger('closeDialog');
				}
				else{

				}
			})
			, $add = $('#add').on('click', function(){
				$addPopup.trigger('showDialog');
			})
			;
	});
});