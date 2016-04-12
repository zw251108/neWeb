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
	, log4js        = require('log4js')
	, logger        //= require('morgan')
	, session       = require('express-session')
	, sessionStore  = new session.MemoryStore()

	, sharedSession = require('express-socket.io-session')

	//----- 自定义模块 -----
	, tpl       = require('./module/emmetTpl/tpl.js') // 模板库
	, modules   = require('./module/module.js') // 首页模块
	, admin     = require('./module/admin.js')   // 后台管理模块
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

var // 数据库操作
	db     = require('./module/db.js');

//----- 重置 manifest 版本代号 -----
var manifest = fs.readFileSync(__dirname + '/tpl/cache.manifest').toString();
fs.writeFileSync(__dirname + '/public/cache.manifest', new Buffer(manifest.replace('%v%', Math.floor(Math.random()*100))) );
console.log('cache.mainfest has reset');

//----- web 服务器设置 -----
web.use( bodyParser.json() );
web.use( bodyParser.urlencoded({extended: true}) );
web.use( cookieParser() );
web.use(
	//logger('dev')
	log4js.connectLogger(logger, {format: ':method :url :remote-addr'})
);

// 设置 session
session = session({
	store:      sessionStore
	, secret:   CONFIG.web.cookieSecret
	, key:      CONFIG.web.cookieKey
	, resave:   false
	, saveUninitialized: true
});
web.use( session );

var userInfo = {
	id: 1
};

// 判断浏览器类型，操作系统
//web.use(function(req, res, next){
//
//});

//----- 静态资源 重定向 -----
web.use('/cache.manifest', express.static(__dirname + '/public/cache.manifest') );  // 离线缓存配置文件

web.use('/favicon.ico', express.static(__dirname + '/public/image/favicon.ico'));

