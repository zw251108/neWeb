import * as crypto from 'crypto';

import web, {httpsGet, httpsPost} from '../web.js';
import sysConfig                  from '../sys/handler.js';

const WB_APP_KEY = 5
	, WB_SECRET = 6
	, WB_ACCESS_TOKEN = 7
	, WB_JS_API_TICKET = 8
	, TOKEN_EXPIRE = 2*60*60*1000
	, TICKET_EXPIRE = 2*60*60*1000
	;

function getBaseInfo(){
	return Promise.all([
		sysConfig.get({
			id: WB_APP_KEY
		})
		, sysConfig.get({
			id: WB_SECRET
		})
	]).then(([appKeyConfig, secretConfig])=>{
		let appKey = appKeyConfig.getDataValue('config')
			, secret = secretConfig.getDataValue('config')
			;

		return [appKey, secret];
	});
}

function token(){
	return sysConfig.get({
		id: WB_ACCESS_TOKEN
	}).then((config)=>{
		let token = config.getDataValue('config')
			, updateDate = config.getDataValue('updateDate');
			;

		if( !token || (Date.now() - new Date(updateDate) > TOKEN_EXPIRE) ){
			return Promise.reject();
		}
		else{
			return token;
		}
	});
}

function jsAPITicket(){
	return sysConfig.get({
		id: WB_JS_API_TICKET
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

web.get('/wb/auth', (req, res)=>{
	let { code
		, url } = req.query
		;

	getBaseInfo().then(([client_id, client_secret])=>{
		return httpsPost('https://api.weibo.com/oauth2/access_token', {
			client_id
			, client_secret
			, grant_type: 'authorization_code'
			, code
			, redirect_uri: url
		});
	}).then(({access_token, uid})=>{
		sysConfig.update({
			id: WB_ACCESS_TOKEN
			, config: access_token
		});

		res.send({
			code: 0
			, data: {
				uid
			}
		});
	}).catch(()=>{
		res.send({
			code: -1
			, msg: ''
		});
	});
});

web.get('/wb/timeline', (req, res)=>{
	let { page = 1
		, max_id } = req.query
		, data = max_id ? {
			max_id
		} : {}
		;

	token().then((access_token)=>{
		return httpsGet('https://api.weibo.com/2/statuses/user_timeline.json', {
			access_token
			, ...data
		});
	}).then((data)=>{
		res.send({
			code: 0
			, data
		});
	}).catch(()=>{
		res.send({
			code: -1
			, msg: ''
		});
	});
});

web.get('/wb/init', (req, res)=>{
	let { url } = req.query
		, appKey
		;

	jsAPITicket().catch(()=>{
		return getBaseInfo().then(([client_id, client_secret])=>{
			appKey = client_id;

			return httpsPost('https://api.weibo.com/oauth2/js_ticket/generate', {
				client_id
				, client_secret
			});
		}).then(({js_ticket})=>{
			sysConfig.update({
				id: WB_JS_API_TICKET
				, config: js_ticket
			});

			return js_ticket;
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
				appKey
				, noncestr: nonceStr
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