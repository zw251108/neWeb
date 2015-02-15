'use strict';

/**
 * Web Server
 * */
var fs = require('fs')

	//----- 全局变量 -----
	, WEB_APP_PORT  = 9001     	// Web 监听端口
	, COOKIE_SECRET = 'secret'
	, COOKIE_KEY    = 'express.sid'

	, DB_CONFIG     = {    // MySQL 数据库配置
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'destiny'
		, dateStrings: true
	}

	//----- MySQL 数据库 -----
	, db = require('mysql').createConnection( DB_CONFIG )

	//----- Web 服务器及相关组件 -----
	, express       = require('express')
	, url           = require('url')
	, bodyParser    = require('body-parser')
	, cookie        = require('cookie')
	, cookieParser  = require('cookie-parser')
	, multer        = require('multer')
	, logger        = require('morgan')
	, session       = require('express-session')

	, web           = express()
	, webServer
	, sessionStore  = new session.MemoryStore()

	//----- Web Socket -----
	, socket        = require('./module/socket/socket.js')
	, socketServer

	//----- 自定义模块 -----
	, tpl           = require('./module/tpl.js')
		//.tpl   // 模块库
	//, template      = require('./module/emmetTpl/emmetTpl.js').template
	//, emmetTplConfig = {
	//
	//}
	//, index         = tpl.tpl('index')
	, metro           = []
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
web.use(multer({   // 文件上传设置
	dest: './public/upload/'
}));
web.use(session({  // session 设置
	store: sessionStore
	, secret: COOKIE_SECRET
	, key: COOKIE_KEY
	, resave: true
	, saveUninitialized: true
}));

//----- 静态资源 重定向 -----
web.use('/script', express.static(__dirname + '/public/script') );  // 前端 js 静态资源
web.use('/script/ui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );  // 前后端通用模板引擎

web.use('/font', express.static(__dirname + '/public/font') );      // 字体图标
web.use('/image', express.static(__dirname + '/public/image') );    // 图片
web.use('/style', express.static(__dirname + '/public/style') );    // 样式

web.use('/cache.manifest', express.static(__dirname + '/public/cache.manifest') );  // 离线缓存配置文件

//web.use(function(req, res, next){
//	var err = new Error('not found');
//	err.status = 404;
//	next( err );
//});
//web.use(function(err, req, res, next){
//	res.status(err.status)
//})

///**
//* 统一上传接口
//* */
//web.post('/upload', function(req, res){
//
//	// todo 上传成功，返回信息
//
//	console.log('\n', req.params);
//	console.log('\n', req.body);
//	console.log('\n', req.files);
//});

//var Tag = {
//	tagTpl: $.template({
//		template: 'span.tag[data-tagid=%Id%]{%name%}'
//	})
//};

/**
 * 访问主页	/
 * */
web.get('/', function(req, res){
	console.log('session id', req.session.id);

	res.send( tpl.html('index', {
		title: '个人小站（开发测试中...）'
		, modules: tpl.metroTpl(metro).join('')
		, script: {
			main: 'script/index'
			, src: 'script/lib/require.min.js'
		}
	}) );
	res.end();
});

//----- 加载模块 -----
require('./module/blog.js')(    web, db, socket, metro);  // 加载模块 blog
require('./module/document.js')(web, db, socket, metro);  // 加载模块 document
require('./module/editor.js')(  web, db, socket, metro);  // 加载模块 editor

require('./module/bower.js')(   web, db, socket, metro);  // 加载模块 bower

metro.push({
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

//<section id="time" class="module module-metro tiny module-time">
//<h2 class="module_title">时间 time</h2>
//<div class="watch_wrap hidden" id="watch">
//<span class="watch_hourHand" id="hourHand"></span>
//<span class="watch_minuteHand" id="minuteHand"></span>
//<span class="watch_secondHand" id="secondHand"></span>
//<span class="watch_mark watch_mark-1"></span>
//<span class="watch_mark watch_mark-2"></span>
//<span class="watch_mark watch_mark-3"></span>
//<span class="watch_mark watch_mark-4"></span>
//<span class="watch_mark watch_mark-5"></span>
//<span class="watch_mark watch_mark-6"></span>
//<span class="watch_mark watch_mark-7"></span>
//<span class="watch_mark watch_mark-8"></span>
//<span class="watch_mark watch_mark-9"></span>
//<span class="watch_mark watch_mark-10"></span>
//<span class="watch_mark watch_mark-11"></span>
//<span class="watch_mark watch_mark-12"></span>
//</div>
//</section>
//
//<a href="document/">
//<section id="document" class="module module-metro small module-document">
//<h2 class="module_title icon icon-document">前端文档 document</h2>
//<ul class="toolbar">
//<li><span class="module_close icon icon-cancel"></span></li>
//</ul>
//<div class="module_content"></div>
//</section>
//</a>
//
//<a href="editor/">
//<section id="editor" class="module module-metro module-editor normal">
//<h2 class="module_title icon icon-editor">前端编辑器 editor</h2>
//<ul class="toolbar">
//<li><span class="module_close icon icon-cancel"></span></li>
//</ul>
//<div class="module_content"></div>
//</section>
//</a>
//
//<a href="bower/">
//<section id="bower" class="module module-metro module-bower normal">
//<h2 class="module_title icon">前端组件管理 bower</h2>
//<ul class="toolbar">
//<li><span class="module_close icon icon-cancel"></span></li>
//</ul>
//<div class="module_content"></div>
//</section>
//</a>

webServer = web.listen( WEB_APP_PORT );
console.log('Web Server is listening...');


//----- socket 服务器 -----
socketServer = socket.listen(webServer);

socketServer.use(function(socket, next){    // 设置 socket.IO 与 express 共用 session
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