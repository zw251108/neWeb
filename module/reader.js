'use strict';

var db        = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, readerTpl    = emmetTpl({
		template: 'section#reader_%Id%.reader_section.section>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]>h3.section_title{%name%}>span.icon.icon-plus^^hr+ul.reader_articleList'
	})
	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article[data-id=%Id%]>a[href=%url% title=%url% target=_blank]>h3.article_title{%title%}' +
		'^hr+a.icon.icon-checkbox%readStatus%[href=reader/read title=%readTitle%]{%readText%}' +
		'+a.icon.icon-star%favorStatus%[href=reader/favor title=%favorTitle%]{%favorText%}' +
		'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
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
			, tags: function(d){
				return d.tag_name ? '<span class="tag">'+ d.tag_name.split(',').join('</span><span class="tag">') +'</span>' : '';
				//var data = []
				//	, tagsId = (d.tags_id || '').split(',')
				//	, tagsName = (d.tags_name || '').split(',')
				//	;
				//
				//$.each(tagsId, function(i, d){
				//	data.push({
				//		Id: d
				//		, name: tagsName[i]
				//	});
				//});
				//
				//return tagTmpl(data).join('');
			}
		}
	})

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

	, Promise = require('promise')

	, httpRequest = function(url){
		return new Promise(function(resolve, reject){
			superAgent.get(url).buffer(true).end(function(err, res){

				if( !err ){
					resolve( res );
				}
				else{
					reject( err );
				}
			});
		});
	}
	, feedHandle = function(res){
		var rss = res.text
			, charset = res.charset
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

			console.log(rs);
			//done(rs);

			return rs;
		}
	}
	, articleHandle = function(res){

	}

	/**
	 * 获取订阅 rss
	 * */
	, getFeedList = function(feed, done, error){
		console.log('获取 rss 订阅源：', feed);

		superAgent.get(feed).buffer(true).end(function(err, res){

			if( !err ){
				var rss = res.text
					, charset = res.charset
					, $
					, $item
					, i, j, temp, $t
					, rs = []
					;

				//if( charset !== 'utf8' ){
				//	rss = iconv.decode(rss, charset);
				//}

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

					console.log(rs);
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
	 * object
	 * object.url
	 * object.title
	 * object.tag_name
	 * */
	, getArticle = function(url, done, error){
		console.log('获取 feed 文章：', url);

		superAgent.get(url).end(function(err, res){
			if( !err ){
				var html = res.text
					, charset = res.charset
					, $
					, $main
					, content
					, rs
					, obj = {}
					, filterRs = []
					, j
					, prefix = '_' + (+new Date())
					, temp
					, title
					, w, p
					;
				console.log(charset, html);
				//if( charset !== 'utf8' ){
				//	html = iconv.decode(html, charset);
				//}

				//console.log(html);
				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					$main = $('article');
					title = $('title').text();
					content = $main.length ? $main.html() : $('body').html();

					//console.log(content);

					rs = segment.doSegment( content );
					//console.log(rs);

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

					done({
						url: url
						, title: title
						, tags: filterRs.slice(0, 20)
					});
					//done(url, title, filterRs.slice(0, 20) );
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

	, ReaderWebCrawler = {
		'reader/feed': function(){
			console.log('获取 feed 文章：', url);

			superAgent.get(url).end(function(err, res){
				if( !err ){
					var html = res.text
						, charset = res.charset
						, $
						, $main
						, content
						, rs
						, obj = {}
						, filterRs = []
						, j
						, prefix = '_' + (+new Date())
						, temp
						, title
						, w, p
						;
					console.log(charset, html);
					//if( charset !== 'utf8' ){
					//	html = iconv.decode(html, charset);
					//}

					//console.log(html);
					if( html ){
						$ = Cheerio.load(html, {decodeEntities: false});

						$main = $('article');
						title = $('title').text();
						content = $main.length ? $main.html() : $('body').html();

						//console.log(content);

						rs = segment.doSegment( content );
						//console.log(rs);

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


						done({
							url: url
							, title: title
							, tag_name: filterRs.slice(0, 20)
						});
						//done(url, title, filterRs.slice(0, 20) );
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
		, 'reader/article': function(){

		}
	}
	, ReaderModel = {
		reader: 'select * from reader where status=1'
		, 'reader/isExist': 'select * form reader where html_url like ?'
		, 'reader/add': ''
		, 'reader/favor': 'select status from reader where Id=?'
		, addToList: 'insert into reader(url,title,datetime) value(?,?,now())'

		, 'reader/favorite': 'select * from bookmark where status=\'2\' order by datetime desc'

		, 'reader/bookmark': 'select Id,title,url,status,tag_id,tag_name from bookmark order by status,Id desc'
		, 'reader/bookmark/isExist': 'select * from bookmark where url like ?'
		, 'reader/bookmark/add': {
			sql: 'insert into bookmark(url,title,tag_name,datetime) select ?,?,?,now() from dual where not exists (select * from bookmark where url like ?)'
			, handle: function(data, rs){
				var r;
				if( rs.insertId ){
					r = {
						id: rs.insertId
						, url: data[0]
						, title: data[1]
						, tag_name: data[2]
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
			sql: 'update bookmark set status=1 where Id=? and status<1'
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
			sql: 'update bookmark set status=2 where Id=? and status<2'
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
					, toolbar: '<li><a href="bookmark" id="bookmark" class="icon icon-bookmark" title="待读文章列表"></a></li>' +
						'<li><a href="favorite" id="favorite" class="icon icon-star" title="收藏文章"></a></li>'+
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
					, toolbar: '<li><a href="./" id="reader" class="icon icon-rss" title="返回订阅列表"></a></li>' +
						'<li><a href="favorite" id="favorite" class="icon icon-star" title="收藏文章"></a></li>' +
						tpl.toolbarTpl([{
						id: 'add', icon: 'plus', title: '添加待读文章'
					}])
					, content: articleTpl(rs).join('')
				}).join('') + tpl.popupTpl([{
					id: 'addPopup', size: 'normal'
					, content: '<form><div class="formGroup">' +
					'<label for="url">请输入链接</label>' +
					'<input type="text" id="url" class="input" placeholder="请输入链接" data-validator="url">' +
					'</div></form>'
					, button: '<button type="button" id="addBookmark" class="btn">确定</button>'
				}])
				, script: {
					main: '../script/module/reader/bookmark'
					, src: '../script/lib/require.min.js'
				}
			});
		}
		, 'reader/favorite': function(rs){
			return tpl.html('module', {
				title: '收藏文章 favorite'
				, modules: tpl.mainTpl({
					id: 'bookmark'
					, title: '收藏文章 favorite'
					, toolbar: '<li><a href="./" id="reader" class="icon icon-rss" title="返回订阅列表"></a></li>' +
						'<li><a href="bookmark" id="favorite" class="icon icon-bookmark" title="待读文章"></a></li>' +
						tpl.toolbarTpl([{
						id: 'add', icon: 'plus', title: '添加待读文章'
					}])
					, content: articleTpl(rs).join('')
				}).join('') + tpl.popupTpl([{
					id: 'addPopup', size: 'normal'
					, content: '<form><div class="formGroup">' +
					'<label for="url">请输入链接</label>' +
					'<input type="text" id="url" class="input" placeholder="请输入链接" data-validator="url">' +
					'</div></form>'
					, button: '<button type="button" id="addBookmark" class="btn">确定</button>'
				}])
			});
		}
	}
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
	, title: '阅读 reader'
});

web.get('/reader/', function(req, res){

	reader.emit('data', 'reader', 'response', res);
});
web.get('/reader/bookmark', function(req, res){

	reader.emit('data', 'reader/bookmark', 'response', res);
});
web.get('/reader/favorite', function(req, res){

	reader.emit('data', 'reader/favorite', 'response', res);
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
				reader.emit('socket', 'reader/feed', socket, '订阅源获取失败');
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
			}, function(err){

				reader.emit('socket', 'reader/article', socket, '订阅文章获取失败');
				error( err );
			});
		}
		else{
			reader.emit('socket', 'reader/article', socket, '缺少参数');
			error( 'E0002' );
		}
	}
	, 'reader/favorArticle': function(socket, data){}

	, 'reader/bookmark': function(socket){}
	, 'reader/bookmark/add': function(socket, data){
		var url = data.query.url;

		if( url ){
			getArticle(url, function(rs){

				reader.emit('data', 'reader/bookmark/add', 'socket', socket, [rs.url, rs.title, rs.tags.map(function(d){return d.tagName;}).join(), rs.url]);
			},function(err){
				reader.emit('socket', 'reader/bookmark/add', socket, '缺少参数');
				error( err );
			});

			//getTitle(url, function(url, title, tags){
			//	reader.emit('data', 'reader/bookmark/add', 'socket', socket, [url, title, url, tags]);
			//}, function(err){
			//	reader.emit('socket', 'reader/bookmark/add', socket, '缺少参数');
			//	error( err );
			//});
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