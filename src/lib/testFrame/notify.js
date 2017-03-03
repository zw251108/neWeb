'use strict';

/**
 * 显示桌面通知
 * @function    notify
 * @param   {String}    title
 * @param   {String}    content
 * */
let notify = function(title, content){}
	;

if( 'Notification' in self ){
	notify = function(title, content){
		let Notify = self.Notification
			, notification
			, permission
			;

		//判断浏览器是否已允许桌面提醒
		if( Notify.permission === 'granted' ){	// 已允许
			permission = Promise.resolve();
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
else if( 'webkitNotifications' in self ){    // 兼容旧版本 chrome
	notify = function(title, content){
		let Notify = self.webkitNotifications;

		// 判断浏览器是否已允许桌面提醒
		if( Notify.checkPermission() === 0 ){	// 已允许

			Notify.createNotification('/image/favicon.ico', title, content).show();
		}
		else{	// 未允许
			Notify.requestPermission();
		}
	};
}

export default notify;