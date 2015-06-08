'use strict';

var Feed = {
		index: {
			sql: 'select * from rss'
		}
	}

	, URL = require('url')
	/**
	 * 创建 HTTP 请求
	 * */
	, HTTP = require('http')

	, segment = require('./segment/segment.js')

	/**
	 * cheerio
	 *  解析 HTML 结构
	 * */
	, Cheerio = require('cheerio')

	, tpl = require('./tpl.js')
	, emmetTpl = require('./emmetTpl/emmetTpl.js').template

	, feedTpl = emmetTpl({
		template: 'section#rss%Id%.rss_section.section>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]>h3.section_title{%name%}>span.icon.icon-plus^^dl{%dl%}'
	})
	, dlTpl = emmetTpl({
		template: ''
	})

	, getFeedList = function(feed, done){console.log(feed)

		var rssReq = HTTP.request(feed, function(res){
			var rss = '';

			res.setEncoding('utf8');
			res.on('data', function(c){
				rss += c;
			});
			res.on('end', function(){
				console.log('\n', rss);
				var $ = Cheerio.load(rss)
					, $item = $('item')
					, i, j, temp, $t
					, rs = [];
					;

				for(i = 0, j = $item.length; i < j; i++ ){
					temp = {};
					$t = $item.eq(i);

					temp.title = $t.find('title').text();
					temp.link = $t.find('link')[0].next.data;
					temp.content = $t.find('description').text();
					temp.author = $t.find('author').text();

					rs.push( temp );
				}
				//var item1 = item.eq(0);

				//		console.log('\n',  item1.find('title').text() )
				//		console.log('\n',  item1.find('link')[0].next.data )
				//		console.log('\n',  item1.find('description').text() )
				//		console.log('\n',  item1.find('author').text() );
				// title link description author
				//console.log(rss, item1.find('link')[0].next.data);
				//getArticle(item1.find('link')[0].next.data);

				done(rs)
			});
		}).on('error', function(e){
			console.log('error: ' + e.message);
		});
		rssReq.end();

	}
	, getArticle = function(url, done){console.log(url)
		var req = HTTP.get(url, function(res){
			var html = '';

			res.setEncoding('utf8');
			res.on('data', function(c){
				html += c;
			});
			res.on('end', function(){console.log(html)
				var
//				segment = new Segment()
					$ = Cheerio.load(html)
					, content
					, rs
					, obj = {}
					, filterRs = []
					, j
					, prefix = '_' + (+new Date())
					, temp
					, w, p
					;

				// 获取页面主要内容
//			if( host in mainContent ){
//				content = $(mainContent[host]).text();
//			}
//			else{
//				content = html;
//			}

				//content = html.replace(/<\/?.*?>/g, ' ');

//			// 使用默认的识别模块及字典
//			segment.useDefault();
				// 分词
				//rs = segment.doSegment(content);
				rs = segment.doSegment( $('body').html() );
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

				//w = 0;
				//j = filterRs.length;
				//while( w < j ){
					console.log('\n', filterRs);
				//
				//	w++;
				//}

				done( filterRs.slice(0, 20) );
			});
		}).on('error', function(e){
			console.log('Error: ' + e.message);
		});
		req.end();
	}
	;

//var parsedUrl = URL.parse( ARTICLE_URL_ARRAY[1], true )
//	, host = parsedUrl.host
//	;

/**
 * HTTP GET 请求
 *  发送请求，获取 RSS
 * */
//var rssReq = HTTP.get(FEED_URL_ARRAY[0], function(res){
//	var rss = '';
//
//	res.setEncoding('utf8');
//	res.on('data', function(c){
//		rss += c;
//	});
//	res.on('end', function(){
//		console.log('\n',  rss );
//		var $ = Cheerio.load(rss)
//			;
//		var item = $('item');
//		var item1 = item.eq(0);
//
////		console.log('\n',  item1.find('title').text() )
////		console.log('\n',  item1.find('link')[0].next.data )
////		console.log('\n',  item1.find('description').text() )
////		console.log('\n',  item1.find('author').text() );
//		// title link description author
//console.log(rss, item1.find('link')[0].next.data);
//		getArticle( item1.find('link')[0].next.data );
//	});
//}).on('error', function(e){
//	console.log('error: ' + e.message);
//});
//rssReq.end();


/**
 * HTTP GET 请求
 *  发送请求，获取网页
 * */
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
//			rs = segment.doSegment(content);
//
//			// 统计
//			j = rs.length;
//			while( j-- ){
//				temp = rs[j];
//				p = temp.p;
//
//				/**
//				 * 过滤，只统计
//				 *  8   专有名词
//				 *  16  外文字符
//				 *  32  机构团体
//				 *  64  地名
//				 *  128 人名
//				 *  4096    动词
//				 *  1048576 名词
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
//					obj[w] = filterRs.length - 1;
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
//			while( w < j ){
//				console.log('\n', filterRs[w]);
//
//				w++;
//			}
//		});
//	}).on('error', function(e){
//		console.log('Error: ' + e.message);
//	});
//	req.end();
//}
//ARTICLE_URL_ARRAY.forEach(getArticle);


module.exports = function(web, db, socket, metro){
	var feed = Feed;

	metro.push({
		id: 'rss'
		, type: 'metro'
		, size: 'normal'
		, title: '订阅 rss'
	});

	web.get('/rss/', function(req, res){
		var index = feed.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send(tpl.html('module', {
					title: '订阅 rss'
					, modules: tpl.mainTpl({
						id: 'rss'
						, title: '订阅 rss'
						, content: feedTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/rss/index'
						, src: '../script/lib/require.min.js'
					}
				}));
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}
			res.end();
		});
	});

	socket.register({
		rss: function(socket){

		}
		, 'rss/feedList': function(socket, data){
			var feed = data.query.feed;

			if( feed ){
				getFeedList(feed, function(rs){
					socket.emit('getData', {
						topic: 'rss/feedList'
						, data: rs
						, id: data.query.id
					});
				})
			}
		}
		, 'rss/article': function(socket, data){
			var url = data.query.url;

			if( url ){
				getArticle(url, function(rs){
					socket.emit('getData', {
						topic: 'rss/article'
						, data: rs
					});
				})
			}
		}
	});
};