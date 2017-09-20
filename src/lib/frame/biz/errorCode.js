'use strict';

/**
 * @file    错误码处理汇总
 * */

/**
 * @namespace   tg.biz.errorCode
 * */

import url      from 'url';
import model    from '../model/index.js';

import alert    from '../component/alert/index.js';
import confirm  from '../component/confirm/index.js';
import notice   from '../component/notice/index.js';

let cookie = model.factory('cookie')
	;

const TOKEN_EXPIRES             = 503   // 微信的 access_token 已经过期，清除 cookie 中的缓存
	, USER_INFO_NOT_COMPLETE    = 887   // 个人信息不完整
	, USER_NOT_LOGIN            = 888   // 没有登录
	, NOT_OPEN_CHAT             = 102   // 对方未开通聊聊功能
	, ALREADY_ADD_FLOWER        = 601   // 已经献过花
	, ALREADY_FOLLOWED          = 602   // 已经关注此人
	, NO_SKU                    = 555   // sku 无库存，不可买
	, ALREADY_HAS_COUPON        = 666   // 券已领
	, ALREADY_HAS_SIGNED        = 777   // 已签到
	, NO_DELIVERY               = 911   // 没有收获地址
	, NOT_SHOW_IM_ICON          = 100   // 不显示导购 IM
	;

export default {
	[USER_INFO_NOT_COMPLETE]: ()=>{
		confirm({
			content: '您的个人头像或昵称未设置，还不能搭讪哟~快去完善个人信息吧！'
			, contentStyle: 'text-align:left;'
			, okText: '马上去填'
			, okScp: '0301.fact.seduce.03'
			, cancelText: '算了'
			, cancelScp: '0301.fact.seduce.02'
		}).then(()=>{
			url.changePage('/mine/myAccount.html');
		}, ()=>{});
	}
	, [USER_NOT_LOGIN]: ()=>{
		cookie.getData('isLogin').then((isLogin)=>{
			let result
				;
			
			if( isLogin ){
				result = cookie.setData('isLogin', false).then(()=>{
					return alert({
						content: '您的账号已在其他终端登录，请重新登录'
					});
				});
			}

			return result;
		}, ()=>{}).then(()=>{
			url.changePage('/login/login.html');
		});
	}
	, [NOT_OPEN_CHAT]: ()=>{
		alert({
			title: '提示'
			, titleStyle: 'color:#ff6565;'
			, content: '<span style="padding:.5rem 0.3rem;display:block;text-align:left;">对方没有开通【聊聊】功能，需要对方登录天狗APP后，你们才能聊天哟~</span>'
			, okText: '我知道了'
			, okStyle: 'color:#ff6565;'
		});
	}
	, [ALREADY_ADD_FLOWER]: ()=>{
		notice('您已经为TA献过花啦~');
	}
	, [ALREADY_FOLLOWED]: ()=>{
		notice("你已经关注此人");
	}
	, [TOKEN_EXPIRES]: ()=>{
		return cookie.removeData('access_token');
	}
	, [ALREADY_HAS_COUPON]: ()=>{
		notice('亲,您今日限额已领完,还有机会哦,明日记得早点来！');
	}
	, [NOT_SHOW_IM_ICON]: (res)=>{
		confirm({
			content: res.message
			, okText: '去下载'
			, cancelText: '算了'
		}).then(()=>{
			url.changePage('/index/loadAndroid.html');
		});
	}

	// , checkLogin: ()=>{
	//
	// }
}