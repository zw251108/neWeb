'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   coupon 业务模块
 * @extends ServiceModel
 * */
class CouponServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['coupon'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * 获取某个用户满平分活动的资格记录
	 * @param   {String|Number} activityId  活动 id
	 * @param   {String|Number} memberId    用户 id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	activityQcList(activityId, memberId){
		return this.getData('/publics/activity/qc/list', {
			method: 'POST'
			, data: {
				activityId
				, memberId
			}
		});
	}
	/**
	 * 获取品活动的优惠规则
	 * @param   {String|Number} activityId  活动 id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	activityRuleGet(activityId){
		return this.getData('/publics/activity/rule/get', {
			method: 'POST'
			, data: {
				activityId
			}
		});
	}
}

ServiceModel.register('coupon', CouponServiceModel);

export default CouponServiceModel;