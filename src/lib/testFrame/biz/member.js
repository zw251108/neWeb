'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   会员业务模块
 * @extends     ServiceModel
 * */
class MemberServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['mServ'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * 获取用户信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    未查到该接口
	 * */
	memberInfo(){
		return this.getData('/publics/member/info');
	}
	/**
	 * 获取我的账户信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	mineInfo(){
		return this.getData('/publics/mine/info');
	}
	/**
	 * 获取结算码弹窗情况
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	openState(){
		return this.getData('/publics/member/openState');
	}
	/**
	 * 店铺所有会员卡
	 * @param   {String|Number} storeId     门店 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	storeToCard(storeId){
		return this.getData('/publics/memberCard/storeToCard', {
			method: 'POST'
			, data: {
				storeId
			}
		});
	}
	/**
	 * 防黄牛
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	secKey(){
		return this.getData('/publics/app/secKey', {
			method: 'POST'
		});
	}
	/**
	 * 查询单笔最大可使用积分
	 * @param   {String|Number} storeId     门店 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	scoreLimit(storeId){
		return this.getData('/publics/store/conf/score/limit', {
			data: {
				storeId
			}
		});
	}
	/**
	 * 加载所有配送地址
	 * @param   {Boolean}   isDefault
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    未查到接口
	 * */
	memberAddressList(isDefault){
		return this.getData('/publics/memberAddress/list', {
			data: {
				isDefault
			}
		});
	}
	/**
	 * 通过收货地址 id 查询收货地址
	 * @param   {String|Number} addressId   收货地址 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	getAddressById(addressId){
		return this.getData('/publics/memberAddress/getById', {
			data: {
				addressId
			}
		});
	}
	/**
	 * 会员卡相关 - 会员解除绑定会员卡
	 * @param   {String|Number} cid
	 * @param   {String|Number} groupId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，若未传 cid 则返回 resolve([])
	 * */
	unbind(cid, groupId){
		let result
			;

		if( cid ){
			result = this.getData('/publics/memberCard/unbind', {
				data: {
					cid
					, groupId
				}
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
	/**
	 * 会员卡相关 - 二次绑定接口
	 * @param   {Number}    cid
	 * @param   {Number}    groupId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	noValidate(cid, groupId){
		return this.getData('/publics/memberCard/bind/noValidate', {
			method: 'POST'
			, data: {
				cid
				, groupId
			}
		});
	}
	/**
	 * 会员卡相关 - 查询当前店铺会员卡绑定状态
	 * @param   {Number}    storeId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 */
	cidBind(storeId){
		return this.getData('/publics/memberCard/cidBind', {
			method: 'POST'
			, storeId
		});
	}
	/**
	 * 实名认证相关 - 获取实名认证列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityList(){
		return this.getData('/publics/memberIdentity/getMemberIdentityList');
	}
	/**
	 * 实名认证相关 - 通过 id 查询我的实名认证
	 * @param   {String|Number} id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityGetById(id){
		return this.getData('/publics/memberIdentity/getById', {
			data: {
				id
			}
		});
	}
	/**
	 * 实名认证相关 - 查询姓名查询我的实名认证
	 * @param   {String}    name
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityGetByName(name){
		return this.getData('/publics/memberIdentity/getByName', {
			data: {
				name
			}
		});
	}
	/**
	 * 实名认证相关 - 新增实名认证
	 * @param   {String}    name
	 * @param   {String}    idCardNumber
	 * @param   {String}    idCardFront
	 * @param   {String}    idCardBack
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityAdd(name, idCardNumber, idCardFront, idCardBack){
		return this.getData('/publics/memberIdentity/add', {
			method: 'POST'
			, data: {
				name
				, idCardNumber
				, idCardFront
				, idCardBack
			}
		});
	}
	/**
	 * 实名认证相关 - 更新实名认证
	 * @param   {String|Number} id
	 * @param   {String}        name
	 * @param   {String}        idCardNumber
	 * @param   {String}        idCardFront
	 * @param   {String}        idCardBack
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityUpdate(id, name, idCardNumber, idCardFront, idCardBack){
		return this.getData('/publics/memberIdentity/update', {
			method: 'POST'
			, data: {
				id
				, name
				, idCardNumber
				, idCardFront
				, idCardBack
			}
		});
	}
	/**
	 * 实名认证相关 - 删除我的实名认证
	 * @param   {String|Number} id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityDelete(id){
		return this.getData('/publics/memberIdentity/delete', {
			data: {
				id
			}
		});
	}
	/**
	 * 实名认证相关 - 上传身份证图片
	 * @param   {FormData}  formData
	 * @param   {File}      formData.file
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	identityUpload(formData){
		return this.getData('/publics/memberIdentity/upload', {
			method: 'POST'
			, data: formData
			, processData: false
			, contentType: false
		});
	}
	/**
	 * 对非用户基于领取优惠券注册
	 * @param   {String}        phone
	 * @param   {String|Number} couponId
	 * @param   {String}        sign
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	fastRegister(phone, couponId, sign){
		return this.getData('/publics/register/fastRegister', {
			method: 'POST'
			, data: {
				phone
				, couponId
				, sign
			}
		});
	}
}

ServiceModel.register('member', MemberServiceModel);

export default MemberServiceModel;