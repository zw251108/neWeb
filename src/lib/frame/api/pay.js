'use strict';

import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';
import domain       from 'domainConfig';

/**
 * @class
 * @classdesc   Pay 支付业务模块，二/三级域名 pay，在 Model.factory 工厂方法注册为 pay，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class PayServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['pay'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 我的银行卡查询
	 * @param   {Number}    [cardType]  0.银行卡，3.大商卡，不传查询全部
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/memberBank/public/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=433}
	 * */
	query(cardType){
		return this.setData('/memberBank/public/query', {
			data: {
				cardType
			}
		});
	}
	/**
	 * @summary 我的银行卡解绑
	 * @param   {Number|String} memberBankId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/memberBank/public/unbind]{@link http://dev.51tiangou.com/interfaces/detail.html?id=435}
	 * */
	unbind(memberBankId){
		return this.setData('/memberBank/public/unbind', {
			data: {
				memberBankId
			}
		});
	}
	/**
	 * @summary 我的银联快捷绑卡
	 * @param   {Object}        data
	 * @param   {Number|String} data.cardType       证件类型，1.身份证
	 * @param   {String}        data.cardNumber     证件号
	 * @param   {String}        data.realName       顾客姓名
	 * @param   {String}        data.cellphone      银行预留手机号
	 * @param   {String}        data.bankcardNo     银行卡号
	 * @param   {String}        [data.objectId]     支付凭证号（订单号）
	 * @param   {Number}        [data.bankCardType] 银行卡类型，1.借记卡，2.信用卡
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://pay.test.66buy.com.cn/memberBank/public/openFast]{@link http://dev.51tiangou.com/interfaces/detail.html?id=429}
	 * */
	openFast(data){
		return this.setData('/memberBank/public/openFast', {
			data
		});
	}
	/**
	 * @summary 分期查询信用卡列表详情
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/memberBank/public/queryInstalmentCard]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2129}
	 * */
	queryInstalmentCard(orderId){
		return this.setData('/memberBank/public/queryInstalmentCard', {
			data: {
				orderId
			}
		});
	}

	/**
	 * @summary 当前门店支付方式（多账户）
	 * @param   {Number|String} orderId
	 * @param   {Number|String} fkStoreId
	 * @param   {Boolean}       isMulti
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/publics/storePayMethod/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2559}
	 * */
	storePayMethod(orderId, fkStoreId, isMulti){
		return this.setData('/publics/storePayMethod/query', {
			data: {
				orderId
				, fkStoreId
				, isMulti
			}
		});
	}

	/**
	 * @summary 分期付款支付
	 * @param   {Object}    data
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/pay/privates/unionInstalmentPay]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2131}
	 * @todo    目前没有调用到，取消
	 * @todo    接口中心显示接口为后台系统
	 * */
	unionInstalmentPay(data){
		return this.setData('/pay/privates/unionInstalmentPay', {
			data
		});
	}

	/**
	 * @summary 银联快捷支付结果接口
	 * @param   {Number|String} orderNo 第三方支付平台订单号
	 * @param   {Number}        [type]  支付类型，10.银联快捷，8.银联分期
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/callback/unionFastPayReturn]{@link http://dev.51tiangou.com/interfaces/detail.html?id=425}
	 * */
	unionFastPayReturn(orderNo, type){
		let data = {
				orderNo
			}
			;

		if( type ){
			data.type = type;
		}

		return this.setData('/callback/unionFastPayReturn', {
			data
		});
	}
	/**
	 * @summary 支付成功通知
	 * @param   {String}        bizNumber
	 * @param   {Number}        bizType
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    bizType 目前的值：
	 *          1   停车场
	 *          3   试衣秀
	 *          4   订单支付
	 * @see     [http://pay.test.66buy.com.cn/publics/successNotify]
	 * @todo    这个接口地址没确定
	 * */
	successNotify(bizNumber, bizType){
		return this.getData('/callback/successNotify', {
			data: {
				bizNumber
				, bizType
			}
		});
	}

	/**
	 * @summary 微众银行开卡
	 * @param   {String}    phoneNo
	 * @param   {String}    redirect
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/open]
	 * @todo    接口中心未查到
	 * */
	personOpen(phoneNo, redirect){
		return this.setData('/webank/open', {
			data: {
				phoneNo
				, redirect
			}
		});
	}
	/**
	 * @summary 绑定银行卡
	 * @param   {String}    redirect
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/bindBankCard]
	 * @todo    接口中心未查到
	 * */
	bindBankCard(redirect){
		return this.setData('/webank/bindBankCard', {
			data: {
				redirect
			}
		});
	}
	/**
	 * @summary 解除绑定银行卡
	 * @param   {String}    bindingId
	 * @param   {String}    redirect
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/unBindBankCard]
	 * @todo    接口中心未查到
	 * */
	unBindBankCard(bindingId, redirect){
		return this.setData('/webank/unBindBankCard', {
			data: {
				bindingId
				, redirect
			}
		});
	}
	/**
	 * @summary 查询银行卡列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/queryBindBankCards]
	 * @todo    接口中心未查到
	 * */
	queryBindBankCards(){
		return this.setData('/webank/queryBindBankCards');
	}
	/**
	 * @summary 修改手机号码
	 * @param   {String}    newPhoneNo
	 * @param   {String}    redirect
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/modifyPhoneNo]
	 * @todo    接口中心未查到
	 * */
	modifyPhoneNo(newPhoneNo, redirect){
		return this.setData('/webank/modifyPhoneNo', {
			data: {
				newPhoneNo
				, redirect
			}
		});
	}
	/**
	 * @summary 修改手机号码
	 * @param   {String}    newPhoneNo
	 * @param   {String}    redirect
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法，内部调用 modifyPhoneNo
	 * @todo    与 modifyPhoneNo 取其一
	 * */
	changePhoneNumber(newPhoneNo, redirect){
		return this.modifyPhoneNo(newPhoneNo, redirect);
	}
	/**
	 * @summary 修改密码
	 * @param   {String}    redirect
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/pwdChange]
	 * @todo    接口中心未查到
	 * */
	pwdChange(redirect){
		return this.setData('/webank/pwdChange', {
			data: {
				redirect
			}
		});
	}
	/**
	 * @summary 重置密码
	 * @param   {String}    redirect
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @todo    接口中心未查到
	 * @see     [http://pay.test.66buy.com.cn/webank/pwdReset]
	 * */
	pwdReset(redirect){
		return this.setData('/webank/pwdReset', {
			data: {
				redirect
			}
		});
	}
	/**
	 * @summary 查询手机号
	 * @param   {Boolean}   [redirect]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/queryPersonPhoneNo]
	 * @todo    接口中心未查到
	 * */
	queryPersonPhoneNo(redirect){
		let data = {}
			;

		if( redirect ){
			data.redirect = redirect;
		}

		return this.setData('/webank/queryPersonPhoneNo', {
			data
		});
	}
	/**
	 * @summary 查询余额
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/queryBalance]
	 * @todo    接口中心未查到
	 * */
	queryBalance(){
		return this.setData('/webank/queryBalance');
	}
	/**
	 * @summary 充值
	 * @param   {Number|String} amount
	 * @param   {String}        bindingId
	 * @param   {String}        cardNo
	 * @param   {String}        cardType
	 * @param   {String}        redirect
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://pay.test.66buy.com.cn/webank/recharge]
	 * @todo    接口中心未查到
	 * */
	recharge(amount, bindingId, cardNo, cardType, redirect){
		return this.setData('/webank/recharge', {
			data: {
				amount
				, bindingId
				, cardNo
				, cardType
				, redirect
			}
		});
	}
}

Model.register('pay', PayServiceModel);

export default PayServiceModel;