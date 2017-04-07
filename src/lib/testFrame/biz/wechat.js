'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

// import Load from '../req/load';

// import LoadReq from '../req/load';

/**
 * @class
 * @classdesc   微信业务模块，在 Model.factory 工厂方法注册为 wechat，别名 weixin,wx，将可以使用工厂方法生成
 * @extends     ServiceModel
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
			// this._load = new Load();

			// this.wx = wx;
		}
		else{
			// this.wx = wx;
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
	 * @desc    本地缓存中获取 openId
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
	 * @desc    加载微信 JS-SDK
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 wx 对象
	 * */
	loadScript(){
		return $.loadScript('//res.wx.qq.com/open/js/jweixin-1.0.0.js').then(()=>{
			this.wx = wx;
		});
		// return this._load('//res.wx.qq.com/open/js/jweixin-1.0.0.js')
	}
	/**
	 * @desc    获取 openid
	 * @param   {String}    code        微信重定向回来 url 上的参数 code
	 * @param   {String}    [appId]     指定公众号 appId
	 // * @param   {String}    [appSecret] 指定公众号 appSecret
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回一个由 openId、openCypher 组成的对象，若未传 code 则返回 Promise.reject();
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=791}
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
			})//.then( this.handleResponse )
				.then((data)=>{
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
	 * @desc    获取 openId 的几种情况
	 *          1.本地没有 openId，并且 url 上没有 code 参数 >> 立即跳转页面去换取微信 code
	 *          2.本地没有 openId，但是 url 上有 code 参数 >> 调取 getOpenid 的接口获取 openId
	 *          3.本地存在 openId，则返回 openId
	 * @param   {String|String[]}   code    若 code 为数组，取最后一个
	 * @param   {String}            appId
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回一个由 openId、openCypher 组成的对象
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
	 * 网页获取 openId （已作废）
	 * @param   {String}    code
	 * @param   {String}    [appid]
	 * @param   {String}    [appsecret]
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=403}
	 * @deprecated
	 * */
	fetchOpenId(code, appid, appsecret){
		return this.getData('/publics/wechat/fetchOpenId', {
			data: {
				code
				, appid
				, appsecret
			}
		});
	}
	/**
	 * @desc    获取微信签名，获取 js-sdk 权限
	 * @param   {String}    url 页面 url，encodeURIComponent 之后
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=405}
	 * */
	sign(url){
		return this.getData('/publics/wechat/sign', {
			data: {
				url
			}
		});
	}
	/**
	 * @desc    下载微信临时图片
	 * @param   {String}    mediaId 即 serverId，微信服务器存储图的唯一标识
	 * @param   {String}    [path]  存到又拍云的地址，若不写则系统自动生成
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=401}
	 * */
	getImageUrlByServerId(mediaId, path){
		let data = {
				mediaId
			}
			;

		if( path ){
			data.path = path;
		}

		return this.getData('/publics/wechat/getTempFile', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    网页授权，获取用户详细信息
	 * @param   {String}    code    微信重定向回来 url 上的参数 code
	 * @param   {String}    appid   指定公众号 appid
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1413}
	 * */
	getInfoByCode(code, appid){
		let result
		;

		if( code && appid){
			result = this.getData('/publics/wechat/getUserInfoByAppId', {
				data: {
					code
					, appid
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    通过 access_token 获取用户信息
	 * @param   {String}    openid          用户 openid，没有值的时候随便给一个，不能为空
	 * @param   {String}    access_token
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=631}
	 * */
	getUserInfoByAccessToken(openid, access_token){
		return this.getData('/publics/wechat/getUserInfoByAccessToken', {
			data: {
				openid
				, access_token
			}
		});
	}
	/**
	 * @desc    获取 openid 加密
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * @todo    目前没有调用到，取消？
	 * */
	openidEncode(){
		return this.getData('/publics/wechat/getOpenidCypher', {
			data: {
			}
		});
	}

	/**
	 * @desc    微信自动登录
	 * @param   {String}    openid
	 * @param   {String}    openid_cypher
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=795}
	 * */
	login(openid, openid_cypher){
		let result
			;

		if( openid && openid_cypher ){
			result = this.getData('/publics/bind/login', {
				data: {
					openid
					, openid_cypher
				}
			});
		}
		else{
			result = Promise.reject();
		}
		
		return result;
	}
	/**
	 * 获取用户绑定信息
	 * @param   {String}    openid
	 * @param   {String}    openid_cypher
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=793}
	 * */
	getBindInfo(openid, openid_cypher){
		let result
			;

		if( openid && openid_cypher ){
			result = this.getData('/publics/bind/info', {
				data: {
					openid
					, openid_cypher
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

	/**
	 * 获取微信活动详情
	 * @param   {Number|String} id  活动 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=549}
	 * */
	getActivityInfo(id){
		let result
			;

		if( validate.isInteger(id) ){
			result = this.getData('/publics/activity/get', {
				data: {
					id
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    获取我的参与活动信息
	 * @param   {Number|String} id      活动 id
	 * @param   {String}        openid  活动参与者的 openid
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=571}
	 * */
	getActivityMine(id, openid){
		let result
			;

		if( validate.isInteger(id) ){
			result = this.getData('/publics/activity/mine', {
				data: {
					id
					, openid
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    参与活动
	 * @param   {Number|String} id          活动 id
	 * @param   {String}        openid      活动参与者 openid
	 * @param   {String}        serverId    微信下上传图片的 serverId
	 * @param   {String}        userInfo    活动参与者用户信息（JSON.stringify）
	 * @param   {String}        [enounce]   投票宣言
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=563}
	 * */
	joinActivity(id, openid, serverId, userInfo, enounce){
		let data = {
				id
				, openid
				, serverId
				, userInfo
			}
			, result
			;

		if( validate.isInteger(id) ){

			if( enounce ){
				data.enounce = enounce;
			}

			result = this.getData('/publics/activity/join', {
				method: 'POST'
				, data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    创建专属二维码
	 * @param   {Number}        [source=0]              创建二维码需求来源，0.活动参与者投票专属二维码，1.关注公众号动态二维码
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.activityId]    活动 id，source === 1 时必须传
	 * @param   {Number|String} [options.joinerId]      活动参与者 id，source === 0 时必须传
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，当参数未满足要求时会 reject
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=567}
	 * */
	createQrcode(source=0, options={}){
		let data = {
				source
			}
			, result
			;

		if( source === 0 && options.joinerId ){
			data.joinerId = options.joinerId;

			result = this.getData('/publics/activity/createQrcode', {
				data
			});
		}
	    else if( source === 1 && options.activityId ){
			data.activityId = options.activityId;

			result = this.getData('/publics/activity/createQrcode', {
				data
			});
		}
		else{
			result = Promise.reject();
		}


		return result;
	}
	/**
	 * @desc    好友查看活动情况
	 * @param   {Number|String} joinerId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=573}
	 * */
	getOwnerInfo(joinerId){
		let result
			;

		if( validate.isInteger(joinerId) ){
			result = this.getData('/publics/activity/joiner', {

			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    通过活动 id 获取活动排行榜
	 * @param   {Number|String} id                      活动 id
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @param   {Number|String} [options.number]        活动参与者编号
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=575}
	 * */
	rankingList(id, options={}){
		let data = {
				id
			}
			, result
			;

		if( validate.isInteger(id) ){

			if( options.number ){
				data.number = options.number;
			}

			data.startNum = options.startNum;
			data.pageCount = options.pageCount;

			result = this.getData('/publics/activity/rankingList', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    给好友投票
	 * @param   {Number|String} joinerId    参与者 id
	 * @param   {String}        openid      投票人的 openid
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=569}
	 * */
	vote(joinerId, openid){
		let data = {
				joinerId
				, openid
			}
			, result
			;

		if( validate.isInteger(joinerId) && openid ){
			result = this.getData('/publics/activity/vote', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    获取刮刮卡活动信息
	 * @param   {Number|String} id  刮刮卡活动 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1605}
	 * */
	scratchActivityGet(id){
		let result
			;

		if( validate.isInteger(id) ){
			result = this.getData('/publics/activity/scratch/get', {
				data: {
					id
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 获取微信刮刮卡活动及参与者信息
	 * @param   {Number|String} activityId
	 * @param   {String}        openId
	 * @param   {String}        userInfo
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2863}
	 * */
	scratchActivityGetNew(activityId, openId, userInfo){
		let result
			;

		if( validate.isInteger(activityId) ){
			result = this.getData('/publics/activity/scratch/info', {
				data: {
					activityId
					, openId
					, userInfo
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 刮刮卡活动我的信息接口
	 * @param   {Number|String} activityId
	 * @param   {String}        openId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2873}
	 * */
	scratchActivityMine(activityId, openId){
		let result
			;

		if( activityId && openId ){
			result = this.getData('/publics/activity/scratch/mine', {
				data: {
					activityId
					, openId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 触发刮刮卡
	 * @param   {Number|String} activityId
	 * @param   {String}        openId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2875}
	 * */
	scratchCard(activityId, openId){
		let result
			;

		if( activityId && openId ){
			result = this.getData('/publics/activity/scratch/scratchCard', {
				data: {
					activityId
					, openId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 刮刮卡 支持队伍，支持一票接口
	 * @param   {Number|String} joinerId
	 * @param   {Number|String} teamId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2003}
	 * */
	scratchTeamSel(joinerId, teamId){
		let result
			;

		if( joinerId && teamId ){
			result = this.getData('/publics/activity/scratch/support', {
				method: 'POST'
				, data: {
					joinerId
					, teamId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 微信刮刮卡支持活动结果
	 * @param   {Number|String} id  活动 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2037}
	 * */
	scratchOnlyResult(id){
		let result
			;

		if( id ){
			result = this.getData('/publics/activity/scratch/result', {
				data: {
					id
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 获取多城市的活动详情
	 * @param   {Number|String} id          活动 id
	 * @param   {Number|String} [cityCode]  城市编码，对应 cityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1973}
	 * */
	getActivityUtil(id, cityCode){
		let data = {
				id
			}
			;

		if( cityCode ){
			data.cityCode = cityCode;
		}

		return this.getData('/publics/activity/multiCity/get', {
			method: 'POST'
			, data
		});
	}
}

Model.register('wechat', WeChatServiceModel);

Model.registerAlias('wechat', ['weixin', 'wx']);

export default WeChatServiceModel;