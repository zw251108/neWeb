'use strict';

let notify = function(){}
	;

if( 'webkitNotifications' in self ){
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
else if( 'Notification' in self ){
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

export default notify;