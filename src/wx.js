import api from './api/index.js';

let wechat
	;

if( /MicroMessenger/i.test(navigator.userAgent) ){
	// 微信
	wechat = new Promise((resolve, reject)=>{
		let script = document.createElement('script')
			;

		script.onload = resolve;
		script.onerror = reject;

		script.src = '//res.wx.qq.com/open/js/jweixin-1.6.0.js';
		document.head.appendChild( script );
	}).then(()=>{
		return api.get('/wx/sign', {
			data: {
				url: window.location.href.replace(window.location.hash, '')
			}
		});
	}).then(({code, data, msg})=>{
		let wx
			;

		if( code !== 0 ){
			return Promise.reject();
		}

		if( 'wx' in window ){
			wx = window.wx;
		}
		else{
			return Promise.reject();
		}

		wx.config({
			debug: false
			, ...data
			, jsApiList: [
				'onMenuShareAppMessage'
				, 'onMenuShareTimeline'
				, 'updateAppMessageShareData'
				, 'updateTimelineShareData'
			]
		});

		return wx;
	});
}
else{
	wechat = Promise.resolve();
}

export default wechat;