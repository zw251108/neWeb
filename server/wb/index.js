import https       from 'https';
import * as crypto from 'crypto';

import web       from '../web.js';
import sysConfig from '../sys/handler.js';

const WB_APP_KEY = 5
	, WB_SECRET = 6
	, WB_JS_API_TICKET = 7
	, TICKET_EXPIRE = 2*60*60*1000
	;

web.get('/wb/sign', (req, res)=>{
	let { url } = req.query
		;

	Promise.all([
		sysConfig.get({
			id: WB_APP_KEY
		})
		, sysConfig.get({
			id: WB_JS_API_TICKET
		})
	]).then(([appKeyConfig, ticketConfig])=>{
		let appKey = appKeyConfig.getDataValue('config')
			, ticket = ticketConfig.getDataValue('config')
			, updateDate = ticketConfig.getDataValue('updateDate')
			, exec
			;

		if( !ticket || (Date.now() - new Date(updateDate) > TICKET_EXPIRE) ){
			exec = sysConfig.get({
				id: WB_SECRET
			}).then((secret)=>{
				secret = secret.getDataValue('config');

				return new Promise((resolve, reject)=>{
					https.get(`https://api.weibo.com/oauth2/js_ticket/generate?client_id=${appKey}&client_secret=${secret}`, (res)=>{
						let { statusCode } = res
							;

						if( statusCode !== 200 ){
							reject();
							res.resume();

							return ;
						}

						res.setEncoding('utf8');

						let rawData = ''
							;

						res.on('data', (chunk)=>{
							rawData += chunk;
						});
						res.on('end', ()=>{
							try{
								const rs = JSON.parse( rawData )
									;

								resolve( rs.js_ticket );
							}
							catch(e){
								reject( e );
							}
						}).on('error', reject);
					});
				});
			}).then((ticket)=>{
				sysConfig.update({
					id: WB_JS_API_TICKET
					, config: ticket
				});

				return ticket;
			});
		}
		else{
			exec = Promise.resolve( ticket );
		}

		exec.then((ticket)=>{
			let sha1 = crypto.createHash("sha1")
				, nonceStr = Math.random().toString(36).slice(2, 15)
				, timestamp = Math.floor( Date.now() /1000 )
				;

			sha1.update(`jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`);

			res.send( JSON.stringify({
				code: 0
				, data: {
					appKey
					, noncestr: nonceStr
					, timestamp
					, signature: sha1.digest('hex')
				}
			}) );
			res.end();
		}, ()=>{
			res.send( JSON.stringify({
				code: -1
				, msg: ''
			}) );
			res.end();
		}).catch((e)=>{
			res.send( JSON.stringify({
				code: -1
				, msg: ''
			}) );
			res.end();
		});
	});
});