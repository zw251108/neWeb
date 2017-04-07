'use strict';

import Model        from '../model/model';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';

/**
 * @class
 * @classdesc   Push 业务模块，在 Model.factory 工厂方法注册为 push，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class PushServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['pushserv'];

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @desc    查询消息列表
	 * @param   {Number|String} messageCode             消息类型，501.降价，502.发券，503.活动
	 * @param   {Object}        [options]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3129}
	 * */
	queryAllMessageBody(messageCode, options){
		let data = {
				messageCode
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/publics/messageBody/queryAllMessageBody', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    查询历史消息列表
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * @todo    目前没有调用到，取消
	 * */
	queryOldMessageBody(){
		return this.getData('/publics/messageBody/queryOldMessageBody', {
			method: 'POST'
		});
	}
}

Model.register('push', PushServiceModel);

export default PushServiceModel;