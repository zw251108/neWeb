'use strict';

var ReaderModel = {
		reader: 'select * from rss'
		, 'reader/add': ''
		, 'reader/favor': 'select status from reader where Id=?'
		, addToList: 'insert into reader(url,title,datetime) value(?,?,now())'

		, 'reader/bookmark': 'select Id,title,url,status from reader order by status,Id desc'
		, 'reader/bookmark/add': {
			sql: 'insert into reader(url,title,datetime) select ?,?,now() from dual where not exists (select * from reader where url like ?)'
			, handle: function(data, rs){console.log(rs);
				var r;
				if( rs.insertId ){
					r = {
						id: rs.insertId
						, url: data[0]
						, title: data[1]
						, status: 0
					};
				}
				else{
					r = '数据已存在';
				}
				return r;
			}
		}
		, 'reader/bookmark/read': {
			sql:'update reader set status=1 where Id=? and status<1'
			, handle: function(data, rs){
				var r;
				if( rs.changedRows ){
					r = {
						id: data[0]
					}
				}
				else{
					r = '该文章已被读过' ;
				}
				return r;
			}
		}
		, 'reader/bookmark/favor': {
			sql: 'update reader set status=2 where Id=? and status<2'
			, handle: function(data, rs){
				var r;
				if( rs.changedRows ){
					r = {
						id: data[0]
					}
				}
				else{
					r = '该文章已被收藏';
				}
				return r;
			}
		}
	}
	, ReaderView = {
		reader: function(rs){
			return tpl.html('module', {
				title: '订阅 reader'
				, modules: tpl.mainTpl({
					id: 'reader'
					, title: '阅读 reader'
					, toolbar: '<li><a href="bookmark" id="bookmark" class="icon icon-bookmark" title="待读文章列表"></a></li>'+
					tpl.toolbarTpl([{
						id: 'add', icon: 'plus', title: '添加订阅源'
					}])
					, content: readerTpl(rs).join('')
				}).join('')
				, script: {
					main: '../script/module/reader/index'
					, src: '../script/lib/require.min.js'
				}
			});
		}
		, 'reader/bookmark': function(rs){
			return tpl.html('module', {
				title: '书签 bookmark'
				, modules: tpl.mainTpl({
					id: 'bookmark'
					, title: '待读文章 bookmark'
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
					main: '../script/module/reader/bookmark'
					, src: '../script/lib/require.min.js'
				}
			});
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

	, segment = require('./segment/segment.js')

	, db        = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, readerTpl    = emmetTpl({
		template: 'section#reader_%Id%.reader_section.section>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]>h3.section_title{%name%}>span.icon.icon-plus^^ul.reader_articleList'
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
					error( err );
				}
			}
			else{
				error( err );
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
					error( err );
				}
			}
			else{
				error( err );
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
	;

reader.on('data', function(topic, next, args, data){
	var sql = ReaderModel[topic]
		, handle = null
		;
	if( typeof sql !== 'string' ){
		handle = sql.handle;
		sql = sql.sql;
	}
	if( data ){
		db.query(sql, data, function(err, rs){
			if( !err ){
				reader.emit(next, topic, args, handle ? handle(data, rs) : rs);
			}
			else{
				error( err );
			}
		});
	}
	else{
		db.query(sql, function(err, rs){
			if( !err ){
				reader.emit(next, topic, args, rs);
			}
			else{
				error( err );
				reader.emit(next, topic, args, '数据库错误')
			}
		});
	}
}).on('response', function(topic, res, rs){
	if( typeof rs !== 'string' ){
		res.send( ReaderView[topic](rs) );
		res.end();
	}
}).on('socket', function(topic, socket, rs){
	var data = {
		topic: topic
	};
	if( typeof rs !== 'string' ){
		if( Array.isArray( rs ) ){
			data.data = rs;
		}
		else{
			data.info = rs;
		}
	}
	else{
		data.error = '';
		data.msg = rs;
	}
	socket.emit('data', data);
});


// 注册首页 metro 模块
metro.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '待读文章 reader'
});

web.get('/reader/', function(req, res){

	reader.emit('data', 'reader', 'response', res);
});
web.get('/reader/bookmark', function(req, res){

	reader.emit('data', 'reader/bookmark', 'response', res);
});

socket.register({
	reader: function(socket){

		reader.emit('data', 'reader', 'socket', socket);
	}
	, 'reader/add': function(socket, data){}
	, 'reader/feed': function(socket, data){
		var feed = data.query.feed;

		if( feed ){
			getFeedList(feed, function(rs){
				reader.emit('socket', 'reader/feed', socket, {
					id: data.query.id
					, data: rs
				});
			}, function(err){
				reader.emit('socket', 'reader/feed', socket, '订阅源获取失败')
				error( err );
			});
		}
		else{
			reader.emit('socket', 'reader/feed', socket, '缺少参数');
			error( 'E0002' );
		}
	}
	, 'reader/article': function(socket, data){
		var url = data.query.url;

		if( url ){
			getArticle(url, function(rs){
				reader.emit('socket', 'reader/article', socket, rs);
				//socket.emit('getData', {
				//	topic: 'rss/article'
				//	, data: rs
				//});
			}, function(err){
				reader.emit('socket', 'reader/article', socket, '订阅文章获取失败');
				error( err );
				//socket.emit('getData', {
				//	topic: 'rss/article'
				//	, error: ''
				//	, msg: '订阅文章获取失败'
				//});
			});
		}
		else{
			reader.emit('socket', 'reader/article', socket, '缺少参数');
			error( 'E0002' );
			//socket.emit('getData', {
			//	topic: 'rss/article'
			//	, error: ''
			//	, msg: ''
			//});
		}
	}
	, 'reader/favorArticle': function(socket, data){}

	, 'reader/bookmark': function(socket){}
	, 'reader/bookmark/add': function(socket, data){
		var url = data.query.url;

		if( url ){
			getTitle(url, function(url, title){
				reader.emit('data', 'reader/bookmark/add', 'socket', socket, [url, title, url]);
			}, function(err){
				reader.emit('socket', 'reader/bookmark/add', socket, '缺少参数');
				error( err );
			});
		}
		else{
			reader.emit('socket', 'reader/bookmark/add', socket, '缺少参数');
			error( 'E0002' );
		}
	}
	, 'reader/bookmark/read': function(socket, data){
		var id = data.query.id;

		if( id ){
			reader.emit('data', 'reader/bookmark/read', 'socket', socket, [id]);
		}
		else{
			reader.emit('socket', 'reader/bookmark/read', socket, '缺少参数');
			error( 'E0002' );
		}
	}
	, 'reader/bookmark/favor': function(socket, data){
		var id = data.query.id;

		if( id ){
			reader.emit('data', 'reader/bookmark/favor', 'socket', socket, [id]);
		}
		else{
			reader.emit('socket', 'reader/bookmark/favor', socket, '缺少参数');
			error( 'E0002' );
		}
	}
});

module.exports = function(){};