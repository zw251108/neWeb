'use strict';

/**
* Web Server
* */
var sys = require('util')
	, fs = require('fs')

	// Web 服务器
	, express = require('express')
	, webApp = express()
	, webServer

	// 监听端口
	, WEB_APP_PORT = 9001
	, COOKIE_SECRET = 'secret'
	, COOKIE_KEY = 'express.sid'

	// Web 服务器相关组件
	, url = require('url')
	, bodyParser = require('body-parser')
	, cookie = require('cookie')
	, cookieParser = require('cookie-parser')
	, multer = require('multer')
	, logger = require('morgan')
	, session = require('express-session')
	, sessionStore = new session.MemoryStore()

	// 数据库
	, db = require('./module/db.js').db

	// 模块库
	, tpl = require('./module/tpl.js').tpl

	// Web Socket
	, socketServer = require('./module/socket.js')
	;

//----- 重置 manifest 版本代号
var manifest = fs.readFileSync(__dirname + '/tpl/cache.manifest').toString();
fs.writeFileSync(__dirname + '/public/cache.manifest', new Buffer(manifest.replace('%v%', Math.floor(Math.random()*100))) );
console.log('cache.mainfest has reset');

//----- web 服务器设置 -----
webApp.use( bodyParser.json() );
webApp.use( bodyParser.urlencoded({extended: true}) );
webApp.use( cookieParser() );
webApp.use( logger('dev') );
// 文件上传设置
webApp.use( multer({
	dest: './public/upload/'
}) );
// session 设置
webApp.use( session({
	store: sessionStore
	, secret: COOKIE_SECRET
	, key: COOKIE_KEY
	, resave: true
	, saveUninitialized: true
}) );

//----- 静态资源 重定向 -----
webApp.use('/script', express.static(__dirname + '/public/script') );

webApp.use('/font', express.static(__dirname + '/public/font') );
webApp.use('/image', express.static(__dirname + '/public/image') );
webApp.use('/style', express.static(__dirname + '/public/style') );

webApp.use('/cache.manifest', express.static(__dirname + '/public/cache.manifest') );

//webApp.use(function(req, res, next){
//	var err = new Error('not found');
//	err.status = 404;
//	next( err );
//});
//webApp.use(function(err, req, res, next){
//	res.status(err.status)
//})

///**
//* 统一上传接口
//* */
//webApp.post('/upload', function(req, res){
//
//	// todo 上传成功，返回信息
//
//	console.log('\n', req.params);
//	console.log('\n', req.body);
//	console.log('\n', req.files);
//});

/**
 * 博客模块
 *  /blog/
 *  /blog/detail/?id=:id&_=.*
 * */
webApp.get('/blog/', function(req, res){
	db.query('blog', [], function(data){

		var header = tpl('header')
			, footer = tpl('footer')
			, main = tpl('blog/index')
			, article = tpl('blog/article')
			, html = ''
			, t, temp
			, i, j, k
			;

		//res.send( tpl(['header', {
		//	tpl: 'blog/index'
		//	, blogList: {
		//		tpl: 'blog/article'
		//		, data: data
		//		, tags: ''
		//	}
		//}, 'footer']) );

		for( i = 0, j = data.length; i < j; i++ ){
			t = article;
			temp = data[i];

			for( k in temp ) if( temp.hasOwnProperty(k) ){
				t = t.replace('%'+ k +'%', temp[k]);
			}
			html += t;
		}


		res.send(header + main.replace('%blogList%', html) + footer);
		res.end();
	}, function(){
		res.end();
	});
});
webApp.get('/blog/detail/', function(req, res){
	var id = req.query.id || '';

	if( id ){

	}
	else{
		//res.send('{error: "E0001", msg:"'+ ERROR_MSG.E0001 +'}');
		res.end();
	}
});

/**
 * Web 前端文档
 *  /document/
 * */
webApp.get('/document/', function(req, res){

});

