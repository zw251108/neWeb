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