///**
//* 定义常量
//* */
//var CONST_VAR = {}
//	, FEED_URL_ARRAY = [
//		'http://feed.feedsky.com/programmer'
//	]
//	, ARTICLE_URL_ARRAY = [
////		'http://zw150026.com/blog/detail.php?id=14&type=1'
////		, 'http://blog.csdn.net/zuoninger/article/details/38842823'
////		,
//		'http://www.iteye.com/news/26243'
//	]
//	, mainContent = {
//		'www.csdn.net': '.news_content'
//		, 'blog.csdn.net': '#article_content'
//		, 'www.iteye.com': '#news_content'
//	}
//	;
///**
//* 分析 URL
//* */
//var URL = require('url')
//	/**
//	 * 创建 HTTP 请求
//	 * */
//	,  HTTP = require('http')
//	/**
//	 * node-segment
//	 *  分词
//	 * */
//	, Segment = require('node-segment').Segment
//	, segment = new Segment()
//	/**
//	 * cheerio
//	 *  解析 HTML 结构
//	 * */
//	, Cheerio = require('cheerio')
//	;
//
//segment
//	// 识别模块
//	// 强制分割类单词识别
//	.use('URLTokenizer')            // URL识别
//	.use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
//	.use('PunctuationTokenizer')    // 标点符号识别
//	.use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
//	// 中文单词识别
//	.use('DictTokenizer')           // 词典识别
//	.use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后
//
//	// 优化模块
//	.use('EmailOptimizer')          // 邮箱地址识别
//	.use('ChsNameOptimizer')        // 人名识别优化
//	.use('DictOptimizer')           // 词典识别优化
//	.use('DatetimeOptimizer')       // 日期时间识别优化
//
//	// 字典文件
//	.loadDict('dict.txt')           // 盘古词典
//	.loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
//	.loadDict('names.txt')          // 常见名词、人名
//	.loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
//// 自定义
//segment.loadDict('../../../segment/web.txt')//.loadDict('wildcard.txt', 'WILDCARD', true); //
//
////var parsedUrl = URL.parse( ARTICLE_URL_ARRAY[1], true )
////	, host = parsedUrl.host
////	;
//
///**
//* HTTP GET 请求
//*  发送请求，获取 RSS
//* */
////var rssReq = HTTP.get(FEED_URL_ARRAY[0], function(res){
////	var rss = '';
////	res.setEncoding('utf8');
////	res.on('data', function(c){
////		rss += c;
////	});
////	res.on('end', function(){
////		console.log('\n',  rss );
////		var $ = Cheerio.load(rss)
////			;
////		var item = $('item');
////		var item1 = item.eq(0);
////
//////		console.log('\n',  item1.find('title').text() )
//////		console.log('\n',  item1.find('link')[0].next.data )
//////		console.log('\n',  item1.find('description').text() )
//////		console.log('\n',  item1.find('author').text() );
////		// title link description author
////
////		getArticle( item1.find('link')[0].next.data );
////	});
////});
////rssReq.end();
//
//
///**
//* HTTP GET 请求
//*  发送请求，获取网页
//* */
//function getArticle(url){
////	var host = URL.parse(url, true).host;
//
//	var req = HTTP.get(url, function(res){
//		var html = '';
//		res.setEncoding('utf8');
//		res.on('data', function(c){
//			html += c;
//		});
//		res.on('end', function(){
//			var
////				segment = new Segment()
////				, $ = Cheerio.load(html)
//				content
//				, rs
//				, obj = {}
//				, filterRs = []
//				, j
//				, prefix = '_' + (+new Date())
//				, temp
//				, w, p
//				;
//
//			// 获取页面主要内容
////			if( host in mainContent ){
////				content = $(mainContent[host]).text();
////			}
////			else{
////				content = html;
////			}
//
//			content = html.replace(/<\/?.*?>/g, ' ');
//
////			// 使用默认的识别模块及字典
////			segment.useDefault();
//			// 分词
//			rs = segment.doSegment( content );
//
//			// 统计
//			j = rs.length;
//			while( j-- ){
//				temp = rs[j];
//				p = temp.p;
//
//				/**
//				 * 过滤
//				 *  只统计 专有名词 外文字符 机构团体 地名 人名 动词 名词
//				 * */
//				if( !(p === 8 ||
//					p === 16 ||
//					p === 32 ||
//					p === 64 ||
//					p === 128 ||
//					p === 4096 ||
//					p === 1048576) ) continue;
//
//				/**
//				 * 对分出来的词加个前缀作为 key 存在 obj 对象中
//				 *  防止分出来的词存在 toString 一类已存在于对象中的属性的关键字
//				 * */
//				w = prefix + temp.w;
//
//				if( w in obj ){
//					filterRs[obj[w]].n++;
//				}
//				else{
//					filterRs.push({
//						tagName: temp.w
//						, p: p
//						, n: 1
//					});
//					obj[w] = filterRs.length -1;
//				}
//			}
//
//			// 排序
//			filterRs.sort(function(a, b){
//				return b.n - a.n;
//			});
//
//			w = 0;
//			j = filterRs.length;
//			while( w !== 10 && w < j ){
//				console.log('\n', filterRs[w]);
//
//				w++;
//			}
//		});
//	});
//	req.end();
//}
//
//ARTICLE_URL_ARRAY.forEach(getArticle);