web.use('/script',  express.static(__dirname + '/public/script') ); // 前端 js 静态资源
web.use('/script/ui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );  // 前后端通用模板引擎

web.use('/font',    express.static(__dirname + '/public/font') );   // 字体图标
web.use('/image',   express.static(__dirname + '/public/image') );  // 图片
web.use('/style',   express.static(__dirname + '/public/style') );  // 样式
web.use('/media',   express.static(__dirname + '/public/media') );  // 多媒体文件

//web.use('/validator.html',    express.static(__dirname + '/validator.html') );  //

web.use('/lib',     express.static(__dirname + '/bower_components'));
web.use('/lib/zui', express.static(__dirname + '/public/script/ui'));
web.use('/lib/zui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );  // 前后端通用模板引擎

web.use('/doc',     express.static(__dirname + '/doc'));
web.use('/requirement',     express.static(__dirname + '/requirement'));

web.use('/test.html',    express.static(__dirname + '/test.html') );  //


/**
 * 加载模块
 * */
require('./module/user/controller.js'       );  // 加载模块 user

require('./module/blog/controller.js'       );  // 加载模块 blog

require('./module/document/controller.js'   );  // 加载模块 document

require('./module/editor/controller.js'     );  // 加载模块 editor

require('./module/bower/controller.js'      );  // 加载模块 bower

require('./module/reader/controller.js'     );  // 加载模块 reader

require('./module/resume/controller.js'     );  // 加载模块 profile

require('./module/task/controller.js'       );  // 加载模块 task

require('./module/tag/controller.js'        );  // 加载模块 tag 功能

//require('./module/image.js');       // 加载模块 image

require('./module/basedata/controller.js'   );  // 加载模块 基础数据

modules.register({
	id: 'time'
	, metroSize: 'tiny'
	, title: '时间 time'
	, icon: ''
	, href: '#'
});

/**
 * 访问主页
	/
 * */
web.get('/', function(req, res){
	var user = req.session.user
		;

	if( !user ){
		user = req.session.user = userInfo;
	}

	console.log(user);

	res.send( tpl.html('index', {
		title: '个人小站（开发测试中...）'
		, user: ('user' in session) ? '/user' : '/login'
		, modules:
			'<section id="userModule" class="module module-user metro normal">\
				<div class="module_content">\
					<div class="user_avatar">\
						<img src="image/default/avatar.png" id="userAvatar" height="110" width="110">\
					</div>\
					<form action="/login">\
						<button class="btn btn-submit" type="submit">登录</button>\
						<div class="formGroup">\
							<label class="label" for="email">电子邮箱</label>\
							<input type="text" class="input" id="email" name="email">\
						</div>\
						<div class="formGroup">\
							<label class="label" for="password">密&emsp;&emsp;码</label>\
							<input type="text" class="input" id="password" name="password">\
						</div>\
					</form>\
				</div>\
			</section>'+
			tpl.metroTpl( modules.modules ).join('') +
			'<a href="" target="_blank">\
				<section class="metro metro-tiny">\
					<h2 class="metro_title icon icon-renren"></h2>\
				</section>\
			</a>\
			<a href="" target="_blank">\
				<section class="metro metro-tiny">\
					<h2 class="metro_title icon icon-qq"></h2>\
				</section>\
			</a>\
			<a href="" target="_blank">\
				<section class="metro metro-tiny">\
					<h2 class="metro_title icon icon-wechat"></h2>\
				</section>\
			</a>\
			<a href="http://weibo.com/2707826454/profile" target="_blank">\
				<section class="metro metro-tiny">\
					<h2 class="metro_title icon icon-weibo"></h2>\
				</section>\
			</a>\
			<a href="https://github.com/zw251108" target="_blank">\
				<section class="metro metro-tiny">\
					<h2 class="metro_title icon icon-github"></h2>\
				</section>\
			</a>'
		, script: {
			main: 'script/index'
			, src: 'script/lib/require.min.js'
		}
	}) );
	res.end();
});


var User = require('./module/user/model.js')
	, UserError = require('./module/user/error.js')
	;

// 用户输入用户名 获取头像
web.get('/getavatar', function(req, res){
	var query = req.query || {}
		, email = query.email
		, execute
		;

	if( email ){
		execute = User.userAvatarByEmail( email ).then(function(rs){
			return {
				success: true
				, info: rs
			};
		});
	}
	else{
		execute = Promise.reject( new UserError('缺少 email') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		};
	}).then(function(rs){
		console.log(rs);

		res.send( JSON.stringify(rs) );
		res.end();
	});
});

// 用户登录
web.get('/login', function(){

});
web.post('/login', function(){
	// todo 登录功能
});

// 编码工具皮肤设置与获取
web.get('/skin', function(req, res){
	var session = req.session || {}
		, user = session.user
		, skin
		;

	if( !user ){
		user = req.session.user = userInfo;
		user.skin = 'default';
	}

	user.skin = skin = user.skin || 'default';

	res.send( JSON.stringify({
		success: true
		, skin: skin
	}) );
	res.end();
});
web.post('/skin', function(req, res){   // 设置皮肤功能
	var session = req.session || {}
		, user = session.user
		, body = req.body || {}
		, skin = body.skin
		;

	if( !user ){
		user = req.session.user = userInfo;
	}
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
	var user = req.session.user
		;

	if( !user ){
		req.session.user = userInfo;
	}

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
//socketServer.use(function(socket, next){
//	var data = socket.handshake || socket.request
//		, cookieData = data.headers.cookie
//		;
//
//	if( cookieData ){
//
//		data.cookie = cookie.parse( cookieData );
//		data.sessionID = cookieParser.signedCookie(data.cookie[CONFIG.web.cookieKey], CONFIG.web.cookieSecret);
//		data.sessionStore = sessionStore;
//
//		sessionStore.get(data.sessionID, function(err, session){
//			if( err || !session ){
//				next( new Error('session not found') );
//			}
//			else{
//				data.session = session;
//				data.session.id = data.sessionID;
//				next();
//			}
//		});
//	}
//	else{
//		next( new Error('missing cookie headers') );
//	}
//});

console.log('Socket Server is listening...');