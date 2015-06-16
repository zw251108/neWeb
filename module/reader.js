'use strict';

var Reader = {
		index: {
			sql: 'select * from rss'
		}
		, bookmark: {
			sql: 'select Id,title,url,status from reader order by status,Id desc'
		}
		, isInList: {
			sql: 'select url from reader where url like ?'
		}
		, getStatus: {
			sql: 'select status from reader where Id=?'
		}
		, addToList: {
			sql: 'insert into reader(url,title,datetime) value(?,?,now())'
		}
		, read: {
			sql: 'update reader set status=1 where Id=?'
		}
		, favor: {
			sql: 'update reader set status=2 where Id=?'
		}
	}

	/**
	 * 访问 路径
	 * */
	, superAgent = require('superagent')

	/**
	 * cheerio
	 *  解析 HTML 结构
	 * */
	, Cheerio = require('cheerio')

	, db        = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, rssTpl    = emmetTpl({
		template: 'section#rss_%Id%.rss_section.section>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]>h3.section_title{%name%}>span.icon.icon-plus^^ul.rss_articleList'
	})
	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article[data-id=%Id%]>a[href=%url% title=%url% target=_blank]>h3.article_title{%title%}' +
		'^hr+a.icon.icon-checkbox%readStatus%[href=reader/read title=%readTitle%]{%readText%}' +
		'+a.icon.icon-star%favorStatus%[href=reader/favor title=%favorTitle%]{%favorText%}+a.icon.icon-cancel[href=reader/remove title=删除]{删除}'
		, filter: {
			title: function(d){
				return d.title || d.url;
			}
			, readStatus: function(d){
				return +d.status > 0 ? '-checked' : '';
			}
			, readTitle: function(d){
				return +d.status > 0 ? '已读' : '未读';
			}
			, readText: function(d){
				return +d.status > 0 ? '已读过' : '读过';
			}
			, favorStatus: function(d){
				return +d.status > 1 ? '' : '-empty';
			}
			, favorTitle: function(d){
				return +d.status > 1 ? '已收藏' : '未收藏';
			}
			, favorText: function(d){
				return +d.status > 1 ? '已收藏' : '收藏';
			}
		}
	})

	/**
	 * 获取订阅 rss
	 * */
	, getFeedList = function(feed, done, error){
		console.log('获取 rss 订阅源：', feed);

		superAgent.get(feed).end(function(err, res){

			if( !err ){
				var rss = res.text
					, $
					, $item
					, i, j, temp, $t
					, rs = []
					;

				if( rss ){
					$ = Cheerio.load(rss, {xmlMode: true});
					$item = $('item');

					for(i = 0, j = $item.length; i < j; i++){
						temp = {};
						$t = $item.eq(i);

						temp.title = $t.find('title').text();
						temp.url = $t.find('link').text();
						temp.content = $t.find('description').text();
						temp.author = $t.find('author').text();
						!temp.author && (temp.author = $t.find('dc\\:creator').text());
						temp.tags = $t.find('category').map(function(){
							return $(this).text();
						}).get().join();
						temp.datetime = $t.find('pubDate').text();

						rs.push(temp);
					}

					done(rs);
				}
				else{
					error();
				}
			}
			else{
				error();
			}
		});
	}
	/**
	 * 获取订阅文章 并分解截取
	 * */
	, getArticle = function(url, done, error){
		console.log('获取 feed 文章：', url);

		superAgent.get(url).end(function(err, res){
			if( !err ){
				var html = res.text
					, $
					, $main
					, content
					, rs
					, obj = {}
					, filterRs = []
					, j
					, prefix = '_' + (+new Date())
					, temp
					, w, p
					;

				console.log(html);
				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					$main = $('article');
					content = $main.length ? $main.html() : $('body').html();

					console.log(content);

					rs = segment.doSegment( content );
					console.log(rs);

					// 统计
					j = rs.length;
					while( j-- ){
						temp = rs[j];
						p = temp.p;

						/**
						 * 过滤，只统计
						 *  8   专有名词
						 *  16  外文字符
						 *  32  机构团体
						 *  64  地名
						 *  128 人名
						 *  4096    动词
						 *  1048576 名词
						 * */
						if( !(p === 8 ||
							p === 16 ||
							p === 32 ||
							p === 64 ||
							p === 128 ||
							p === 4096 ||
							p === 1048576) ) continue;

						/**
						 * 对分出来的词加个前缀作为 key 存在 obj 对象中
						 *  防止分出来的词存在 toString 一类已存在于对象中的属性的关键字
						 * */
						w = prefix + temp.w;

						if( w in obj ){
							filterRs[obj[w]].n++;
						}
						else{
							filterRs.push({
								tagName: temp.w
								, p: p
								, n: 1
							});
							obj[w] = filterRs.length - 1;
						}
					}

					// 排序
					filterRs.sort(function(a, b){
						return b.n - a.n;
					});

					console.log('\n', filterRs);

					done( filterRs.slice(0, 20) );
				}
				else{
					error();
				}
			}
			else{
				error();
			}
		});
	}
	/**
	 * 获取文章标题
	 * */
	, getTitle = function(url, done, error){
		superAgent.get(url).end(function(err, res){
			if( !err ){
				var html = res.text
					, $
					;

				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					done(url, $('title').text());
				}
				else{
					error( err );
				}
			}
			else{
				error( err );
			}
		});
	}
	, checkExist = function(){}
	, checkRead = function(){}
	, checkFavor = function(){}

	, Event = require('events').EventEmitter
	, readerController  = new Event()
	, readerModel       = new Event()
	, readerResponse    = new Event()
	, readerSocket      = new Event()
	;

