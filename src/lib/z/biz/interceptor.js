'use strict';

import ServiceModel from '../model/service.js';

ServiceModel.interceptor.res.add((res)=>{
	let rs
		;
	if( res.msg === 'Done' ){
		rs = res.data;
	}
	else{
		rs = Promise.reject( res.msg );
	}

	return rs;
});