/**
 * 编辑器模块
 * editor/
 * editor/code/
 * */
webApp.get('/editor/', function(req, res){
	res.end();
});
webApp.get('/editor/code/', function(req, res){
	res.end();
});

//webApp.all('/user/:id/:op?', function(req, res, next){
//	req.user = users[req.params.id];
//	console.log('\n', req.user);
//	if( req.user ){
//		next();
//	}
//	else{
//		next( new Error('can not find id: '+ req.params.id ) );
//	}
//});
//webApp.get(/^\/(\d+)$/, function(req, res){
//	res.send( 'reg '+ req.params[0] );
//});
//webApp.get('/a*', function(req, res){
//	res.send('a');
//});
//webApp.get('/:id(b\\d+)', function(req, res){
//	if( req.params.id ){
//		res.send( req.params.id );
//	}
//	else{
//		res.send('hello world');
//	}
//});
//webApp.get('/user/:id', function(req, res, next){
//	var id = req.params.id;
//	if( /^\d+$/.test( id ) ){
//		res.send( 'id: '+ id );
//	}
//	else{
//		next();
//	}
//});
//webApp.get('/user/:name', function(req, res){
//	var name = req.params.name;
//	res.send( 'name: '+ name );
//});
//webApp.get('/user/:id/edit', function(req, res){
//	res.send('edit user: '+ req.user.name);
//});
//webApp.get('/user/:id/getData.:format((json|xml))', function(req, res){
//	res.send('{"name":"zwb"}');
//});
//webApp.get('*', function(req, res){
//	res.send('<form action="/" method="post">' +
//	'<input type="hidden" name="_method" value="put"/>' +
//	'<input type="text" name="name"/>' +
//	'<input type="submit" value="提交"/>' +
//	'</form>');
//});
//
//webApp.put('/', function(req, res){
//	res.send('welcome, '+ req.body.name);
//});
///**
// * 访问静态资源 *.*
// * */
//webApp.get(/.*\..*$/, function(req, res){
//	var pathname = url.parse( req.url ).pathname
//		, extname = path.extname( pathname )
//		, type = extname.slice(1)
//		;
//
//	// 判断是否已有缓存
//	if( pathname in CACHE ){
//		res.writeHead(200, {'Content-Type': mime[type]});
//		res.write(CACHE[pathname], 'binary');
//		res.end();
//	}
//	else{
//		fs.readFile('.'+ pathname, function(e, d){
//
//			if( e ){
//				res.writeHead(404, {'Content-Type': 'text/plain'});
//
//			}
//			else{
////				CACHE[pathname] = d;    // 加入缓存
//				console.log('\n', '缓存 ', pathname);
//
//				res.writeHead(200, {'Content-Type': mime[type]});
//				res.write(d, 'binary');
//			}
//			res.end();
//		});
//	}
//});

/**
* 访问主页	/
* */
webApp.get('/', function(req, res){
	console.log('session id', req.session.id);

	res.send( tpl('index') );
	res.end();
});

webServer = webApp.listen( WEB_APP_PORT );

console.log('Web Server is listening...');

//----- socket 服务器 -----
socketServer = socketServer.listen(webServer);

//----- 设置 socket.IO 与 express 共用 session -----
socketServer.use(function(socket, next){
	var data = socket.handshake || socket.request
		, cookieData = data.headers.cookie
		;

	if( cookieData ){

		data.cookie = cookie.parse( cookieData );
		data.sessionID = cookieParser.signedCookie(data.cookie[COOKIE_KEY], COOKIE_SECRET);
		data.sessionStore = sessionStore;

		sessionStore.get(data.sessionID, function(err, session){
			if( err || !session ){
				next( new Error('session not found') );
			}
			else{
				data.session = session;
				data.session.id = data.sessionID;
				next();
			}
		});
	}
	else{
		next( new Error('missing cookie headers') );
	}
});

console.log('Socket Server is listening...');