import {ServiceModel, Model} from 'cyan-maple';

import {baseUrl} from '../config.js';

const api = new ServiceModel({
		// baseUrl: '//zw150026.com'
		baseUrl
		, resource: {
			news: '/news'
			, blog: '/blog'
		}
	})
	, ls = Model.factory('ls')
	;

// api.sourceFrom( ls );
//
// api.syncTo(ls, (topic, {data}, res)=>{
// 	let { data: resData } = res
// 		;
//
// 	// 未返回数据不缓存
// 	if( !resData ){
// 		return false;
// 	}
//
// 	return {
// 		topic
// 		, value: resData
// 	};
// });

export default api;