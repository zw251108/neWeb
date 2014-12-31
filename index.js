'use strict';

/**
* Web Server
* */
var
	//sys = require('util')
	//,
	fs = require('fs')

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
	, DB_SERVER_HOST = 'localhost'
	, DB_SERVER_PORT = 3306
	, DB_USERNAME = 'root'
	, DB_PASSWORD = 'zw251108'
	, DB_DATABASE = 'destiny'
	//, db = require('mysql').createConnection({
	//	host: DB_SERVER_HOST
	//	, port: DB_SERVER_PORT
	//	, user: DB_USERNAME
	//	, password: DB_PASSWORD
	//	, database: DB_DATABASE
	//	, dateStrings: true	// 强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回. (默认: false)
	//})

	// 模块库
	, tpl = require('./module/tpl.js').tpl
	, template = require('./module/template/template.js').template

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

//var Tag = {
//	tagTmpl: $.template({
//		template: 'span.tag[data-tagid=%Id%]{%name%}'
//	})
//};

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
			, articleTmpl = template({
				template:'article#blogArt%Id%.article>a[href=blog/detail/?id=%Id%]>h3.article_title{%title%}' +
				'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
				, filter:{
					//tags: function(d){
					//	var data = []
					//		, tagsId = (d.tags_id || '').split(',')
					//		, tagsName = (d.tags_name || '').split(',')
					//		;
					//
					//	$.each(tagsId, function(i, d){
					//		data.push({
					//			Id: d
					//			, name: tagsName[i]
					//		});
					//	});
					//
					//	return tagTmpl(data).join('');
					//}
				}
			})
			;

		res.send(header.replace('%pageTitle%', '博客 Blog') + main.replace('%blogList%', articleTmpl(data).join('')) + footer);
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
		res.end();
	}
});

/**
 * Web 前端文档
 *  /document/
 * */
webApp.get('/document/', function(req, res){
	db.query('document', [], function(data){
		var header = tpl('header')
			, footer = tpl('footer')
			, main = tpl('document/index')
			, dlTmpl = template({
				template: 'dt.icon.icon-arrow-r{%title%}+dd{%content%}'
			})
			, sectionTmpl = template({
				template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon-CSS.icon-minus^dl{%dl%}'
				, filter: {
					dl: function(d){
						return dlTmpl(d.dl).join('');
					}
				}
			})
			;

		res.send(header.replace('%pageTitle%', '前端文档 Document') + main.replace('%documentList%', sectionTmpl(data).join('') ) + footer);
		res.end();
	}, function(){
		res.end();
	})
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