readerController.on('reader/web', function(res){
	readerModel.emit('reader', readerResponse, res);
}).on('reader/socket', function(socket){
	readerModel.emit('reader', socket);
}).on('reader/bookmark/web', function(res){
	readerModel.emit('reader/bookmark', readerResponse, res);
}).on('reader/bookmark/add/socket', function(data, socket){
	//if( data.query.url ){
		readerModel.emit('reader/bookmark/add', data, readerSocket, socket);
	//}
	//else{
	//	socket.emit('error', {
	//		error: 'E0004'
	//		, msg: ''
	//	});
	//	error( 'E0004' );
	//}
	//readerModel.emit('reader/bookmark/add', data)
});

readerModel.on('reader', function(next, args){
	db.query('select * from rss', function(err, rs){
		if( !err ){
			next.emit('reader', rs, args);
		}
		else{
			error(err);
		}
	});
}).on('reader/add', function(){
}).on('reader/favorArticle', function(){
}).on('reader/bookmark', function(next, args){
	db.query('select * from reader', function(err, rs){
		if( !err ){
			next.emit('reader/bookmark', rs, args);
		}
		else{
			error( err );
		}
	});
}).on('reader/bookmark/add', function(data, next, args){
	db.query('insert into reader(url,title,datetime) select ?,?,now() from dual where not exists (select * from reader where url like ? limit 0,1)', data, function(err, rs){
		console.log(123123)
		if( !err ){
			next.emit('reader/bookmark/add', {
				id: rs.insertId
				, url: data[0]
				, title: data[1]
				, status: 0
			}, args);
		}
		else{
			error( err );
		}
	});
}).on('reader/bookmark/read', function(data, next, args){
	db.query('update reader set status=1 where Id=? and status<1', data, function(err, rs){

	});
}).on('reader/bookmark/favor', function(data, next, args){
	db.query('update reader set status=2 where Id=? and status<2', data, function(err, rs){

	});
});

