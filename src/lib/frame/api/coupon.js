'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   coupon 业务模块，二/三级域名 coupon，在 Model.factory 工厂方法注册为 coupon，将可以使用工厂方法生成
 * @extends     ServiceModel
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
	 * @summary 获取某个用户满平分活动的资格记录
	 * @param   {Number|String} activityId  活动 id
	 * @param   {Number|String} memberId    用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/qc/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2377}
	 * */
	activityQcList(activityId, memberId){
		return this.getData('/publics/activity/qc/list', {
			data: {
				activityId
				, memberId
			}
		});
	}
	/**
	 * @summary 获取某个用户满平分活动的资格记录（不分页）
	 * @param   {Number|String} activityId
	 * @param   {Number|String} memberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 activityQcList 调用相同接口，整理为内部调用 activityQcList
	 * @see     [activityQcList]{@link CouponServiceModel#activityQcList}
	 * */
	getOlympicUActUserQcList(activityId, memberId){
		return this.activityQcList(activityId, memberId);
	}
	/**
	 * @summary 获取品活动的优惠规则
	 * @param   {Number|String} activityId  活动 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/rule/get]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2375}
	 * */
	activityRuleGet(activityId){
		return this.setData('/publics/activity/rule/get', {
			data: {
				activityId
			}
		});
	}
	/**
	 * @summary 获取品活动的优惠规则
	 * @param   {Number|String} activityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 activityRuleGet 调用相同接口，调整为内部调用 activityRuleGet
	 * @see     [activityRuleGet]{@link CouponServiceModel#activityRuleGet}
	 * */
	getOlympicActRule(activityId){
		return this.activityRuleGet(activityId);
	}
	/**
	 * @summary 查询活动券
	 * @param   {Number|String} activityId
	 * @param   {Number|String} cityId
	 * @param   {Number|String} source
	 * @param   {Boolean}       [isEffective=true]
	 * @param   {Number}        [pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/coupon/list]
	 * @todo    接口中心未查到
	 * */
	getActivityCoupon(activityId, cityId, source, isEffective=true, pageCount=999){
		return this.getData('/publics/activity/coupon/list', {
			data: {
				activityId
				, cityId
				, source
				, isEffective
				, pageCount
			}
		});
	}
	/**
	 * @summary 活动查询
	 * @param   {Object}        data
	 * @param   {Number|String} [data.cityId]
	 * @param   {Number|String} [data.storeIds]
	 * @param   {Number|String} [data.advertiseId]      值为 5306
	 * @param   {Number|String} [data.brandIds]
	 * @param   {Number|String} [data.types]
	 * @param   {Number}        [data.source]
	 * @param   {Boolean}       [data.ignoreShowType]   值为 true
	 * @param   {Number}        [data.startNum]
	 * @param   {Number}        [data.pageCount]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    cityId 和 storeIds 必须存一个
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/search]{@link http://dev.51tiangou.com/interfaces/detail.html?id=927}
	 * */
	activeSearch(data){
		let result
		;

		if( (data.cityId && validate.isInteger(data.cityId)) || (data.storeIds && validate.checkNumberListFormat(data.storeIds)) ){
			result = this.getData('/publics/activity/search', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 根据活动 id 查询
	 * @param   {Number|String} activityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/detail]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1029}
	 * @todo    页面中使用了同步请求
	 * */
	activeDetail(activityId){
		let result
		;

		if( activityId && validate.isInteger(activityId) ){
			result = this.getData('/publics/activity/detail', {
				data: {
					activityId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 百货限时抢，头部图片
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/rob]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1333}
	 * */
	activityRob(){
		return this.getData('/publics/activity/rob');
	}
	/**
	 * @summary 根据自定义类型查询商品
	 * @param   {Number|String} customType  自定义活动
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/customActivityProducts]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1481}
	 * */
	customActivityProducts(customType, options={}){
		let data = {
				customType
			}
		;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/publics/activity/customActivityProducts', {
			data
		});
	}
	/**
	 * @summary 会员专享，活动 id
	 * @param   {Number|String} cityId
	 * @param   {Number}        [advertiseId=5374]  5374 为固定值
	 * @param   {Number}        [startNum=0]
	 * @param   {Number}        [pageCount=20]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/subjectProduct]
	 * @todo    接口中心未查到
	 * @todo    疑似 {@link http://dev.51tiangou.com/interfaces/detail.html?id=1089}
	 * */
	subjectProduct(cityId, advertiseId=5374, startNum=0, pageCount=20){
		return this.getData('/publics/activity/subjectProduct', {
			data: {
				cityId
				, advertiseId
				, startNum
				, pageCount
			}
		});
	}
	/**
	 * @summary 超市改版活动新增页面 - 通过专题 id 获取活动下活动品
	 * @param   {Number|String} advertiseId 专题 id
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/adve/product]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2001}
	 * */
	queryAdvProduct(advertiseId, storeId, options={}){
		let data = {
				advertiseId
				, storeId
			}
			, result
		;

		if( advertiseId ){

			data.startNum = options.startNum || 0;
			data.pageCount = options.pageCount || 10;

			result = this.getData('/publics/activity/adve/product', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 跨境商品活动联查
	 * @param   {Number|String} customType  自定义活动
	 * @param   {Number}        [startNum]
	 * @param   {Number}        [pageCount]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/customActivity]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1111}
	 * */
	customActivity(customType, startNum, pageCount){
		let data = {
				customType
			}
		;

		if( startNum && pageCount ){
			data.startNum = startNum;
			data.pageCount = pageCount;
		}

		return this.getData('/publics/activity/customActivity', {
			data
		});
	}

	/**
	 * @summary 超市改版，专题活动查询地址
	 * @param   {Number|String} advertiseId 专题 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/adve/coupon]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1995}
	 * */
	getSupermarketAdvertise(advertiseId){
		return this.getData('/publics/activity/adve/coupon', {
			data: {
				advertiseId
			}
		});
	}
	/**
	 * @summary 限时抢商品查询
	 * @param   {Number|String} advertiseId
	 * @param   {Number|String} storeId
	 * @param   {Number}        state                   查询状态，1.进行中,2.未开始,3.同时
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/activity/item/hot]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3271}
	 * */
	QiangItem(advertiseId, storeId, state, options={}){
		let data = {
				advertiseId
				, storeId
				, state
			}
		;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/publics/activity/item/hot', {
			data
		});
	}


	/**
	 * 根据优惠券号 id 获取优惠券详情
	 * @param   {Number|String} id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/get]{@link http://dev.51tiangou.com/interfaces/detail.html?id=20}
	 * */
	get(id){
		let result
			;

		if( id ){
			result = this.getData('/publics/couponCode/get', {
				data: {
					id
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 分页查询我的优惠券
	 * @param   {Number|String} [useTag=4]  1.未使用，2.已使用，3.已过期，4.即将过期
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=21}
	 * */
	query(useTag=4){
		return this.getData('/publics/couponCode/query', {
			data: {
				useTag
			}
		});
	}
	/**
	 * @summary 分页查询优惠券
	 * @param   {Object}        data
	 * @param   {Number|String} [data.cityId]
	 * @param   {Number|String} [data.couponId]
	 * @param   {String}        [data.couponName]       优惠券名称，全匹配
	 * @param   {Number|String} [data.brandIds]
	 * @param   {Number|String} [data.storeIds]
	 * @param   {Number|String} [data.activityId]       值为 -1
	 * @param   {Number}        [data.source]           业态，值为 1
	 * @param   {String}        [data.couponState]      值为 'processing'
	 * @param   {Number|String} [data.couponTypes]      优惠券类型，逗号分隔的数字列表
	 * @param   {Number}        [data.whichOrder]       1.距离排序，2.时间排序
	 * @param   {Number|String} [data.longitude]        经度
	 * @param   {Number|String} [data.latitude]         纬度
	 * @param   {Number}        [data.payType]          值为 1,2
	 * @param   {Boolean}       [data.isEffective]      值为 true
	 * @param   {Boolean}       [data.isGift]           值为 false
	 * @param   {String}        [data.excCouponName]    优惠券不包含名称，值为 '会员尊享'
	 * @param   {Number}        [data.isOneIntegrate]   值为 0,1
	 * @param   {Number}        [data.startNum]
	 * @param   {Number}        [data.pageCount]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    cityId storeIds (二者必选其中之一)
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/search]{@link http://dev.51tiangou.com/interfaces/detail.html?id=25}
	 * @todo    参数太多，精简
	 * */
	search(data){
		let result
		;

		if( (data.cityId && validate.isInteger(data.cityId)) || (data.storeIds && validate.checkNumberListFormat(data.storeIds)) ){
			result = this.getData('/publics/couponCode/search', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 获取优惠券品牌
	 * @param   {Number|String} cityId
	 * @param   {String}        couponState             券状态，进行中 processing，未开始 toStart
	 * @param   {Number|String} [source=1]              1.百货，2.超市
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.storeIds]
	 * @param   {String}        [options.couponTypes]   券类型
	 * @param   {Number}        [options.payType]       0.普通券，1.积分券
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/queryBrands]{@link http://dev.51tiangou.com/interfaces/detail.html?id=63}
	 * */
	queryBrands(cityId, couponState, source=1, options={}){
		let data = {
				cityId
				, couponState
				, source
			}
			, result
		;

		if( couponState && source ){

			if( 'storeIds' in options ){
				data.storeIds = options.storeIds;
			}

			if( 'couponTypes' in options ){
				data.couponTypes = options.couponTypes;
			}

			data.startNum = options.startNum || 0;
			data.pageCount = options.pageCount || 999;

			result = this.getData('/publics/couponCode/queryBrands', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 领取优惠券
	 * @param   {Number|String} couponId
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} options.storeId
	 * @param   {Number|String} options.cardId      积分支付门店会员卡号
	 * @param   {Number|String} options.amount      支付金额
	 * @param   {Number}        [options.source]
	 * @param   {Number}        [options.paytype]   目前只有值为 1
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    options 可以不传，但传了，就必须有 cardId,storeId,amount 参数，source 和 paytype 要同时有，使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=23}
	 * @todo    页面中使用了同步请求
	 * @todo    使用防黄牛机制
	 * */
	add(couponId, options={}){
		let data = {
				couponId
			}
			;

		if( 'cardId' in options && 'storeId' in options && 'amount' in options ){

			data.cardId = options.cardId;
			data.storeId = options.storeId;
			data.amount = options.amount;

			if( 'source' in options && 'paytype' in options ){

				data.source = options.source;
				data.paytype = options.paytype;
			}
		}

		return this.setData('/publics/couponCode/add', {
			data
		});
	}
	/**
	 * @summary 领取优惠券
	 * @param   {Number|String} couponId
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} options.storeId
	 * @param   {Number|String} options.cardId      积分支付门店会员卡号
	 * @param   {Number|String} options.amount      支付金额
	 * @param   {Number}        [options.source]
	 * @param   {Number}        [options.paytype]   目前只有值为 1
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 add 调用相同接口，调整为内部调用 add
	 * @see     [add]{@link CouponServiceModel#add}
	 * @todo    与 add 取其一
	 * */
	/**
	 * @summary 领取新鲜不过夜优惠券
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/addFresh]{@link http://dev.51tiangou.com/interfaces/detail.html?id=24}
	 * @todo    使用防黄牛机制
	 * */
	addFresh(){
		return this.setData('/publics/couponCode/addFresh');
	}
	/**
	 * @summary 零积分兑换券，
	 * @param   {Number|String} couponId
	 * @param   {Number|String} cardId
	 * @param   {Number|String} storeId
	 * @param   {Number|String} amount
	 * @param   {Number}        source
	 * @param   {Number}        [paytype=1]     目前只有值为 1
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/couponCode/evipAdd]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2541}
	 * @todo    页面中使用了同步请求
	 * */
	addZeroCoupon(couponId, cardId, storeId, amount, source, paytype=1){
		return this.setData('/publics/couponCode/evipAdd', {
			data: {
				couponId
				, cardId
				, storeId
				, amount
				, source
				, paytype
			}
		});
	}

	/**
	 * @summary 活动商品列表
	 * @param   {Object}        data
	 * @param   {Number|String} [data.cityId]
	 * @param   {Number|String} [data.storeIds]         门店 id 集合
	 * @param   {Number|String} [data.brandsIds]        品牌 id 集合
	 * @param   {Number|String} [data.activityId]
	 * @param   {Number|String} [data.activityType]     值为 10,11
	 * @param   {Number}        [data.priceFrom]        价格区间-起始价格
	 * @param   {Number}        [data.priceTo]          价格区间-结束价格
	 * @param   {Number|String} [data.types]            营销商品类型，值为 10
	 * @param   {Number}        [data.source]           业态，值为 0 到 5，1.百货，2.超市，3.有机，4.海外 1
	 * @param   {Number|String} [data.categoryCode]     分类 code
	 * @param   {Boolean}       [data.cache]            是否使用缓存
	 * @param   {Number|String} [data.clickIndex]       组，值不为 '0' 或值为 6
	 * @param   {Number}        [data.pageCount]        值为 99
	 * @param   {String}        [data.orderColumn]      排序字段，值为 'ap.sort_order','price'
	 * @param   {String}        [data.orderType]        排序方式，值为 'DESC' 或 'ASC'
	 * @param   {Boolean}       [data.indexSort]        值为 true
	 * @param   {Number}        [data.isPre]            值为 1
	 * @param   {Number}        [data.day]              值为 20
	 * @param   {Number}        [data.startNum]
	 * @param   {Number}        [data.pageCount]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    对返回的数据补全已售数量
	 * @see     [http://coupon.test.66buy.com.cn/front/listing/searchByActivity]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1239}
	 * @todo    页面中使用了同步请求
	 * */
	activityList(data){

		if( data.storeId && !validate.checkNumberListFormat(data.storeId) ){
			delete data.storeId;
		}

		return this.getData('/front/listing/searchByActivity', {
			data
		}).then(function(data){
			(validate.isObject( data ) ? data.productList || [] : data).forEach((d)=>{
				if( !d.solidQty ){
					d.solidQty = 0;
				}
			});

			return data;
		});
	}
	/**
	 * @summary 超市大放送商品
	 * @param   {Number|String} cityId
	 * @param   {Number|String} storeIds
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/front/listing/superMarkerSales]
	 * @todo    接口中心未查到
	 * */
	marketSales(cityId, storeIds, options={}){
		let data = {
				cityId
			}
			;

		if( storeIds && validate.checkNumberListFormat(storeIds) ){
			data.storeIds = storeIds
		}

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/front/listing/superMarkerSales', {
			data
		});
	}
	/**
	 * @summary 抢（跨境频道用）
	 * @param   {Number|String} activityId
	 * @param   {Number}        source      1 或 4
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.cityId]
	 * @param   {Number}        [options.isNext]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    实际并不是跨境频道专用，在 farm 和 oversea 下都只传 activityId 和 source，source 都为 4；在 mall 下还传了 cityId,isNext，source 为 1
	 * @see     [http://coupon.test.66buy.com.cn/front/listing/nextRoundRob]
	 * @todo    接口中心未查到
	 */
	qiangOverseas(activityId, source, options){
		let data = {
				source
			}
		;

		if( validate.isInteger(activityId) ){
			data.activityId = activityId;
		}
		if( options.cityId ){
			data.cityId = options.cityId;
		}
		if( options.isNext ){
			data.isNext = options.isNext;
		}

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/front/listing/nextRoundRob', {
			data
		});
	}
	/**
	 * 抢，与 qiangOverseas 调用相同接口但传参不同
	 * @param   {Number|String} cityId
	 * @param   {Number}        [isNext=0]
	 * @param   {Number}        [pageCount=3]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/front/listing/nextRoundRob]
	 * @todo    接口中心未查到
	 * */
	qiang(cityId, isNext=0, pageCount=3){
		return this.getData('/front/listing/nextRoundRob', {
			data: {
				cityId
				, isNext
				, pageCount
			}
		});
	}
	/**
	 * @summary 抢（下一轮抢，通用）
	 * @param   {Number|String} activityId
	 * @param   {Number}        source                  1 或 4
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.cityId]        在 mall 下传
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/front/listing/nextNotStartRoundRob]
	 * @todo    接口中心未查到
	 * */
	qiangNextRound(activityId, source, options={}){
		let data = {
				activityId
				, source
			}
			, result
			;

		if( options.cityId ){
			data.cityId = options.cityId;
		}

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		if( validate.isInteger(activityId) ){
			result = this.getData('/front/listing/nextNotStartRoundRob', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

	/**
	 * @summary 获取优惠券详情
	 * @param   {Number|String} couponId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/coupon/detail]{@link http://dev.51tiangou.com/interfaces/detail.html?id=22}
	 * */
	detail(couponId){
		return this.getData('/publics/coupon/detail', {
			data: {
				couponId
			}
		});
	}
	/**
	 * @summary 通过店铺和专柜查询当前能够领取的优惠券
	 * @param   {Number|String} storeId
	 * @param   {Number|String} counterId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/coupon/scQuery]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2413}
	 * */
	queryByCounter(storeId, counterId){
		return this.getData('/publics/coupon/scQuery', {
			data: {
				storeId
				, counterId
			}
		});
	}
	/**
	 * @summary 通过券 id 获取能够使用该券的营销商品信息
	 * @param   {Number|String} couponId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/coupon/queryProduct]{@link http://dev.51tiangou.com/interfaces/detail.html?id=561}
	 * */
	queryProduct(couponId){
		return this.getData('/publics/coupon/queryProduct', {
			data: {
				couponId
			}
		});
	}

	/**
	 * @summary 首页轮播
	 * @param   {Number|String} cityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/tgAdvertise/index/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1023}
	 * */
	advIndexList(cityId){
		let result
			;

		if( cityId ){
			result = this.getData('/publics/tgAdvertise/index/list', {
				data: {
					cityId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary id 查询专题
	 * @param   {Number|String} id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/tgAdvertise/query]
	 * @todo    页面中使用了同步请求
	 * @todo    接口中心未查到
	 * */
	advQuery(id){
		let result
		;

		if( id ){
			result = this.getData('/publics/tgAdvertise/query', {
				data: {
					id
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 有机 跨境轮播
	 * @param   {Number|String} cityId
	 * @param   {Number}        source  3 或 4 或 5
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/tgAdvertise/supermarket/list]
	 * @todo    接口中心未查到
	 * */
	advSuperList(cityId, source){
		let result
		;

		if( cityId ){
			result = this.getData('/publics/tgAdvertise/supermarket/list', {
				data: {
					cityId
					, source
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

	/**
	 * @summary 广告位
	 * @param   {Number|String} cityId
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.storeId]
	 * @param   {Number}        [options.pageType]      页面 id，值为 2,3,4,5,7,11,12,13,14,15,16,17,18,,43
	 * @param   {Number}        [options.advModuleId]   值为 138,139
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/tgAd/advModule]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2941}
	 * @todo    原页面写有 pageType 需要修改
	 * */
	advModule(cityId, options={}){
		let data = {
				cityId
			}
			, result
			;

		if( cityId ){

			if( 'pageType' in options ){
				data.pageType = options.pageType;
			}
			if( 'storeId' in options ){
				data.storeId = options.storeId;
			}
			if( 'advModuleId' in options ){
				data.advModuleId = options.advModuleId;
			}

			result = this.getData('/publics/tgAd/advModule', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 门店级广告位
	 * @param   {Number|String} storeId
	 * @param   {Number}        [pageType=50]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/tgAd/store/advModule]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2619}
	 * */
	advStoreModule(storeId, pageType=50){
		return this.getData('/publics/tgAd/store/advModule', {
			data: {
				storeId
				, pageType
			}
		});
	}
	/**
	 * @summary 限时抢广告位
	 * @param   {Number|String} storeId
	 * @param   {Number|String} cityId
	 * @param   {Number}        pageType    值为 47 或 48
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/tgAd/bestModule]
	 * @todo    接口中心未查到
	 * */
	qiangAdvModule(storeId, cityId, pageType){
		return this.getData('/publics/tgAd/bestModule', {
			data: {
				storeId
				, cityId
				, pageType
			}
		});
	}

	/**
	 * @summary 根据活动 id 查询大转盘活动
	 * @param   {Number|String} activityId
	 * @param   {Number}        [activityType=7]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/lottery/mallLottery/queryByAdvertise]{@link http://dev.51tiangou.com/interfaces/detail.html?id=907}
	 * @todo    查接口存在 storeId 参数，用途？
	 * */
	lotteryQuery(activityId, activityType=7){
		let result
			;

		if( activityId && validate.isInteger(activityId) ){
			result = this.getData('/publics/lottery/mallLottery/queryByAdvertise', {
				data: {
					activityId
					, activityType
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 大转盘点击
	 * @param   {Number|String} activityId
	 * @param   {Number}        [activityType=7]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/lottery/mallLottery/hit]{@link http://dev.51tiangou.com/interfaces/detail.html?id=909}
	 * */
	lotteryHit(activityId, activityType=7){
		let result
			;

		if( activityId && validate.isInteger(activityId) ){
			result = this.getData('/publics/lottery/mallLottery/hit', {
				data: {
					activityId
					, activityType
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 我的奖品
	 * @param   {Number|String} activityId
	 * @param   {Number}        [activityType=7]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/lottery/mallLottery/myAward]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1077}
	 * */
	lotteryMyAward(activityId, activityType=7){
		let result
			;

		if( activityId && validate.isInteger(activityId) ){
			result = this.getData('/publics/lottery/mallLottery/myAward', {
				data: {
					activityId
					, activityType
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 中奖名单
	 * @param   {Number|String} activityId
	 * @param   {Number}        [activityType=7]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/lottery/winnerList]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1075}
	 * @todo    目前没有调用到，取消？
	 * */
	lotteryWinnerList(activityId, activityType=7){
		let result
			;

		if( activityId && validate.isInteger(activityId) ){
			result = this.getData('/publics/lottery/winnerList', {
				data: {
					activityId
					, activityType
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

	/**
	 * @summary 当前早晚市活动
	 * @param   {Number|String} cityId
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=3]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/supermarket/maemarket]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1411}
	 * */
	maemarket(cityId, storeId, options={}){
		let data = {
				cityId
				, storeId
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 3;

		return this.getData('/publics/supermarket/maemarket', {
			data
		});
	}
	/**
	 * @summary 下一场早晚市
	 * @param   {Number|String} cityId
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=3]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/supermarket/maemarket/next]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1461}
	 * */
	maemarketNext(cityId, storeId, options={}){
		let data = {
				cityId
				, storeId
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 3;

		return this.getData('/publics/supermarket/maemarket/next', {
			data
		});
	}
	/**
	 * @summary 一元抢活动
	 * @param   {Number|String} cityId
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/supermarket/yiyuan/detail]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1463}
	 * */
	yiyuan(cityId, storeId){
		return this.getData('/publics/supermarket/yiyuan/detail', {
			data: {
				cityId
				, storeId
			}
		});
	}

	/**
	 * @summary 分享语查询
	 * @param   {String}    objectId    分享页面/活动 id
	 * @param   {Number}    type        分享语类型
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://coupon.test.66buy.com.cn/publics/shareWord/queryShareWord]{@link http://dev.51tiangou.com/interfaces/detail.html?id=811}
	 * */
	queryShareWord(objectId, type){
		let data = {
				objectId
			}
			;

		if( type ){
			data.type = type;
		}

		return this.getData('/publics/shareWord/queryShareWord', {
			data
		});
	}
	/**
	 * @summary 微信分享
	 * @param   {String}    objectId
	 * @param   {Number}    type
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    实际为 queryShareWord 接口重命名
	 * @see     [queryShareWord]{@link CouponServiceModel#queryShareWord}
	 * @todo    与 queryShareWord 取其一
	 * */
	getDynamicWcShare(objectId, type){
		return this.queryShareWord(objectId, type);
	}

	/**
	 * @summary 根据传入的 url 根据绑定关系，映射到不同的地址
	 * @param   {String}    url 扫描二维码获得的网址
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://coupon.test.66buy.com.cn/publics/qr/route]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3259}
	 * */
	getQrUrl(url){
		return this.getData('/publics/qr/route', {
			data: {
				url
			}
		});
	}
}

Model.register('coupon', CouponServiceModel);

export default CouponServiceModel;