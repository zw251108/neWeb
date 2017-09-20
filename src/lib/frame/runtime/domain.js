'use strict';

/**
 * @file    获取当前环境状态
 * */

const DOMAIN = [
		'66buy.com.cn'
		, '51tiangou.com'
	]
	, STATUS = [
		'dev'
		, 'test'
		, 'pre'
		, 'online'
	]
	;

let hostname = location.hostname
	, protocol = location.protocol
	, currentDomain = DOMAIN.filter((d)=>hostname.indexOf(d) > 0)[0] || '51tiangou.com'
	, currentStatus = hostname.replace('.'+ currentDomain, '').split('.')
	;

currentStatus = currentStatus[currentStatus.length -1];

// 若 currentStatus 不在 STATUS 中则认为是线上环境
if( STATUS.indexOf(currentStatus) === -1 ){
	
	currentStatus = 'online';
}

let test = currentStatus === 'dev' || currentStatus === 'test'
	, protocolExpr = /^https?:\/\//
	, isOnline = currentStatus === 'online'
	;

/**
 * @exports     domain
 * @type        {Object}
 * @memberOf    maple
 * */
export default {
	env: currentStatus
	, isOnline
	, host: isOnline ? DOMAIN[1] : DOMAIN[0]
	, protocol
	, protocolExpr
	// , getImageUrl(url, type='y'){
	// 	let imageUrl = ''
	// 		, product_url = test ? '//test.img.tg-img.com/' : '//image1.51tiangou.com/'
	// 		, prefix = test ? {
	// 			e: ''
	// 			, s: ''
	// 			, v: ''
	// 			, m: ''
	// 			, y: ''
	// 			, "640x260": ''
	// 			, "580x220": ''
	// 		} : {}
	// 		, postfix = {
	// 			e: '!e'
	// 			, s: '!s'
	// 			, v: '!y'
	// 			, m: '!m'
	// 			, y: '!y'
	// 			, "640x260": '!640x260'
	// 			, "580x220": '!580x220'
	// 		}
	// 		;
	//
	// 	if( url ){
	// 		if( protocolExpr.test( url ) ){
	// 			imageUrl = url + (postfix[type] || '');
	// 		}
	// 		else{
	// 			imageUrl = product_url + (prefix[type] || '') + url + (postfix[type] || '');
	// 		}
	// 	}
	//
	// 	return imageUrl;
	// }
	// // todo getLinkHref 未用到？
	// , getLinkHref(clickUrl){
	// 	let rs = '';
	//
	// 	if( clickUrl ){
	// 		if( protocolExpr.test( clickUrl ) ){
	// 			rs = clickUrl;
	// 		}
	// 		else{
	// 			rs = clickUrl;
	// 		}
	// 	}
	//
	// 	return rs;
	// }
};