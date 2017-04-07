'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   Item 业务模块，在 Model.factory 工厂方法注册为 item，将可以使用工厂方法生成
 * @extends     ServiceModel
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
	 * @desc    商品列表，对返回的数据补全已售数量
	 * @param   {Object}        data
	 * @param   {Number|String} [data.cityId]
	 * @param   {Number|String} [data.counterId]
	 * @param   {Number|String} [data.storeId]
	 * @param   {Number|String} [data.storeIds]         门店 id 集合
	 * @param   {Number|String} [data.brandsIds]        品牌 id 集合
	 * @param   {Number|String} [data.activityId]
	 * @param   {Number}        [data.merchantId]       值为 -1 或 0
	 * @param   {String}        [data.searchName]       搜索词
	 * @param   {Number}        [data.priceFrom]        价格区间-起始价格
	 * @param   {Number}        [data.priceTo]          价格区间-结束价格
	 * @param   {Number|String} [data.types]            营销商品类型，值为 2.鲜，3.销，或为 '0,2,3'
	 * @param   {Number}        [data.source]           业态，值为 0 到 5，1.百货，2.超市，3.有机，4.海外
	 * @param   {Number}        [data.itemTag]          值为 1 或 3
	 * @param   {Number|String} [data.categoryHint]
	 * @param   {Number|String} [data.categoryCode]     分类 code
	 * @param   {Number|String} [data.topBizCategory]
	 * @param   {Number|String} [data.itemBizCategories]
	 * @param   {Boolean}       [data.currentCityOnly]  是否仅为当前城市，值为 true
	 * @param   {Boolean}       [data.cache]            是否使用缓存，值为 true
	 * @param   {Number|String} [data.clickIndex]       组，值不为 '0' 或值为 6
	 * @param   {Number}        [data.isDefault]        是否为综合 tab，当 orderColumn 为 'item_heat desc,start_time' 时为 1，否则为 0；还有其它判断规则
	 * @param   {String}        [data.orderColumn]      排序字段，值为 'item_heat desc,start_time','start_time','discount','item_heat desc,id','sold_qty','price','item_heat desc,sold_qty','sold_qty desc,start_time desc'
	 * @param   {String}        [data.orderType]        排序方式，值为 'DESC' 或 'ASC'
	 * @param   {Boolean}       [data.indexSort]        值为 true
	 * @param   {Number}        [data.showMore]         是否显示更多，值为 0 或 1
	 * @param   {Boolean}       [data.bottomTip]        值为 false
	 * @param   {Number}        [data.startNum]         值为 0
	 * @param   {Number}        [data.pageCount]        值为 4 或 6 或 8 或 24
	 * @param   {Number}        [data.pageNum]          接口中心没有该参数，疑似错误，值为 0
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=713}
	 * @todo    参数太多，精简
	 * */
	search(data){

		if( data.counterId && !validate.isInteger(data.counterId) ){
			delete data.counterId;
		}
		if( data.storeIds && !validate.checkNumberListFormat(data.storeIds) ){
			delete data.storeIds;
		}
		if( data.source && !/[0-5]/.test(data.source) ){
			delete data.source;
		}
		if( data.orderType && !validate.checkOrderType(data.orderType) ){
			delete data.orderType;
		}

		return this.getData('/front/listing/search', {
			data
		}).then(function(data){ // 补全已售数量
			(validate.isObject( data ) ? data.productList || [] : data).forEach((d)=>{
				if( !d.solidQty ){
					d.solidQty = 0;
				}
			});

			return data;
		});
	}
	/**
	 * @desc    活动商品列表
	 * @param   {Object}        data
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    对返回的数据补全已售数量
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1239}
	 * @todo    coupon 下有接口调用相同的路径
	 * @todo    目前没有调用到，取消？
	 * */
	activityList(data){

		if( data.storeId && !validate.checkNumberListFormat(data.storeId) ){
			delete data.storeId;
		}

		return this.getData('/front/listing/searchByActivity', {
			data
		}).then(function(data){ // 补全已售数量
			(validate.isObject( data ) ? data.productList || [] : data).forEach((d)=>{
				if( !d.solidQty ){
					d.solidQty = 0;
				}
			});

			return data;
		});
	}
	/**
	 * @desc    获取品牌
	 * @param   {Number|String} cityId
	 * @param   {Number}        pageCount
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	brandAll(cityId, pageCount=999){
		return this.getData('/front/listing/search/brand', {
			data: {
				cityId
				, pageCount
			}
		});
	}
	/**
	 * @desc    获取分类
	 * @param   {Object}        data
	 * @param   {Number|String} [data.storeId]
	 * @param   {Number|String} [data.storeIds]
	 * @param   {Number|String} [data.cityId]
	 * @param   {Number|String} [data.counterId]
	 * @param   {Number|String} [data.merchantId]
	 * @param   {Number}        [data.source]       值为 1,2
	 * @param   {Number}        [data.level]        值为 1
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	categoryCode(data){
		if( data.storeId && !validate.checkNumberListFormat(data.storeId) ){
			delete data.storeId;
		}

		return this.getData('/front/listing/search/categoryCode', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    虚拟货架商品分类查询
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * @todo    目前没有调用到，取消？
	 * */
	merchantCategoryCode(){
		return this.getData('/front/listing/search/merchant/categoryCode', {
			method: 'POST'
		});
	}
	/**
	 * @desc    获取品牌
	 * @param   {Number}    [needProduct=0]
	 * @param   {Number}    [startNum=0]
	 * @param   {Number}    [pageCount=999]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * @todo    应该还有其它参数
	 * */
	brand(needProduct=0, startNum=0, pageCount=999){
		return this.getData('/front/listing/search/order', {
			method: 'POST'
			, data: {
				needProduct
				, startNum
				, pageCount
			}
		});
	}
	/**
	 * @desc    加载商品数据
	 * @param   {Number|String} id  商品 id
	 * @param   {Number}        source  门店类型
	 * @param   {String}        [orderColumn='item_heat desc,sold_qty desc,start_time desc']
	 * @param   {String}        [orderType='DESC']
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
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
	/**
	 * @desc    商品列表（跨境吃货合并后的接口），猜测参数与 search 接口一致
	 * @param   {Object}        data
	 * @param   {Number|String} [data.storeIds]         门店 id 集合
	 * @param   {Number|String} [data.brandsIds]        品牌 id 集合
	 * @param   {Number}        [data.priceFrom]        价格区间-起始价格
	 * @param   {Number}        [data.priceTo]          价格区间-结束价格
	 * @param   {Number}        [data.source]           业态，值为 0 到 5，1.百货，2.超市，3.有机，4.海外
	 * @param   {Number|String} [data.codeName]         
	 * @param   {Number|String} [data.categoryCode]     分类 code
	 * @param   {Boolean}       [data.cache]            是否使用缓存，值为 true
	 * @param   {Number|String} [data.clickIndex]       组，值不为 '0' 或值为 4,6
	 * @param   {String}        [data.orderColumn]      排序字段，值为 'item_heat desc,start_time','start_time','discount','item_heat desc,id','sold_qty','price','item_heat desc,sold_qty','sold_qty desc,start_time desc'
	 * @param   {String}        [data.orderType]        排序方式，值为 'DESC' 或 'ASC'
	 * @param   {Number}        [data.startNum]
	 * @param   {Number}        [data.pageCount]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	searchMerge(data){

		if( data.counterId && !validate.isInteger(data.counterId) ){
			delete data.counterId;
		}
		if( data.storeIds && !validate.checkNumberListFormat(data.storeIds) ){
			delete data.storeIds;
		}
		if( data.source && !/[0-5]/.test(data.source) ){
			delete data.source;
		}
		if( data.orderType && !validate.checkOrderType(data.orderType) ){
			delete data.orderType;
		}

		return this.getData('/front/listing/overseaSearch', {
			data
		});
	}
	/**
	 * @desc    商品详情
	 * @param   {Number|String} id          商品 id
	 * @param   {Number|String} storeId
	 * @param   {Number|String} fxStoreId
	 * @param   {String}        jr
	 * @param   {Boolean}       isApp       是否为 APP
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=789}
	 * @todo    接口中心写 161019 废弃
	 * */
	detail(id, storeId, fxStoreId, jr, isApp){
		let data = {
				id
				, storeId
				, fxStoreId
				, jr
				, isApp
			}
			, result
			;

		if( id && validate.isInteger(id) ){
			if( storeId && !validate.checkNumberListFormat(storeId) ){
				delete data.storeId;
			}

			result = this.getData('/front/listing/detailInfo', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * 超市大放送商品
	 * @param   {Object}        data
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1241}
	 * @todo    coupon 下有接口调用相同的路径
	 * @todo    目前没有调用到，取消？
	 * */
	marketSales(data){

		if( data.storeIds && !validate.checkNumberListFormat(data.storeIds) ){
			delete data.storeIds;
		}

		return this.getData('/front/listing/superMarketSales', {
			data
		});
	}
	/**
	 * @desc    档期购
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1237}
	 * */
	basePromotion(storeId, options={}){
		let data = {
				storeId
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/front/listing/query/basePromotion', {
			data
		});
	}
	/**
	 * @desc    图文详情
	 * @param   {Number|String} productId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，如果未传参数会返回 []
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1235}
	 * */
	introduce(productId){
		let result
		;

		if( productId && validate.isInteger(productId) ){
			result = this.getData('/front/listing/query/detail', {
				data: {
					productId
				}
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
	
	/**
	 * @desc    抢，根据 cityId,storeId 下一轮抢的活动产品
	 * @param   {Number|String} cityId
	 * @param   {Number|String} storeId
	 * @param   {Number|String} activityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1243}
	 * @todo    目前没有调用到，取消？
	 * */
	qiang(cityId, storeId, activityId){
		return this.getData('/mallProduct/nextRoundRob', {
			data: {
				cityId
				, storeId
				, activityId
			}
		});
	}
	/**
	 * @desc    抢（跨境频道用），与 qiang 调用相同接口但传参不同
	 * @param   {Number|String} cityId
	 * @param   {Number|String} storeId
	 * @param   {Number|String} activityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部调用的路径与 qiang 接口相同，添加了验证对 activityId 的验证
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1243}
	 * @todo    目前没有调用到，取消？
	 * */
	qiangOverseas(cityId, storeId, activityId){
		let data = {
				cityId
				, storeId
				, activityId
			}
			;

		if( validate.isInteger(activityId) ){
			data.activityId = activityId;
		}

		return this.getData('/mallProduct/nextRoundRob', {
			data
		});
	}
	/**
	 * @desc    抢（下一轮抢，通用）
	 * @param   {Number|String} activityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2265}
	 * @todo    目前没有调用到，取消？
	 * */
	qiangNextRound(activityId){
		let data = {
			}
			;

		if( validate.isInteger(activityId) ){
			data.activityId = activityId;
		}

		return this.getData('/mallProduct/nextNotStartRoundRob', {
			data
		});
	}
	/**
	 * @desc    查询 sku（试衣用）
	 * @param   {Number|String} activityProductId
	 * @param   {Number|String} counterId
	 * @param   {Number|String} [storeId]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=497}
	 * */
	querySku(activityProductId, counterId, storeId){
		let data = {
				activityProductId
				, counterId
			}
			, result
		;

		if( validate.isInteger(activityProductId) ){
			if( storeId && validate.checkNumberListFormat(storeId) ){
				data.storeId = storeId;
			}

			result = this.getData('/mallProduct/querySku', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    获取收藏商品信息
	 * @param   {Number|String} itemId
	 * @param   {Number|String} [fxStoreId]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2777}
	 * */
	queryCollectItemInfo(itemId, fxStoreId){
		let data = {
				itemId
			}
			;

		if( fxStoreId ){
			data.fxStoreId = fxStoreId;
		}

		return this.getData('/mallProduct/queryFittingItem', {
			method: 'POST'
			, data
		});
	}

	/**
	 * @desc    试衣详情页接口
	 * @param   {Number|String} id  营销商品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，如果未传参数会返回 []
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=89}
	 * */
	fittingDetailInfo(id){
		let result
			;

		if( validate.isInteger(id) ){
			result = this.getData('/mallActivityProductToFitting/detailInfo', {

			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
	/**
	 * @desc    试衣列表
	 * @param   {Object}    [data={}]
	 * @param   {String}    [data.order='time'] 排序，time 时间排序，category 分类排序，默认分类排序
	 * @param   {Number}    [data.startNum=0]
	 * @param   {Number}    [data.pageNum=30]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=501}
	 * */
	fittingList(data={}){

		data.order = data.order || 'time';
		data.startNum = data.startNum || 0;
		data.pageCount = data.pageCount || 30;

		return this.getData('/mallActivityProductToFitting/queryMallProductToFitting', {
			data
		});
	}

	/**
	 * @desc    查询试衣总人数
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1127}
	 * @todo    目前没有调用到，取消？
	 * */
	queryFittingNum(){
		return this.getData('/mallActivityProductToFitting/queryFittingNum');
	}
	/**
	 * @desc    查询试衣间列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	queryFittingRecord(){
		return this.getData('/mallActivityProductToFitting/queryFittingRecord');
	}
	/**
	 * @desc    绑定试衣照片与商品信息
	 * @param   {String}    mallProductToFittingAllJson
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=493}
	 * */
	bindFittingItem(mallProductToFittingAllJson){
		return this.getData('/mallActivityProductToFitting/addShareFittingRecord', {
			data: {
				mallProductToFittingAllJson
			}
		});
	}
	/**
	 * @desc    绑定试衣照片与商品信息，实际为 bindFittingItem 接口重命名，调整为内部调用 bindFittingItem
	 * @param   {String}    mallProductToFittingAllJson
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [bindFittingItem]{@link ItemServiceModel#bindFittingItem}
	 * @todo    与 bindFittingItem 取其一
	 * */
	addShareFittingRecord(mallProductToFittingAllJson){
		return this.bindFittingItem( mallProductToFittingAllJson );
	}
	/**
	 * @desc    试衣列表删除功能
	 * @param   {Number|String} ids 试衣品 id 集合
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=499}
	 * @todo    有一次调用，但被注释掉，取消？
	 * */
	delFittingItems(ids){
		return this.getData('/mallActivityProductToFitting/updDeleteMallProductToFitting', {
			method: 'POST'
			, data: {
				ids
			}
		});
	}
	/**
	 * 查询用户的收藏记录列表
	 * @param   {String}    fieldText               商品名称或者专柜名称
	 * @param   {Object}    [options={}]
	 * @param   {String}    [options.order='time']  排序方式，time 时间排序，category 分类排序，默认分类排序
	 * @param   {Number}    [options.startNum=0]
	 * @param   {Number}    [options.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2749}
	 * */
	queryItemCollections(fieldText, options={}){
		let data = {
				fieldText
			}
		;

		data.order = options.order || 'time';
		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/mallActivityProductToFitting/queryItemCollections', {
			data
		});
	}
	/**
	 * @desc    删除收藏记录
	 * @param   {Number|String} itemIds 商品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2817}
	 * */
	updDelItemCollection(itemIds){
		return this.getData('/mallActivityProductToFitting/updDelItemCollection', {
			data: {
				itemIds
			}
		});
	}
	/**
	 * @desc    收藏记录详情页
	 * @param   {Number|String} fittingId   试衣 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2759}
	 * */
	queryItemCollectionInfo(fittingId){
		return this.getData('/mallActivityProductToFitting/queryItemCollectionInfo', {
			data: {
				fittingId
			}
		});
	}
	/**
	 * @desc    判断商品当前收藏状态
	 * @param   {Number|String} itemId  商品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2701}
	 * */
	isCollected(itemId){
		return this.getData('/mallActivityProductToFitting/existShareFittingRecord', {
			method: 'POST'
			, data: {
				itemId
			}
		});
	}
	/**
	 * @desc    添加收藏商品
	 * @param   {String}    mallProductToFittingAllJson
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2813}
	 * */
	addItemCollection(mallProductToFittingAllJson){
		return this.getData('/mallActivityProductToFitting/addItemCollection', {
			method: 'POST'
			, data: {
				mallProductToFittingAllJson
			}
		});
	}

	/**
	 * @desc    发起天猫比价
	 * @param   {Number|String} fittingId   试衣 id
	 * @param   {String}        url         天猫同款 url
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=397}
	 * @todo    目前没有调用到，取消？
	 * */
	addCompare(fittingId, url){
		return this.getData('/publics/tmallCompare/addCompare', {
			data: {
				fittingId
				, url
			}
		});
	}

	/**
	 * @desc    朋友发起砍价
	 * @param   {Number|String}     activityProductId   活动品 id
	 * @param   {Number|String}     uuid                微信 openId
	 * @param   {String}            wechatName
	 * @param   {Number|String}     memberSecId         分享者的 memberId，加密后的字符串
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=633}
	 * @todo    使用防黄牛机制
	 * */
	barginRecordAdd(activityProductId, uuid, wechatName, memberSecId){
		return this.getData('/barginRecord/add', {
			method: 'POST'
			, data: {
				activityProductId
				, uuid
				, wechatName
				, memberSecId
			}
		});
	}
	/**
	 * @desc    获取砍价团详情
	 * @param   {Number|String}    activityProductId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=629}
	 * */
	barginRecordDetail(activityProductId){
		return this.getData('/barginRecord/detail', {
			data: {
				activityProductId
			}
		});
	}
	/**
	 * @desc    分享后的砍价详情页
	 * @param   {Number|String}    activityProductId
	 * @param   {Number|String}    memberSecId          加密后的会员 id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=677}
	 * */
	shareBarginRecordDetail(activityProductId, memberSecId){
		return this.getData('/barginRecord/shareDetail', {
			data: {
				activityProductId
				, memberSecId
			}
		});
	}

	/**
	 * @desc    邀请分享并参加活动
	 * @param   {Number|String} activityProductId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=637}
	 * */
	barginItemAdd(activityProductId){
		return this.getData('/barginItem/add', {
			data: {
				activityProductId
			}
		});
	}
	/**
	 * @desc    获取我的砍价团信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=635}
	 * */
	barginItemList(){
		return this.getData('/barginItem/list', {
			method: 'POST'
		});
	}

	/**
	 * @desc    消息推送
	 * @param   {Number|String} messageCode     501.降价，502.发券
	 * @param   {Number}        [startNum=1]
	 * @param   {Number}        [pageCount=1]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=471}
	 * */
	queryAllMessageBody(messageCode, startNum=0, pageCount=1){
		return this.getData('/messageBody/queryAllMessageBody', {
			data: {
				messageCode
				, startNum
				, pageCount
			}
		});
	}

	/**
	 * @desc    查询专柜和专柜品
	 * @param   {Number|String} storeId
	 * @param   {Number|String} [categoryId=''] 分类 id
	 * @param   {String}        [sort='']       排序方式，dynamic 表示专柜动态排序，attention 表示关注人数排序
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1633}
	 * */
	queryDynamicByStore(storeId, categoryId='', sort=''){
		let data = {
				storeId
			}
			;

		if( categoryId ){
			data.categoryId = categoryId;
		}
		if( sort ){
			data.sort = sort;
		}

		return this.getData('/counterDynamicsPub/queryDynamicForIndex', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    导购推荐
	 * @param   {Number|String} counterId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1629}
	 * */
	queryCounterRecommend(counterId){
		return this.getData('/counterDynamicsPub/queryCounterRecommend', {
			method: 'POST'
			, data: {
				counterId
			}
		});
	}
	/**
	 * @desc    专柜动态
	 * @param   {Number|String} counterId
	 * @param   {Object}        [options={}]        分页参数
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1631}
	 * */
	queryDynamicByCounter(counterId, options){
		let data = {
				counterId
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/counterDynamicsPub/queryDynamicByCounterId', {
			method: 'POST'
			, data
		});
	}

	/**
	 * @desc    分享分销专题展示
	 * @param   {Number|String} distributionTopicId 专题 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1639}
	 * */
	queryTopic(distributionTopicId){
		let result
			;

		if( distributionTopicId ){
			result = this.getData('/distributionTopicPub/queryTopic', {
				method: 'POST'
				, data: {
					distributionTopicId
				}
			});
		}
		else{
			result = Promise.reject();
		}
		
		return result;
	}

	/**
	 * @desc    运营品牌
	 * @param   {Number|String} brandId
	 * @param   {Number}        source      业态
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2509}
	 * */
	queryFrontBizBrand(brandId, source){
		let result
			;

		if( brandId ){
			result = this.getData('/frontBizCategory/queryFrontBizBrand', {
				method: 'POST'
				, data: {
					brandId
					, source
				}
			});
		}
		else{
			result = Promise.reject();
		}
		
		return result;
	}
}

Model.register('item', ItemServiceModel);

export default ItemServiceModel;