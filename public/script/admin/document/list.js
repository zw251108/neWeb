require(['/script/config.js'], function(config){

	var r = require.config( config );
	r(['jquery', 'global', 'adminAddDataPopup', 'msgPopup'], function($, g, addPopup, msgPopup){
		var $addPopup = addPopup(function(data){
				return !!data.title;
			}, function(data, json){
				if( json.success ){
					$mainList.append('<li class="article" data-id="'+ json.id +'"><a href="'+ json.id +'/"><h3 class="article_title"><i class="icon icon-edit"> </i>'+ data.title +'</h3></a></li>');
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