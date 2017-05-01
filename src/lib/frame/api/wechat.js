'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../runtime/domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   微信业务模块，二/三级域名 wechat，在 Model.factory 工厂方法注册为 wechat，别名 weixin,wx，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class WeChatServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['wechat'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 获取 openid
	 * @param   {String}    code        微信重定向回来 url 上的参数 code
	 * @param   {String}    [appId]     指定公众号 appId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回一个由 openId、openCypher 组成的对象，若未传 code 则返回 Promise.reject();
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/getOpenid]{@link http://dev.51tiangou.com/interfaces/detail.html?id=791}
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
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

	/**
	 * 网页获取 openId （已作废）
	 * @param   {String}    code
	 * @param   {String}    [appid]
	 * @param   {String}    [appsecret]
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/fetchOpenId]{@link http://dev.51tiangou.com/interfaces/detail.html?id=403}
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
	 * @summary 获取微信签名，获取 js-sdk 权限
	 * @param   {String}    url 页面 url，encodeURIComponent 之后
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/sign]{@link http://dev.51tiangou.com/interfaces/detail.html?id=405}
	 * */
	sign(url){
		return this.getData('/publics/wechat/sign', {
			data: {
				url
			}
		});
	}
	/**
	 * @summary 下载微信临时图片
	 * @param   {String}    mediaId 即 serverId，微信服务器存储图的唯一标识
	 * @param   {String}    [path]  存到又拍云的地址，若不写则系统自动生成
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/getTempFile]{@link http://dev.51tiangou.com/interfaces/detail.html?id=401}
	 * */
	getImageUrlByServerId(mediaId, path){
		let data = {
				mediaId
			}
			;

		if( path ){
			data.path = path;
		}

		return this.setData('/publics/wechat/getTempFile', {
			data
		});
	}
	/**
	 * @summary 网页授权，获取用户详细信息
	 * @param   {String}    code    微信重定向回来 url 上的参数 code
	 * @param   {String}    appid   指定公众号 appid
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/getUserInfoByAppId]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1413}
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
	 * @summary 通过 access_token 获取用户信息
	 * @param   {String}    openid          用户 openid，没有值的时候随便给一个，不能为空
	 * @param   {String}    access_token
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/getUserInfoByAccessToken]{@link http://dev.51tiangou.com/interfaces/detail.html?id=631}
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
	 * @summary 获取 openid 加密
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/wechat/getOpenidCypher]
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
	 * @summary 微信自动登录
	 * @param   {String}    openid
	 * @param   {String}    openid_cypher
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/bind/login]{@link http://dev.51tiangou.com/interfaces/detail.html?id=795}
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
	 * @see     [http://wechat.test.66buy.com.cn/publics/bind/info]{@link http://dev.51tiangou.com/interfaces/detail.html?id=793}
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
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/get]{@link http://dev.51tiangou.com/interfaces/detail.html?id=549}
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
	 * @summary 获取我的参与活动信息
	 * @param   {Number|String} id      活动 id
	 * @param   {String}        openid  活动参与者的 openid
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/mine]{@link http://dev.51tiangou.com/interfaces/detail.html?id=571}
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
	 * @summary 参与活动
	 * @param   {Number|String} id          活动 id
	 * @param   {String}        openid      活动参与者 openid
	 * @param   {String}        serverId    微信下上传图片的 serverId
	 * @param   {String}        userInfo    活动参与者用户信息（JSON.stringify）
	 * @param   {String}        [enounce]   投票宣言
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/join]{@link http://dev.51tiangou.com/interfaces/detail.html?id=563}
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

			result = this.setData('/publics/activity/join', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 创建专属二维码
	 * @param   {Number}        [source=0]              创建二维码需求来源，0.活动参与者投票专属二维码，1.关注公众号动态二维码
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.activityId]    活动 id，source === 1 时必须传
	 * @param   {Number|String} [options.joinerId]      活动参与者 id，source === 0 时必须传
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，当参数未满足要求时会 reject
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/createQrcode]{@link http://dev.51tiangou.com/interfaces/detail.html?id=567}
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
	 * @summary 好友查看活动情况
	 * @param   {Number|String} joinerId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/joiner]{@link http://dev.51tiangou.com/interfaces/detail.html?id=573}
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
	 * @summary 通过活动 id 获取活动排行榜
	 * @param   {Number|String} id                      活动 id
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @param   {Number|String} [options.number]        活动参与者编号
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/rankingList]{@link http://dev.51tiangou.com/interfaces/detail.html?id=575}
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
	 * @summary 给好友投票
	 * @param   {Number|String} joinerId    参与者 id
	 * @param   {String}        openid      投票人的 openid
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/vote]{@link http://dev.51tiangou.com/interfaces/detail.html?id=569}
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
	 * @summary 获取刮刮卡活动信息
	 * @param   {Number|String} id  刮刮卡活动 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/scratch/get]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1605}
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
	 * @summary 获取微信刮刮卡活动及参与者信息
	 * @param   {Number|String} activityId
	 * @param   {String}        openId
	 * @param   {String}        userInfo
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/scratch/info]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2863}
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
	 * @summary 刮刮卡活动我的信息接口
	 * @param   {Number|String} activityId
	 * @param   {String}        openId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/scratch/mine]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2873}
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
	 * @summary 触发刮刮卡
	 * @param   {Number|String} activityId
	 * @param   {String}        openId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/scratch/scratchCard]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2875}
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
	 * @summary 刮刮卡 支持队伍，支持一票接口，使用 POST 方法
	 * @param   {Number|String} joinerId
	 * @param   {Number|String} teamId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/scratch/support]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2003}
	 * */
	scratchTeamSel(joinerId, teamId){
		let result
			;

		if( joinerId && teamId ){
			result = this.setData('/publics/activity/scratch/support', {
				data: {
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
	 * @summary 微信刮刮卡支持活动结果
	 * @param   {Number|String} id  活动 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/scratch/result]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2037}
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
	 * @summary 获取多城市的活动详情，使用 POST 方法
	 * @param   {Number|String} id          活动 id
	 * @param   {Number|String} [cityCode]  城市编码，对应 cityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://wechat.test.66buy.com.cn/publics/activity/multiCity/get]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1973}
	 * */
	getActivityUtil(id, cityCode){
		let data = {
				id
			}
			;

		if( cityCode ){
			data.cityCode = cityCode;
		}

		return this.setData('/publics/activity/multiCity/get', {
			data
		});
	}
}

Model.register('wechat', WeChatServiceModel);

Model.registerAlias('wechat', ['weixin', 'wx']);

export default WeChatServiceModel;