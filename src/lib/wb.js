import maple from 'cyan-maple';

import api from '../api/index.js';

let env = /weibo/i.test( navigator.userAgent )
	, weibo = {
		env
	}
	;

if( env ){
	const WEIBO_APP_KEY = '3802778706'
		;

	// 微博 sdk 初始化
	weibo.init = new Promise((resolve, reject)=>{
		let script = document.createElement('script')
			;

		script.onload = resolve;
		script.onerror = reject;

		script.src = 'https://open.weibo.com/views/js/wbsdk.js';
		document.head.appendChild( script );
	}).then(()=>{
		return api.get('/wb/init', {
			data: {
				url: window.location.href.replace(window.location.hash, '')
			}
		});
	}).then(({code, data, msg})=>{
		let wb
			;

		if( code !== 0 ){
			return Promise.reject();
		}

		if( 'wb' in window ){
			wb = window.wb;
		}
		else{
			return Promise.reject();
		}

		wb.init({
			debug: true
			, appKey: WEIBO_APP_KEY
			, ...data
		});

		return wb;
	});

	weibo.login = ()=>{
		maple.url.replacePage(`https://api.weibo.com/oauth2/authorize?client_id=${WEIBO_APP_KEY}&redirect_uri=${encodeURIComponent(`http://zw150026.com:3000/#/wb`)}&response_type=code`)
	};
}
else{
	weibo.init = Promise.resolve();
}

export default weibo;