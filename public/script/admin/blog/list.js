require(['/script/config.js'], function(config){

	var r = require.config( config );
	r(['jquery', 'global', 'adminAddDataPopup', 'template'], function($, g, addPopup, template){
		var $blog = $('#blog')

			, $addPopup = addPopup(function(data){
				return !!data.title;
			}, function(data, json){
				if( json.msg === 'Done' ){
					json = json.data[0];

					var date = new Date()
						, y = date.getFullYear()
						, mouth = date.getMonth() +1
						, d = date.getDate()
						, h = date.getHours()
						, m = date.getMinutes()
						, s = date.getSeconds()
						;

					mouth = mouth > 9 ? mouth : '0'+ mouth;
					d = d > 9 ? d : '0'+ d;
					h = h > 9 ? h : '0'+ h;
					m = m > 9 ? m : '0'+ m;
					s = s > 9 ? s : '0'+ s;

					date = y +'-'+ mouth +'-'+ d +' '+ h +':'+ m +':'+ s;

					$blog.find('.module_content').prepend('<article class="article" data-id="'+ json.id +'">' +
						'<a href="./'+ json.id +'/">' +
							'<h3 class="article_title">'+ data.title +'</h3>' +
						'</a>' +
						'<hr/>' +
						'<time class="article_date" pubdate="pubdate" datetime="'+ date +'">'+ date +'</time>' +
					'</article>');
					$addPopup.trigger('closeDialog');
				}
				else{
					// todo 错误处理
				}
			})
			, $add = $('#add').on('click', function(){
				$addPopup.trigger('showDialog');
			})
			;
	});
});