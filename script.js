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
	, u = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2013/index.html'
	, reg = /(.*\/).*?\.html$/
	, gbkExpr = /gbk/i
	, gb2312Expr = /gb2312/i
	, charset = 'utf8'
	, data = []
	, iconv = require('iconv-lite')
	, http = require('http')
	, province = []
	, cityArr = []
	, districtArr = []
	, townArr = []
	, villageArr = []
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

//db.query('select Id,content from document', function(err, rs){
//	var i, j, t;
//	var s = 0;
//	if( !err ){console.log(123)
//		for(i = 0, j = rs.length; i < j; i++){console.log(i)
//			t = rs[i];
//                                console.log(t)
//			t.content = t.content.replace(/<textarea class="brush:(.*)">/g, '<textarea data-code-type="$1">');
//			t.content = t.content.replace(/<span class="code">(.*?)<\/span>/g, '<code class="code">$1</code>');
//
//			db.query('update document set content=? where Id=?', [t.content, t.Id], function(err, rs){
//				console.log(rs.changedRows);
//			});
//		}
//	}
//	else{
//		console.log(err)
//	}
//});

//superAgent.get(u).end(function(err, res){
//	if( !err ){
//		var html = res.text
//			, $
//			, $meta
//			, $t
//			, $list
//			, i, j
//			, isGbk
//			, isGb2312
//			;
//		//res.setEncoding('utf8');
//		//console.log(  )
//		console.log( iconv.decode(new Buffer( html ), 'gb2312') );
//		//console.log(arguments)
//		//console.log('\n')
//		//console.log(res)
//		//html = iconv.decode(new Buffer(res.text), 'gb2312').toString();
//		  //console.log(res.charset, html)
//		//if( html ){
//		//	$ = Cheerio.load(html, {decodeEntities: false});
//		//
//		//	$meta = $('meta');
//		//	for(i = 0, j = $meta.length; i < j; i++){
//		//		$t = $meta.eq(i);
//		//		if( gb2312Expr.test( $t.attr('content') ) ){
//		//			isGb2312 = true;
//		//			charset = 'gb2312';
//		//		}
//		//		else if( gbkExpr.test( $t.attr('content') ) ){
//		//			isGbk = true;
//		//			charset = 'gbk';
//		//		}
//		//	}
//		//	console.log(isGb2312, isGbk, charset)
//		//	$list = $('.provincetr a');
//		//	//console.dir( $list )
//		//
//		//
//		//	console.log( iconv.decode($list.text(), 'gb2312').toString() );
//		//}
//		//else{
//		//	//error( err );
//		//}
//		//for(var k in html){
//		//	console.log(k, ', ', html[k])
//		//}
//		//console.dir( html )
//	}
//	else{
//		//error( err );
//	}
//})
function city(u, href, code){
	var url = u.split('/');
	url[url.length-1] = href;
	url = url.join('/')
	console.log(u, url)
	http.get(url, function(res){
		var chunks = [];
		res.on('data', function(chunkBuffer){
			chunks.push(chunkBuffer);
		});
		res.on('end', function(){
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
				, $ = Cheerio.load(html, {decodeEntities: false})
				, $list = $('.citytr a')
				, i, j, $t
				;
			for(i = 0, j = $list.length; i < j; i+=2){
				$t = $list.eq(i)

				console.log($t.attr('href'), $t.text());

				cityArr.push({
					code: $t.text()
					, name: $list.eq(i+1).text()
					, province: code
				})
				district(url, $t.attr('href'), $t.text());
			}
			console.log(cityArr)
		});
	});
};
function district(u, href, code){
	var url = u.split('/');
	url[url.length-1] = href;
	url = url.join('/')
	console.log(u, url)
	http.get(url, function(res){
		var chunks = [];
		res.on('data', function(chunkBuffer){
			chunks.push(chunkBuffer);
		});
		res.on('end', function(){
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
				, $ = Cheerio.load(html, {decodeEntities: false})
				, $list = $('.countytr a')
				, i, j, $t
				;
			for(i = 0, j = $list.length; i < j; i+=2){
				$t = $list.eq(i)

				console.log($t.attr('href'), $t.text());

				districtArr.push({
					code: $t.text()
					, name: $list.eq(i+1).text()
					, city: code
				});
				town(url, $t.attr('href'), $t.text());
			}
			console.log(districtArr)
		});
	});
}
function town(u, href, code){
	var url = u.split('/');
	url[url.length-1] = href;
	url = url.join('/')
	console.log(u, url)
	http.get(url, function(res){
		var chunks = [];
		res.on('data', function(chunkBuffer){
			chunks.push(chunkBuffer);
		});
		res.on('end', function(){
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
				, $ = Cheerio.load(html, {decodeEntities: false})
				, $list = $('.countytr a')
				, i, j, $t
				;
			for(i = 0, j = $list.length; i < j; i+=2){
				$t = $list.eq(i)

				console.log($t.attr('href'), $t.text());

				townArr.push({
					code: $t.text()
					, name: $list.eq(i+1).text()
					, district: code
				});
				village(url, $t.attr('href'), $t.text());
			}
			console.log(townArr)
		});
	});
}
function village(u, href, code){
	var url = u.split('/');
	url[url.length-1] = href;
	url = url.join('/')
	console.log(u, url)
	http.get(url, function(res){
		var chunks = [];
		res.on('data', function(chunkBuffer){
			chunks.push(chunkBuffer);
		});
		res.on('end', function(){
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
				, $ = Cheerio.load(html, {decodeEntities: false})
				, $list = $('.villagetr td')
				, i, j, $t
				;
			for(i = 0, j = $list.length; i < j; i+=3){
				$t = $list.eq(i)

				console.log($t.attr('href'), $t.text());

				villageArr.push({
					code: $t.text()
					, type: $list.eq(i+1).text()
					, name: $list.eq(i+2).text()
					, town: code
				});
				//town(url, $t.attr('href'));
			}
			console.log(villageArr)
		});
	});
}
http.get(u, function(res){
	var chunks = [];
	res.on('data', function(chunkBuffer){
		chunks.push( chunkBuffer );
	});
	res.on('end', function(){
		var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
			, $ = Cheerio.load(html, {decodeEntities: false})
			, $list = $('.provincetr a')
			, i, j, $t
			;
		for(i = 0, j = 1; i < j; i++){
			$t = $list.eq(i);

			console.log( $t.attr('href'), $t.text() );

			city(u, $t.attr('href') );
		}
		//console.log( $list );
		//console.log(decodedBody);

	});
});