'use strict';

import Model from '../model/index.js';

/**
 * @method   Sync
 * @param   {Model}     from
 * @param   {Model}     to
 * */
function sync(from, to){
	let exec
		;

	// 参数都为 Model 子类，且为不同的两种子类
	if( typeof from === 'object' &&
		typeof to === 'object' &&
		from instanceof Model &&
		to instanceof Model &&
		from.constructor !== to.constructor){

		exec = function(key, value){
			let rs
				;

			if( value !== null ){
				rs = to.setData(key, value)
			}
			else{
				rs = to.removeData(key);
			}

			rs.then((rs)=>{
				if( rs ){
					console.log( from.constructor.name +' 数据同步到 '+ to.constructor.name +' 成功' );
				}
			});
		};

		from.on( exec );

		return {
			clearSync: function(){
				from.off( exec );
				console.log( '解除 '+ to.constructor.name +'对'+ from.constructor.name +' 的数据同步');
			}
			// todo 添加更多操作
		}
	}
	else{
		console.log( new Error('参数类型错误') );
	}
}

export default sync;