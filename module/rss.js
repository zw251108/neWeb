'use strict';

var RSS = {
		index: {
			sql: 'select * from rss'
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

	, tpl = require('./tpl.js')
	, emmetTpl = require('./emmetTpl/emmetTpl.js').template

	, rssTpl = emmetTpl({
		template: 'section#rss_%Id%.rss_section.section>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]>h3.section_title{%name%}>span.icon.icon-plus^^ul.rss_articleList'
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

					console.log(content)

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
	;

module.exports = function(web, db, socket, metro){
	var rss = RSS;

	metro.push({
		id: 'rss'
		, type: 'metro'
		, size: 'normal'
		, title: '订阅 rss'
	});

	web.get('/rss/', function(req, res){
		var index = rss.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send(tpl.html('module', {
					title: '订阅 rss'
					, modules: tpl.mainTpl({
						id: 'rss'
						, title: '订阅 rss'
						, content: rssTpl(rs).join('')
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
		, 'rss/article': function(socket, data){
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
	});
};