readerResponse.on('reader', function(rs, res){
	res.send( tpl.html('module', {
		title: '订阅 rss'
		, modules: tpl.mainTpl({
			id: 'rss'
			, title: '阅读 reader'
			, toolbar: '<li><a href="bookmark" id="bookmark" class="icon icon-bookmark" title="待读文章列表"></a></li>'+
				tpl.toolbarTpl([{
					id: 'add', icon: 'plus', title: '添加订阅源'
				}])
			, content: rssTpl(rs).join('')
		}).join('')
		, script: {
			main: '../script/module/rss/index'
			, src: '../script/lib/require.min.js'
		}
	}) );
	res.end();
}).on('reader/bookmark', function(rs, res){
	res.send( tpl.html('module', {
		title: '待读文章 reader'
		, modules: tpl.mainTpl({
			id: 'reader'
			, title: '待读文章 reader'
			, toolbar: tpl.toolbarTpl([{
				id: 'add', icon: 'plus', title: '添加待读文章'
			}])
			, content: articleTpl(rs).join('')
		}).join('') + tpl.popupTpl([{
			id: 'addPopup', size: 'normal'
			, content: '<form><div class="formGroup">' +
			'<label for="url">请输入链接</label>' +
			'<input type="text" id="url" class="input" placeholder="请输入链接" data-validator="url">' +
			'</div></form>'
			, button: '<button type="button" id="addReader" class="btn">确定</button>'
		}])
		, script: {
			main: '../script/module/reader/index'
			, src: '../script/lib/require.min.js'
		}
	}) );
	res.end();
});
readerSocket.on('reader', function(){

}).on('reader/bookmark/add', function(data, socket){
	socket.emit('data', {
		topic: 'reader/bookmark/add'
		, msg: 'success'
		, info: data
	})
});

metro.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '待读文章 reader'
});

web.get('/reader/', function(req, res){
	//var index = Reader.index;

	readerController.emit('reader/web', res);
	//db.handle({
	//	sql: index.sql
	//	, success: function(rs){
	//		res.send( tpl.html('module', {
	//			title: '订阅 rss'
	//			, modules: tpl.mainTpl({
	//				id: 'rss'
	//				, title: '阅读 reader'
	//				, toolbar: '<li><a href="bookmark" id="bookmark" class="icon icon-bookmark" title="待读文章列表"></a></li>'+
	//					tpl.toolbarTpl([{
	//						id: 'add', icon: 'plus', title: '添加订阅源'
	//					}])
	//				, content: rssTpl(rs).join('')
	//			}).join('')
	//			, script: {
	//				main: '../script/module/rss/index'
	//				, src: '../script/lib/require.min.js'
	//			}
	//		}) );
	//		res.end();
	//	}
	//});
});
web.get('/reader/bookmark', function(req, res){
	//var bookmark = Reader.bookmark;

	readerController.emit('reader/bookmark/web', res);
	//db.handle({
	//	sql: bookmark.sql
	//	, success: function(rs){
	//		res.send( tpl.html('module', {
	//			title: '待读文章 reader'
	//			, modules: tpl.mainTpl({
	//				id: 'reader'
	//				, title: '待读文章 reader'
	//				, toolbar: tpl.toolbarTpl([{
	//					id: 'add', icon: 'plus', title: '添加待读文章'
	//				}])
	//				, content: articleTpl(rs).join('')
	//			}).join('') + tpl.popupTpl([{
	//				id: 'addPopup', size: 'normal'
	//				, content: '<form><div class="formGroup">' +
	//				'<label for="url">请输入链接</label>' +
	//				'<input type="text" id="url" class="input" placeholder="请输入链接" data-validator="url">' +
	//				'</div></form>'
	//				, button: '<button type="button" id="addReader" class="btn">确定</button>'
	//			}])
	//			, script: {
	//				main: '../script/module/reader/index'
	//				, src: '../script/lib/require.min.js'
	//			}
	//		}) );
	//		res.end();
	//	}
	//});
});