//// 载入模块
//var Segment = require('node-segment').Segment;
//// 创建实例
//var segment = new Segment();
//// 配置，可根据实际情况增删，详见segment.useDefault()方法
//segment.use('DictTokenizer')  // 载入识别模块，详见lib/module目录，或者是自定义模块的绝对路径
////.use('URLTokenizer')            // URL识别
////	.use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
////	.use('PunctuationTokenizer')    // 标点符号识别
////	.use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
//segment.loadDict('dict.txt'); // 载入字典，详见dicts目录，或者是自定义字典文件的绝对路径
//
//segment
//	// 识别模块
//	// 强制分割类单词识别
//	.use('URLTokenizer')            // URL识别
//	.use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
//	.use('PunctuationTokenizer')    // 标点符号识别
//	.use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
//	// 中文单词识别
//	.use('DictTokenizer')           // 词典识别
//	.use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后
//
//	// 优化模块
//	.use('EmailOptimizer')          // 邮箱地址识别
//	.use('ChsNameOptimizer')        // 人名识别优化
//	.use('DictOptimizer')           // 词典识别优化
//	.use('DatetimeOptimizer')       // 日期时间识别优化
//
//	// 字典文件
//	.loadDict('dict.txt')           // 盘古词典
//	.loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
//	.loadDict('names.txt')          // 常见名词、人名
//	.loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
//// 自定义
//segment.loadDict('../../../segment/web.txt', 'Web', true);
//
//// 开始分词
//console.log('\n', segment.doSegment('<p>前端工程师，有一个人</p>这是一个基于Node.js的中文分词模块。互联网，Java'));

//---------- 使用 Express 开发 Web 应用 ----------
/**
 * Web 服务器
 * */
