'use strict';

var ReaderModel = {
		reader: 'select * from rss'
		, 'reader/add': ''
		, 'reader/favor': 'select status from reader where Id=?'
		, addToList: 'insert into reader(url,title,datetime) value(?,?,now())'

		, 'reader/bookmark': 'select Id,title,url,status from reader order by status,Id desc'
		, 'reader/bookmark/add':    'select url from reader where url like ?'
		, 'reader/bookmark/read':   'update reader set status=1 where Id=?'
		, 'reader/bookmark/favor':  'update reader set status=2 where Id=?'
	}
	, ReaderView = {

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
		console.log('获取文章标题：', url);

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

	, Event = require('events').EventEmitter
	, reader = new Event()
	, readerModel       = new Event()
	, readerResponse    = new Event()
	, readerSocket      = new Event()
	;

reader.on('data', function(topic, next, data, args){
	if( data ){
		db.query(ReaderModel[topic], data, function(err, rs){
			if( !err ){
				reader.emit(next, topic, args, rs);
			}
			else{
				error( err );
			}
		});
	}
	else{
		db.query(ReaderModel[topic], function(err, rs){
			if( !err ){
				reader.emit(next, topic, args, rs);
			}
			else{
				error( err );
				reader.emit(next, topic, args, 'error')
			}
		});
	}

}).on('response', function(topic, res, rs){
	if( typeof rs !== 'string' && rs !== 'error' ){
		res.send( ReaderView[topic](rs) );
		res.end();
	}
}).on('socket', function(topic, socket, rs){
	var data = {
		topic: topic
	};
	if( typeof rs !== 'string' && rs !== 'error' ){
		if( Array.isArray( rs ) ){
			data.data = rs;
		}
		else{
			data.info = rs;
		}
	}
	else{
		data.error = '';
		data.msg = ''
	}
	socket.emit('data', data);
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
		if( !err ){
			next.emit('reader/bookmark/read', {
				id: data[0]
			}, args);
		}
		else{
			error( err );
		}
	});
}).on('reader/bookmark/favor', function(data, next, args){
	db.query('update reader set status=2 where Id=? and status<2', data, function(err, rs){
		if( !err ){
			next.emit('reader/bookmark/favor', {
				id: data[0]
			}, args);
		}
		else{
			error( err );
		}
	});
});

// web 响应
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

// socket 响应
readerSocket.on('reader', function(){

}).on('reader/bookmark/add', function(data, socket){
	socket.emit('data', {
		topic: 'reader/bookmark/add'
		, msg: 'success'
		, info: data
	});
}).on('reader/bookmark/read', function(data, socket){
	socket.emit('data', {
		topic: 'reader/bookmark/read'
		, msg: 'success'
		, info: data
	});
}).on('reader/bookmark/favor', function(data, socket){
	data.topic = 'reader/bookmark/favor';
	socket.emit('data', {
		topic: 'reader/bookmark/favor'
		, msg: 'success'
		, info: data
	});
});

// 注册首页 metro 模块
metro.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '待读文章 reader'
});

web.get('/reader/', function(req, res){

	readerModel.emit('reader', readerResponse, res);
});
web.get('/reader/bookmark', function(req, res){

	readerModel.emit('reader/bookmark', readerResponse, res);
});

socket.register({
	reader: function(socket){

		readerModel.emit('reader', readerSocket, socket);
	}
	, 'reader/add': function(socket, data){}
	, 'reader/getList': function(socket, data){
		var feed = data.query.feed;

		if( feed ){
			getFeedList(feed, function(rs){
				readerSocket.emit('reader/getList', data)
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
		var url = data.query.url;

		if( url ){
			getTitle(url, function(url, title){
				readerModel.emit('reader/bookmark/add', [url, title, url], readerSocket, socket);
			}, function(err){
				error( err );
				socket.emit('data', {
					topic: 'reader/bookmark/add'
					, error: ''
					, msg: '无法获取页面信息'
				});
			});
		}
		else{
			error( 'E0002' );
			socket.emit('data', {
				error: 'reader/bookmark/add'
				, msg: '缺少参数'
			});
		}
	}
	, 'reader/bookmark/read': function(socket, data){
		var id = data.query.id;

		if( id ){
			readerModel.emit('reader/bookmark/read', [id], socket);
		}
		else{
			error( 'E0002' );
			socket.emit('data', {
				topic: 'reader/bookmark/read'
				, error: ''
				, msg: '缺少参数'
			});
		}
	}
	, 'reader/bookmark/favor': function(socket, data){
		var id = data.query.id;

		if( id ){
			readerModel.emit('reader/bookmark/favor', [id], readerSocket, socket);
		}
		else{
			error( 'E0002' );
			readerSocket.emit('reader/bookmark/favor', {
				error: ''
				, msg: '缺少参数'
			}, socket);
		}
	}
});

module.exports = function(){};