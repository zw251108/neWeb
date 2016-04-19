/**
 * 首页
 * 全局设置
 * */
//---------- 工具模块 ----------
//----- 地理定位 -----
define('location', function(){});
//----- 本地存储 模块 -----
define('storage', function(){});

//---------- 公用基础模块 ----------
//----- 用户信息模块 user -----
define('user', ['jquery', 'global', 'socket', 'msgPopup'], function($, g, socket, msgPopup){
	var timeout = null
		, $userAvatar = $('#userAvatar')
		, $user = $('#userModule').on({
			getAvatar: function(e, email){
				$.ajax({
					url: 'user/avatar'
					, type: 'POST'
					, data: {
						email: email
					}
					, dataType: 'json'
					, success: function(json){
						if( !('error' in json) ){
							if( json.info.avatar ){
								$userAvatar.attr('src', json.info.avatar);
							}
						}
						else{
							$userAvatar.attr('src', 'image/default/avatar.png');
						}
					}
				});
			}
			, setDefaultAvatar: function(){
				$userAvatar.attr('src', 'image/default/avatar.png');
			}
		}).on('keyup', '#email', function(){
			var val = this.value;

			if( val ){


				timeout && clearTimeout( timeout );
				timeout = setTimeout(function(){

					$user.triggerHandler('getAvatar', [val]);

					timeout = null;
				}, 800);
			}
			else{
				$user.triggerHandler('setDefaultAvatar');
			}
		}).on('submit', '#userLoginForm', function(e){
			e.preventDefault();

			var $form = $(this)
				, data = $form.serializeJSON()
				;

			$.ajax({
				url: this.action
				, type: this.method
				, data: data
				, success: function(json){
					if( !('error' in json) ){
						$userAvatar.attr('src', json.info.avatar);
						$form.remove();
						$user.toggleClass('normal tiny');
					}
					else{
						msgPopup.showMsg( json.msg );
					}
				}
			})
		})
		;

	//$header.find('.toolbar').prepend('<li><a href="/login/"></a></li>');
	//var $user = $('#user');
	//
	//if( !$user.find('img').length ){
	//
	//}
	//
	//$user.on('click', function(){
	//	$user.after('<div class="loginBar"><form action=""></form></div>');
	//});
});

//---------- 应用模块 ----------
require(['config'], function(config){
	config.requireConfig.baseUrl = 'script/';

	var r = require.config(config.requireConfig);

	r(['jquery', 'global', 'socket', 'time', 'login', 'user'], function($, g, socket, $time){
		var $container = g.$container
			, $blog = $('#blog').data('width', 'big') // Blog 模块
			, $document = $('#document').data('width', 'small') // Document 文档模块
			, $editor = $('#editor').data('width', 'normal')   // Editor 编辑器
			, $talk = $('#talk').data('width', 'small') // Talk 模块
			;

		g.mod('$blog', $blog);
		g.mod('$document', $document);
		g.mod('$editor', $editor);
		g.mod('$talk', $talk);
		g.mod('$time', $time);

//	var $login = $('#login')
//		, $loginForm = $login.find('#loginForm')
//		;
//
//	$login.on('submit', '#loginForm', function(e){
//        var loginData = $loginForm.serializeArray()
//            , i = loginData.length
//            , data = {}
//            , temp
//            ;
//
//        while( i-- ){
//            temp = loginData[i];
////            if( temp.name in data ){
////                data[temp.name] += ',' + temp.value;
////            }
////            else
//            data[temp.name] = temp.value;
//        }
//
//        data.receive = 'login';
//
//        socket.on('login', function(data){
//            /**
//             * todo
//             *  登录成功
//             *  保存返回的用户数据
//             * */
//            if( 'error' in data ){
//                console.log('error');
//            }
//            else{
//                console.log('success');
//                g.user = data;
//            }
//
//        });
//
//        socket.emit('login', data);
//
//		e.preventDefault();
//		e.stopImmediatePropagation();
//	});

	});
});