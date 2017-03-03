'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   IM 业务模块
 * @extends ServiceModel
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
	 * 获取用户账号信息（判断用户是否注册了环信 IM 账号）
	 * @param   {String|Number} memberId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
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
	 * 获取用户环信信息
	 * @param   {String|Number} memberId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
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
	 * 获取客服系统中的 IM 服务号
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	getServiceNo(){
		return this.getData('/publics/tgou/easemob/kefu/serverNo', {
			method: 'POST'
		});
	}
	/**
	 * 根据类型获取配置的技能组
	 * @param   {Number}    type
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	getSkillGroup(type){
		return this.getData('/publics/tgou/easemob/getSkillGroup', {
			method: 'POST'
			, data: {
				type
			}
		});
	}
}

ServiceModel.register('im', ImServiceModel);

export default ImServiceModel;