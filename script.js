'use strict';

/**
 * 临时使用脚本文件
 * */
var db = require('mysql').createConnection({
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'destiny'
		, dateStrings: true
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
	, error = function(e){
		console.log(e);
	}
	, getArticle = function(url, done){
		console.log('获取 feed 文章：', url);

		superAgent.get(url).end(function(err, res){
			if( !err ){
				var html = res.text
					, $
					, $main
					;

				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					$main = $('title');

					done( $main.text() );
				}
				else{
					error( err );
				}
			}
			else{
				error( err );
			}
		})

	}
	, getFeedList = function(feed, done, error){
		console.log('获取 rss 订阅源：', feed);

		superAgent.get(feed).buffer(true).end(function(err, res){

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
	, setRss = function(rs){console.log(rs)
		getFeedList(rs.xml_url, function(){
			db.query('update reader set status=? where Id=?', [1, rs.Id], function(err, r){
				if( !err ){
					console.log(rs.Id, ' good');
				}
			});
		}, function(){
			db.query('update reader set status=? where Id=?', [0, rs.Id], function(err, r){
				if( !err ){
					console.log(rs.Id, ' bad');
				}
			});
		});

	}
	, handle = function(temp){
		getArticle(temp.url, function(title){
			console.log(title);
			db.query('update reader set title=? where Id=?', [title, temp.Id], function(rs){
				console.log( temp.Id)
			})
		});
	}
	, Promise = require('promise')
	, dbQuery = function(sql, data){console.log(1230)
		return new Promise(function(fulfill, reject){
			db.query(sql, data, function(err, rs){
				if( err ){
					reject(err);
				}
				else{
					fulfill( rs );
				}
			});
		});
	}
	, url = require('url')
	;

//db.query('select * from bookmark', function(err, rs){
//	var t, i, j
//		, source
//		;
//	if( !err ){
//
//		for(i = 0, j = rs.length; i < j; i++){
//			t = rs[i];
//
//			source = url.parse( t.url );
//			source = source.protocol +'//'+ source.host;
//
//			db.query('update bookmark set source=? where Id=?', [source, t.Id], function(err, rs){
//				console.log(rs)
//			});
//		}
//	}
//})

//dbQuery('select * from reader').then(function(rs){console.log(rs)}).catch(function(){
//	console.log(arguments)
//});

//db.query('select * from reader where status<>?', ['2'], function(e, rs){
//	if( !e ){
//		var i, j
//			, temp
//			;
//
//		for(i = 0, j = rs.length; i < j; i++){
//			handle( rs[i] );
//		}
//	}
//	else{
//		console.log(e);
//	}
//});

//db.query('select * from reader where status is null', function(err, rs){console.log(rs)
//	if( !err ){
//		var i, j;
//		for( i = 0, j = rs.length; i < j; i++ ){
//			setRss( rs[i] );
//		}
//	}
//	else{
//		console.log(err)
//	}
//})

db.query('select Id,content from document', function(err, rs){
	var i, j, t;
	var s = 0;
	if( !err ){console.log(123)
		for(i = 0, j = rs.length; i < j; i++){console.log(i)
			t = rs[i];
                                console.log(t)
			t.content = t.content.replace(/<textarea class="brush:(.*)">/g, '<textarea data-code-type="$1">');
			t.content = t.content.replace(/<span class="code">(.*?)<\/span>/g, '<code class="code">$1</code>');

			db.query('update document set content=? where Id=?', [t.content, t.Id], function(err, rs){
				console.log(rs.changedRows);
			});
		}
	}
	else{
		console.log(err)
	}
});