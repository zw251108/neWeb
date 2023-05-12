import maple from 'cyan-maple';

import api from '../api/index.js';

let env = /MicroMessenger/i.test( navigator.userAgent )
	, wechat = {
		env
	}
	;

if( env ){  // 微信
	const WX_APP_ID = 'wx61d59950777ab142'
		;

	// 微信 sdk 初始化
	wechat.sign = new Promise((resolve, reject)=>{
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
			, appId: WX_APP_ID
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

	wechat.login = ()=>{
		maple.url.replacePage(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APP_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/#/wx`)}&response_type=code&scope=snsapi_base#wechat_redirect`)
	};
}
else{
	wechat.sign = Promise.resolve();
}

export default wechat;