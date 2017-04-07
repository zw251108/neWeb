'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';

/**
 * @class
 * @classdesc   Pay 支付业务模块，在 Model.factory 工厂方法注册为 pay，将可以使用工厂方法生成
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
	 * @desc    我的银行卡查询
	 * @param   {Number}    [cardType]  0.银行卡，3.大商卡，不传查询全部
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=433}
	 * */
	query(cardType){
		return this.getData('/memberBank/public/query', {
			method: 'POST'
			, data: {
				cardType
			}
		});
	}
	/**
	 * @desc    我的银行卡解绑
	 * @param   {Number|String} memberBankId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=435}
	 * */
	unbind(memberBankId){
		return this.getData('/memberBank/public/unbind', {
			method: 'POST'
			, data: {
				memberBankId
			}
		});
	}
	/**
	 * @desc    我的银联快捷绑卡
	 * @param   {Object}        data
	 * @param   {Number|String} data.cardType       证件类型，1.身份证
	 * @param   {String}        data.cardNumber     证件号
	 * @param   {String}        data.realName       顾客姓名
	 * @param   {String}        data.cellphone      银行预留手机号
	 * @param   {String}        data.bankcardNo     银行卡号
	 * @param   {String}        [data.objectId]     支付凭证号（订单号）
	 * @param   {Number}        [data.bankCardType] 银行卡类型，1.借记卡，2.信用卡
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=429}
	 * */
	openFast(data){
		return this.getData('/memberBank/public/openFast', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    分期查询信用卡列表详情
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2129}
	 * */
	queryInstalmentCard(orderId){
		return this.getData('/memberBank/public/queryInstalmentCard', {
			method: 'POST'
			, data: {
				orderId
			}
		});
	}

	/**
	 * @desc    当前门店支付方式（多账户）
	 * @param   {Number|String} orderId
	 * @param   {Number|String} fkStoreId
	 * @param   {Boolean}       isMulti
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2559}
	 * */
	storePayMethod(orderId, fkStoreId, isMulti){
		return this.getData('/publics/storePayMethod/query', {
			method: 'POST'
			, data: {
				orderId
				, fkStoreId
				, isMulti
			}
		});
	}

	/**
	 * @desc    分期付款支付
	 * @param   {Object}    data
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2131}
	 * @todo    目前没有调用到，取消
	 * @todo    接口中心显示接口为后台系统
	 * */
	unionInstalmentPay(data){
		return this.getData('/pay/privates/unionInstalmentPay', {
			method: 'POST'
			, data
		});
	}

	/**
	 * @desc    银联快捷支付结果 接口
	 * @param   {Number|String} orderNo 第三方支付平台订单号
	 * @param   {Number}        [type]  支付类型，10.银联快捷，8.银联分期
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=425}
	 * */
	unionFastPayReturn(orderNo, type){
		let data = {
				orderNo
			}
			;

		if( type ){
			data.type = type;
		}

		return this.getData('/callback/unionFastPayReturn', {
			method: 'POST'
			, data
		});
	}
}

Model.register('pay', PayServiceModel);

export default PayServiceModel;