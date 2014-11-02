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

	// Web 服务器相关组件
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, multer = require('multer')
	, logger = require('morgan')

	// socket.io
	, sio = require('socket.io')()

	// 错误类型信息
	, ERROR_MSG = {
		E0001: '信息不完整'
		, E0002: ''
		, E0003: ''
		, E0004: '所访问的内容不存在'
	}

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
	console.log('\n', 'index success');
});

//----- web 服务器设置 -----
webApp.use( bodyParser.json() );
webApp.use( bodyParser.urlencoded({extended: true}) );
webApp.use( cookieParser() );
webApp.use( logger('dev') );
webApp.use( multer({dest: './upload/'}) );

//----- 静态资源 重定向 -----
webApp.use('/script', express.static(__dirname + '/script') );
webApp.use('/style', express.static(__dirname + '/style') );
webApp.use('/image', express.static(__dirname + '/image') );

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
	res.send( CACHE.index );
	res.end();
});

webServer = webApp.listen(9001);


//----- socket 服务器 -----
var CLIENT_LIST = {}
	, CLIENT_INDEX_LIST = [];

function guid(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
		var r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8);
		return v.toString(16);
	}).toUpperCase();
}

sio.listen( webServer );
sio.on('connection', function(socket){

	// todo 设置索引
	// todo 应该获取 session
	var clientIndex = guid();
	CLIENT_LIST[clientIndex] = socket;
	CLIENT_INDEX_LIST.push( clientIndex );

	console.log('socket: id', clientIndex, 'connect')

	socket.on('getData', function(query){
		var topic = query.topic
			, receive = query.receive
			, sql
			, dbCallback
			, dbErr = function(){
				socket.emit(receive, {});
			}
			, id = query.id
			, uid = query.uid
			;

		switch( topic ){
			case 'document':
				sql = 'select title,content,section_title from document order by section_id';
				dbCallback = function(rs){
					var document = []
						, tempTitle = ''
						, tempArray
						, i, j;

					for(i = 0, j = rs.length; i < j; i++){
						if( rs[i].section_title !== tempTitle ){
							tempTitle = rs[i].section_title;
							tempArray = [];
							document.push({
								section_title: tempTitle
								, dl: tempArray
							});
						}

						tempArray.push( rs[i] );
					}
					socket.emit(receive, document);
				};
				break;
			case 'blog':
				sql = 'select Id,title,datetime,tagsId,tagsName from blog where status=1 order by Id desc';
				dbCallback = function(rs){
					socket.emit(receive, rs);
				};
				break;
			case 'blog/detail':
				sql = 'select content from blog where id='+ id;
				dbCallback = function(rs){
					rs[0].id = id;
					socket.emit(receive, rs[0]);
				};
				break;
			default:
				break;
		}
		dbInterface.select(sql, dbCallback, dbErr);
	});

	socket.on('disconnect', function(){
		console.log('socket: id', clientIndex, 'disconnect');
	});
});