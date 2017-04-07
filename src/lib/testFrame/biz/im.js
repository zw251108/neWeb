'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   IM 业务模块，在 Model.factory 工厂方法注册为 im，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class ImServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['imserv'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @desc    获取用户账号信息（判断用户是否注册了环信 IM 账号）
	 * @param   {Number|String} memberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3211}
	 * */
	getByMemberId(memberId){
		return this.getData('/publics/tgou/easemob/getByMemberId', {
			method: 'POST'
			, data: {
				memberId
			}
		});
	}
	/**
	 * @desc    获取用户环信信息
	 * @param   {Number|String} memberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3151}
	 * */
	getAccount(memberId){
		return this.getData('/publics/tgou/easemob/getAccount', {
			method: 'POST'
			, data: {
				memberId
			}
		});
	}
	/**
	 * @desc    获取客服系统中的 IM 服务号
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3197}
	 * */
	getServiceNo(){
		return this.getData('/publics/tgou/easemob/kefu/serverNo', {
			method: 'POST'
		});
	}
	/**
	 * @desc    根据类型获取配置的技能组
	 * @param   {Number}    type    技能组类型
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3221}
	 * */
	getSkillGroup(type){
		return this.getData('/publics/tgou/easemob/getSkillGroup', {
			method: 'POST'
			, data: {
				type
			}
		});
	}
	
	/**
	 * @desc    通过 counterId 获得导购 im 账号列表
	 * @param   {Number|String} counterId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，如果未传参数会返回 []
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=106}
	 * */
	getServiceList(counterId){
		let result
			;

		if( counterId && validate.isInteger(counterId) ){
			result = this.getData('/publics/tgou/getByCounterId', {
				data: {
					counterId
				}
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
}

Model.register('im', ImServiceModel);

export default ImServiceModel;