//var express = require('express')
//	, partials = require('express-partials')    // 模板
//	, http = require('http')
//	, path = require('path')
//	, app = express()
//	, tweets = []
//	;
//
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//app.use(partials());
//
//// 中间件 错误处理
//app.use(function(err, req, res, next){
//	console.error(err.stack);
//	res.send(500, 'Something broke');
//});
////app.use(express.bodyParser());  // express.bodyParset() 中间件，把 POST 数据转换成 JavaScript 对象
//
////app.use(express.json);
//app.use(express.urlencoded());
//
//app.use(express.methodOverride());
//app.use(express.cookieParser('cookie'));
//app.use(express.session());
//app.use(app.router);
//
//console.log('\n', __dirname, path.join(__dirname, 'views'));
//
//// 为匹配第一个参数所指定 URL 的 get 请求指定回调函数
//app.get('/', function(req, res){
//	res.render('index', {
//		locals: {
//			layout: 'index',
//			title: 'hi',
//			header: 'welcome',
//			tweets: tweets,
//			style: '//192.168.0.46/truth/style/style.css'
//		}
//	});
//
////	res.send('welcome');
//});
//
//app.get('/tweets', function(req, res){
//	res.send( tweets );
//});
//
//function acceptsHtml(header){
//	var accepts = header.split(',')
//		, i = 0
//		, j = accepts.length
//		;
//	for(; i < j; i++){
//		if( accepts[i] === 'text/html' ){
//			return true;
//		}
//	}
//	return false;
//}
//app.post('/send/:a', function(req, res){
//	var msg = {
//		status: 'ok'
//	};
//
//	console.log('\n', req.params, req.param, req.param('tweet'), req.body, req.query);
//	if( req.body && req.body.tweet ){
//		tweets.push( req.body.tweet );
//
//		msg.message = 'tweet received';
//
////		if( acceptsHtml(req.headers['accept']) ){
////			res.redirect('/', 302);
////			return;
////		}
//	}
//	else{
//		msg.message = 'no tweet received';
//	}
//
//	res.send( msg );
//});
//
//
//app.listen(3000);

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
	, dbErrorCallback = function(e){	// 数据库异常回调函数
		console.log('\n', 'Error: '+ e.message);
	}

	, path = require('path')
	, url = require('url')

	// Web 框架
	, express = require('express')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, multer = require('multer')
	, logger = require('morgan')
	, webApp = express()
	// 静态资源类型
	, mime = {
		html : 'text/html',
		css  : 'text/css',
		js   : 'text/javascript',
		json : 'application/json',
		ico  : 'image/x-icon',
		gif  : 'image/gif',
		jpeg : 'image/jpeg',
		jpg  : 'image/jpeg',
		png  : 'image/png',
		pdf  : 'application/pdf',
		svg  : 'image/svg+xml',
		swf  : 'application/x-shockwave-flash',
		tiff : 'image/tiff',
		txt  : 'text/plain',
		wav  : 'audio/x-wav',
		wma  : 'audio/x-ms-wma',
		wmv  : 'video/x-ms-wmv',
		xml  : 'text/xml'
	}

	// 项目配置
	, STATIC_PATH = '../'   // 前端 JS 路径
	, STYLE_HTML = ''
	, HEADER_HTML = ''
	, FOOTER_HTML = ''
	, ERROR_MSG = {
		E0001: '信息不完整'
		, E0002: ''
		, E0003: ''
		, E0004: '所访问的内容不存在'
	}

	// 页面资源缓存
	, CACHE = {
		index: '<!DOCTYPE html>' +
			'<html lang="zh-CN">' +
			'<head>' +
				'<meta charset="utf-8" />' +
				'<!--[if lt IE 9]><meta http-equiv="content-type" content="text/html; charset=utf-8" /><![endif]-->' +
				'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />' +
				'<title>个人小站（开发测试中...）</title>' +
				'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />' +
				'<meta name="author" content="周文博" />' +
				'<meta name="description" content="小小的前端工程师，自说自话，自娱自乐的小网站" />' +
				'<meta name="keywords" content="web,前端,html,html5,css,css3,javascript" />' +
//				'<meta name="msapplication-TileColor" content="#44cef6"/><!-- win 8 磁贴颜色 -->' +
//				'<meta name="msapplication-TileImage" content="image/favicon.png"/><!-- win 8 磁贴图标 -->' +
//				'<meta name="msapplication-tap-highlight" content="no" />' +
//				'<link rel="shortcut icon" type="image/x-icon" href="image/favicon.ico" />' +
//				'<link rel="stylesheet" href="style/style.css" />' +
//				'<link rel="stylesheet" href="script/plugin/clippy/clippy.css" />' +
//				'<!--[if lt IE 9]>' +
//				'<link rel="stylesheet" href="style/ie.css" />' +
//				'<script src="script/lib/html5shiv/html5shiv.min.js"></script>' +
//				'<![endif]-->' +
			'</head>' +
			'<body class="Container index">' +
//				'<header class="Header">' +
//					'<nav class="nav large" id="header">' +
//						'<a class="btn btn-link btn-menuItem btn-menuItem-home" id="home" href="" title="返回首页"></a>' +
//						'<button class="btn btn-menu hidden" id="menu" type="button" title="显示菜单"></button>' +
//						'<ul id="headerMenu" class="menu hidden">' +
//							'<li>' +
//								'<a class="btn btn-link btn-menuItem btn-menuItem-blog" title="博客" href="blog/">博客<br />blog</a>' +
//							'</li>' +
//							'<li>' +
//								'<a class="btn btn-link btn-menuItem btn-menuItem-document" title="前端文档" href="document/">前端文档<br />document</a>' +
//							'</li>' +
//							'<li>' +
//								'<a class="btn btn-link btn-menuItem btn-menuItem-editor" title="编辑器" href="editor/">编辑器<br />editor</a>' +
//							'</li>' +
//							'<li>' +
//								'<a class="btn btn-link btn-menuItem btn-menuItem-favorite" title="收藏夹" href="favorite/">收藏夹<br />favorite</a>' +
//							'</li>' +
//							'<li>' +
//								'<a class="btn btn-link btn-menuItem btn-menuItem-rss" title="订阅" href="rss/">订阅<br />rss</a>' +
//							'</li>' +
//							'<li>' +
//								'<a class="btn btn-link btn-menuItem btn-menuItem-palette" title="调色板" href="palette/">调色板<br />palette</a>' +
//							'</li>' +
//						'</ul>' +
//						'<button class="btn btn-menuItem btn-menuItem-copyright" id="copyright" type="button" title="copyright &copy; 2014 周文博 All rights reserved"></button>' +
//						'<button class="btn btn-backTop hidden" id="backTop" type="button" title="回到顶部"></button>' +
//					'</nav>' +
//				'</header>' +
				'<a href="#/blog/">' +
					'<section class="module module-metro big module-blog">' +
						'<h2 class="module_title">博客 blog</h2>' +
						'<span class="module_info"></span>' +
					'</section>' +
				'</a>' +
				'<a href="#/profile/">' +
					'<section class="module module-metro tiny module-user">' +
						'<h2 class="module_title">我 me</h2>' +
					'</section>' +
				'</a>' +
				'<section class="module module-metro tiny module-watch">' +
					'<h2 class="module_title">时间 time</h2>' +
					'<div class="watch_wrap hidden" id="watch">' +
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
					'</div>' +
				'</section>' +
//				'<a href="#/calendar/">' +
//				'<section class="module module-metro small module-calendar" id="calendar">' +
//					'<h2 class="module_title">' +
//					'日历 calendar' +
//					'</h2>' +
//					'<span class="module_info">2014 年 10 月</span>' +
//					'<div class="calendar_today">13</div>' +
//				'</section>' +
//				'<!--</a>-->' +
//				'<section class="module module-metro small module-weather" id="weather">' +' +
//					'<h2 class="module_title">' +
//					'天气预报 weather' +
//					'</h2>' +
//					'<span class="module_info"></span>' +
//				'</section>' +
//				'<a href="#/document/">' +
//					'<section class="module module-metro small module-document">' +
//						'<h2 class="module_title">' +
//						'前端文档 document' +
//						'</h2>' +
//					'</section>' +
//				'</a>' +
//				'<a href="#/editor/">' +
//					'<section class="module module-metro small module-editor">' +
//						'<h2 class="module_title">' +
//						'编辑器 editor' +
//						'</h2>' +
//						'<span class="module_info"></span>' +
//					'</section>' +
//				'</a>' +
//				'<a href="favorite">' +
//					'<section class="module module-metro normal module-favor">' +
//						'<h2 class="module_title">' +
//						'收藏夹 favorite' +
//						'</h2>' +
//					'</section>' +
//				'</a>' +
//				'<a href="#/palette/">' +
//					'<section class="module module-metro small module-palette">' +
//						'<h2 class="module_title">' +
//						'调色板 palette' +
//						'</h2>' +
//					'</section>' +
//				'</a>' +
//				'<a href="#/rss/">' +
//					'<section class="module module-metro normal module-rss">' +
//						'<h2 class="module_title">' +
//						'订阅 rss' +
//						'</h2>' +
//					'</section>' +
//				'</a>' +
//				'<section class="module large module-advert hidden">' +
//					'<h2 class="module_title">可耻的广告区</h2>' +
//				'</section>' +
//				'<div class="clearfix"></div>' +
//				'<div id="statistics" class="hidden"></div>' +
//				'<script>' +
//				'var USER_INFO = null,' +
//				'shim = ['jquery'],' +
//				'MODULE_CONFIG = MODULE_CONFIG || {' +
//					'shim:{' +
//					'extend:shim,' +
//					'clippy:shim,' +
//					'validator:shim' +
//					'},' +
//				'paths:{' +
//					'jquery:'lib/jQuery/jquery.min',' +
//					'global:'module/global',' +
//					'extend:'ui/jquery.extend',' +
//					'clippy:'plugin/clippy/clippy.min',' +
//					'validator:'ui/jquery.validator'' +
//					'}' +
//				'};' +
//				'</script>' +
//				'<!--[if lt IE 9]><script src="script/ie.js"></script><![endif]--><script data-main="script/index" src="script/lib/require/require.js"></script>' +
			'</body>' +
		'</html>'
	}
	;

