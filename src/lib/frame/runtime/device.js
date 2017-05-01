'use strict';

/**
 * @file    识别当前运行设备
 * @todo    评估一下是否有用，基本上只用到判断是否为微信，判断 app 使用了 cookie。。。
 * */

const alias = {
		androidchorme: 'androidchrome'
		, guge: 'chrome'
		, webview: 'webView'
		, minimalui: 'minimalUi'
		, statusbar: 'statusBar'
		, pixelratio: 'pixelRatio'
		, wechat: 'weixin'
		, wx: 'weixin'
	}
	, ua = navigator.userAgent
	;

/**
 * @summary     判断当前设备是否满足期望
 * @function
 * @param       {...String}
 * @return      {Boolean}
 * @desc        可以传多个参数，当同时满足时，返回 true，否则 false
 * */
let device = function(){
		let argc = arguments.length
			, result = true
			, i, temp
		;

		if( argc === 0 ){
			result = false;
		}
		else{
			for(i = 0; i < argc; i++){

				temp = arguments[i];

				if( temp in device && device.hasOwnProperty(temp) ){
					result = result && device[temp];
				}
				else{
					temp = temp.toLowerCase();

					if( temp in alias ){
						result = result && device[alias[temp]];
					}
					else{
						result = result && false;
					}
				}

				if( !result ){
					break;
				}
			}
		}

		return result;
	}
	;

device.alipay = ua.indexOf("AlipayClient") > 0;

let android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
let ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
let iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

// Chrome
device.chrome = ua.toLowerCase().indexOf('chrome') >= 0;

// Android
if (android) {
	device.os = 'android';
	device.osVersion = android[2];
	device.android = true;
	device.androidChrome = device.android && device.chrome;
}

// iOS
if (ipad || iphone || ipod) {
	device.os = 'ios';
	device.ios = true;
}
if (iphone && !ipod) {
	device.osVersion = iphone[2].replace(/_/g, '.');
	device.iphone = true;
}
if (ipad) {
	device.osVersion = ipad[2].replace(/_/g, '.');
	device.ipad = true;
}
if (ipod) {
	device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	device.iphone = true;
}
// iOS 8+ changed UA
if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
	if (device.osVersion.split('.')[0] === '10') {
		device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	}
}

// Webview
device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

// Minimal UI
if (device.os && device.os === 'ios') {
	let osVersionArr = device.osVersion.split('.');
	device.minimalUi = !device.webView &&
		(ipod || iphone) &&
		(osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
		$('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
}

// Check for status bar and fullscreen app mode
let windowWidth = $(window).width();
let windowHeight = $(window).height();

device.statusBar = device.webView && (windowWidth * windowHeight === screen.width * screen.height);

// Classes
let classNames = [];

// Pixel Ratio
device.pixelRatio = window.devicePixelRatio || 1;
classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
if (device.pixelRatio >= 2) {
	classNames.push('retina');
}

// OS classes
if (device.os) {
	classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
	if (device.os === 'ios') {
		let major = parseInt(device.osVersion.split('.')[0], 10);
		for (let i = major - 1; i >= 6; i--) {
			classNames.push('ios-gt-' + i);
		}
	}

}
// Status bar classes
if (device.statusBar) {
	classNames.push('with-statusbar-overlay');
}
else {
	$('html').removeClass('with-statusbar-overlay');
}

// Add html classes
if (classNames.length > 0) $('html').addClass(classNames.join(' '));

// keng..
device.weixin = /MicroMessenger/i.test(ua);

// UC 浏览器
device.uc = ua.indexOf('UCBrowser') > -1;


/**
 * @exports {Function}  device
 * */
export default device;