define(['jquery', 'global'], function($, g){
	var notice = function(){}
		;

	if( 'webkitNotifications' in window ){
		notice = function(title, content){
			var Notify = window.webkitNotifications;

			// 判断浏览器是否已允许桌面提醒
			if( Notify.checkPermission() === 0 ){	// 已允许

				Notify.createNotification('/image/favicon.ico', title, content).show();
			}
			else{	// 未允许
				Notify.requestPermission();
			}
		};
	}
	else if( 'Notification' in window ){
		notice = function(title, content){
			var Notify = window.Notification
				, notification
				, permission
				;

			//判断浏览器是否已允许桌面提醒
			if( Notify.permission === 'granted' ){	// 已允许

				permission = $.Deferred().resolve();
			}
			else{	// 用户未设置
				permission = Notify.requestPermission();
			}

			permission.then(function(){

				notification = new Notify(title, {
					icon: '/image/favicon.ico'
					, body: content
				});

				notification.onclick = function(){
					notification.close();
				};
			});
		};
	}

	return notice;
});