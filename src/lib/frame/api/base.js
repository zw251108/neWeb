'use strict';

import domain       from 'domainConfig';
import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';
import mallList     from '../../../../setting/mallShop.json';
import marketList   from '../../../../setting/marketShop.json';

/**
 * @class
 * @classdesc   Base 业务模块，二/三级域名 base，在 Model.factory 工厂方法注册为 base，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class BaseServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['base'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	// ---------- 私有方法 ----------
	/**
	 * @summary 通过 gps 取附近的门店
	 * @private
	 * @param   {Number|String} lat
	 * @param   {Number|String} lon
	 * @param   {Number}        [source=1]  门店类型：1.百货，2.超市
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    实际为 nearStore 接口重命名
	 * @see     [nearStore]{@link BaseServiceModel#nearStore}
	 * @todo    与 nearStore 取其一
	 * */
	_getGpsShop(lat, lon, source=1){
		return this.nearStore(lat, lon, source);
	}
	/**
	 * @summary 计算弧度
	 * @private
	 * @param   {Number|String} d
	 * @return  {Number}
	 * */
	_rad(d){
		return d * Math.PI / 180.0;
	}
	/**
	 * @summary 根据经纬度，获取距离
	 * @private
	 * @param   {Number|String} lat1
	 * @param   {Number|String} lng1
	 * @param   {Number|String} lat2
	 * @param   {Number|String} lng2
	 * @return  {Number}        返回距离信息
	 * */
	_getDistance(lat1='', lng1='', lat2='', lng2=''){
		let EARTH_RADIUS = 6378.137 // 地球半径
			, radLat1
			, radLat2
			, a, b, s
		;
		if ( lat1 === '' || lng1 === '' || lat2 === '' || lng2 === '' ){
			s = 0;
		}
		else{
			radLat1 = this._rad( lat1 );
			radLat2 = this._rad( lat2 );
			a = radLat1 - radLat2;
			b = this._rad( lng1 ) - this._rad( lng2 );
			s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b /2), 2)));
			s = s * EARTH_RADIUS;
			s = Math.round(s * 10000) / 10000;
			return s;
		}

		return s;
	}

	// ---------- 公有方法 ----------
	/**
	 * @summary 城市相关 - 获取城市列表
	 * @param   {Number|String} id  城市 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/city/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1865}
	 * */
	cityList(id){
		return this.getData('/publics/city/list', {
			data: {
				id
			}
		});
	}
	/**
	 * @summary 城市相关 - 通过经纬度获取城市信息
	 * @param   {Number|String} lon
	 * @param   {Number|String} lat
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/city/locate]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1809}
	 * */
	cityLocate(lat, lon){
		return this.getData('/publics/city/locate', {
			data: {
				latitude: lat
				, longitude: lon
			}
		});
	}
	/**
	 * @summary 城市相关 - 获取热门城市
	 * @param   {Number|String} [pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/city/hot/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1811}
	 * @todo    查接口存在 id 参数，用途？
	 * */
	hotCity(pageCount=999){
		return this.getData('/publics/city/hot/list', {
			data: {
				pageCount
			}
		});
	}
	/**
	 * @summary 城市相关 - 获取热门城市，与 hotCity 接口完全相同，整理为内部调用 hotCity 接口，为旧版接口
	 * @param   {Number|String} [pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [hotCity]{@link BaseServiceModel#hotCity}
	 * @todo    与 hotCity 取其一
	 * */
	hotCityList(pageCount=999){
		return this.hotCity(pageCount);
	}
	/**
	 * @summary 城市相关 - 根据省份获取城市列表
	 * @param   {Number|String} provinceId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/city/cities]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1859}
	 * */
	cityListByProvince(provinceId){
		return this.getData('/publics/city/cities', {
			data: {
				provinceId
			}
		});
	}
	/**
	 * @summary 查热门城市及城市下所有百货超市
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/city/hot/store]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3673}
	 * */
	allCityStore(){
		return this.getData('/publics/city/hot/store');
	}

	/**
	 * @summary 自提点查询
	 * @param   {Number|String} storeId     门店 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/pickupsite/queryPickUpSiteByStoreId]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1969}
	 * */
	queryPickUpSiteByStoreId(storeId){
		return this.setData('/publics/pickupsite/queryPickUpSiteByStoreId', {
			data: {
				storeId
			}
		});
	}

	/**
	 * @summary 门店相关 - 获取门店列表
	 * @param   {Number|String} [cityId]
	 * @param   {Number|String} [type]          为 1 或 2
	 * @param   {Number}        [pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/store/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1851}
	 * */
	storeList(cityId, type, pageCount=999){
		let data = {
				pageCount
			}
			;

		if( cityId ){
			data.cityId = cityId
		}
		if( type ){
			data.type = type
		}

		return this.setData('/publics/store/list', {
			data
		});
	}
	/**
	 * @summary 门店相关 - 获取门店信息
	 * @param   {Number|String} storeId     门店 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/store/info]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1853}
	 * @todo    页面中使用了同步请求
	 * */
	storeInfo(storeId){
		return this.setData('/publics/store/info', {
			data: {
				storeId
			}
		});
	}
	/**
	 * @summary 门店相关 - 查询城市百货门店
	 * @param   {Number|String} cityId
	 * @param   {Number|String} [type=1]        目前只看到 type 为 1
	 * @param   {Number}        [pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/store/cityMallStores]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1549}
	 * */
	cityMallStores(cityId, type=1, pageCount=999){
		return this.setData('/publics/store/cityMallStores', {
			data: {
				cityId
				, type
				, pageCount
			}
		});
	}
	/**
	 * @summary 门店相关 - 查询城市超市门店
	 * @param   {Number|String} cityId
	 * @param   {Number|String} type            type 为 1 或 2
	 * @param   {Number}        [pageCount=999]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/store/cityMarketStores]
	 * @todo    接口中心未查到
	 * @todo    type 值？
	 * */
	cityMarketStores(cityId, type, pageCount=999){
		return this.setData('/publics/store/cityMarketStores', {
			data: {
				cityId
				, type
				, pageCount
			}
		});
	}
	/**
	 * @summary 门店相关 - 查询附近的门店
	 * @param   {Number|String} lat
	 * @param   {Number|String} lon
	 * @param   {Number}        [type=1]  门店类型：1.百货，2.超市
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/store/nearby/store]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1595}
	 * @see     [http://base.test.66buy.com.cn/publics/store/nearby/store]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1863}
	 * */
	nearStore(lat, lon, type=1){
		return this.setData('/publics/store/nearby/store', {
			data: {
				latitude: lat
				, longitude: lon
				, type
			}
		});
	}
	/**
	 * @summary 门店相关 - 查询附近的门店
	 * @param   {Number|String} lat
	 * @param   {Number|String} lon
	 * @param   {Number}        [type=1]  门店类型：1.百货，2.超市
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 nearStore 接口完全相同，目前为调用 nearStore 接口，为旧版接口
	 * @see     [nearStore]{@link BaseServiceModel#nearStore}
	 * @todo    与 nearStore 取其一
	 * */
	nearbyStore(lat, lon, type=1){
		return this.nearStore(lat, lon, type);
	}
	/**
	 * @summary 根据经纬度到百度提供的 api 查所在城市，再判断该城市下是否有门店
	 * @param   {Number}    lat
	 * @param   {Number}    lon
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/store/judgeStoreByCity]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3575}
	 * */
	judgeStoreByCity(lat, lon){
		return this.setData('/publics/store/judgeStoreByCity', {
			data: {
				latitude: lat
				, longitude: lon
			}
		});
	}

	/**
	 * @summary 查询百货商品分类
	 * @param   {Number|String} storeId
	 * @param   {Number|String} [floor] 楼层
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/counterCategory/listMainCategory]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1551}
	 * */
	listMainCategory(storeId, floor){
		let data = {
				storeId
			}
			;

		if( floor ){
			data.floor = floor;
		}
		
		return this.setData('/publics/counterCategory/listMainCategory', {
			data
		});
	}

	/**
	 * @summary 专柜相关 - 查询店铺楼层
	 * @param   {Number|String} storeId
	 * @param   {Number|String} [counterCategoryId] 未查到该参数
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/counter/floors]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1579}
	 * */
	storeFloors(storeId, counterCategoryId){
		let data = {
				storeId
			}
			;

		if( counterCategoryId ){
			data.counterCategoryId = counterCategoryId;
		}

		return this.setData('/publics/counter/floors', {
			data
		});
	}
	/**
	 * @summary 专柜相关 - 查询热门专柜
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/counter/hotCounter]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1553}
	 * */
	hotCounter(storeId){
		return this.setData('/publics/counter/hotCounter', {
			data: {
				storeId
			}
		});
	}
	/**
	 * @summary 专柜列表
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/counter/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1855}
	 * @todo    查接口存在 brandIds,orderColumn,orderType 参数，用途？
	 * */
	counterList(storeId){
		return this.setData('/publics/counter/list', {
			data: {
				storeId
			}
		});
	}
	/**
	 * @summary 专柜相关 - 查询全部专柜
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]            配置查询条件
	 * @param   {Number|String} [options.floor]         楼层
	 * @param   {Number|String} [options.categoryCode]  分类
	 * @param   {String}        [options.sort]          排序方式，dynamic 表示装柜动态排序，attention 表示关注人数排序
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/counter/listCounter]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1555}
	 * */
	listCounter(storeId, options={}){
		let data = {
				storeId
			}
			;

		if( 'floor' in options ){
			data.floor = options.floor;
		}
		if( 'categoryCode' in options ){
			data.categoryCode = options.categoryCode;
		}
		if( 'sort' in options ){
			data.sort = options.sort;
		}

		data.startNum = options.startNum || 0;
		data.pageCOunt = options.pageCount || 10;

		return this.setData('/publics/counter/listCounter', {
			data
		});
	}
	/**
	 * @summary 专柜相关 - 查询专柜信息
	 * @param   {Number|String} counterId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://base.test.66buy.com.cn/publics/counter/counterInfo]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1557}
	 * */
	counterInfo(counterId){
		return this.setData('/publics/counter/counterInfo', {
			data: {
				counterId
			}
		});
	}

	/**
	 * @summary 获取省份列表
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/province/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1857}
	 * */
	provinceList(){
		return this.getData('/publics/province/list');
	}

	/**
	 * @summary 通过 storeId 查询省份简称
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/storeAddress/queryProByStoreId]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3923}
	 * */
	queryProByStoreId(storeId){
		return this.setData('/publics/storeAddress/queryProByStoreId', {
			data: {
				storeId
			}
		});
	}

	/**
	 * @summary 获取地区列表
	 * @param   {Number|String} cityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/district/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1861}
	 * */
	districtList(cityId){
		return this.getData('/publics/district/list', {
			data: {
				cityId
			}
		});
	}

	/**
	 * @summary 品牌查询
	 * @param   {Number|String} brandIds
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://base.test.66buy.com.cn/publics/brand/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1849}
	 * @todo    查接口存在 storeId,cityId,counterId,source,categoryCode,needProduct,orderColumn,orderType 参数，用途？
	 * */
	brandQuery(brandIds){
		return this.getData('/publics/brand/query', {
			data: {
				brandIds
			}
		});
	}

	/**
	 * @summary 按门店 id、商品末级分类查出对应电子信誉卡
	 * @param   {Number|String} storeId
	 * @param   {String}        categoryIds 商品末级分类 id
	 * @return  {Promise}
	 * @desc    使用 POST 方法
	 * @see     [http://base.dev.66buy.com.cn/publics/storeCreditCard/queryByCateIds]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3991}
	 * */
	storeCreditCard(storeId, categoryIds){
		return this.setData('/publics/storeCreditCard/queryByCateIds', {

		});
	}

	/**
	 * @summary 获取去过的门店
	 * @param   {Object[]}      storeList   去过的门店
	 * @param   {Number|String} storeList[].cityId
	 * @param   {Number|String} storeList[].id
	 * @param   {Number|String} storeList[].type
	 * @param   {Number|String} cityId  城市 id
	 * @param   {Number|String} [source]    门店类型：1.百货；2.超市
	 * @param   {Number|String} [lat]
	 * @param   {Number|String} [lon]
	 * @return  {Promise}       在 resolve 时传入 storeId
	 * @desc    从 cookie 中获取 cityId、经纬度（lat lon）、去过的门店列表（usualShop）
				从去过的门店中获取当前城市最近去过的的门店
				若没有则根据 GPS 发送请求获取当前距离最近的门店
				若没有则根据 mallShop.json 和 market.json 获取当前城市的默认门店
内部调用了 _getGpsShow、_getDistance、_rad 方法
	 * */
	getUsualShop(storeList, cityId, source, lat, lon){
		let storeId
			, result
			;

		if( source ){
			storeList = storeList.filter((d)=>d.type == source);
		}

		if( storeList.length ){
			storeId = storeList[0].id;
		}

		if( storeId ){
			result = Promise.resolve( storeId );
		}
		else if( lat && lon ){
			if( source ){
				result = this._getGpsShop(lat, lon);
			}
			else{
				result = this._getGpsShop(lat, lon, source);
			}

			result = result.then((res)=>{
				let data
					, tempCityId
					, distance
					, storeId
					, result
					;
				if( res.success ){
					data = res.data;

					if( data && data.id ){
						tempCityId = data.storeAddress.fkCityId;
						distance = that._getDistance(lat, lon, data.storeAddress.dimension, data.storeAddress.longitude);
					}
					
					//小余5公里
					if (data && distance <= 5 && tempCityId == cityId) {
						storeId = data.id;

						result = storeId;
					}
					else{
						result = Promise.reject();
					}

				}
				else{
					result = Promise.reject( res );
				}

				return result;
			});
		}
		else{
			result = Promise.reject();
		}

		return result.catch(()=>{
			if( source === 1 ){
				storeList = mallList.filter(d=>d.cityId == cityId);
			}
			else{
				storeList = marketList.filter(d=>d.cityId == cityId);
			}

			if( storeList.length ){
				storeId = storeList[0].id;
			}

			return storeId;
		});
	}
}

Model.register('base', BaseServiceModel);

export default BaseServiceModel;
