'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';

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

		this._config.domainList = [domain.isOnline ? 'orderserver' : 'oser'];  // 子域名

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
	 * @desc    获取下单所用数据，订单确认
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @param   {Number|String} fxStoreId   分销 storeId
	 * @param   {Number}        JR
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3163}
	 * */
	preOrder(from, products, fxStoreId, JR){
		return this.getData('/publics/tgouOrder/preOrder', {
			method: 'POST'
			, data: {
				from
				, products
				, fxStoreId
				, JR
			}
		});
	}
	/**
	 * @desc    验证限购数
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @param   {Number|String} fxStoreId   分销 storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3337}
	 * */
	validate(from, products, fxStoreId){
		return this.getData('/publics/tgouOrder/validate', {
			method: 'POST'
			, data: {
				from
				, products
				, fxStoreId
			}
		});
	}
	/**
	 * @desc    订单确认页 - 查询优惠信息
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3339}
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
	 * @desc    老版本下单接口
	 * @param   {String}    addOrderRequest 商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	addOrder(addOrderRequest){
		return this.getData('/publics/tgouOrder/addOrder', {
			method: 'POST'
			, data: {
				addOrderRequest
			}
		});
	}
	/**
	 * @desc    下订单
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @param   {String}        orderOption 支付方式、提货方式数据序列化（JSON.stringify）
	 * @param   {Number|String} fxStoreId   分销 storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3195}
	 * @todo    使用防黄牛机制
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
	 * @desc    订单列表
	 * @param   {Array}     stateSet                订单状态，Waiting,Pending,Processing,Shipping,PointShipped,End,Returned
	 * @param   {String}    orderColumn             值为 id
	 * @param   {String}    orderType               值为 desc
	 * @param   {Object}    [options={}]            分页参数
	 * @param   {Number}    [options.startNum=0]
	 * @param   {Number}    [options.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3419}
	 * @todo    接口中心没有 jsonStr 参数
	 * */
	list(stateSet, orderColumn, orderType, options={}){
		let data = {
				stateSet
				, orderColumn
				, orderType
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/publics/tgouOrder/list', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    订单详情
	 * @param   {Number|String} id          订单号
	 * @param   {Boolean}       [supplier]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3261}
	 * */
	detail(id, supplier){
		let data = {
				id
			}
			;

		if( supplier ){
			data.supplier = supplier;
		}

		return this.getData('/publics/tgouOrder/detail', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    订单详情
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3181}
	 * */
	payDetail(orderId){
		return this.getData('/publics/tgouOrder/payOrderInfo', {
			method: 'POST'
			, data: {
				orderId
			}
		});
	}
	/**
	 * @desc    支付成功订单信息查询接口，与 payDetail 调用相同接口，调整为内部调用 payDetail
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [payDetail]{@link OrderServiceModel#payDetail}
	 * */
	prePayOrderInfo(orderId){
		return this.payDetail( orderId );
	}
	/**
	 * @desc    取消订单
	 * @param   {Number|String} id          订单 id
	 * @param   {Number|String} [reasonId]  取消原因 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1091}
	 * */
	cancel(id, reasonId){
		let data = {
				id
			}
		;

		if( reasonId ){
			data.reasonId = reasonId;
		}

		return this.getData('/publics/tgouOrder/cancel', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    订单完成
	 * @param   {Number|String} id  订单 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	end(id){
		return this.getData('/publics/tgouOrder/end', {
			data: {
				id
			}
		});
	}
	/**
	 * @desc    未支付订单数量
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	waitings(){
		return this.getData('/publics/tgouOrder/waitings');
	}
	/**
	 * @desc    订单支付
	 * @param   {Object}        data
	 * @param   {Number|String} data.orderId
	 * @param   {Number|String} [data.orderNo]
	 * @param   {Number|String} [data.storeId]
	 * @param   {Number}        [data.type]             值为 4,10,12,13,14
	 * @param   {Number|String} [data.memberbankId]
	 * @param   {String}        [data.payPasswod]
	 * @param   {String}        [data.smsCode]
	 * @param   {String}        [data.type]
	 * @param   {String}        [data.bankCode]
	 * @param   {String}        [data.buyerMobile]
	 * @param   {String}        [data.debitCreditType]  值为 'CREDIT','DEBIT'
	 * @param   {String}        [data.appDeviceInfo]    值为 'ios','android'
	 * @param   {Number}        [data.bizType]          值为 1.订单，2.券，3.打赏
	 * @param   {Number|String} [data.bizNumber]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2809}
	 * @todo    bizNumber 参数后边有注释“这个是什么鬼”。。。
	 * @todo    整理参数
	 * */
	pay(data){
		return this.getData('/publics/tgouOrder/pay', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    退货详情
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	stateLog(orderId){
		return this.getData('/publics/tgouOrder/stateLog', {
			method: 'POST'
			, data: {
				orderId
			}
		});
	}
	/**
	 * @desc    创建退货
	 * @param   {Number|String} orderId
	 * @param   {Number}        type    退货类型
	 * @param   {String}        comment  备注
	 * @param   {String}        jsonStr
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1093}
	 * @todo    接口中心没有 jsonStr 参数，但有 orderItemJson 参数，疑似为一个
	 * @todo    整理参数
	 * */
	return(orderId, type, comment, jsonStr){
		return this.getData('/publics/tgouOrder/return', {
			method: 'POST'
			, data: {
				orderId
				, type
				, comment
				, jsonStr
			}
		});
	}
	/**
	 * @desc    申请仲裁
	 * @param   {Number|String} returnRequestId
	 * @param   {String}        [comment='申请仲裁']
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	complain(returnRequestId, comment='申请仲裁'){
		return this.getData('/publics/tgouOrder/return/complain', {
			data: {
				returnRequestId
				, comment
			}
		});
	}
	/**
	 * @desc    退货同意，退货信息
	 * @param   {Number|String} returnRequestId
	 * @param   {String}        trackingNumber  快递单号
	 * @param   {String}        deliveryCompany 快递公司
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	addReturnInfo(returnRequestId, trackingNumber, deliveryCompany){
		return this.getData('/publics/tgouOrder/addReturnInfo', {
			method: 'POST'
			, data: {
				returnRequestId
				, trackingNumber
				, deliveryCompany
			}
		});
	}
	/**
	 * @desc    微信扫码支付接口
	 * @param   {Number|String} orderId
	 * @param   {String}        [openId]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2113}
	 * */
	wxScanPay(orderId, openId){
		let data = {
				orderId
			}
			, result
		;

		if( orderId ){

			if( openId ){
				data.openId = openId;
			}

			result = this.getData('/publics/tgouOrder/wxScanPay', {
				method: 'POST'
				, data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    添加撒娇礼订单
	 * @param   {String}    addOrderRequest
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2855}
	 * @todo    页面中调用了一次，但被注释掉了，取消？
	 * */
	addCrowdRecordOrder(addOrderRequest){
		return this.getData('/publics/tgouOrder/addCrowdRecordOrder', {
			method: 'POST'
			, data: {
				addOrderRequest
			}
		});
	}
	/**
	 * @desc    订单取消原因查询
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2943}
	 * */
	cancelReasons(){
		return this.getData('/publics/tgouOrder/cancelReasons');
	}
	/**
	 * @desc    订单取消日志
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2947}
	 * */
	cancelLogs(orderId){
		return this.getData('/publics/tgouOrder/cancel/logs', {
			data: {
				orderId
			}
		});
	}

	/**
	 * @desc    查询优惠信息，订单确认，查询优惠信息
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2609}
	 * */
	calculate(products){
		return this.getData('/publics/shippingFee/calculate', {
			method: 'POST'
			, data: {
				products
			}
		});
	}

	/**
	 * @desc    将商品添加到购物车
	 * @param   {Number|String}     activityProductId   商品 id
	 * @param   {Number}            quantity    商品数量
	 * @param   {Number|String}     skuId
	 * @param   {Number}            source      门店类型
	 * @param   {Number|String}     fkStoreId
	 * @param   {Boolean}           [onshelfType=false]
	 * @param   {Number|String}     [fxStoreId] 分销fxStoreId
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2681}
	 * */
	addShopCart(activityProductId, quantity, skuId, source, fkStoreId, onshelfType=false, fxStoreId){
		let data = {
				activityProductId
				, quantity
				, skuId
				, source
				, fkStoreId
			}
			;

		data.onshelfType = onshelfType ? 1 : '';
		fxStoreId && (data.fxStoreId = fxStoreId);

		return this.getData('/publics/shopCart/add', {
			method: 'POST'
			, data
		});
	}

	/**
	 * @desc    购物车下单
	 * @param   {String}    addOrderRequest 值为一个对象的序列号（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	cartCommit(addOrderRequest){
		return this.getData('/publics/shopCart/cartCommit', {
			method: 'POST'
			, data: {
				addOrderRequest
			}
		});
	}
	/**
	 * @desc    更新数量
	 * @param   {Number|String} id          商品 id
	 * @param   {Number}        quantity    数量
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * @todo    页面中使用了同步请求
	 * */
	updateQty(id, quantity){
		return this.getData('/publics/shopCart/updateQty', {
			method: 'POST'
			, data: {
				id
				, quantity
			}
		});
	}
	/**
	 * @desc    删除购物车数据
	 * @param   {String}    idSetStr    商品 id 数组组成的字符串
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    页面中使用了同步请求
	 * */
	delete(idSetStr){
		return this.getData('/publics/shopCart/delete', {
			method: 'POST'
			, data: {
				idSetStr
			}
		});
	}
	/**
	 * @desc    购物车数量
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=437}
	 * */
	shopCartProductQty(){
		return this.getData('/publics/shopCart/shopCartProductQty');
	}
	/**
	 * @desc    购物车列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=553}
	 * */
	cartList(){
		return this.getData('/publics/shopCart/cartList', {
			method: 'POST'
		});
	}
	/**
	 * @desc    购物车确认订单页
	 * @param   {String}    idSetStr    购物车id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=555}
	 * */
	cartOrder(idSetStr){
		return this.getData('/publics/shopCart/cartOrder', {
			method: 'POST'
			, data: {
				idSetStr
			}
		});
	}

	/**
	 * @desc    物流信息
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	getByOrderId(orderId){
		return this.getData('/publics/delivery/getByOrderId', {
			data: {
				orderId
			}
		});
	}
	/**
	 * @desc    未知接口
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * @todo    页面中没有调用到，取消？
	 * */
	getByPackageId(){
		return this.getData('/publics/delivery/getByPackageId');
	}

	/**
	 * @desc    银联发送短信
	 * @param   {Number}        amount          支付金额
	 * @param   {Number|String} memberbandId
	 * @param   {Number}        type            8.银联分期，10.银联快捷
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1419}
	 * @todo    页面中没有调用到，取消？
	 * */
	sendSmsCode(amount, memberbandId, type){
		return this.getData('/publics/memberBank/sendSmsCode', {
			data: {
				amount
				, memberbandId
				, type
			}
		});
	}

	/**
	 * @desc    加载订单数据
	 * @param   {Number|String} serveOrderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	serveOrderQuery(serveOrderId){
		return this.getData('/serveOrder/query/by/id', {
			method: 'POST'
			, data: {
				serveOrderId
			}
		});
	}

	/**
	 * @desc    电子下单
	 * @param   {String}    addOrderRequest     商品信息的序列号（JSON.stringify）
	 * @param   {String}    [global='webapp']   全局环境
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	elecOrderAdd(addOrderRequest, global='webapp'){
		return this.getData('/elecOrder/add', {
			method: 'POST'
			, data: {
				addOrderRequest
				, global
			}
		});
	}
	/**
	 * @desc    查询优惠信息
	 * @param   {Number|String} serveOrderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @todo    接口中心未查到
	 * */
	queryDiscount(serveOrderId){
		return this.getData('/elecOrder/query/discount', {
			method: 'POST'
			, data: {
				serveOrderId
			}
		});
	}

	/**
	 * @desc    返回域名拼装 url
	 * @param   {String}    path    路径，以 / 开头
	 * @return  {String}
	 * */
	returnUrl(path){
		return this._config.baseUrl + path;
	}
}

Model.register('order', OrderServiceModel);

export default OrderServiceModel;