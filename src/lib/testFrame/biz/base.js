'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';
import mallList from '../../../../setting/mallShop.json';
import marketList from '../../../../setting/marketShop.json';

/**
 * @class
 * @classdesc   Base 业务模块
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

	/**
	 * 获取城市列表
	 * @param   {String|Number} id  城市 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	cityList(id){
		return this.getData('/publics/city/list', {
			data: {
				id
			}
		});
	}
	/**
	 * 通过经纬度获取城市信息
	 * @param   {String|Number} lat
	 * @param   {String|Number} lon
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
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
	 * 获取热门城市
	 * @param   {String|Number} pageCount
	 * */
	hotCity(pageCount){
		return this.getData('/publics/city/hot/list', {
			data: {
				pageCount
			}
		});
	}
	/**
	 * 自提点查询
	 * @param   {String|Number} storeId     门店 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	queryPickUpSiteByStoreId(storeId){
		return this.getData('/publics/pickupsite/queryPickUpSiteByStoreId', {
			method: 'POST'
			, data: {
				storeId
			}
		});
	}
	/**
	 * 获取门店信息
	 * @param   {String|Number} storeId     门店 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	storeInfo(storeId){
		return this.getData('/publics/store/info', {
			method: 'POST'
			, data: {
				storeId
			}
		});
	}
	/**
	 * 通过 gps 取附近的门店
	 * @private
	 * @param   {String|Number} lat
	 * @param   {String|Number} lon
	 * @param   {Number}        [source=1]  门店类型
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	_getGpsShop(lat, lon, source=1){
		return this.getData('/publics/store/nearby/store', {
			method: 'POST'
			, data: {
				latitude: lat
				, longitude: lon
				, type: source
			}
		})
	}

	/**
	 * 计算弧度
	 * @private
	 * @param   {String|Number} d
	 * @return  {Number}
	 * */
	_rad(d){
		return d * Math.PI / 180.0;
	}
	/**
	 * 根据经纬度，获取距离
	 * @private
	 * @param   {String|Number} lat1
	 * @param   {String|Number} lng1
	 * @param   {String|Number} lat2
	 * @param   {String|Number} lng2
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
	/**
	 * 获取去过的门店
	 * @param   {Object[]}      storeList   去过的门店
	 * @param   {String|Number} storeList[].cityId
	 * @param   {String|Number} storeList[].id
	 * @param   {String|Number} storeList[].type
	 * @param   {String|Number} cityId  城市 id
	 * @param   {String|Number} [source]    门店类型：1.百货；2.超市
	 * @param   {String|Number} [lat]
	 * @param   {String|Number} [lon]
	 * @return  {Promise}       在 resolve 时传入 storeId
	 * @desc    从 cookie 中获取 cityId、经纬度（lat lon）、去过的门店列表（usualShop）
	 *      从去过的门店中获取当前城市最近去过的的门店
	 *      若没有则根据 GPS 发送请求获取当前距离最近的门店
	 *      若没有则根据 mallShop.json 和 market.json 获取当前城市的默认门店
	 *      内部调用了 _getGpsShow、_getDistance、_rad 方法
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

ServiceModel.register('base', BaseServiceModel);

export default BaseServiceModel;
