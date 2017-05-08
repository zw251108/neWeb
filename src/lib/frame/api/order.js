'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../runtime/domain.js';

/**
 * @class
 * @classdesc   订单业务模块，线上环境二级域名 orderserver，测试环境三级域名 oser，在 Model.factory 工厂方法注册为 order，将可以使用工厂方法生成
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
	// 	return this.setData('/publics/tgouOrder/newPreOrder', {
	// 		data: {
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
	 * @summary 获取下单所用数据，订单确认
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @param   {Number|String} fxStoreId   分销 storeId
	 * @param   {Number}        JR
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/preOrder]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3163}
	 * */
	preOrder(from, products, fxStoreId, JR){
		return this.setData('/publics/tgouOrder/preOrder', {
			data: {
				from
				, products
				, fxStoreId
				, JR
			}
		});
	}
	/**
	 * @summary 验证限购数
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @param   {Number|String} fxStoreId   分销 storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/validate]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3337}
	 * */
	validate(from, products, fxStoreId){
		return this.setData('/publics/tgouOrder/validate', {
			data: {
				from
				, products
				, fxStoreId
			}
		});
	}
	/**
	 * @summary 订单确认页 - 查询优惠信息
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/promotions]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3339}
	 * */
	promotions(products){
		return this.setData('/publics/tgouOrder/promotions', {
			data: {
				products
			}
		});
	}
	/**
	 * @summary 老版本下单接口
	 * @param   {String}    addOrderRequest 商品数组数据序列化（JSON.stringify）
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/addOrder]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @todo    接口中心未查到
	 * */
	addOrder(addOrderRequest){
		return this.setData('/publics/tgouOrder/addOrder', {
			data: {
				addOrderRequest
			}
		});
	}
	/**
	 * @summary 下订单
	 * @param   {Number}        from        订单来源，1:立即购买，2:购物车，3:服务单
	 * @param   {String}        products    商品数组数据序列化（JSON.stringify）
	 * @param   {String}        orderOption 支付方式、提货方式数据序列化（JSON.stringify）
	 * @param   {Number|String} fxStoreId   分销 storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3195}
	 * @todo    使用防黄牛机制
	 * */
	add(from, fxStoreId, products, orderOption){
		return this.setData('/publics/tgouOrder/add', {
			data: {
				from
				, fxStoreId
				, products
				, orderOption
			}
		});
	}
	/**
	 * @summary 订单列表
	 * @param   {Array}     stateSet                订单状态，Waiting,Pending,Processing,Shipping,PointShipped,End,Returned
	 * @param   {String}    orderColumn             值为 id
	 * @param   {String}    orderType               值为 desc
	 * @param   {Object}    [options={}]            分页参数
	 * @param   {Number}    [options.startNum=0]
	 * @param   {Number}    [options.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3419}
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

		return this.setData('/publics/tgouOrder/list', {
			data
		});
	}
	/**
	 * @summary 订单详情
	 * @param   {Number|String} id          订单号
	 * @param   {Boolean}       [supplier]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/detail]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3261}
	 * */
	detail(id, supplier){
		let data = {
				id
			}
			;

		if( supplier ){
			data.supplier = supplier;
		}

		return this.setData('/publics/tgouOrder/detail', {
			data
		});
	}
	/**
	 * @summary 订单详情
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/payOrderInfo]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3181}
	 * */
	payDetail(orderId){
		return this.setData('/publics/tgouOrder/payOrderInfo', {
			data: {
				orderId
			}
		});
	}
	/**
	 * @summary 支付成功订单信息查询接口
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    与 payDetail 调用相同接口，调整为内部调用 payDetail
	 * @see     [payDetail]{@link OrderServiceModel#payDetail}
	 * */
	prePayOrderInfo(orderId){
		return this.payDetail( orderId );
	}
	/**
	 * @summary 取消订单
	 * @param   {Number|String} id          订单 id
	 * @param   {Number|String} [reasonId]  取消原因 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/cancel]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1091}
	 * */
	cancel(id, reasonId){
		let data = {
				id
			}
		;

		if( reasonId ){
			data.reasonId = reasonId;
		}

		return this.setData('/publics/tgouOrder/cancel', {
			data
		});
	}
	/**
	 * @summary 订单完成
	 * @param   {Number|String} id  订单 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/end]
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
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/waitings]
	 * @todo    接口中心未查到
	 * */
	waitings(){
		return this.getData('/publics/tgouOrder/waitings');
	}
	/**
	 * @summary 订单支付
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
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/pay]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2809}
	 * @todo    bizNumber 参数后边有注释“这个是什么鬼”。。。
	 * @todo    整理参数
	 * */
	pay(data){
		return this.setData('/publics/tgouOrder/pay', {
			data
		});
	}
	/**
	 * @summary 退货详情
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/stateLog]
	 * @todo    接口中心未查到
	 * */
	stateLog(orderId){
		return this.setData('/publics/tgouOrder/stateLog', {
			data: {
				orderId
			}
		});
	}
	/**
	 * @summary 创建退货
	 * @param   {Number|String} orderId
	 * @param   {Number}        type    退货类型
	 * @param   {String}        comment  备注
	 * @param   {String}        jsonStr
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/return]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1093}
	 * @todo    接口中心没有 jsonStr 参数，但有 orderItemJson 参数，疑似为一个
	 * @todo    整理参数
	 * */
	return(orderId, type, comment, jsonStr){
		return this.setData('/publics/tgouOrder/return', {
			data: {
				orderId
				, type
				, comment
				, jsonStr
			}
		});
	}
	/**
	 * @summary 申请仲裁
	 * @param   {Number|String} returnRequestId
	 * @param   {String}        [comment='申请仲裁']
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/return/complain]
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
	 * @summary 退货同意，退货信息
	 * @param   {Number|String} returnRequestId
	 * @param   {String}        trackingNumber  快递单号
	 * @param   {String}        deliveryCompany 快递公司
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/addReturnInfo]
	 * @todo    接口中心未查到
	 * */
	addReturnInfo(returnRequestId, trackingNumber, deliveryCompany){
		return this.setData('/publics/tgouOrder/addReturnInfo', {
			data: {
				returnRequestId
				, trackingNumber
				, deliveryCompany
			}
		});
	}
	/**
	 * @summary 微信扫码支付接口
	 * @param   {Number|String} orderId
	 * @param   {String}        [openId]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/wxScanPay]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2113}
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

			result = this.setData('/publics/tgouOrder/wxScanPay', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 添加撒娇礼订单
	 * @param   {String}    addOrderRequest
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/addCrowdRecordOrder]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2855}
	 * @todo    页面中调用了一次，但被注释掉了，取消？
	 * */
	addCrowdRecordOrder(addOrderRequest){
		return this.setData('/publics/tgouOrder/addCrowdRecordOrder', {
			data: {
				addOrderRequest
			}
		});
	}
	/**
	 * @summary 订单取消原因查询
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/cancelReasons]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2943}
	 * */
	cancelReasons(){
		return this.getData('/publics/tgouOrder/cancelReasons');
	}
	/**
	 * @summary 订单取消日志
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/tgouOrder/cancel/logs]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2947}
	 * */
	cancelLogs(orderId){
		return this.getData('/publics/tgouOrder/cancel/logs', {
			data: {
				orderId
			}
		});
	}
	/**
	 * @summary 获得会员用户当前可用的线上的优惠券
	 * @param   {Number|String} counterId
	 * @param   {Number|String} storeId
	 * @param   {Number}        productAccount
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oserv.test.66buy.com.cn/publics/tgouOrder/getUsableCouponItems]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3759}
	 * */
	getUsableCouponItems(counterId, storeId, productAccount){
		return this.setData('/publics/tgouOrder/getUsableCouponItems', {
			data: {
				counterId
				, storeId
				, productAccount
			}
		});
	}

	/**
	 * @summary 查询优惠信息，订单确认，查询优惠信息
	 * @param   {String}    products    商品数组数据序列化（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shippingFee/calculate]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2609}
	 * */
	calculate(products){
		return this.setData('/publics/shippingFee/calculate', {
			data: {
				products
			}
		});
	}

	/**
	 * @summary 将商品添加到购物车
	 * @param   {Number|String}     activityProductId   商品 id
	 * @param   {Number}            quantity    商品数量
	 * @param   {Number|String}     skuId
	 * @param   {Number}            source      门店类型
	 * @param   {Number|String}     fkStoreId
	 * @param   {Boolean}           [onshelfType=false]
	 * @param   {Number|String}     [fxStoreId] 分销fxStoreId
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2681}
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

		return this.setData('/publics/shopCart/add', {
			data
		});
	}

	/**
	 * @summary 购物车下单
	 * @param   {String}    addOrderRequest 值为一个对象的序列号（JSON.stringify）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/cartCommit]
	 * @todo    接口中心未查到
	 * */
	cartCommit(addOrderRequest){
		return this.setData('/publics/shopCart/cartCommit', {
			data: {
				addOrderRequest
			}
		});
	}
	/**
	 * @summary 更新数量
	 * @param   {Number|String} id          商品 id
	 * @param   {Number}        quantity    数量
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/updateQty]
	 * @todo    接口中心未查到
	 * @todo    页面中使用了同步请求
	 * */
	updateQty(id, quantity){
		return this.setData('/publics/shopCart/updateQty', {
			data: {
				id
				, quantity
			}
		});
	}
	/**
	 * @summary 删除购物车数据
	 * @param   {String}    idSetStr    商品 id 数组组成的字符串
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/delete]
	 * @todo    页面中使用了同步请求
	 * */
	delete(idSetStr){
		return this.setData('/publics/shopCart/delete', {
			data: {
				idSetStr
			}
		});
	}
	/**
	 * @summary 购物车数量
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/shopCartProductQty]{@link http://dev.51tiangou.com/interfaces/detail.html?id=437}
	 * */
	shopCartProductQty(){
		return this.getData('/publics/shopCart/shopCartProductQty');
	}
	/**
	 * @summary 购物车列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/cartList]{@link http://dev.51tiangou.com/interfaces/detail.html?id=553}
	 * */
	cartList(){
		return this.setData('/publics/shopCart/cartList');
	}
	/**
	 * @summary 购物车确认订单页
	 * @param   {String}    idSetStr    购物车id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/publics/shopCart/cartOrder]{@link http://dev.51tiangou.com/interfaces/detail.html?id=555}
	 * */
	cartOrder(idSetStr){
		return this.setData('/publics/shopCart/cartOrder', {
			data: {
				idSetStr
			}
		});
	}

	/**
	 * @summary 物流信息
	 * @param   {Number|String} orderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/delivery/getByOrderId]
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
	 * @summary 未知接口
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/delivery/getByPackageId]
	 * @todo    接口中心未查到
	 * @todo    页面中没有调用到，取消？
	 * */
	getByPackageId(){
		return this.getData('/publics/delivery/getByPackageId');
	}

	/**
	 * @summary 银联发送短信
	 * @param   {Number}        amount          支付金额
	 * @param   {Number|String} memberbandId
	 * @param   {Number}        type            8.银联分期，10.银联快捷
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @see     [http://oser.test.66buy.com.cn/publics/memberBank/sendSmsCode]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1419}
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
	 * @summary 加载订单数据
	 * @param   {Number|String} serveOrderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/serveOrder/query/by/id]
	 * @todo    接口中心未查到
	 * */
	serveOrderQuery(serveOrderId){
		return this.setData('/serveOrder/query/by/id', {
			data: {
				serveOrderId
			}
		});
	}

	/**
	 * @summary 电子下单
	 * @param   {String}    addOrderRequest     商品信息的序列号（JSON.stringify）
	 * @param   {String}    [global='webapp']   全局环境
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/elecOrder/add]
	 * @todo    接口中心未查到
	 * */
	elecOrderAdd(addOrderRequest, global='webapp'){
		return this.setData('/elecOrder/add', {
			data: {
				addOrderRequest
				, global
			}
		});
	}
	/**
	 * @summary 查询优惠信息
	 * @param   {Number|String} serveOrderId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://oser.test.66buy.com.cn/elecOrder/query/discount]
	 * @todo    接口中心未查到
	 * */
	queryDiscount(serveOrderId){
		return this.setData('/elecOrder/query/discount', {
			data: {
				serveOrderId
			}
		});
	}

	/**
	 * @summary 返回域名拼装 url
	 * @param   {String}    path    路径，以 / 开头
	 * @return  {String}
	 * */
	returnUrl(path){
		return this._config.baseUrl + path;
	}
}

Model.register('order', OrderServiceModel);

export default OrderServiceModel;