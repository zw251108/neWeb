'use strict';

/**
 * @file    设置去过的门店
 * */

import Model    from '../model/index.js';

let cookie = Model.factory('cookie')

	/**
	 * @summary     从 cookie 中取出 cityId、storeId，设置到 visitStores 中对应城市下
	 * @function    setVisitStores
	 * @memberOf    tg.biz
	 * @return      {Promise}
	 * */
	, setVisitStores = function(){
		return cookie.getData('cityId', 'storeId', 'visitStores').then(({cityId, storeId, visitStores})=>{
			let cityStores
				, index
				;

			if( !visitStores ){
				visitStores = {};
			}

			cityStores = visitStores[cityId] || [];

			index = cityStores.indexOf( storeId );

			if( index !== -1 ){
				cityStores.splice(index, 1);
			}

			cityStores.unshift( storeId );

			visitStores[cityId] = cityStores.slice(0, 3);
			
			return cookie.setData('visitStores', visitStores);
		});
	}
	;

export default setVisitStores;
