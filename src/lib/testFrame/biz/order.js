'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   订单业务模块
 * @extends     ServiceModel
 * */
class OrderServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = [domain.isOnline ? 'orderserver' : 'oSer'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	// newPreOrder(source, crowdItemId, quantity, skuId, storeId, activityProductId, crowdAmount){
	// 	return this.getData('/publics/tgouOrder/newPreOrder', {
	// 		method: 'POST'
	// 		, data: {
	// 			source
	// 			, crowdItemId
	// 			, quantity
	// 			, skuId
	// 			, storeId
	// 			, activityProductId
	// 			, crowdAmount
	// 		}
	// 	})
	// }

	/**
	 * 获取下单所用数据，订单确认
	 * @param   {Number}        from    订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String|Number} fxStoreId   分销 storeId
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	preOrder(from, fxStoreId, products){
		return this.getData('/publics/tgouOrder/preOrder', {
			method: 'POST'
			, data: {
				from
				, fxStoreId
				, products
			}
		});
	}
	/**
	 * 验证限购数
	 * @param   {Number}    from    订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	validate(from, products){
		return this.getData('/publics/tgouOrder/validate', {
			method: 'POST'
			, data: {
				from
				, products
			}
		});
	}
	/**
	 * 订单确认页 - 查询优惠信息
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	promotions(products){
		return this.getData('/publics/tgouOrder/promotions', {
			method: 'POST'
			, data: {
				products
			}
		});
	}

	/**
	 * 查询优惠信息，订单确认，查询优惠信息
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	calculate(products){
		return this.getData('/publics/tgouOrder/promotions', {
			method: 'POST'
			, data: {
				products
			}
		});
	}
	/**
	 * 下订单
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String|Number} fxStoreId   分销 storeId
	 * @param   {String}        products        商品数组数据序列化（JSON.stringify）
	 * @param   {String}        orderOption     支付方式、提货方式数据序列化（JSON.stringify）
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	add(from, fxStoreId, products, orderOption){
		return this.getData('/publics/tgouOrder/add', {
			method: 'POST'
			, data: {
				from
				, fxStoreId
				, products
				, orderOption
			}
		});
	}
	/**
	 * 将商品添加到购物车
	 * @param   {Number|String}     activityProductId   商品 id
	 * @param   {Number}            quantity    商品数量
	 * @param   {Number|String}     skuId
	 * @param   {Number}            source      门店类型
	 * @param   {Number|String}     fkStoreId
	 * @param   {Boolean}           [onshelfType=false]
	 * @param   {Number|String}     [fxStoreId] 分销fxStoreId
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * */
	addShopCart(activityProductId, quantity, skuId, source, fkStoreId, onshelfType=false, fxStoreId){
		let data = {
			activityProductId
			, quantity
			, skuId
			, source
			, fkStoreId
		};
		data.onshelfType = onshelfType ? 1 : '';
		fxStoreId && (data.fxStoreId = fxStoreId);

		return this.getData('/publics/shopCart/add', {
			method: 'POST'
			, data
		});
	}
}

ServiceModel.register('order', OrderServiceModel);

export default OrderServiceModel;