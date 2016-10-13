'use strict';

/**
 * 设置 log
 * */
var log4js        = require('log4js')
	, logger
	;

log4js.configure({
	appenders: [{
		type: "console"
	}, {
		type: 'file'
		, filename: __dirname + '/log/access.log'
		, maxLogSize: 1024 * 1024 * 1000
		, backups: 4
		, category: 'normal'
	}]
	, replaceConsole: true
});
logger = log4js.getLogger('normal');
logger.setLevel('INFO');

//---------- APP ----------
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
	, cors          = require('cors')
	, compression   = require('compression')
	, helmet        = require('helmet')

	, session       = require('express-session')
	, sessionStore  = new session.MemoryStore()

	, sharedSession = require('express-socket.io-session')

	//----- 自定义模块 -----
	, tpl       = require('./module/emmetTpl/tpl.js')   // 模板库
	, modules   = require('./module/module.js') // 首页模块
	, admin     = require('./module/admin.js')  // 后台管理模块
	, moduleTpl = require('./module/tpl.js')    // 全局模板引擎

	, UserHandler   = require('./module/user/handler.js')

	, i, j, t
	//数据库操作
	//, db     = require('./module/db.js')
	;

//----- 重置 manifest 版本代号 -----
var manifest = fs.readFileSync(__dirname + '/tpl/cache.manifest').toString();
fs.writeFileSync(__dirname + '/public/cache.manifest', new Buffer(manifest.replace('%v%', Math.floor(Math.random()*100))) );
console.log('cache.mainfest has reset');

//----- web 服务器设置 -----
web.use( bodyParser.json() );
web.use( bodyParser.urlencoded({extended: true}) );
web.use( cookieParser() );
web.use( log4js.connectLogger(logger, {format: ':method :url :remote-addr'}) );
//web.use( cors({ // 允许跨域
//	origin: ['http://localhost:'+ CONFIG.web.port]
//	, methods: ['GET', 'POST']
//	, allowedHeaders: ['Content-Type', 'Authorization']
//}) );
//web.use( compression() );   // GZIP 压缩
//web.use( helmet() );    // 安全性

// 设置 session
session = session({
	store:      sessionStore
	, secret:   CONFIG.web.cookieSecret
	, key:      CONFIG.web.cookieKey
	, resave:   false
	, saveUninitialized: true
});
web.use( session );

// 判断浏览器类型，操作系统
web.use(function(req, res, next){
	var session = req.session
		;

	if( !('ua' in session) ){
		console.log('设备 UA: ', req.headers['user-agent'] );
		session.ua = req.headers['user-agent'];
	}
	else{
		console.log(session.id)
	}

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
web.use('/less',    express.static(__dirname + '/less') );  // 样式 source map
web.use('/media',   express.static(__dirname + '/public/media') );  // 多媒体文件

//web.use('/validator.html',    express.static(__dirname + '/validator.html') );  //

web.use('/lib',     express.static(__dirname + '/bower_components'));
web.use('/lib/zui', express.static(__dirname + '/public/script/ui'));
web.use('/lib/zui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );  // 前后端通用模板引擎

web.use('/doc',     express.static(__dirname + '/doc'));
web.use('/requirement',     express.static(__dirname + '/requirement'));

web.use('/test.html',    express.static(__dirname + '/test.html') );  //

web.use('/static', express.static(__dirname + '/static'));  // 静态页面目录，实验性页面

/**
 * 自动设置静态目录 主要用于测试 demo
 * */
for( i = 0, j = CONFIG.works.length; i < j; i++){
	t = CONFIG.works[i];

	web.use('/'+ t, express.static(__dirname + '/work/'+ t));
}

/**
 * 自动加载模块
 * */
for( i = 0, j = CONFIG.modules.length; i < j; i++ ){
	require('./module/'+ CONFIG.modules[i] +'/controller.js' );
}

modules.register({
	id: 'time'
	, metroSize: 'tiny'
	, title: '时间 time'
	, icon: ''
	, href: '#'
});

var userSNS = [{
	icon: 'renren'
	, url: '#'
}, {
	icon: 'qq'
	, url: '#'
}, {
	icon: 'wechat'
}, {
	icon: 'weibo'
	, url: 'http://weibo.com/2707826454/profile'
}, {
	icon: 'github'
	, url: 'https://github.com/zw251108'
}];

/**
 * 访问主页
	/
 * */
web.get('/', function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		, isGuest = UserHandler.isGuest( user )
		, userData = {
			avatar: 'image/default/avatar.png'
		}
		;

	res.send( tpl.html('index', {
		title: '个人小站（开发测试中...）'
		, user: isGuest ? '/user/login' : '/user/center'
		, modules:
			'<section id="userModule" class="module module-user metro normal">\
				<div class="module_content">\
					<div class="user_avatar">\
						<img src="image/default/avatar.png" id="userAvatar" height="110" width="110">\
					</div>' +
				(isGuest ?
					'<form id="userLoginForm" action="user/login" method="post">\
						<button class="btn btn-submit" type="submit">登录</button>\
						<div class="formGroup">\
							<label class="label" for="email">电子邮箱</label>\
							<input type="text" class="input" id="email" name="email">\
						</div>\
						<div class="formGroup">\
							<label class="label" for="password">密&emsp;&emsp;码</label>\
							<input type="password" class="input" id="password" name="password">\
						</div>\
					</form>' : '') +
				'</div>\
			</section>'+
			tpl.metroTpl( modules.modules ).join('') +
			userSNS.map(function(d){
				return '<a href="'+ d.url +'" target="_blank"><section class="metro metro-tiny"><h2 class="metro_title icon icon-'+ d.icon +'"></h2></section></a>';
			}).join('') +
			'<dialog id="msgPopup" class="module module-popup small hidden" open="open">\
				<ul class="toolbar" role="toolbar">\
					<li><button id="msgPopupClose" class="icon icon-cancel module_close" type="button" title="关闭"></button></li>\
				</ul>\
				<div class="module_content scrollBar">\
					<div class="msg" id="msgContent" role="alert"></div>\
				</div>\
				<div class="btnGroup"></div>\
			</dialog>'
		, script: {
			main: 'script/index'
			, src: 'script/lib/require.min.js'
		}
	}) );
	res.end();
});

// 编码工具皮肤设置与获取
web.get('/skin', function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		, skin
		;

	user.skin = skin = user.skin || 'default';

	res.send( JSON.stringify({
		success: true
		, skin: skin
	}) );
	res.end();
});
web.post('/skin', function(req, res){   // 设置皮肤功能
	var user = UserHandler.getUserFromSession.fromReq( req )
		, body = req.body || {}
		, skin = body.skin
		;

	if( skin ){
		user.skin = skin;
	}

	res.send( JSON.stringify({
		success: true
	}) );
	res.end();
});

/**
 * 后台管理首页
	admin/
 * */
web.get('/admin/', function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		, isGuest = UserHandler.isGuest( user )
		;

	//if( isGuest ){
	//	req.session.user = userInfo;
	//}

	res.send( tpl.html('admin', {
		title: '个人小站（开发测试中...）'
		, modules: tpl.metroTpl( admin.modules ).join('')
	}) );
	res.end();
});

//----- Web 服务器 -----
webServer = web.listen( CONFIG.web.port
	//, CONFIG.web.ip
);
console.log('Web Server is listening...');

//----- socket 服务器 -----
socketServer = socket.listen( webServer );

// 设置 socket.IO 与 express 共用 session
socketServer.use( sharedSession(session, {
	autoSave: true
}) );

console.log('Socket Server is listening...');