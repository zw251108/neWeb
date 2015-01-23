'use strict';

/**
 * Web Server
 * */
var fs = require('fs')

	// Web 服务器
	, express = require('express')
	, web = express()
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
	, DB_CONFIG = {
		DB_SERVER_HOST: 'localhost'
		, DB_SERVER_PORT: 3306
		, DB_USERNAME: 'root'
		, DB_PASSWORD: 'zw251108'
		, DB_DATABASE: 'destiny'
	}
	, db = require('./module/db.js').db( DB_CONFIG )

	// 模块库
	, tpl = require('./module/tpl.js').tpl
	, template = require('./module/emmetTpl/emmetTpl.js').template

	// Web Socket
	, socketServer = require('./module/socket.js')
	;

//----- 重置 manifest 版本代号
var manifest = fs.readFileSync(__dirname + '/tpl/cache.manifest').toString();
fs.writeFileSync(__dirname + '/public/cache.manifest', new Buffer(manifest.replace('%v%', Math.floor(Math.random()*100))) );
console.log('cache.mainfest has reset');

//----- web 服务器设置 -----
web.use( bodyParser.json() );
web.use( bodyParser.urlencoded({extended: true}) );
web.use( cookieParser() );
web.use( logger('dev') );
// 文件上传设置
web.use( multer({
	dest: './public/upload/'
}) );
// session 设置
web.use( session({
	store: sessionStore
	, secret: COOKIE_SECRET
	, key: COOKIE_KEY
	, resave: true
	, saveUninitialized: true
}) );

//----- 静态资源 重定向 -----
// js
web.use('/script', express.static(__dirname + '/public/script') );
// 前后端通用模板引擎
web.use('/script/ui/jquery.emmetTpl.js', express.static(__dirname + '/module/emmetTpl/emmetTpl.js') );

//样式
web.use('/font', express.static(__dirname + '/public/font') );
web.use('/image', express.static(__dirname + '/public/image') );
web.use('/style', express.static(__dirname + '/public/style') );
// 离线缓存
web.use('/cache.manifest', express.static(__dirname + '/public/cache.manifest') );

web.use('/test_case', express.static(__dirname + '/test_case') );

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

var moduleTpl = template({
	template: 'div.Container>section#%moduleId%.module.module-main.module-%moduleId%.large>div.module_content{%moduleContent%}'
});
var stylesheetTpl = template({
	template: 'link[rel=stylesheet href=%path%]'
});
var styleTpl = template({
	template: 'style{%style%}'
});
var scriptTpl = template({
	template: 'script[data-main=%main% src=%require%]'
});

/**
 * 博客模块
 *  /blog/
 *  /blog/detail/?id=:id&_=.*
 * */
web.get('/blog/', function(req, res){
	var header = tpl('header')
		, footer = tpl('footer')
		, articleTpl = template({
			template:'article#blogArt%Id%.article>a[href=detail?id=%Id%]>h3.article_title{%title%}' +
			'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
			, filter: {
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
				//	return tagTpl(data).join('');
				//}
			}
		})
		;
	db.query('blog', [], function(data){
		res.send(header.replace('%pageTitle%', '博客 Blog').replace('%style%', '') + moduleTpl([{
			moduleId: 'blog'
			, moduleContent: articleTpl(data).join('')
		}]).join('') + footer);
		res.end();
	}, function(){
		res.end();
	});
});
web.get('/blog/detail', function(req, res){
	var id = req.query.id || ''
		, header = tpl('header')
		, footer = tpl('footer')
		, articleDetailTpl = template({
			template: 'article.article>h3.article_title{%title%}+div.article_content{%content%}+hr' +
			'+span.article_date{%datetime%}+div.tagsArea{%tags%}'
			, filter: {

			}
		})
		;
	if( id ){
		db.query('blog/detail', [id], function(data){
			res.send(header.replace('%pageTitle%', '博客 Blog').replace('%style%', '') + moduleTpl([{
				moduleId: 'blog'
				, moduleContent: articleDetailTpl(data).join('')
			}]).join('') + footer);
			res.end();
		}, function(){
			res.end();
		});
	}
	else{
		res.end();
	}
});

/**
 * Web 前端文档
 *  /document/
 * */
web.get('/document/', function(req, res){
	var header = tpl('header')
		, footer = tpl('footer')
		, dlTpl = template({
			template: 'dt.icon.icon-arrow-r{%title%}+dd{%content%}'
		})
		, sectionTpl = template({
			template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon.icon-minus^dl{%dl%}'
			, filter: {
				dl: function(d){
					return dlTpl(d.dl).join('');
				}
			}
		})
		;
	db.query('document', [], function(data){
		res.send(header.replace('%pageTitle%', '前端文档 Document')
			.replace('%style%', stylesheetTpl({
				path: '../script/plugin/codeMirror/lib/codemirror.css'
			}).join('')) + moduleTpl([{
				moduleId: 'document'
				, moduleContent: sectionTpl(data).join('')
			}]).join('') + scriptTpl([{
				main: '../script/module/document/index'
				, require: '../script/lib/require.min.js'
			}]).join('') + footer);
		res.end();
	}, function(){
		res.end();
	});
});

/**
 * 编辑器模块
 * editor/
 * editor/code/
 * */
