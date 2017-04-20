'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   IM 业务模块，二/三级域名 imserv，在 Model.factory 工厂方法注册为 im，将可以使用工厂方法生成
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
	 * @summary 获取用户账号信息（判断用户是否注册了环信 IM 账号）
	 * @param   {Number|String} memberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://imserv.test.66buy.com.cn/publics/tgou/easemob/getByMemberId]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3211}
	 * */
	getByMemberId(memberId){
		return this.setData('/publics/tgou/easemob/getByMemberId', {
			data: {
				memberId
			}
		});
	}
	/**
	 * @summary 获取用户环信信息
	 * @param   {Number|String} memberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://imserv.test.66buy.com.cn/publics/tgou/easemob/getAccount]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3151}
	 * */
	getAccount(memberId){
		return this.setData('/publics/tgou/easemob/getAccount', {
			data: {
				memberId
			}
		});
	}
	/**
	 * @summary 获取客服系统中的 IM 服务号
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://imserv.test.66buy.com.cn/publics/tgou/easemob/kefu/serverNo]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3197}
	 * */
	getServiceNo(){
		return this.setData('/publics/tgou/easemob/kefu/serverNo');
	}
	/**
	 * @summary 根据类型获取配置的技能组
	 * @param   {Number}    type    技能组类型
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://imserv.test.66buy.com.cn/publics/tgou/easemob/getSkillGroup]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3221}
	 * */
	getSkillGroup(type){
		return this.setData('/publics/tgou/easemob/getSkillGroup', {
			data: {
				type
			}
		});
	}
	
	/**
	 * @summary 通过 counterId 获得导购 im 账号列表
	 * @param   {Number|String} counterId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，如果未传参数会返回 []
	 * @see     [http://imserv.test.66buy.com.cn/publics/tgou/easemob/getSkillGroup]{@link http://dev.51tiangou.com/interfaces/detail.html?id=106}
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