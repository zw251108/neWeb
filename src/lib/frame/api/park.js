'use strict';

import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';
import domain       from 'domainConfig';

/**
 * @class
 * @classdesc   停车场业务接口，二/三级域名 park，在 Model.factory 工厂方法注册为 park，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class ParkServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['park'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 查询缴费记录
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkPay/queryPayDetails]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3643}
	 * */
	queryPayDetails(){
		return this.setData('/publics/parkPay/queryPayDetails');
	}
	/**
	 * @summary 查询缴费详情
	 * @param   {Number|String} parkBillId  缴费详情 id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkPay/queryPayDetail]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3645}
	 * */
	queryPayDetail(parkBillId){
		return this.setData('/publics/parkPay/queryPayDetail', {
			data: {
				parkBillId
			}
		});
	}
	/**
	 * @summary 订单
	 * @param   {Number|String} storeId
	 * @param   {Number|String} parkId
	 * @param   {String}        recordNumber    进停车场的记录号
	 * @param   {Number}        remainAmount    待支付金额
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkPay/payOptions]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3639}
	 * */
	payOptions(storeId, parkId, recordNumber, remainAmount){
		return this.setData('/publics/parkPay/payOptions', {
			data: {
				storeId
				, parkId
				, recordNumber
				, remainAmount
			}
		});
	}
	/**
	 * @summary 提交停车支付单
	 * @param   {Number}        actualAmount                需要支付的实际金额
	 * @param   {Number|String} storeId
	 * @param   {Number|String} parkId
	 * @param   {String}        carNumber                   车牌号
	 * @param   {String}        recordNumber                车辆停车记录
	 * @param   {Number}        payAmount                   本次缴费代缴总金额
	 * @param   {Number|String} enterTime                   车辆入场时间，时间戳
	 * @param   {Number|String} parkMesc                    停车时长，为毫秒数
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.couponCodeId]      选择的券的 id
	 * @param   {Number}        [options.couponDiscount]    选择的券的优惠金额
	 * @param   {Number|String} [options.cid]               会员卡 id
	 * @param   {Number}        [options.pointAmount]       使用的积分数
	 * @param   {Number}        [options.memberDiscount]    会员专享优惠
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法，couponCodeId 和 couponDiscount 必须同时传，cid 必须和 pointAmount 或 memberDiscount 同时传
	 * @see     [http://park.test.66buy.com.cn/publics/parkPay/payOptions/commit]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3823}
	 * */
	commit(actualAmount, storeId, parkId, carNumber, recordNumber, payAmount, enterTime, parkMesc, options={}){
		let data = {
				actualAmount
				, storeId
				, parkId
				, carNumber
				, recordNumber
				, payAmount
				, enterTime
				, parkMesc
			}
			;

		if( options.couponCodeId && options.couponDiscount ){
			data.couponCodeId = options.couponCodeId;
			data.couponDiscount = options.couponDiscount;
		}
		if( options.cid && options.pointAmount ){
			data.cid = options.cid;
			data.pointAmount = options.pointAmount
		}
		if( options.cid && options.memberDiscount ){
			data.cid = options.cid;
			data.memberDiscount = options.memberDiscount;
		}

		return this.setData('/publics/parkPay/payOptions/commit', {
			data
		});
	}

	/**
	 * @summary 添加爱车
	 * @param   {String}    carNumber   车牌号
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkCar/addCar]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3631}
	 * */
	addCar(carNumber){
		return this.setData('/publics/parkCar/addCar', {
			data: {
				carNumber
			}
		});
	}
	/**
	 * @summary 删除爱车
	 * @param   {String}    carNumber   车牌号
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkCar/deleteCar]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3909}
	 * */
	deleteCar(carNumber){
		return this.setData('/publics/parkCar/deleteCar', {
			data: {
				carNumber
			}
		});
	}
	/**
	 * @summary 提交反馈问题
	 * @param   {Number}        questionCode    反馈问题码
	 * @param   {Number|String} parkBillId      停车支付单号
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkCar/submitParkQuestion]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3637}
	 * */
	submitParkQuestion(questionCode, parkBillId){
		return this.setData('/publics/parkCar/submitParkQuestion', {
			data: {
				questionCode
				, parkBillId
			}
		});
	}
	/**
	 * @summary 查询停车场的 Q&A
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkCar/queryQA]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3647}
	 * */
	queryQA(){
		return this.setData('/publics/parkCar/queryQA');
	}
	/**
	 * @summary 查询停车支付反馈问题
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://park.test.66buy.com.cn/publics/parkCar/feedBackQuestions]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3827}
	 * */
	feedBackQuestions(){
		return this.setData('/publics/parkCar/feedBackQuestion');
	}
}

Model.register('park', ParkServiceModel);

export default ParkServiceModel;