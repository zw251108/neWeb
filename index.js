'use strict';

/**
* Web Server
* */
var sys = require('util')
	, fs = require('fs')

	// 数据库
	, mysql = require('mysql')
	, conn = mysql.createConnection({
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'coding4fun'
		, dateStrings: true	// 强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
	})
	//----- 定义数据库统一接口 -----
	, dbInterface = {
		select: function(sql, data, callback, errorHandler){
			if( typeof data === 'function' ){
				errorHandler = callback;
				callback = data;
			}
			conn.query(sql, function(e, rs, field){
				if( e ){
					console.log('\n', '数据库出错：', sql, e.message);
					errorHandler && errorHandler();
				}
				else{
					callback( rs );
				}
			});
		}
		, insert: function(){}
		, update: function(){}
		, 'delete': function(){}
	}

	, path = require('path')
	, url = require('url')

	// Web 服务器
	, express = require('express')
	, webApp = express()
	, webServer

	, COOKIE_SECRET = 'secret'
	, COOKIE_KEY = 'express.sid'

	// Web 服务器相关组件
	, bodyParser = require('body-parser')
	, cookie = require('cookie')
	, cookieParser = require('cookie-parser')
	, multer = require('multer')
	, logger = require('morgan')
	, session = require('express-session')
	, sessionStore = new session.MemoryStore()

	// 页面资源缓存
	, CACHE = {}
	;

//----- 读取文件 -----
fs.readFile('index.html', function(e, d){
	if( e ){
		console.log('\n', 'index error');
		return ;
	}
	CACHE.index = d.toString();
	console.log('index file read success');
});

//----- web 服务器设置 -----
webApp.use( bodyParser.json() );
webApp.use( bodyParser.urlencoded({extended: true}) );
webApp.use( cookieParser() );
webApp.use( logger('dev') );
// 文件上传设置
webApp.use( multer({
	dest: './upload/'
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
webApp.use('/script', express.static(__dirname + '/script') );
webApp.use('/style', express.static(__dirname + '/style') );
webApp.use('/image', express.static(__dirname + '/image') );
webApp.use('/cache.manifest', express.static(__dirname + '/cache.manifest') );

//webApp.use(function(req, res, next){
//	var err = new Error('not found');
//	err.status = 404;
//	next( err );
//});
//webApp.use(function(err, req, res, next){
//	res.status(err.status)
//})

///**
//* 博客模块
//*  /blog/
//*  /blog/detail/?id=:id&_=.*
//* */
//webApp.get('/blog/', function(req, res){
//	dbInterface.select('select Id,title,datetime,tagsId,tagsName from blog order by Id desc', function(rs){
//		if( req.query.type === 'json' ){
//
//			res.send( '['+ rs.map(function(i){
//				return JSON.stringify(i);
//			}).join() +']' );
//		}
//		else{
//			res.send('blog');
//		}
//		res.end();
//	}, function(){
//		res.end();
//	});
//});
//webApp.get('/blog/detail/', function(req, res){
//	var id = req.query.id || '';
//
//	if( id ){
//		dbInterface.select('select content from blog where id=?', [id], function(rs){
//			if( req.query.type === 'json' ){
//				res.send( JSON.stringify(rs[0]) );
//			}
//			else{
//				res.send('blog/detail/'+ id);
//			}
//			res.end();
//		}, function(){
//			res.send('{error: "E0004", msg:"'+ ERROR_MSG.E0004 +'"}');
//			res.end();
//		});
//	}
//	else{
//		res.send('{error: "E0001", msg:"'+ ERROR_MSG.E0001 +'}');
//		res.end();
//	}
//});
//
///**
//* Web 前端文档
//*  /document/
//* */
//webApp.get('/document/', function(req, res){
//	dbInterface.select('select title,content,section_title from document order by section_id', function(rs){
//		var document = []
//			, tempTitle = ''
//			, tempArray
//			, i, j;
//
//		if( req.query.type === 'json' ){
//
//			for(i = 0, j = rs.length; i < j; i++){
//				if( rs[i].section_title !== tempTitle ){
//					tempTitle = rs[i].section_title;
//					tempArray = [];
//					document.push({
//						section_title: tempTitle
//						, dl: tempArray
//					});
//				}
//
//				tempArray.push( rs[i] );
//			}
//
//			res.send( JSON.stringify( document ) );
//		}
//		else{
//			res.send('document');
//		}
//
//		res.end();
//	}, function(){
//		res.end();
//	});
//});
//
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
////webApp.get('/', function(req, res){
////	res.send('hello world');
////});
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
//		'<input type="hidden" name="_method" value="put"/>' +
//		'<input type="text" name="name"/>' +
//		'<input type="submit" value="提交"/>' +
//		'</form>');
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
* 统一上传接口
* */
webApp.post('/upload', function(req, res){

	// todo 上传成功，返回信息

	console.log('\n', req.params);
	console.log('\n', req.body);
	console.log('\n', req.files);
});

/**
* 访问主页	/
* */
webApp.get('/', function(req, res){
	var session = req.session;
	console.log(session.id)
	res.send( CACHE.index );
	res.end();
});
//webApp.get('/reconnect', function(req, res){
//	res.end();
//});

webServer = webApp.listen(9001);


//----- socket 服务器 -----
var socketServer = require('./socket.js').listen(webServer, dbInterface);

//---- 设置 socket.IO 与 express 共用 session -----
socketServer.use(function(socket, next){
	var data = socket.handshake || socket.request
		, cookieData = data.headers.cookie
		;

	if( cookieData ){

		data.cookie = cookie.parse( cookieData );
		data.sessionID = cookieParser.signedCookie(data.cookie[COOKIE_KEY], COOKIE_SECRET)
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