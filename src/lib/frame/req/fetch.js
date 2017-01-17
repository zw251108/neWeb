'use strict';

import Req from './req';

/**
 * @class
 * @extends Req
 * */
class FetchReq extends Req{
	/**
	 * @constructor
	 * */
	constructor(){
		super();
	}

	/**
	 *
	 * */
	send(url, options){
		return fetch(url, {
			credentials: 'include'
			// , methods: ''
			, header: {
				'Accept': ''
				, 'Content-Type': 'application/x-www-form-urlencode;charset=utf-8'
			}
			, body: {}
		})
	}
}

Req.register('fetch', FetchReq);

export default FetchReq;