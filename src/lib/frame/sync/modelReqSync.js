'use strict';

import Model from '../model/index';

/**
 * @class
 * 实现 model 与网络请求之间同步
 * */
class ModelConnectSync{
	/**
	 * @constructor
	 * */
	constructor(from, to){

		//
		if( typeof from === 'object' &&
			typeof to === 'object' &&
			from instanceof Model ){

		}
	}
}

export default ModelConnectSync;
