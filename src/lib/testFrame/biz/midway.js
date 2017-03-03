'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   中间件模块
 * @extends ServiceModel
 * */
class MidwayServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['midway'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * 获取中间件数据
	 * @param   {String}    topic   中间件请求地址
	 * @param   {Object}    options
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * */
	getMidData(topic, options){
		return this.getData(topic, options).then((data)=>{
			// todo 数据操作
		});
	}
}

ServiceModel.register('midway', MidwayServiceModel);

ServiceModel.registerAlias('midway', 'mid');

export default MidwayServiceModel;