//----- 读取文件 -----
fs.readFile('index.html', function(e, d){
	if( e ){
		console.log('\n', 'index error');
		return ;
	}
	CACHE.index = d.toString();
	console.log('\n', 'index success');
});
//fs.readFile('template/style.html', function(e, d){
//	if( e ){
//		console.log('\n', '读取 style 模板异常');
//		return ;
//	}
//	STYLE_HTML = d.toString();
//	console.log('\n', '读取 style 模板完成');
//});
//fs.readFile('template/header.html', function(e, d){
//	if( e ){
//		console.log('\n', '读取 header 模板异常');
//		return ;
//	}
//	HEADER_HTML = d.toString();
//	console.log('\n', '读取 header 模板完成');
//});
//fs.readFile('template/footer.html', function(e, d){
//	if( e ){
//		console.log('\n', '读取 footer 模板异常');
//		return ;
//	}
//	FOOTER_HTML = d.toString();
//	console.log('\n', '读取 footer 模板完成');
//});
//console.log('\n', 'bodyParser' in express, typeof express.bodyParser)
//bodyParser({
//	uploadDir:'./upload'
//	, extended: true
//})
//----- web 服务器 -----
webApp.use( logger('dev') );
//webApp.use( bodyParser({
//	uploadDir:'./upload'
//	, extended: true
//}) );
webApp.use( bodyParser.json() );
webApp.use( bodyParser.urlencoded({extended: true}) );
webApp.use( cookieParser() );
webApp.use( multer({dest: './upload/'}) );

