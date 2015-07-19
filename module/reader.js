'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, readerTpl    = emmetTpl({
		template: 'section#reader_%Id%.reader_section.section>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]>h3.section_title{%name%}>span.icon.icon-plus^^hr+ul.reader_articleList'
	})
	, articleTpl   = emmetTpl({
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
				return +d.status > 1 ? '-full' : '';
			}
			, favorTitle: function(d){
				return +d.status > 1 ? '已收藏' : '未收藏';
			}
			, favorText: function(d){
				return +d.status > 1 ? '已收藏' : '收藏';
			}
			, tags: function(d){
				return d.tag_name ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tag_name.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
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

	, Url = require('url')

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

	///**
	// * 获取订阅 rss
	// * */
	//, getFeedList = function(feed, done, error){
	//	console.log('获取 rss 订阅源：', feed);
	//
	//	superAgent.get(feed).buffer(true).end(function(err, res){
	//
	//		if( !err ){
	//			var rss = res.text
	//				, charset = res.charset
	//				, $
	//				, $item
	//				, i, j, temp, $t
	//				, rs = []
	//				;
	//
	//			//if( charset !== 'utf8' ){
	//			//	rss = iconv.decode(rss, charset);
	//			//}
	//
	//			if( rss ){
	//				$ = Cheerio.load(rss, {xmlMode: true});
	//				$item = $('item');
	//
	//				for(i = 0, j = $item.length; i < j; i++){
	//					temp = {};
	//					$t = $item.eq(i);
	//
	//					temp.title = $t.find('title').text();
	//					temp.url = $t.find('link').text();
	//					temp.content = $t.find('description').text();
	//					temp.author = $t.find('author').text();
	//					!temp.author && (temp.author = $t.find('dc\\:creator').text());
	//					temp.tags = $t.find('category').map(function(){
	//						return $(this).text();
	//					}).get().join();
	//					temp.datetime = $t.find('pubDate').text();
	//
	//					rs.push(temp);
	//				}
	//
	//				console.log(rs);
	//				done(rs);
	//			}
	//			else{
	//				error( err );
	//			}
	//		}
	//		else{
	//			error( err );
	//		}
	//	});
	//}
	///**
	// * 获取订阅文章 并分解截取
	// * object
	// * object.url
	// * object.title
	// * object.tag_name
	// * */
	//, getArticle = function(url, done, error){
	//	console.log('获取 feed 文章：', url);
	//
	//	superAgent.get(url).end(function(err, res){
	//		if( !err ){
	//			var html = res.text
	//				, charset = res.charset
	//				, $
	//				, $main
	//				, content
	//				, rs
	//				, obj = {}
	//				, filterRs = []
	//				, j
	//				, prefix = '_' + (+new Date())
	//				, temp
	//				, title
	//				, w, p
	//				, urlResult = Url.parse(url)
	//				, source = urlResult.protocol + '//' + urlResult.host
	//				, charExpr = /^[a-z]$/i
	//				;
	//			console.log(charset, html, source);
	//
	//			if( !charset || charset.toUpperCase() !== 'UTF-8' ){
	//				// todo 转码：将 GBK 转成 UTF-8
	//			}
	//
	//			if( html ){
	//				$ = Cheerio.load(html, {decodeEntities: false});
	//
	//				// todo 删除代码片段 script style
	//
	//				title = $('title').text();
	//				rs = segment.doSegment( title );
	//
	//				$main = $('article');
	//				content = $main.length ? $main.html() : $('body').html();
	//
	//				//console.log(content);
	//
	//				rs = rs.concat( segment.doSegment( content ) );
	//				//console.log(rs);
	//
	//				// 统计
	//				j = rs.length;
	//				while( j-- ){
	//					temp = rs[j];
	//					p = temp.p;
	//					w = temp.w;
	//
	//					/**
	//					 * 过滤，只统计
	//					 *  8       专有名词
	//					 *  16      外文字符
	//					 *  32      机构团体
	//					 *  64      地名
	//					 *  128     人名
	//					 *  4096    动词
	//					 *  1048576 名词
	//					 * */
	//					if( !(p === 8 ||
	//						p === 16 ||
	//						p === 32 ||
	//						p === 64 ||
	//						p === 128 ||
	//						p === 4096 ||
	//						p === 1048576) ) continue;
	//
	//					/**
	//					 * 将单个字符排除
	//					 * */
	//					if( charExpr.test( w ) ) continue;
	//
	//					/**
	//					 * 对分出来的词加个前缀作为 key 存在 obj 对象中
	//					 *  防止分出来的词存在 toString 一类已存在于对象中的属性的关键字
	//					 * */
	//					w = prefix + w;
	//
	//					if( w in obj ){
	//						filterRs[obj[w]].n++;
	//					}
	//					else{
	//						filterRs.push({
	//							tagName: temp.w
	//							, p: p
	//							, n: 1
	//						});
	//						obj[w] = filterRs.length - 1;
	//					}
	//				}
	//
	//				// 排序
	//				filterRs.sort(function(a, b){
	//					return b.n - a.n;
	//				});
	//
	//				console.log('\n', filterRs.slice(0, 20));
	//
	//				done({
	//					url: url
	//					, title: title
	//					, tags: filterRs.slice(0, 20)
	//					, source: source
	//				});
	//				//done(url, title, filterRs.slice(0, 20) );
	//			}
	//			else{
	//				error( err );
	//			}
	//		}
	//		else{
	//			error( err );
	//		}
	//	});
	//}

	/**
	 * @namespace   Reader
	 * */
	, Reader = {
		/**
		 * @method  crawler
		 * @memberof    Reader
		 * @param   {string}    url 抓起目标路径
		 * @return  {object}    promise 对象
		 * @desc    抓起目标路径的内容，可以是 rss 也可以是网页
		 * */
		crawler: function(url){
			return new Promise(function(resolve, reject){
				if( url ){
					superAgent.get(url).buffer(true).end(function(err, res){
						if( !err ){
							resolve({
								res: res
								, url: url
							});
						}
						else{
							reject( err )
						}
					});
				}
				else{
					reject( new Error('缺少参数') );
				}
			});
		}

		/**
		 * @namespace   Model
		 * @memberof    Reader
		 * @desc    业务相关 sql 语句集合
		 * */
		, Model: {
			reader: 'select * from reader where status=1'
			, readerCount: 'select count(*) as count from reader where status=1'
			, readerPage: 'select * from reader where status=1 limit ?,?'
			, readerIsExist: 'select * from reader where xml_url like ?'

			, bookmark: 'select Id,title,url,status,tag_id,tag_name from bookmark order by status,Id desc'
			, bookmarkCount: 'select count(*) as count from bookmark'
			, bookmarkPage: 'select Id,title,url,status,tag_id,tag_name from bookmark order by status,Id desc limit ?,?'
			, bookmarkAdd: 'insert into bookmark(url,title,source,tag_name,datetime) select ?,?,?,?,now() from dual where not exists (select * from bookmark where url like ?)'
			, bookmarkRead: 'update bookmark set status=1 where Id=? and status<1'
			, bookmarkFavor: 'update bookmark set status=2,tag_name=?,score=score+? where Id=? and status<2'
			, bookmarkIsExist: 'select * from bookmark where url like ?'

			, favorite: 'select * from bookmark where status=2 order by datetime desc'
			, favoriteCount: 'select count(*) as count from bookmark where status=2'
			, favoritePage: 'select * from bookmark where status=2 order by datetime desc limit ?,?'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Reader
		 * @desc    数据处理方法集合
		 * */
		, Handler: {
			/**
			 * @method  crawlerFeed
			 * @memberof    Handler
			 * @param   {object}    result
			 * @param   {object}    result.res  抓取的 rss 内容
			 * @param   {string}    result.url  抓取的 rss 路径
			 * @return  {object}    对抓取的 rss 内容的整理
			 * */
			crawlerFeed: function(result){
				var res = result.res
					, rss = res.text
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
				}
				else{
					rs = null;
				}

				return rs;
			}
			/**
			 * @method  crawlerArticle
			 * @memberof    Handler
			 * @param   {object}    result
			 * @param   {object}    result.res 抓取的页面
			 * @param   {string}    result.url 抓起的页面路径
			 * @return  {object}    对抓取的页面的分词统计结果
			 * */
			, crawlerArticle: function(result){
				var res = result.res
					, url = result.url
					, html = res.text
					, charset = res.charset
					, $ , $main
					, title , content
					, segmentResult = []
					, indexCache = {}
					, filterResult = []
					, prefix = '_' + (+new Date())
					, urlResult = Url.parse(url)
					, source = urlResult.protocol + '//' + urlResult.host
					, charExpr = /^[a-z]$/i
					, j, temp, w, p
					, rs = null
					;
				console.log(charset, html, source);

				if( !charset || charset.toUpperCase() !== 'UTF-8' ){
					// todo 转码：将 GBK 转成 UTF-8
				}

				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					// todo 删除代码片段 script style

					title = $('title').text();

					// 对标题进行分词
					segmentResult = segment.doSegment(title);

					// 获取页面主内容
					$main = $('article');
					content = $main.length ? $main.html() : $('body').html();

					// 连接分词结果
					segmentResult = segmentResult.concat( segment.doSegment(content) );

					// 统计
					j = segmentResult.length;
					while( j-- ){
						temp = segmentResult[j];
						p = temp.p;
						w = temp.w;

						/**
						 * 过滤，只统计
						 *  8       专有名词
						 *  16      外文字符
						 *  32      机构团体
						 *  64      地名
						 *  128     人名
						 *  4096    动词
						 *  1048576 名词
						 * */
						if( !(
							p === 8 ||
							p === 16 ||
							p === 32 ||
							p === 64 ||
							p === 128 ||
							p === 4096 ||
							p === 1048576) ) continue;

						/**
						 * 将单个字符排除
						 * */
						if( charExpr.test(w) ) continue;

						/**
						 * 对分出来的词加个前缀作为 key 存在 indexCache 对象中
						 *  防止分出来的词存在 toString 一类已存在于对象中的属性的关键字
						 * */
						w = prefix + w;

						if( w in indexCache ){
							filterResult[indexCache[w]].n++;
						}
						else{
							filterResult.push({
								tagName: temp.w
								, p: p
								, n: 1
							});
							indexCache[w] = filterResult.length - 1;
						}
					}

					// 排序
					filterResult.sort(function(a, b){
						return b.n - a.n;
					});

					console.log('\n', filterResult.slice(0, 20));

					rs = {
						url: url
						, title: title
						, tag_name: filterResult.slice(0, 20).map(function(d){return d.tagName}).join()
						, source: source
					};
				}

				return rs;
			}
			/**
			 * @method  readerIsExist
			 * @memberof    Handler
			 * @param   {object}    rs  数据库查询结果
			 * @return  {boolean}   该数据是否存在
			 * */
			, readerIsExist: function(rs){
				rs = rs.result;
				
				return !!(rs && rs.length);
			}
			/**
			 * @method  bookmarkIsExist
			 * @memberof    Handler
			 * @param   {object}    rs  数据库查询结果
			 * @return  {boolean}   该数据是否存在
			 * */
			, bookmarkIsExist: function(rs){
				rs = rs.result;

				return !!(rs && rs.length);
			}
		}

		/**
		 * @namespace   View
		 * @memberof    Reader
		 * @desc    视图模板集合
		 * */
		, View: {
			reader: function(rs){
				rs = rs.result;

				return tpl.html('module', {
					title: '阅读 reader'
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
			, bookmark: function(rs){
				rs = rs.result;

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
						'<label class="label" for="url">请输入链接</label>' +
						'<input type="text" id="url" class="input" placeholder="请输入链接" data-validator="url"/>' +
						'</div></form>'
						, button: '<button type="button" id="addBookmark" class="btn">确定</button>'
					}, {
						id: 'favorPopup', size: 'normal'
						, content: '<form id="favorForm">' +
								'<input type="hidden" id="bookmarkId" name="bookmarkId"/>' +
								'<div class="formGroup">' +
									'<label class="label" for="star1">请评分</label>' +
									'<div class="input-score">' +
										'<input name="score" type="radio" value="5" id="star5"><label for="star5" class="icon icon-star"></label>' +
										'<input name="score" type="radio" value="4" id="star4"><label for="star4" class="icon icon-star"></label>' +
										'<input name="score" type="radio" value="3" id="star3"><label for="star3" class="icon icon-star"></label>' +
										'<input name="score" type="radio" value="2" id="star2"><label for="star2" class="icon icon-star"></label>' +
										'<input name="score" type="radio" value="1" id="star1"><label for="star1" class="icon icon-star"></label>' +
									'</div>' +
								'</div>' +
								'<div class="formGroup">' +
									'<label class="label" for="tag">请输入标签</label>' +
									'<input type="text" id="tag" class="input" placeholder="请输入标签" data-validator="tag"/><button id="addTag" class="btn" type="button">添加</button>' +
								'</div>' +
								'<div class="formGroup">' +
									'<label class="label" for="tags">请选择标签</label>' +
									'<div class="tagsArea"></div>' +
									'<textarea id="tags" class="hidden" name="tags"></textarea>' +
								'</div>' +
							'</form>'
						, button: '<button type="button" id="favorBookmark" class="btn">确定</button>'
					}])
					, script: {
						main: '../script/module/reader/bookmark'
						, src: '../script/lib/require.min.js'
					}
				});
			}
			, favorite: function(rs){
				rs = rs.result;

				return tpl.html('module', {
					title: '收藏文章 favorite'
					, modules: tpl.mainTpl({
						id: 'bookmark'
						, title: '收藏文章 favorite'
						, toolbar: '<li><a href="./" id="reader" class="icon icon-rss" title="返回订阅列表"></a></li>' +
						'<li><a href="bookmark" id="favorite" class="icon icon-bookmark" title="待读文章"></a></li>' +
						tpl.toolbarTpl([{
							//id: 'add', icon: 'plus', title: '添加待读文章'}, {
							id: 'filter', icon: 'filter', title: '过滤'
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
	}
	;


// 注册首页 metro 模块
metro.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '阅读 reader'
});

web.get('/reader/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	page = page < 1 ? 1 : page;
	size = size < 1 ? 20 : size;

	db.handle({
		sql: Reader.Model.readerPage
		, data: [(page-1) * size, page * size]
	}).then( Reader.View.reader ).then(function(html){
		res.send( html );
		res.end();
	});
});
web.get('/reader/bookmark', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	page = page < 1 ? 1 : page;
	size = size < 1 ? 20 : size;


	db.handle({
		sql: Reader.Model.bookmarkPage
		, data: [(page-1) * size, page * size]
	}).then( Reader.View.bookmark ).then(function(html){
		res.send( html );
		res.end();
	});
});
web.get('/reader/favorite', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	page = page < 1 ? 1 : page;
	size = size < 1 ? 20 : size;

	db.handle({
		sql: Reader.Model.favoritePage
		, data: [(page-1) * size, page * size]
	}).then( Reader.View.favorite ).then(function(html){
		res.send( html );
		res.end();
	});
});

/**
 * 数据接口
 * */
web.get('/data/reader', function(req, res){
	var query = req.query || {}
		, page
		, size
		, callback = query.callback
		, handle = {}
		;

	if( 'page' in query ){
		page = query.page || 1;
		size = query.size || 20;

		page = page < 1 ? 1 : page;
		size = size < 1 ? 20 : size;

		handle.sql = Reader.Model.readerPage;
		handle.data = [(page -1)*size, page*size];
	}
	else{
		handle.sql = Reader.Model.reader;
	}

	db.handle( handle ).then(function(rs){
		rs = JSON.stringify( rs.result );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/data/bookmark', function(req, res){
	var query = req.query || {}
		, page
		, size
		, callback = query.callback
		, handle = {}
		;

	if( 'page' in query ){
		page = query.page || 1;
		size = query.size || 20;

		page = page < 1 ? 1 : page;
		size = size < 1 ? 20 : size;

		handle.sql = Reader.Model.bookmarkPage;
		handle.data = [(page -1)*size, page*size];
	}
	else{
		handle.sql = Reader.Model.bookmark;
	}

	db.handle( handle ).then(function(rs){
		rs = JSON.stringify( rs.result );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/data/favorite', function(req, res){
	var query = req.query || {}
		, page
		, size
		, callback = query.callback
		, handle = {}
		;

	if( 'page' in query ){
		page = query.page || 1;
		size = query.size || 20;

		page = page < 1 ? 1 : page;
		size = size < 1 ? 20 : size;

		handle.sql = Reader.Model.favoritePage;
		handle.data = [(page -1)*size, page*size];
	}
	else{
		handle.sql = Reader.Model.favorite;
	}

	db.handle( handle ).then(function(rs){
		rs = rs.result;

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});

socket.register({
	reader: function(socket, data){
		var query = data.query || {}
			, page
			, size
			, handle = {}
			;

		if( 'page' in query ){
			page = query.page || 1;
			size = query.size || 20;

			page = page < 1 ? 1 : page;
			size = size < 1 ? 20 : size;

			handle.sql = Reader.Model.readerPage;
			handle.data = [(page -1)*size, page*size];
		}
		else{
			handle.sql = Reader.Model.reader;
		}

		db.handle( handle ).then(function(rs){
			rs = rs.result;

			socket.emit('data', {
				topic: 'reader'
				, data: rs
			});
		});
	}
	, 'reader/add': function(socket, data){}
	, 'reader/feed': function(socket, data){
		var send = {
				topic: 'reader/feed'
			}
			, feed = data.query.feed
			;

		if( feed ){

			Reader.crawler( feed ).then( Reader.Handler.crawlerFeed ).then(function(rs){

				if( rs ){
					send.info = {
						id: data.query.id
						, data: rs
					};
				}
				else{
					send.error = '';
					send.msg = '抓取失败';
				}

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '抓取失败';

			socket.emit('data', '缺少参数');

			error( 'E0002' );
		}
	}
	, 'reader/article': function(socket, data){
		// todo 抓取 rss 文章，进行分词

		//var url = data.query.url;
		//
		//if( url ){
		//	getArticle(url, function(rs){
		//
		//		reader.emit('socket', 'reader/article', socket, [rs.url, rs.title, rs.source, rs.tags.map(function(d){return d.tagName;}).join(), rs.url]);
		//	}, function(err){
		//
		//		reader.emit('socket', 'reader/article', socket, '订阅文章获取失败');
		//		error( err );
		//	});
		//}
		//else{
		//	reader.emit('socket', 'reader/article', socket, '缺少参数');
		//	error( 'E0002' );
		//}
	}
	, 'reader/favor': function(socket, data){}

	, 'reader/bookmark': function(socket, data){
		var query = data.query || {}
			, page
			, size
			, handle = {}
			;

		if( 'page' in query ){
			page = query.page || 1;
			size = query.size || 20;

			page = page < 1 ? 1 : page;
			size = size < 1 ? 20 : size;

			handle.sql = Reader.Model.bookmarkPage;
			handle.data = [(page -1)*size, page*size];
		}
		else{
			handle.sql = Reader.Model.bookmark;
		}

		db.handle( handle ).then(function(rs){
			rs = rs.result;

			socket.emit('data', {
				topic: 'reader/bookmark'
				, data: rs
			});
		});
	}
	, 'reader/bookmark/add': function(socket, data){
		var send = {
				topic: 'reader/bookmark/add'
			}
			, url = data.query.url
			;

		if( url ){

			db.handle({
				sql: Reader.Model.bookmarkIsExist
				, data: [url]
			}).then( Reader.Handler.bookmarkIsExist ).then(function(rs){

				if( rs ){
					send.error = '';
					send.msg = '数据已存在';

					socket.emit('data', send);

					throw new Error(url +'，数据已存在');
				}

				return Reader.crawler( url );
			}).then( Reader.Handler.crawlerArticle ).then(function( data ){

				if( !data ){
					send.error = '';
					send.msg = '抓取数据失败';

					socket.emit('data', send);

					throw new Error('抓取数据失败');
				}

				return db.handle({
					sql: Reader.Model.bookmarkAdd
					, data: [data.url, data.title, data.source, data.tag_name, data.url]
				});
			}).then(function(rs){
				rs= rs.result;

				if( rs.insertId ){
					send.info = {
						id: rs.insertId
						, url: data[0]
						, title: data[1]
						, tag_name: data[3]
						, status: 0
					}
				}
				else{
					send.error = '';
					send.msg = '数据已存在'
				}

				socket.emit('data', send);
			}).catch(function(err){
				console.log( err );
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);

			error( 'E0002' );
		}
	}
	, 'reader/bookmark/read': function(socket, data){
		var send = {
				topic: 'reader/bookmark/read'
			}
			, id = data.query.id
			;

		if( id ){
			db.handle({
				sql: Reader.Model.bookmarkRead
				, data: [id]
			}).then(function(rs){
				rs = rs.result;

				if( rs.changedRows ){
					send.info = {
						id: id
					};
				}
				else{
					send.error = '';
					send.msg = '该文章已被读过' ;
				}

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);

			error( 'E0002' );
		}
	}
	, 'reader/bookmark/favor': function(socket, data){
		var send = {
				topic: 'reader/bookmark/favor'
			}
			, query = data.query
			, id = query.id
			, tag_name = query.tag_name || ''
			, score = query.score || 0
			;

		if( id ){
			db.handle({
				sql: Reader.Model.bookmarkFavor
				, data: [tag_name, score, id]
			}).then(function(rs){
				rs = rs.result;

				if( rs.changedRows ){
					send.info = {
						id: id
					};
				}
				else{
					send.error = '';
					send.msg = '该文章已被收藏' ;
				}

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);

			error( 'E0002' );
		}
	}

	, 'reader/favorite': function(socket, data){
		var query = data.query || {}
			, page
			, size
			, handle = {}
			;

		if( 'page' in query ){
			page = query.page || 1;
			size = query.size || 20;

			page = page < 1 ? 1 : page;
			size = size < 1 ? 20 : size;

			handle.sql = Reader.Model.favoritePage;
			handle.data = [(page -1)*size, page*size];
		}
		else{
			handle.sql = Reader.Model.favorite;
		}

		db.handle( handle ).then(function(rs){
			rs = rs.result;

			socket.emit('data', {
				topic: 'reader/favorite'
				, data: rs
			});
		});
	}
});

module.exports = function(){};