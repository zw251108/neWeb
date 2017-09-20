'use strict';

import domain   from 'domainConfig';
import url      from 'url';
import merge    from '../util/merge.js';
import Model    from '../model/index.js';
import view     from '../view/index.js';

const UUID_KEY                  = 'tgs_uuid'
	, ENTRY_KEY                 = 'tgs_entry'   // ?
	, FIRST_TIME_KEY            = 'first_time'
	, SESSION_KEY               = 'tgs_session'
	, UUID_COOKIE_EXPIRES       = '100y'
	, SESSION_KEY_EXPIRES       = '10m'
	, FIRST_TIME_KEY_EXPIRES    = '100y'
	;

let cookie  = Model.factory('c')
	, ls    = Model.factory('ls')
	, ss    = Model.factory('ss')
	, log   = Model.factory('log')
	;

let basicData = cookie.getData(SESSION_KEY, FIRST_TIME_KEY).then((cookieData)=>{
		return merge({
			referrer: document.referrer
			, url: url.path.substring(1)
			, domain: url.host
		}, cookieData);
	})
	, scpExtraData = Promise.all([
		ls.getData( UUID_KEY ).catch(()=>{})
		, ss.setData( UUID_KEY ).catch(()=>{})
		, cookie.getData(UUID_KEY, 'global', 'memberId')
	]).then(([localUUID, sessionUUID, cookieData])=>{
		let cookieUUID = cookieData[UUID_KEY]
			, global = cookieData.global
			, memberId = cookieData.memberId
			// 优先使用 cookie，再取 localStorage，再取 sessionStorage
			, uuid = cookieUUID || localUUID || sessionUUID   // || uuid
			;

		if( uuid !== localUUID ){
			ls.setData(UUID_KEY, uuid);
		}
		if( uuid !== sessionUUID ){
			ss.setData(UUID_KEY, uuid);
		}
		if( uuid !== cookieUUID ){
			cookie.setData(UUID_KEY, uuid, UUID_COOKIE_EXPIRES);
		}

		if( !global ){
			global = 'webapp';
		}

		return {
			uu: uuid
			, gl: global
			, mi: memberId
		};
	})

	, pageExtraData = Promise.all([])
	, searchExtraData = Promise.all([])
	, _track = (opts={}, extraData={}, url)=>{

	}
	;


basicData.then(({session, firstTime})=>{
	/**
	 * 设置页面关闭时的处理
	 * */

	view.beforeunload.on();
	view.beforeunload.add(()=>{
		if( session !== null ){
			cookie.setData(SESSION_KEY, session, SESSION_KEY_EXPIRES);
		}
		if( firstTime !== null ){
			cookie.setData(FIRST_TIME_KEY, firstTime, FIRST_TIME_KEY_EXPIRES);
		}
	});
});

log.setSCPExtra( scpExtraData );
log.setPageExtra( pageExtraData );
log.setSearchExtra( searchExtraData );