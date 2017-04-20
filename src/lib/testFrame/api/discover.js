'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';

/**
 * @class
 * @classdesc   发现业务模块，二/三级域名 discover，在 Model.factory 工厂方法注册为 base，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class DiscoverServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['discover'];

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 删除发现
	 * @param   {Number|String} discoverId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回值
	 * @desc    使用 POST 方法
	 * @see     [http://discover.test.66buy.com.cn/front/discover/delete]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3669}
	 * */
	delDiscover(discoverId){
		return this.setData('/front/discover/delete', {
			data: {
				discoverId
			}
		});
	}

	/**
	 * @summary 新增评论
	 * @param   {String}        content                     回复内容
	 * @param   {Number|String} memberId                    用户 id
	 * @param   {Number|String} discoverId                  发现 id
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.sourceId]          原始评论
	 * @param   {Number|String} [options.replyCommentId]    回复目标评论 id
	 * @param   {String}        [options.replyCommentName]  回复目标名称
	 * @param   {Number}        [options.memberType]        用户类型，1.天狗用户，2.微信
	 * @param   {String}        [options.wechatName]        微信昵称
	 * @param   {String}        [options.wechatPhoto]       微信头像
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回值
	 * @desc    使用 POST 方法
	 * */
	addReply(content, memberId, discoverId, options){
		let data = {
				content
				, memberId
				, discoverId
			}
			;

		if( options.memberType ){
			data.memberType = options.memberType;

			if( options.memberType === 2 && options.wechatName && options.wechatPhoto ){
				data.wechatName = options.wechatName;
				data.wechatPhoto = options.wechatPhoto;
			}
		}

		if( options.sourceId ){
			data.sourceId = options.sourceId;

			if( options.replyCommentId && options.replyCommentName ){
				data.replyCommentId = options.replyCommentId;
				data.replyCommentName = options.replyCommentName;
			}
		}


		return this.setData('/front/discover/delete', {
			data
		});
	}
	/**
	 * @summary 删除评论
	 * @param   {Number|String} commentId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回值
	 * @desc    使用 POST 方法
	 * @see     [http://discover.test.66buy.com.cn/front/comment/delete]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3691}
	 * */
	delReply(commentId){
		return this.setData('/front/comment/delete', {
			data: {
				commentId
			}
		});
	}

	/**
	 * @summary 发现频道 - 喜欢发现
	 * @param   {Number|String} discoverId
	 * @param   {Object}        options
	 * @param   {Number}        options.memberType      用户类型，1.天狗用户，2.微信用户
	 * @param   {String}        options.openId          当 memberType 为 2 时，必传
	 * @param   {String}        options.wechatNickName  当 memberType 为 2 时，必传
	 * @param   {String}        options.wechatPhoto     当 memberType 为 2 时，必传
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回值
	 * @desc    使用 POST 请求
	 * @see     [http://discover.test.66buy.com.cn/front/liked/selected]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3683}
	 * */
	like(discoverId, options){
		let data = {
				discoverId
			}
			;

		if( options.memberType ){
			data.memberType = options.memberType;

			if( options.memberType === 2 ){
				data.options = options.openId;
				data.wechatNickname = options.wechatNickName;
				data.wechatPhoto = options.wechatPhoto;
			}
		}

		return this.setData('/front/liked/selected', {
			data
		});
	}
	/**
	 * @summary 发现频道 - 取消喜欢发现
	 * @param   {Number|String} discoverId
	 * @param   {String}        [openId='']
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回值
	 * @desc    使用 POST 请求
	 * @see     [http://discover.test.66buy.com.cn/front/liked/canceled]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3685}
	 * */
	likeCancel(discoverId, openId=''){
		let data = {
				discoverId
			}
			;

		if( openId ){
			data.openId = openId;
		}

		return this.setData('/front/liked/canceled', {
			data
		});
	}

}

Model.register('discover', DiscoverServiceModel);

export default DiscoverServiceModel;