'use strict';

/**
 * @file    微信相关操作
 * @todo    使用 localStorage 代替 cookie
 * */

import $        from 'jquery';
import model    from '../model/index.js';
import domain   from '../runtime/domain.js';
import url      from '../runtime/url.js';
import device   from '../runtime/device.js';

const APP_ID                = {
		dev:        'wx3bc8b36ed3f965bd'
		, test:     'wx3bc8b36ed3f965bd'
		, pre:      'wxd13f25106e193648'
		, online:   'wx1c18f2760c5ff068'
	}
	, STATE_NAME            = 'wechat_util'
	, USER_INFO_EXPIRES     = 7             // userInfo 在 cookie 中的过期时间
	, ACCESS_TOKEN_EXPIRES  = '2h'          // access_token 在 cookie 中的过期时间（2 小时）
	, OPENID_EXPIRES        = 365           // openid 在 cookie 中的过期时间
	, OPENID_CYPHER_EXPIRES = 365           // openid_cypher 在 cookie 中的过期时间
	, TOKEN_EXPIRES         = 7             // token 在 cookie 中的过期时间
	, WECHAT_AUTH_URL       = 'https://open.weixin.qq.com/connect/oauth2/authorize'
	, WECHAT_REDIRECT_HASH  = 'wechat_redirect'
	;

let cookie      = model.factory('cookie')
	, ls        = model.factory('ls')
	, member    = model.factory('member')
	, wechat    = model.factory('wechat')

	, defaultShare = {
		title: '【天狗网】不一样的逛街方式'
		, desc: location.href || 'm.51tiangou.com'
		, link: location.href
		, imgUrl: ''
		, success: ()=>{}
		, cancel: ()=>{}
	}
	, defaultAppId = APP_ID[domain.env] || APP_ID.online
	
	, wx = $.getScript('//res.wx.qq.com/open/js/jweixin-1.0.0.js').then(()=>{
		return wx;
	})
	/**
	 * @summary 返回微信授权页面回退页面路径
	 * @param   {String}    appId
	 * @param   {String}    scope   目前有 2 个值，获取 openid 时为 snsnapi_base，获取用户信息时为 snsapi_userinfo
	 * @param   {String}    state   目前有 2 个值，获取 openid 时为 _static_openid_flag_，获取用户信息时为 wechat_util
	 * @return  {String}    拼装后的微信授权页面路径
	 * */
	, getWxAuthUrl = (appId, scope, state)=>{
		return WECHAT_AUTH_URL +'?'+ [
			'appid='+ appId
			, 'redirect_uri='+ encodeURIComponent(url.origin + url.pathname + url.search)
			, 'response_type=code'
			, 'scope='+ scope
			, 'state='+ state
		].join('') + '#' + WECHAT_REDIRECT_HASH;
	}
	;


/**
 * @exports wechat
 * */
