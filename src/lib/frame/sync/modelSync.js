'use strict';

import Model from '../model/index';

/**
 * @class   ModelSync   实现 model 直接数据同步
 * */
class ModelSync{
	/**
	 * @constructor
	 * @param   {Model}     from
	 * @param   {Model}     to
	 * */
	constructor(from, to){

		// 参数都为 Model 子类，且为不同的两种子类
		if( typeof from === 'object' &&
			typeof to === 'object' &&
			from instanceof Model &&
			to instanceof Model &&
			from.constructor !== to.constructor ){

			this.from = from;
			this.to = to;
			this._syncState = true; // 同步建立

			from.on((key, value)=>{
				this._sync(key, value)
			});
		}
		else{
			console.log( new Error('参数类型错误') );
		}
	}
	/**
	 * @desc    同步回调函数
	 * @private
	 * @param   {String}    key
	 * @param   {*}         value
	 * */
	_sync(key, value){
		let rs
			;

		if( value !== null ){
			rs = this.to.setData(key, value);
		}
		else{
			rs = this.io.removeData(key);
		}

		rs.then((rs)=>{
			if( rs ){
				console.log( this.from.constructor.name +' 数据同步到 '+ this.to.constructor.name +' 成功' );
			}
		});
	}

	clearSync(){
		if( this._syncState ){

			this.from.off( this._sync );

			this._syncState = false;    // 解除同步

			console.log( '解除 '+ this.to.constructor.name +'对'+ this.from.constructor.name +' 的数据同步');
		}
	}

	// todo 添加更多操作
}

export default ModelSync;