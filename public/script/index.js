/**
 * 首页
 * 全局设置
 * */
//---------- 工具模块 ----------
//----- 地理定位 -----
define('location', function(){});

//---------- 公用基础模块 ----------
//----- 用户信息模块 user -----
define('user', ['jquery', 'global', 'socket', 'msgPopup', 'storage'], function($, g, socket, msgPopup, storage){
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
						var avatar = ''
							;
						if( !('error' in json) ){
							if( json.info.avatar ){
								avatar = json.info.avatar;
							}
						}

						$user.triggerHandler('setAvatar', [avatar]);
					}
				});
			}
			, setAvatar: function(e, avatar){
				$userAvatar.attr('src', avatar || 'image/default/avatar.png');
			}
			, switchLogin: function(){
				$userLoginForm.remove();
				$user.toggleClass('normal tiny');
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
				$user.triggerHandler('setAvatar');
			}
		}).on('submit', '#userLoginForm', function(e){
			e.preventDefault();

			var data = $userLoginForm.serializeJSON()
				;

			$.ajax({
				url: this.action
				, type: this.method
				, data: data
				, success: function(json){
					var info
						, date
						, m, d
						;

					if( !('error' in json) ){
						info = json.info;

						date = new Date();
						m = date.getMonth() +1;
						d = date.getDate();
						info.date = date.getFullYear() +'-'+ (m > 9 ? m : '0'+ m) +'-'+ (d > 9 ? d : '0'+d);
						storage.setItem('user', JSON.stringify(info) );

						$user.triggerHandler('setAvatar', [info.avatar]);
						$user.triggerHandler('switchLogin');
					}
					else{
						$user.triggerHandler('setAvatar');
						msgPopup.showMsg( json.msg );
					}
				}
			})
		})
		, $userLoginForm = $('#userLoginForm')
		, user = storage.getItem('user')
		;

	// todo header 导航登录功能
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

	user = user ? $.parseJSON(user) : {};
	$.ajax({
		url: 'user/verify'
		, type: 'POST'
		, data: user
		, success: function(json){
			if( !('error' in json) ){
				$user.triggerHandler('setAvatar', [user.avatar]);
				$user.triggerHandler('switchLogin');
			}
		}
	})
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