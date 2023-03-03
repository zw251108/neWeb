import http from 'http';
import httpProxy from 'http-proxy';


const SERVER_HOST = {
		'zw150026.com': 'http://localhost:9001'
	}
	;

let proxy = httpProxy.createProxyServer()
	, server = http.createServer(function(req, res){
		let host = req.headers['host']
			, target
			;

		host = host.split(':')[0];
		target = SERVER_HOST[host];

		if( target ){
			proxy.web(req, res, {
				target
			}, function(e){
				console.log( e );
				res.setHeader('Content-Type', 'text/plain;charset=utf-8');
				res.end('当前项目未启动');
			});
		}
		else{
			res.setHeader('Content-Type', 'text/plain;charset=utf-8');
			res.end(`${host} 项目未代理`);
		}
	})
	;

server.on('listening', function(){
	console.log('代理服务器开启');
});

server.on('error', function(){
	console.log('80 端口已被监听');
});

server.listen(80);