'use strict';

var db          = require('./db.js')
	, web       = require('./web.js')
	, socket    = require('./socket.js')
	, error     = require('./error.js')

	, index     = require('./index.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	//, tag       = require('./tag.js')
	, tagModel  = require('./tag/model.js')
	, tagView   = require('./tag/view.js')

	, readerTpl    = emmetTpl({
		template: 'section#reader_%Id%.reader_section.section' +
			'>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]' +
				'>h3.section_title{%name%}' +
					'>span.icon.icon-up' +
				'^^hr' +
				'+ul.reader_articleList'
	})
	, articleTpl   = emmetTpl({
		template: 'article#readerArt%Id%.reader_article.article[data-id=%Id%]' +
			'>a[href=%url% title=%title% target=_blank]' +
				'>h3.article_title{%title%}' +
			'^hr' +
			'+a.icon.icon-checkbox%readStatus%[href=reader/read title=%readTitle%]{%readText%}' +
			'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}' +
			'+div.tagsArea{%tags%}'
		, filter: {
			title: function(d){
				return d.title || d.url;
			}
			, readStatus: function(d){
				return +d.status > 1 ? '-checked' : '';
			}
			, readTitle: function(d){
				return +d.status > 1 ? '已读' : '未读';
			}
			, readText: function(d){
				return +d.status > 1 ? '已读过' : '读过';
			}
			, tags: function(d){
				return d.tags ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
			}
		}
	})

	, bookmarkAddFormTpl    = emmetTpl({
		template: 'form' +
			'>div.formGroup' +
				'>label.label[for=url]{请输入链接}' +
				'+input#url.input[type=text placeholder=请输入链接 data-validator=url]'
	})
	, bookmarkReadFormTpl  = emmetTpl({
		template: 'form#readForm' +
			'>input#bookmarkId[type=hidden name=bookmarkId]' +
			'+input#bookmarkUrl[type=hidden name=bookmarkUrl]' +
			'+div.formGroup' +
				'>label.label[for=bookmarkTitle]{请设置标题}' +
				'+input#bookmarkTitle.input[type=text name=title placeholder="重新设置标题" data-validator=title]' +
			'^div.formGroup' +
				'>label.label[for=star1]{请评分}' +
				'+div.input-score' +
					'>input#star5[type=radio name=score value=5]' +
					'+label.icon.icon-star[for=star5]' +
					'+input#star4[type=radio name=score value=4]' +
					'+label.icon.icon-star[for=star4]' +
					'+input#star3[type=radio name=score value=3]' +
					'+label.icon.icon-star[for=star3]' +
					'+input#star2[type=radio name=score value=2]' +
					'+label.icon.icon-star[for=star2]' +
					'+input#star1[type=radio name=score value=1]' +
					'+label.icon.icon-star[for=star1]' +
			'^^' + tagView.tagEditorEmmet
	})

	, segment = require('./segment/segment.js')

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

	, Promise = require('promise')

	, TAG_CACHE
	, TAG_INDEX

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
			, readerPage: 'select * from reader where status=1 limit :page,:size'
			, readerIsExist: 'select * from reader where xml_url like :xmlUrl'

			, bookmark: 'select Id,title,url,status,tags,datetime from bookmark order by status,Id desc'
			, bookmarkCount: 'select count(*) as count from bookmark'
			, bookmarkPage: 'select Id,title,url,status,tags,datetime from bookmark order by status,Id desc limit :page,:size'
			, bookmarkAdd: 'insert into bookmark(url,title,source,tags,datetime) select :url,:title,:source,:tags,now() from dual where not exists (select * from bookmark where url like :url)'
			, bookmarkRead: 'update bookmark set status=2,title=:title,tags=:tags,score=score+:score where Id=:id and status<2'
			, bookmarkIsExist: 'select * from bookmark where url like :url'

			, favorite: 'select * from bookmark where status=2 order by score desc,datetime desc'
			, favoriteCount: 'select count(*) as count from bookmark where status=2'
			, favoritePage: 'select * from bookmark where status=2 order by datetime desc limit :page,:size'
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

					, urlResult = Url.parse(url)
					, source = urlResult.protocol + '//' + urlResult.host

					, $ , $main
					, title , content

					, segmentResult = []
					, indexCache = {}
					, filterResult = []

					, prefix = '_' + (+new Date())
					, index

					, j, temp, w, p

					, tagsData = TAG_CACHE || tagModel.TAG_CACHE || []
					, tagsIndex = TAG_INDEX || tagModel.TAG_INDEX || {}
					, tagsRs

					, rs = null
					;

				TAG_CACHE = tagsData;
				TAG_INDEX = tagsIndex;

				console.log(tagsData);
				//console.log(charset, html, source);

				if( !charset || charset.toUpperCase() !== 'UTF-8' ){
					// todo 转码：将 GBK 转成 UTF-8
				}

				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					// todo 删除代码片段 script style

					title = $('title').text();

					// 对标题进行分词
					segmentResult = segment.doSegment(title);

					// todo 根据不同网站 获取不同内容
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
						if( !(p === 8 || p === 16 || p === 32 || p === 64 || p === 128 || p === 4096 || p === 1048576) ) continue;

						// 将单个字符排除
						if( w.length < 2 ) continue;

						/**
						 * 对分出来的词加个前缀作为 key 存在 indexCache 对象中
						 *  防止分出来的词存在 toString 一类已存在于对象中的属性的关键字
						 * */
						index = prefix + w;

						//console.log(w);
						if( index in indexCache ){
							filterResult[indexCache[index]].n++;
						}
						else{
							filterResult.push({
								tagName: w
								, rank: (w in tagsIndex && tagsIndex.hasOwnProperty(w) ) ? tagsData[tagsIndex[w]].num : 0
								, p: p
								, n: 1
							});

							indexCache[index] = filterResult.length - 1;
						}
					}

					// 按钮权重排序
					filterResult.sort(function(a, b){
						var rs = b.rank - a.rank;

						if( rs === 0 ){
							rs = b.n - a.n;
						}

						return rs;
					});

					tagsRs = filterResult.slice(0, 15);

					// 按分词数量排序
					tagsRs = tagsRs.concat( filterResult.slice(16).sort(function(a, b){
						return b.n - a.n;
					}).slice(0, 5) );

					//console.log('\n', tagsRs);

					rs = {
						url: url
						, title: title
						, tags: tagsRs.map(function(d){return d.tagName;}).join()
						, source: source
					};
					console.log(rs);
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
				//rs = rs.result;
				
				return !!(rs && rs.length);
			}
			/**
			 * @method  bookmarkIsExist
			 * @memberof    Handler
			 * @param   {object}    rs  数据库查询结果
			 * @return  {boolean}   该数据是否存在
			 * */
			, bookmarkIsExist: function(rs){
				//rs = rs.result;

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
				//rs = rs.result;

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
					}).join('') + tpl.popupTpl([{
						id: 'readPopup', size: 'normal'
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn">确定</button>'
					}]).join('')
					, script: {
						main: '../script/module/reader/index'
						, src: '../script/lib/require.min.js'
					}
				});
			}
			, bookmark: function(rs){
				//rs = rs.result;

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
							, content: bookmarkAddFormTpl({})
							, button: '<button type="button" id="addBookmark" class="btn">确定</button>'
					}, {
						id: 'readPopup', size: 'normal'
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn">确定</button>'
					}]).join('')
					, script: {
						main: '../script/module/reader/bookmark'
						, src: '../script/lib/require.min.js'
					}
				});
			}
			, favorite: function(rs){
				//rs = rs.result;

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
							, content: bookmarkAddFormTpl({})
							, button: '<button type="button" id="addBookmark" class="btn">确定</button>'
					}])
				});
			}
		}
	}
	;

