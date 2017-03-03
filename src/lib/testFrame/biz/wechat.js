'use strict';

import Model from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain from '../domain.js';

// import Load from '../req/load';

// import LoadReq from '../req/load';

/**
 * @class
 * @classdesc   微信业务模块
 * @extends ServiceModel
 * */
class WeChatServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * @param   {Object}    [wx]    微信
	 * */
	constructor(config={}, wx){
		super( config );

		this._config.domainList = ['wechat'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');

		if( !wx ){
			// todo 使用 localStorage 替代 cookie
			this._cache = Model.factory('cookie');
			this._load = new Load();

			this.wx = wx;
		}
		else{
			this.wx = wx;
		}

		// this.wx = new Promise((resolve, reject)=>{
		// 	// 判断是否为微信环境
		// 	if( /imessage/i.test(navigator.userAgent) ){
		// 		// 微信 JS-SDK 是否已加载
		// 		if( 'wx' in window ){
		// 			resolve( wx );
		// 		}
		// 		else{
		//
		// 		}
		// 	}
		// 	else{
		//
		// 	}
		// });
	}

	/**
	 * @本地缓存中获取 openId
	 * @param   {String}    [appId='']
	 * @return  {Promise}   在 resolve 时传回查询
	 * */
	_getLocalOpenid(appId=''){
		return this._cache.getData( (appId && appId +'_') +'openid' );
	}
	_setLocalOpenid(openId, appId=''){
		return this._cache.setData((appId && appId +'_') +'openid', openId, '365d');
	}
	_getLocalOpenCypher(appId=''){
		return this._cache.getData( (appId && appId +'_') +'openid_cypher' );
	}
	_setLocalOpenCypher(openIdCypher, appId){
		return this._cache.setData((appId && appId +'_') +'openid_cypher', openIdCypher, '365d');
	}

	/**
	 * 获取 openid
	 * @param   {String}    code
	 * @param   {String}    appId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回一个由 openId、openCypher 组成的对象，若未传 code 则返回 Promise.reject();
	 * */
	getOpenid(code, appId){
		let result
			;

		if( code ){
			result = this.getData('/publics/wechat/getOpenid', {
				data: {
					code
					, appId
				}
			}).then( this.handleResponse ).then((data)=>{
				let openId = data.openid
					, openCypher = data.openid_cypher
					;

				this._setLocalOpenid( openId );
				this._setLocalOpenCypher( openCypher );

				return {
					openId
					, openCypher
				};
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 加载微信 JS-SDK
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 wx 对象
	 * */
	loadScript(){
		return this._load('//res.wx.qq.com/open/js/jweixin-1.0.0.js').then(()=>{
			return wx;
		});
	}
	/**
	 * 获取 openID
	 * @param   {String|String[]}   code    若 code 为数组，取最后一个
	 * @param   {String}    appId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回一个由 openId、openCypher 组成的对象
	 * @desc    获取 openId 的几种情况
	 *          1.本地没有 openId，并且 url 上没有 code 参数 >> 立即跳转页面去换取微信 code
	 *          2.本地没有 openId，但是 url 上有 code 参数 >> 调取 getOpenid 的接口获取 openId
	 *          3.本地存在 openId，则返回 openId
	 * */
	getOpenidUtil(code, appId){
		if( Array.isArray(code) ){
			code = code[code.length -1];
		}

		Promise.all([
			this._getLocalOpenid( appId )
			, this._getLocalOpenCypher( appId )
		]).then((rs)=>{ // 情况 3

			return {
				openId: rs[0]
				, openCypher: rs[1]
			};
		}, (e)=>{
			let result
				;

			if( code && code.length > 26 ){ // code 长度小于 26 则视为无效的 code
				result = this.getOpenid(code, appId);
			}
			else{   // 情况 1
				let url = 'https://open.weixin.qq.com/connect/oauth2/authorize'
					, params = [
						'appid='+ appId
						, 'redirect_uri='+ encodeURIComponent( location.origin + location.pathname + location.search )
						, 'response_type=code'
						, 'scope=snsapi_base'
						, 'state=_static_openid_flag_'
					]
					, hash = 'wechat_redirect'
					;

				// 跳转至微信 authorize 地址，获取 code
				location.replace( url +'?'+ params.join('&') +'#'+ hash );
			}

			return result;
		});
	}

	/**
	 * 微信自动登录
	 * @param   {String}    openid
	 * @param   {String}    openid_cypher
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	login(openid, openid_cypher){
		return this.getData('/publics/bind/login', {
			data: {
				openid
				, openid_cypher
			}
		});
	}
	/**
	 * 获取微信签名，获取 js-sdk 权限
	 * @param   {String}    url
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	sign(url){
		return this.getData('/publics/wechat/sign', {
			data: {
				url
			}
		});
	}
	/**
	 * 下载微信临时图片
	 * @param   {String}    mediaId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	getImageUrlByServerId(mediaId){
		return this.getData('/publics/wechat/getTempFile', {
			method: 'POST'
			, data: {
				mediaId
			}
		});
	}
}

ServiceModel.register('wechat', WeChatServiceModel);

ServiceModel.registerAlias('wechat', ['weixin', 'wx']);

export default WeChatServiceModel;