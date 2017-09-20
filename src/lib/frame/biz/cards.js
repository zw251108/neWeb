'use strict';

import alert    from '../component/alert/index.js';

export default {
	errorEvent(){
		alert({
			content:'此卡状态异常，如想继续使用，请联系门店会员中心处理！'
		});
	}
};