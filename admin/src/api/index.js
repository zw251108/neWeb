'use strict';

import {api} from '../../mgcc';

let { midway } = api
	;

midway.resource({
	pageList: '/mg/page/list'
	, pageUpdate: '/mg/page/update'
	, pageCreate: '/mg/page/create'

	, codeGet: '/mg/code/get'
	, codeList: '/mg/code/list'
	, codeCount: '/mg/code/count'
	, codeCreate: '/mg/code/create'
	, codeUpdate: '/mg/code/update'

	// , feComponentList: '/mg/fe/component/list'
	//
	// , fePageGet: '/mg/fe/page/get'
	// , fePageCreate: '/mg/fe/page/create'
	// , fePageUpdate: '/mg/fe/page/update'
});

export default api;

export {
	midway
};