// 注册首页 metro 模块
index.push({
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
		, data: {
			page: (page-1) * size
			, size: size
		}
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
		, data:{
			page: (page-1) * size
			, size: size
		}
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
		, data: {
			page: (page-1) * size
			, size: size
		}
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
		handle.data = {
			page: (page-1) * size
			, size: size
		};
	}
	else{
		handle.sql = Reader.Model.reader;
	}

	db.handle( handle ).then(function(rs){
		rs = JSON.stringify( rs )//.result );

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
		handle.data = {
			page: (page-1) * size
			, size: size
		};
	}
	else{
		handle.sql = Reader.Model.bookmark;
	}

	db.handle( handle ).then(function(rs){
		rs = JSON.stringify( rs )//.result );

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
		handle.data = {
			page: (page-1) * size
			, size: size
		};
	}
	else{
		handle.sql = Reader.Model.favorite;
	}

	db.handle( handle ).then(function(rs){
		//rs = rs.result;

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
			handle.data = {
				page: (page-1) * size
				, size: size
			};
		}
		else{
			handle.sql = Reader.Model.reader;
		}

		db.handle( handle ).then(function(rs){
			//rs = rs.result;

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
	, 'reader/article/bookmark': function(socket, data){
		var send = {
				topic: 'reader/article/bookmark'
			}
			, query = data.query || {}
			, url = query.url
			, targetId = query.targetId
			, dataAll
			;

		if( url && targetId ){

			db.handle({
				sql: Reader.Model.bookmarkIsExist
				, data: {
					url: '%'+ url +'%'
				}
			}).then(function(rs){

				if( rs && rs.length ){
					send.error = '';
					send.msg = '数据已存在';
					send.info = rs[0];
					send.info.targetId = targetId;


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
				dataAll = data;
				return db.handle({
					sql: Reader.Model.bookmarkAdd
					, data: data
				});
			}).then(function(rs){
				//var data = rs.data;

				//rs= rs.result;

				dataAll.targetId = targetId;

				if( rs.insertId ){
					dataAll.id = rs.insertId;
					dataAll.statsu = 0;
				}
				else{
					send.error = '';
					send.msg = '数据已存在'
				}
				send.info = dataAll;//data;

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
	, 'reader/article/read': function(socket, data){

	}
	//, 'reader/favor': function(socket, data){}

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
			handle.data = {
				page: (page-1) * size
				, size: size
			};
		}
		else{
			handle.sql = Reader.Model.bookmark;
		}

		db.handle( handle ).then(function(rs){
			//rs = rs.result;

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
			, dataAll
			;

		if( url ){

			db.handle({
				sql: Reader.Model.bookmarkIsExist
				, data: {
					url: '%'+ url +'%'
				}
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
				dataAll = data;
				return db.handle({
					sql: Reader.Model.bookmarkAdd
					, data: data
				});
			}).then(function(rs){
				//var data = rs.data;

				//rs= rs.result;

				if( rs.insertId ){
					dataAll.id = rs.insertId;
					dataAll.statsu = 0;

					send.info = dataAll;//data;
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
			, query = data.query
			, id = query.id
			, tags = query.tags || ''
			, score = query.score || 0
			, title = query.title || ''
			;

		if( id ){
			db.handle({
				sql: Reader.Model.bookmarkRead
				, data: {
					id: id
					, title: title
					, score: score
					, tags: tags
				}
			}).then(function(rs){
				//rs = rs.result;

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

	, 'reader/read': function(socket, data){
		var query = data.query
			, id = query.id
			, url = query.url
			, tags = query.tags || ''
			, score = query.score || 0
			, title = query.title || ''
			;


		if( id ){
			if( /^\d+$/.test( id ) ){
				db.handle({
					sql: Reader.Model.bookmarkRead
					, data: {
						id: id
						, title: title
						, score: score
						, tags: tags
					}
				}).then(function(rs){

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
			else if( url ){
				db.handle({
					sql: Reader.Model.bookmarkIsExist
					, data: {
						url: '%'+ url +'%'
					}
				}).then( Reader.Handler.bookmarkIsExist ).then(function(rs){

					if( rs ){
						send.error = '';
						send.msg = '数据已存在';

						socket.emit('data', send);

						throw new Error(url +'，数据已存在');
					}

					var source = Url.parse(url);
					source = source.protocol + '//' + source.host;

					return db.handle({
						sql: Reader.Model.bookmarkAdd
						, data: {
							url: url
							, title: title
							, score: score
							, tags: tags
							, source: source
						}
					});
				}).then(function(rs){
					//var data = rs.data;

					//rs= rs.result;

					if( rs.insertId ){
						send.info = {
							targetId: id
							, tags: tags
							, bookmarkId: rs.insertId
						};
						//dataAll.id = rs.insertId;
						//dataAll.statsu = 0;

						//send.info = dataAll;//data;
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
				// todo 错误
			}
		}
		else{
			// todo 错误
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
			handle.data = {
				page: (page-1) * size
				, size: size
			};
		}
		else{
			handle.sql = Reader.Model.favorite;
		}

		db.handle( handle ).then(function(rs){
			//rs = rs.result;

			socket.emit('data', {
				topic: 'reader/favorite'
				, data: rs
			});
		});
	}
});

module.exports = Reader;