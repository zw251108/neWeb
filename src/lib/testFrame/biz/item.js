'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   Item 业务模块
 * @extends ServiceModel
 * */
class ItemServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['item'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * 加载商品数据
	 * @param   {Number|String} id  商品 id
	 * @param   {Number}        source  门店类型
	 * @param   {String}        [orderColumn='item_heat desc,sold_qty desc,start_time desc']
	 * @param   {String}        [orderType='DESC']
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	sugProduct(id, source, orderColumn='item_heat desc,sold_qty desc,start_time desc', orderType='DESC'){
		let result
			;

		if( id ){
			result = this.getData('/front/listing/search/order/sug', {
				method: 'POST'
				, data: {
					id
					, source
					, orderColumn
					, orderType
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

}

ServiceModel.register('item', ItemServiceModel);

export default ItemServiceModel;