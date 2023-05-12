import * as crypto from 'crypto';

import web, {httpsGet} from '../web.js';
import sysConfig       from '../sys/handler.js';

const WX_APP_ID = 1
	, WX_SECRET = 2
	, WX_ACCESS_TOKEN = 3
	, WX_JS_API_TICKET = 4
	, TICKET_EXPIRE = 2*60*60*1000
	;

function getBaseInfo(){
	return Promise.all([
		sysConfig.get({
			id: WX_APP_ID
		})
		, sysConfig.get({
			id: WX_SECRET
		})
	]).then(([appIdConfig, secretConfig])=>{
		let appId = appIdConfig.getDataValue('config')
			, secret = secretConfig.getDataValue('config')
			;

		return [appId, secret];
	});
}

function jsAPITicket(){
	return sysConfig.get({
		id: WX_JS_API_TICKET
	}).then((config)=>{
		let ticket = config.getDataValue('config')
			, updateDate = config.getDataValue('updateDate')
			;

		if( !ticket || (Date.now() - new Date(updateDate) > TICKET_EXPIRE) ){
			return Promise.reject();
		}
		else{
			return ticket;
		}
	});
}

web.get('/wx/sign', (req, res)=>{
	let { url } = req.query
		, appId
		;

	jsAPITicket().catch(()=>{
		return getBaseInfo().then(([appid, secret])=>{
			appId = appid;

			return httpsGet('https://api.weixin.qq.com/cgi-bin/token', {
				grant_type: 'client_credential'
				, appid
				, secret
			});
		}).then(({access_token})=>{
			sysConfig.update({
				id: WX_ACCESS_TOKEN
				, config: access_token
			});

			return httpsGet('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
				type: 'jsapi'
				, access_token
			});
		}).then(({ticket})=>{
			sysConfig.update({
				id: WX_JS_API_TICKET
				, config: ticket
			});

			return ticket;
		});
	}).then((ticket)=>{
		let sha1 = crypto.createHash("sha1")
			, nonceStr = Math.random().toString(36).slice(2, 15)
			, timestamp = Math.floor( Date.now() /1000 )
			;

		sha1.update(`jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`);

		res.send({
			code: 0
			, data: {
				appId
				, nonceStr
				, timestamp
				, signature: sha1.digest('hex')
			}
		});
	}).catch(()=>{
		res.send({
			code: -1
			, msg: ''
		});
	});
});