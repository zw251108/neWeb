'use strict';

/**
 * @file    自动定位
 * */

import url      from 'url';
import position from '../position.js';
import model    from '../model/index.js';

import confirm  from '../component/confirm/index.js';

const CITY_ID_EXPIRES   = 365
	, CITY_NAME_EXPIRES = 365
	, LATITUDE_EXPIRES  = 1
	, LONGITUDE_EXPIRES = 1
	;

let cookie = model.factory('cookie')
	, base = model.factory('base')

	, pathname = url.path
	, isIndex = (pathname === '/' || pathname === '/index.html' || pathname === '/discover/index.html' || pathname === '/testDemo.html')    // testDemo 为测试用
	, changeCityConfirm = function(currCity, toCity){
		return confirm({
			title: '提示信息'
			, content: '您当前选择的城市为'+ currCity +'，是否切换至'+ toCity +'？'
		});

		// return new Promise((resolve, reject)=>{
		//
		// 	maple.confirm({
		// 		title: '提示信息'
		// 		, content: '您当前选择的城市为'+ currCity +'，是否切换至'+ toCity +'？'
		// 		, okFn: resolve
		// 		, cancelFn: reject
		// 	});
		// });
	}
	;

/**
 * @summary     获取当前地理位置的门店信息
 * @function    positionInfo
 * @memberOf    tg.biz
 * @return      {Promise}
 * */
let positionInfo = function(){
		let params = url.params
			, cityId = params.cityId || params.cityid || undefined
			, defaultCity = {
				cityId: 2554
				, cityName: '大连'
			}
			, exec
			;

		if( cityId ){   // url 上带入城市信息，请求城市名
			exec = base.cityList( cityId ).then((data)=>{
				let rs = null
					;

				if( data.length ){
					rs = {};
					rs.cityId = data[0].id;
					rs.cityName = data[0].name;
				}

				return rs || defaultCity;
			});
		}
		else{
			exec = cookie.getData('cityId', 'cityName').catch(()=>{
				return defaultCity;
			});
		}

		return exec.then((rs)=>{
			gpsPosition();

			return rs;
		});
	}
	, gpsPosition = function(){
		console.log('进入定位');
	
		if( isIndex ){  // 当前页面是首页或者发现频道首页
			cookie.getData('isGPS').then(()=>{  // 定位过
				console.log('已经定位过');
				
				return Promise.reject();
			}, ()=>{   // 没有进行过定位，当前页面是首页或者城市惠页面
				return position();
			}).then((position)=>{
				let coords = (position || {}).coords || {}
					, exec
					;

				if( !isNaN(coords.latitude) && !isNaN(coords.longitude) ){

					exec = {
						lat: coords.latitude
						, lon: coords.longitude
					};
				}
				else{   // 返回结果不是经纬度
					exec = Promise.reject();
				}

				return exec;
			}, ()=>{
				console.log('定位失败');
				
				return Promise.reject();
			}).then(({lat, lon})=>{

				// 根据经纬度到百度提供的 api 查所在城市，再判断该城市下是否有门店
				return base.judgeStoreByCity(lat, lon).then((data)=>{   // data 是 boolean 类型。。。
					let exec
						;

					if( data ){
						cookie.setData('lat', lat, LATITUDE_EXPIRES);
						cookie.setData('lon', lon, LONGITUDE_EXPIRES);

						// 通过经纬度获取城市信息
						exec = base.cityLocate(lat, lon);
					}
					else{
						exec = Promise.reject();
					}

					return exec
				}, ()=>{
					cookie.setData('lat', lat, LATITUDE_EXPIRES);
					cookie.setData('lon', lon, LONGITUDE_EXPIRES);

					return base.cityLocate(lat, lon);
				});
			}).then((data)=>{
				let cityId = data.id
					, cityName = data.name
					;

				// return Promise.all([
				// 	cookie.getData('cityId')
				// 	, cookie.getData('cityName')
				// ]).catch(()=>{  // 第一次进入，cookie 中没有 cityId,cityName
				// 	return [];
				// }).then(([currCityId, currCityName])=>{
				return cookie.getData('cityId', 'cityName').catch(()=>{
					return {};
				}).then(({cityId: currCityId, cityName: currCityName})=>{
					let exec
						;

					if( cityId.toString() !== currCityId.toString() ){
						exec = changeCityConfirm(currCityName, cityName);
					}
					else{
						exec = Promise.reject();
					}

					return exec.then(()=>{ // 切换城市
						cookie.setData('cityId', cityId, CITY_ID_EXPIRES);
						cookie.setData('cityName', cityName, CITY_NAME_EXPIRES);
						cookie.removeData('storeId');

						// 去掉 url 上参数
						url.replace('cityId', 'storeId', 'source');

						// 刷新当前页面
						url.reload();
					}, ()=>{});
				});
			}).catch(()=>{}).then(()=>{
				cookie.setData('isGPS', true);
			});
		}
	}
	;

export default positionInfo;