web.get('/editor/', function(req, res){
	var header = tpl('header')
		, footer = tpl('footer')
		, codeTpl = template({
			template: 'a[href=code?id=%Id%]' +
				'>article.article.editor_article[data-tagsid=%tagsId%]' +
				'>h3.article_title{%name%}' +
				'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]',
			filter:{
				alt:function(data, index){
					return data.preview ? data.name : '没有预览图片';
				}
			}
		})
		;
	db.query('editor', [], function(data){
		res.send(header.replace('%pageTitle%', '前端编辑器 Editor').replace('%style%', '') + moduleTpl([{
			moduleId: 'editor'
			, moduleContent: codeTpl(data).join('')
		//}]).join('') + scriptTpl([{
		//	main: '../script/module/editor/index'
		//	, require: '../script/lib/require.min.js'
		}]).join('') + footer);
		res.end();
	}, function(){
		res.end();
	});
});
web.get('/editor/code', function(req, res){
	var id = req.query.id || ''
		, header = tpl('header')
		, footer = tpl('footer')
		, codeEditTpl = template({
			template: 'h3.editor_title{%name%}>input#id[type=hidden name=id value=%Id%]' +
				'^div#editorContainer.editor_container' +
				'>div.editor_area>label[for=html]{HTML}+textarea#html.hidden.code-html[name=html]{%html%}' +
				'^div.editor_area>label[for=css]{CSS}+textarea#css.hidden.code-css[name=css]{%css%}' +
				'^div.editor_area>label[for=js]{JavaScript}+textarea#js.hidden.code-js[name=js]{%js%}' +
				'^div.editor_area>label{Result}+iframe#result.editor_text[src=result?id=%Id% name=result]'
		})
		;
	if( id ){
		db.query('editor/code', [id], function(data){
			res.send(header.replace('%pageTitle%', '前端编辑器 Editor')
				.replace('%style%', stylesheetTpl({
					path: '../script/plugin/codeMirror/lib/codemirror.css'
				}).join('')) + moduleTpl([{
					moduleId: 'editor'
					, moduleContent: codeEditTpl(data).join('')
				}]).join('') + scriptTpl([{
					main: '../script/module/editor/code'
					, require: '../script/lib/require.min.js'
				}]).join('') + footer);
			res.end();
		}, function(){
			res.end();
		});
	}
	else{
		res.end();
	}
});
web.get('/editor/result', function(req, res){
	var id = req.query.id || ''
		, result = tpl('editor/result')
		;
	if( id ){
		db.query('editor/code', [id], function(data){
			res.send(result.replace('%style%', data.css)
				.replace('%html%', data.html)
				.replace('%script%', data.js));
			res.end();
		}, function(){
			res.end();
		});
	}
	else{
		res.end();
	}
});

web.get('/bower/', function(req, res){
	var header = tpl('header')
		, footer = tpl('footer')
		, bowerTpl = template({
			template: 'tr>td{%name%}+td{%version%}+td{%css_path%}+td{%js_path%}' +
				'+td>a[href=%demo_path% target=_blank]{%demo_path%}^td{%tags_html%}+td{%receipt_time%}'
		})
	    ;
	db.query('bower', [], function(data){console.log(data);
		res.send(header.replace('%pageTitle%', 'Bower 组件管理').replace('%style%', '') +
			moduleTpl({
				moduleId: 'bower'
				, moduleContent: '<div class="wrap"><table class="lib_table"><thead><tr>' +
					'<th>组件名称</th>' +
					'<th>版本</th>' +
					'<th>CSS 文件路径</th>' +
					'<th>JS 文件路径</th>' +
					'<th>demo 页面</th>' +
					'<th>标签</th>' +
					'<th>收录时间</th>' +
					'</tr></thead><tbody>'+ bowerTpl(data).join('') +'</tbody></table></div>'
			}).join('') +
			scriptTpl({
				main: '../script/bower'
				, require: '../script/lib/require.min.js'
			}).join('') +
		footer);
		res.end();
	}, function(){
		res.end();
	})
});

//web.all('/user/:id/:op?', function(req, res, next){
//	req.user = users[req.params.id];
//	console.log('\n', req.user);
//	if( req.user ){
//		next();
//	}
//	else{
//		next( new Error('can not find id: '+ req.params.id ) );
//	}
//});
//web.get(/^\/(\d+)$/, function(req, res){
//	res.send( 'reg '+ req.params[0] );
//});
//web.get('/a*', function(req, res){
//	res.send('a');
//});
//web.get('/:id(b\\d+)', function(req, res){
//	if( req.params.id ){
//		res.send( req.params.id );
//	}
//	else{
//		res.send('hello world');
//	}
//});
//web.get('/user/:id', function(req, res, next){
//	var id = req.params.id;
//	if( /^\d+$/.test( id ) ){
//		res.send( 'id: '+ id );
//	}
//	else{
//		next();
//	}
//});
//web.get('/user/:name', function(req, res){
//	var name = req.params.name;
//	res.send( 'name: '+ name );
//});
//web.get('/user/:id/edit', function(req, res){
//	res.send('edit user: '+ req.user.name);
//});
//web.get('/user/:id/getData.:format((json|xml))', function(req, res){
//	res.send('{"name":"zwb"}');
//});
//web.get('*', function(req, res){
//	res.send('<form action="/" method="post">' +
//	'<input type="hidden" name="_method" value="put"/>' +
//	'<input type="text" name="name"/>' +
//	'<input type="submit" value="提交"/>' +
//	'</form>');
//});
//
//web.put('/', function(req, res){
//	res.send('welcome, '+ req.body.name);
//});
///**
// * 访问静态资源 *.*
// * */
//web.get(/.*\..*$/, function(req, res){
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
web.get('/', function(req, res){
	console.log('session id', req.session.id);

	res.send( tpl('index') );
	res.end();
});

webServer = web.listen( WEB_APP_PORT );

console.log('Web Server is listening...');

//----- socket 服务器 -----
socketServer = socketServer.listen(webServer, db);

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