///**
// * 博客模块
// *  /blog/
// *  /blog/detail.php?id=:id&_=.*
// * */
//webApp.get('/blog/', function(req, res){
//	'blog' in CACHE ? res.send( CACHE.blog ) : fs.readFile('template/blog/index.html', function(e, d){
//		var page = d.toString()
//				.replace(/%STYLE_HTML%/, STYLE_HTML)
//				.replace(/%HEADER_HTML%/, HEADER_HTML)
//				.replace(/%FOOTER_HTML%/, FOOTER_HTML)
//				.replace(/%STATIC_PATH%/g, STATIC_PATH)
//				.replace(/%PAGE_TITLE%/, '个人小站（开发测试中...）-博客目录')
//			;
//
//		conn.query('select Id,title,datetime,tagsId,tagsName from blog order by Id desc', function(e, rs){
//			if( e ){
//				dbErrorCallback( e );
//			}
//			else{
////				console.log('\n', rs, JSON.stringify(rs));
//				page = page.replace(/%BLOG_LIST%/, JSON.stringify(rs));
//
//				CACHE.blog = page;
//
//				res.send( page );
//				res.end();
//			}
//		});
//	});
//});
//webApp.get(/\/blog\/detail\.php/, function(req, res){
//	var id = req.query.id || '';
//
//	if( id ){
//		('detail/'+ id) in CACHE ? res.send( CACHE['detail/'+ id] ) :
//			conn.query('select content from blog where id=?', [id], function(e, rs){
//				if( e ){
//					dbErrorCallback( e );
//					res.send('{error: "E0004", msg:"'+ ERROR_MSG.E0004 +'"}');
//				}
//				else{
//					res.send( JSON.stringify(rs[0]) );
//				}
//				res.end();
//			});
//	}
//	else{
//		res.send('{error: "E0001", msg:"'+ ERROR_MSG.E0001 +'}');
//		res.end();
//	}
//});
//
/**
* Web 前端文档
*  /document/
* */
webApp.get('/document/', function(req, res){
	conn.query('select title,content from document where section_id=0', function(e, rs, fields){
		if( e ){
			console.log('\n', '读取数据库出错');
		}
		else{
			console.log('\n', req.query)
			if( req.query.type === 'json' ){
				res.send( '['+ rs.map(function(i){
					return JSON.stringify(i);
				}).join() +']' );
			}
			else{
				res.send('123');
			}
		}
		res.end();
	});
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

/**
 * 访问静态资源 *.*
 * */
webApp.get(/.*\..*$/, function(req, res){
//	console.log('\n', req.url)

	var pathname = url.parse( req.url ).pathname
		, extname = path.extname( pathname )
		, type = extname.slice(1)
		;

	// 判断是否已有缓存
	if( pathname in CACHE ){
		res.writeHead(200, {'Content-Type': mime[type]});
		res.write(CACHE[pathname], 'binary');
		res.end();
	}
	else{
		fs.readFile('.'+ pathname, function(e, d){

			if( e ){
				res.writeHead(404, {'Content-Type': 'text/plain'});

			}
			else{
//				CACHE[pathname] = d;    // 加入缓存
				console.log('\n', '缓存 ', pathname);

				res.writeHead(200, {'Content-Type': mime[type]});
				res.write(d, 'binary');
			}
			res.end();
		});
	}
});

/**
 * 统一上传接口
 * */
webApp.post('/upload', function(req, res){

	console.log('\n', req.params);
	console.log('\n', req.body);
	console.log('\n', req.files);
});

/**
 * 访问主页	/
 * */
webApp.get('/', function(req, res){
//	req.params.type
//	'index' in CACHE ?
		res.send( CACHE.index )
//		: fs.readFile('template/index.html', function(e, d){
//		var page = d.toString()
//				.replace(/%STYLE_HTML%/, STYLE_HTML)
//				.replace(/%HEADER_HTML%/, HEADER_HTML)
//				.replace(/%FOOTER_HTML%/, FOOTER_HTML)
//				.replace(/%STATIC_PATH%/g, '')
//				.replace(/%PAGE_TITLE%/, '个人小站（开发测试中...）')
//			;
//
//		CACHE.index = page;
//
//		res.send( page );
//		res.end();
//	});
});

/**
 * 404
 * */
webApp.get('*', function(req, res){
	console.log('\n', '请求'+ req.url);
});
webApp.listen(9001);