socket.register({
	reader: function(socket){}
	, 'reader/add': function(socket, data){}
	, 'reader/getList': function(socket, data){
		var feed = data.query.feed;

		if( feed ){
			getFeedList(feed, function(rs){
				socket.emit('getData', {
					topic: 'rss/feedList'
					, data: rs
					, id: data.query.id
				});
			}, function(){
				socket.emit('getData', {
					topic: 'rss/feedList'
					, error: ''
					, msg: '订阅源获取失败'
				});
			});
		}
		else{
			socket.emit('getData', {
				topic: 'rss/feedList'
				, error: ''
				, msg: ''
			});
		}
	}
	, 'reader/getArticle': function(socket, data){
		var url = data.query.url;

		if( url ){
			getArticle(url, function(rs){
				socket.emit('getData', {
					topic: 'rss/article'
					, data: rs
				});
			}, function(){
				socket.emit('getData', {
					topic: 'rss/article'
					, error: ''
					, msg: '订阅文章获取失败'
				});
			});
		}
		else{
			socket.emit('getData', {
				topic: 'rss/article'
				, error: ''
				, msg: ''
			});
		}
	}
	, 'reader/favorArticle': function(socket, data){}

	, 'reader/bookmark': function(socket){}
	, 'reader/bookmark/add': function(socket, data){
		var url = data.query.url
			;

		if( url ){
			getTitle(url, function(url, title){console.log(title)
				readerController.emit('reader/bookmark/add/socket', [url, title, url], socket)
			}, error);
			//readerController.emit('reader/bookmark/add/socket', [url, url, url], socket)
			//db.handle({
			//	sql: Reader.isInList.sql
			//	, data: [url]
			//	, success: function(rs){
			//		if( Array.isArray( rs ) && rs.length ){
			//			socket.emit('getData', {
			//				topic: 'reader/bookmarkAdd'
			//				, msg: '数据已存在'
			//			});
			//		}
			//		else{
			//			getTitle(url, function(url, title){
			//				db.handle({
			//					sql: Reader.addToList.sql
			//					, data: [url, title]
			//					, success: function(rs){
			//						socket.emit('getData', {
			//							topic: 'reader/bookmarkAdd'
			//							, msg: 'success'
			//							, info: {
			//								id: rs.insertId || id
			//								, url: url
			//								, title: title
			//								, status: 0
			//							}
			//						});
			//					}
			//					, error: function(e){
			//						socket.emit('getData', {
			//							error: ''
			//							, msg: ''
			//						});
			//					}
			//				})
			//			}, function(e){
			//				console.log(e);
			//			});
			//		}
			//	}
			//	, error: function(e){
			//		socket.emit('getData', {
			//			error: ''
			//			, msg: ''
			//		});
			//	}
			//});
		}
		else{
			socket.emit('data', {
				error: ''
				, msg: ''
			});
			error( 'E0002' );
			//console.log('\n', 'socket reader/add', '\n', 'no url');
		}
	}
	, 'reader/bookmark/read': function(socket, data){
		var id = data.query.id
			;

		if( id ){
			readerController.emit('reader/bookmark/read/socket', [id], socket);
			//db.handle({
			//	sql: Reader.get.sql
			//	, data: [id]
			//	, success: function(rs){
			//		if( rs ){
			//			socket.emit('getData', {
			//				topic: 'reader/read'
			//				, msg: 'success'
			//				, id: id
			//			});
			//		}
			//	}
			//	, error: function(e){
			//		socket.emit('getData', {
			//			error: 'E0002'
			//			, msg: error['E0002']
			//		});
			//	}
			//});
		}
		else{
			socket.emit('data', {
				error: ''
				, msg: ''
			});
			error( 'E0002' );
			//console.log('\n', 'socket reader/read', '\n', 'no id')
		}
	}
	, 'reader/bookmark/favor': function(socket, data){
		var id = data.query.id
			;

		if( id ){
			readerController.emit('reader/bookmark/favor/socket', [id], socket);
			//db.query(reader.favor.sql, [id], function(e, rs){
			//	if( !e ){
			//		if( rs ){
			//			socket.emit('getData', {
			//				topic: 'reader/favor'
			//				, msg: 'success'
			//				, id: id
			//			});
			//		}
			//		else{
			//			socket.emit('getData', {
			//				error: ''
			//				, msg: ''
			//			});
			//			console.log('\n', 'db', '\n', reader.favor.sql, '\n', e.message);
			//		}
			//	}
			//	else{
			//		socket.emit('getData', {
			//			error: ''
			//			, msg: ''
			//		});
			//		console.log('\n', 'db', '\n', reader.favor.sql, '\n', e.message);
			//	}
			//})
		}
		else{
			socket.emit('getData', {
				error: ''
				, msg: ''
			});
			error( 'E0002' );
			//console.log('\n', 'socket reader/favor', '\n', 'no id')
		}
	}
});

module.exports = function(){};