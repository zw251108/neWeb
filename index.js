'use strict';

/**
 *
 * */
var fs = require('fs')

	// 全局配置信息
	, CONFIG = require('./config.js')

	//----- Web Server -----
	, express       = require('express')
	, web           = require('./module/web.js')
	, webServer

	//----- Web Socket -----
	, socket        = require('./module/socket.js')
	, socketServer

	//----- Web 服务器及相关组件 -----
	, bodyParser    = require('body-parser')
	, cookie        = require('cookie')
	, cookieParser  = require('cookie-parser')
	//, multer        = require('multer')
	, logger        = require('morgan')
	, session       = require('express-session')
	, sessionStore  = new session.MemoryStore()

	// 数据库操作
	, db     = require('./module/db.js')

	//----- 自定义模块 -----
	, tpl           = require('./module/emmetTpl/tpl.js') // 模板库
	, index         = require('./module/index.js') // 首页模块
	;

//----- 重置 manifest 版本代号 -----
var manifest = fs.readFileSync(__dirname + '/tpl/cache.manifest').toString();
fs.writeFileSync(__dirname + '/public/cache.manifest', new Buffer(manifest.replace('%v%', Math.floor(Math.random()*100))) );
console.log('cache.mainfest has reset');

//----- web 服务器设置 -----
web.use( bodyParser.json() );
web.use( bodyParser.urlencoded({extended: true}) );
web.use( cookieParser() );
web.use( logger('dev') );

web.use( session({
	store:      sessionStore
	, secret:   CONFIG.web.cookieSecret
	, key:      CONFIG.web.cookieKey
	, resave:   false
	, saveUninitialized: true
}) );

var userInfo = {
	id: 1
};
web.use(function(req, res, next){
	//console.log(req.url, req.session.id, sessionStore);

	var sessionId = req.session.id
	//	, session = (sessionId && sessionId in sessionStore.sessions)? JSON.parse( sessionStore.sessions[sessionId] ) : {}
	//	, user = session.user
		;
	//console.log('session id', sessionId);
	//if( !user ){
	//	user = req.session.user = userInfo;
	//}
	//else{
	//
	//}

	// todo

	next();
});

//----- 静态资源 重定向 -----
web.use('/cache.manifest', express.static(__dirname + '/public/cache.manifest') );  // 离线缓存配置文件

web.use('/favicon.ico', express.static(__dirname + '/public/image/favicon.ico'));

web.use('/script',  express.static(__dirname + '/public/script') ); // 前端 js 静态资源
web.use('/script/ui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );  // 前后端通用模板引擎

web.use('/font',    express.static(__dirname + '/public/font') );   // 字体图标
web.use('/image',   express.static(__dirname + '/public/image') );  // 图片
web.use('/style',   express.static(__dirname + '/public/style') );  // 样式

web.use('/doc.html',    express.static(__dirname + '/doc.html') );  //

web.use('/lib',     express.static(__dirname + '/bower_components'));
web.use('/lib/zui', express.static(__dirname + '/public/script/ui'));
web.use('/lib/zui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );  // 前后端通用模板引擎

web.use('/doc',     express.static(__dirname + '/doc'));
web.use('/requirement',     express.static(__dirname + '/requirement'));

web.use('/test.html',    express.static(__dirname + '/test.html') );  //


/**
 * 访问主页	/
 * */
web.get('/', function(req, res){
	var sessionId = req.session.id
		//, session = JSON.parse( sessionStore.sessions[sessionId] )
		, user = req.session.user
		;

	if( !user ){
		user = req.session.user = userInfo;
	}

	console.log(sessionId);

	res.send( tpl.html('index', {
		title: '个人小站（开发测试中...）'
		, user: ('user' in session) ? '/user' : '/login'
		, modules: tpl.metroTpl(index).join('')
		, script: {
			main: 'script/index'
			, src: 'script/lib/require.min.js'
		}
	}) );
	res.end();
});

web.post('/login', function(req, res){
	// todo 登录功能
});

index.push({
	id: 'time'
	, type: 'metro'
	, size: 'tiny'
	, title: '时间 time'
	, info: '<div class="watch_wrap hidden" id="watch">' +
		'<span class="watch_hourHand" id="hourHand"></span>' +
		'<span class="watch_minuteHand" id="minuteHand"></span>' +
		'<span class="watch_secondHand" id="secondHand"></span>' +
		'<span class="watch_mark watch_mark-1"></span>' +
		'<span class="watch_mark watch_mark-2"></span>' +
		'<span class="watch_mark watch_mark-3"></span>' +
		'<span class="watch_mark watch_mark-4"></span>' +
		'<span class="watch_mark watch_mark-5"></span>' +
		'<span class="watch_mark watch_mark-6"></span>' +
		'<span class="watch_mark watch_mark-7"></span>' +
		'<span class="watch_mark watch_mark-8"></span>' +
		'<span class="watch_mark watch_mark-9"></span>' +
		'<span class="watch_mark watch_mark-10"></span>' +
		'<span class="watch_mark watch_mark-11"></span>' +
		'<span class="watch_mark watch_mark-12"></span>' +
	'</div>'
});

/**
 * 加载模块
 * */
//require('./module/blog.js');        // 加载模块 blog
require('./module/blog/controller.js');

//require('./module/content.js');    // 加载模块 document
require('./module/document/controller.js'); // 加载模块 document

require('./module/editor.js');      // 加载模块 editor

require('./module/bower.js');       // 加载模块 bower

require('./module/reader.js');      // 加载模块 reader

//require('./module/tag.js');         // 加载模块 tag 功能
require('./module/tag/controller.js');  // 加载模块 tag 功能

require('./module/image.js');       // 加载模块 image

require('./module/basedata/controller.js'); // 加载模块 基础数据

//----- 后台管理 -----
require('./admin/index.js');


//----- Web 服务器 -----
webServer = web.listen( CONFIG.web.port );
console.log('Web Server is listening...');


//----- socket 服务器 -----
socketServer = socket.listen( webServer );

// 设置 socket.IO 与 express 共用 session
socketServer.use(function(socket, next){
	var data = socket.handshake || socket.request
		, cookieData = data.headers.cookie
		;

	if( cookieData ){

		data.cookie = cookie.parse( cookieData );
		data.sessionID = cookieParser.signedCookie(data.cookie[CONFIG.web.cookieKey], CONFIG.web.cookieSecret);
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