export default {
	/**
	 * @summary 注册调用微信接口
	 * @method
	 * @memberOf    wechat
	 * @param       {Object}    config
	 * @param       {Array}     config.jsApiList
	 * @return      {Promise}   返回一个 Promise 对象，在 wx.ready 时调用 resolve 并传回返回结果
	 * */
	sign(config){
		wx.then((wx)=>{
			wx.config( config );

			return new Promise((resolve)=>{
				wx.ready( resolve );
			});
		})
	}
	/**
	 * @summary 设置分享语
	 * @method
	 * @memberOf    wechat
	 * @param       {Object}    options
	 * @param       {String}    options.title
	 * @param       {String}    options.friendTitle
	 * @param       {String}    options.desc
	 * @param       {String}    options.link
	 * @param       {String}    options.imgUrl
	 * @param       {Function}  options.success     分享成功的回调
	 * @param       {Function}  options.cancel      取消分享的回调
	 * @param       {String}    [options.subTitle]  和 desc 必一个
	 * @param       {String}    [options.imageUrl]  和 imgUrl 必有一个
	 * */
	, setShare(options={}){
		return wx.then((wx)=>{

			// 显示微信功能菜单
			wx.showMenuItems({
				menuList: [
					'menuItem:share:appMessage'
					, 'menuItem:share:timeline'
					, 'menuItem:share:qq'
					, 'menuItem:share:weiboApp'
					, 'menuItem:favorite'
					, 'menuItem:share:facebook'
					, 'menuItem:share:QZone'
				]
			});

			// 发送给朋友
			wx.onMenuShareAppMessage({
				title: options.title || defaultShare.title
				, desc: options.desc || options.subTitle || defaultShare.desc
				, link: options.link || defaultShare.link
				, imgUrl: options.imgUrl || options.imageUrl || defaultShare.imgUrl
				, success: options.success || defaultShare.success
				, cancel: options.cancel || defaultShare.cancel
			});

			// 发送到朋友圈
			wx.onMenuShareTimeline({
				title: options.friendTitle || defaultShare.title
				, link: options.link || defaultShare.link
				, imgUrl: options.imgUrl || options.imageUrl || defaultShare.imgUrl
				, success: options.success || defaultShare.success
				, cancel: options.cancel || defaultShare.cancel
			});
		});
	}
	/**
	 * @summary 隐藏菜单
	 * @method
	 * @memberOf    wechat
	 * */
	, hideMenu(){
		return this.wx.then((wx)=>{
			wx.hideMenuItems({
				menuList: [
					'menuItem:share:appMessage'
					, 'menuItem:share:timeline'
					, 'menuItem:share:qq'
					, 'menuItem:share:weiboApp'
					, 'menuItem:favorite'
					, 'menuItem:share:facebook'
					, 'menuItem:share:QZone'
				]
			});
		});
	}
	/**
	 * @summary 获取 openId
	 * @method
	 * @memberOf    wechat
	 * @param       {String|String[]}   code    若 code 为数组，取最后一个
	 * @param       {String}            [appId]
	 * @return      {Promise}           返回一个 Promise 对象，在 resolve 时传回一个由 openId、openCypher 组成的对象
	 * @desc        获取 openId 的几种情况：
					1.本地没有 openId，并且 url 上没有 code 参数 >> 立即跳转页面去换取微信 code
					2.本地没有 openId，但是 url 上有 code 参数 >> 调取 getOpenid 的接口获取 openId
					3.本地存在 openId，则返回 openId
	 * */
	, getOpenidUtil(code, appId=defaultAppId){
		let isDefaultAppId = appId === defaultAppId
			, openIdKey = 'openid' + (isDefaultAppId ? '' : '_' + appId)
			, openIdCypherKey = 'openid_cypher' + (isDefaultAppId ? '' : '_' + appId)
			;

		if( Array.isArray(code) ){
			code = code[code.length -1];
		}

		// return cookie.getData([openIdKey, openIdCypherKey]).then()
		return Promise.all([
			cookie.getData( openIdKey )
			, cookie.getData( openIdCypherKey )
		]).then(([openId, openCypher])=>{ // 情况 3
			return {
				openId
				, openCypher
			};
		}, ()=>{
			let exec
				;

			if( code && code.length > 26 ){ // code 长度小于 26 则视为无效的 code
				exec = wechat.getOpenid(code, appId);
			}
			else{
				exec = Promise.reject();
			}

			return exec;
		}).catch(()=>{  // 情况 1

			// 跳转至微信 authorize 地址，获取 code
			url.changePage( getWxAuthUrl(appId, 'snsnapi_base', '_static_openid_flag_') );
		});
	}
	/**
	 * @summary 获取微信用户个人信息的通用方法
	 * @method
	 * @memberOf    wechat
	 * @param       {String}    [appId=defaultAppId]    公众号 AppId，可以根据不同AppId取得对应的openId。默认用当前环境的AppId
	 * @return      {Promise}   执行后返回一个 Promise 对象，在 resolve 时传入微信个人信息数据，否则跳转页面到微信授权页面
	 * @desc        可以获取当前微信用户的头像、性别、昵称、openId 等信息，流程之上而下的逻辑优先顺序如下：
					1.如果 cookie 中存在了用户信息，则直接返回 cookie 中的用户信息，cookie 中的保存时间暂时定为7天
					2.如果 cookie 中存在 access_token 和 openid 时，则利用这两个值来调用后台接口来换取用户信息（获取后缓存至 cookie）
					3.如果 url 上带有 code 和 state 参数，则利用 code 来调用后台接口来换取用户信息（获取后缓存至 cookie）和 access_token(此值缓存至 cookie，用来调用步骤 2)
					4.以上条件都不满足，说明该用户比较纯洁，第一次浏览该页面。此时，直接跳转至“微信鉴权页面”去换取 code
	 * */
	, getUserInfoUtil(appId=defaultAppId){
		let isDefaultAppId = appId === defaultAppId
			, accessTokenKey = 'access_token' + (isDefaultAppId ? '' : '_' + appId)
			, openIdKey = 'openid' + (isDefaultAppId ? '' : '_' + appId)
			, openIdCypherKey = 'openid_cypher' + (isDefaultAppId ? '' : '_' + appId)
			, userInfoKey = 'userInfo' + (isDefaultAppId ? '' : '_' + appId)
			;

		return cookie.getData('userInfo').catch(()=>{   // cookie 中不存在 userInfo

			// 读取 cookie 中的 openid 和 access_token
			return Promise.all([
				cookie.getData( openIdKey )
				, cookie.getData( accessTokenKey )
			]).then(([openid, access_token])=>{   // 存在，通过 openid 和 access_token 获取用户信息
				return wechat.getUserInfoByAccessToken(openid, access_token).catch((res)=>{
					let exec
						;

					// access_token 已经过期，清除 cookie 中的缓存
					if( res.code === 503 ){
						exec = cookie.removeData('access_token');
					}
					else{
						exec = Promise.resolve();
					}

					return exec.then(()=>{
						return Promise.reject();
					});
				});
			}, ()=>{  // cookie 中不存在 openid 或 access_token
				let params = url.params
					, code = params.code
					, exec
					;

				code = Array.isArray(code) ? code[code.length - 1] : code;

				// 判断 url 上是否带有 code 和 state
				if( code && params.state === STATE_NAME ){

					//已授权（刚授权），来获取 access_token
					exec = wechat.getInfoByCode(url.params.code, appId).then((data)=>{
						return cookie.setData(accessTokenKey, data.access_token, ACCESS_TOKEN_EXPIRES).then(()=>{
							return data.userInfo;
						});
					});
				}
				else{   // 未授权，跳转至微信授权页面
					exec = Promise.reject();
				}

				return exec;
			}).then((data)=>{

				// 缓存用户信息
				return Promise.all([
					cookie.setData(userInfoKey, data, USER_INFO_EXPIRES)
					, cookie.setData(openIdKey, data.openid, OPENID_EXPIRES)
					, cookie.setData(openIdCypherKey, data.openid_cypher, OPENID_CYPHER_EXPIRES)
				]).then(()=>{
					return data;
				});
			}, ()=>{  // 未授权，需跳转至微信授权页面
				url.changePage( getWxAuthUrl(appId, 'snsapi_userinfo', 'wechat_util') );
			});
		});
	}
	/**
	 * @summary 微信自动登录
	 * @method
	 * @memberOf    wechat
	 * @param       {Boolean}   isWcAutoLogin   是否微信自动登录
	 * @return      {Promise}
	 * */
	, login(isWcAutoLogin){
		let exec
			;

		if( device.weixin && isWcAutoLogin ){
			exec = cookie.getData(['autoLogin', 'isLogin']).then(({autoLogin, isLogin})=>{
				let result
					;

				if( autoLogin === 'true' && isLogin === 'true' ){   // 已经登录
					result = true;
				}
				else{   // 微信下，并且需要自动登录
					result = this.getOpenidUtil( url.params.code || '' ).then(({openid, openid_cypher})=>{
						return wechat.login(openid, openid_cypher).then((data)=>{
							return cookie.setData('token', data.token, TOKEN_EXPIRES);
						}, (res)=>{
							if( res.code === 503 ){
								url.reload();
							}
							else{
								return true;
							}
						});
					}, ()=>{
						return cookie.setData('autoLogin', true)
					});
				}

				return result;
			});
		}
		else{
			exec = Promise.resolve();
		}

		return exec.then(()=>{  // 校验登录状态
			return cookie.getData('isCheck');
		}).then((value)=>{
			let exec
				;

			if( value === 'true' ){ // 获取用户基本信息
				exec = Promise.reject();
			}
			else{
				exec = member.memberInfo().then((data)=>{
					return Promise.all([
						cookie.setData({
							memberId: data.id
							, cellPhone: data.cellPhone
							, username: data.nickName || data.cellPhone
							, validate: data.validate
							, nickName: data.nickName
							, isLogin: true
						}, USER_INFO_EXPIRES)
						, cookie.setData('isCheck', true)
					]);
				}, (res)=>{
					let result
						;

					if( res.code === 888 ){
						result = true;
					}
					else{
						result = Promise.reject();
					}

					return result;
				}).then(()=>{
					return Promise.all([
						cookie.removeData(['token', 'isLogin', 'validate', 'memberId', 'cellPhone', 'username', 'nickName'])
						, cookie.setData({
							isLogin: false
							, isCheck: true
						})
					]);
				});
			}

			return exec;
		});
	}
}