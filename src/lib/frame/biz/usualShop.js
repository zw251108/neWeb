'use strict';

/**
 * @file    兼容旧版去过的门店
 * */

import Model    from '../model/index.js';

let cookie = Model.factory('cookie')

	/**
	 * @summary     旧版去过的门店处理
	 * @function    usualShop
	 * @memberOf    tg.biz
	 * @param       {Object}        storeData           门店数据
	 * @param       {Number|String} storeData.id        门店 id
	 * @param       {Number|String} storeData.cityId
	 * @param       {Number}        storeData.type      门店类型
	 * @return      {Promise}
	 * */
	, usualShop = function(storeData){
		return cookie.getData('usualShop').catch(()=>{
			return [];
		}).then((usualShop)=>{
			if( usualShop.length ){
				usualShop.unshift( storeData );

				usualShop = usualShop.filter((d)=>{
					return d.cityId !== storeData.cityId || d.id !== storeData.id;
				});
			}
			else{
				usualShop.push( storeData );
			}

			return cookie.setData('usualShop', usualShop);
		});
	}
	;

export default usualShop;