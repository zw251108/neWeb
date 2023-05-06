import https from 'https';
import * as crypto from 'crypto';

import web       from '../web.js';
import sysConfig from '../sys/handler.js';

web.get('/wx/sign', (req, res)=>{
	let { url } = req.query
		;

	Promise.all([
		sysConfig.get({
			id: 1
		})
		, sysConfig.get({
			id: 4
		})
	]).then(([appIdConfig, ticketConfig])=>{
		let appId = appIdConfig.getDataValue('config')
			, ticket = ticketConfig.getDataValue('config')
			, updateDate = ticketConfig.getDataValue('updateDate')
			, exec
			;

		if( !ticket || (Date.now() - new Date(updateDate) > 2*60*60*1000) ){
			exec = sysConfig.get({
				id: 2
			}).then((secret)=>{
				secret = secret.getDataValue('config');

				return new Promise((resolve, reject)=>{
					https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`, (res)=>{
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

							   	resolve( rs.access_token );
							}
							catch(e){
								reject( e );
							}
						});
					}).on('error', reject);
				});
			}).then((access_token)=>{
				sysConfig.update({
					id: 3
					, config: access_token
				});

				return new Promise((resolve, reject)=>{
					https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, (res)=>{
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

								resolve( rs.ticket );
							}
							catch(e){
								reject( e );
							}
						}).on('error', reject);
					});
				});
			}).then((ticket)=>{
				sysConfig.update({
					id: 4
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
					appId
					, nonceStr
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
	})
});