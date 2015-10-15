require(['../../config'], function(config){

	config.requireConfig.baseUrl = location.origin + '/script/';

	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'adminAddDataPopup', 'msgPopup'], function($, g, addPopup, msgPopup){
		var $addPopup = addPopup(function(data){
				return !!data.title;
			}, function(data, json){
				if( json.success ){
					$mainList.append('<li class="article" data-id="'+ json.id +'"><a href="'+ json.id +'/"><h3 class="article_title"><span class="icon icon-edit"> </span>'+ data.title +'</h3></a></li>');
					$addPopup.trigger('closeDialog');

					msgPopup.showMsg(data.title +' 文档建立成功！');
				}
				else{

				}
			})
			, $add = $('#add').on('click', function(){
				$addPopup.trigger('showDialog');
			})
			, $mainList = $('.module-main').find('.module_content ul')
			;
	});
});