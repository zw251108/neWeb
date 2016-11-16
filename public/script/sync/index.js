'use strict';

import Model from '../model/index.js';

/**
 * @method   Sync
 * @param   {Model}     from
 * @param   {Model}     to
 * @param   {Object}    options
 * */
function sync(from, to, options){

	// 参数都为 Model 子类，且为不同的两种子类
	if( typeof from === 'object' &&
		typeof to === 'object' &&
		from instanceof Model &&
		to instanceof Model &&
		from.constructor !== to.constructor){

		from.on(function(key, value){
			var rs
				;

			if( value !== null ){
				rs = to.setData(key, value)
			}
			else{
				rs = to.removeData(key);
			}

			rs.then(function(rs){
				if( rs ){
					console.log( from.constructor.name +' 数据同步到 '+ to.constructor.name +' 成功' );
				}
			});
		});
	}
	else{
		console.log( new Error('参数类型错误') );
	}
}

export default sync;