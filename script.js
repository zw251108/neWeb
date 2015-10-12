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
	, province      = {}
	, cityArr       = {}
	, districtArr   = {}
	, townArr       = {}
	, villageArr    = {}
	, citySql       = 'insert into basedata_city(name,code,province) values(?,?,?)'
	, districtSql   = 'insert into basedata_district(name,code,city) values(?,?,?)'
	, townSql       = 'insert into basedata_town(name,code,district) values(?,?,?)'
	, villageSql    = 'insert into basedata_village(name,code,town,type) values(?,?,?,?)'
	, cb = function(err, rs){
		if( !err ){
			console.log(rs.insertId);
		}
	}
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
	var url = u.split('/')
		, rs = []
		;
	url[url.length-1] = href;
	url = url.join('/');
	//console.log(u, url);

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
				$t = $list.eq(i);

				//console.log($t.attr('href'), $t.text());

				//rs.push({
				//	code: $t.text()
				//	, name: $list.eq(i+1).text()
				//	, province: code
				//});
				db.query(citySql, [$list.eq(i+1).text(), $t.text(), code], cb);
				district(url, $t.attr('href'), $t.text());
			}
			//cityArr[code] = rs;

			//console.log('city', cityArr);
		});
	});
}
function district(u, href, code){
	var url = u.split('/')
		, rs = []
		;
	url[url.length-1] = href;
	url = url.join('/');
	console.log(u, url);

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
				$t = $list.eq(i);

				//console.log($t.attr('href'), $t.text());

				//rs.push({
				//	code: $t.text()
				//	, name: $list.eq(i+1).text()
				//	, city: code
				//});
				db.query(districtSql, [$list.eq(i+1).text(), $t.text(), code], cb);
				town(url, $t.attr('href'), $t.text());
			}
			//districtArr[code] = rs;
			//console.log('district', districtArr)
		});
	});
}
function town(u, href, code){
	var url = u.split('/')
		, rs = []
		;
	url[url.length-1] = href;
	url = url.join('/');
	//console.log(u, url);

	http.get(url, function(res){
		var chunks = [];
		res.on('data', function(chunkBuffer){
			chunks.push(chunkBuffer);
		});
		res.on('end', function(){
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
				, $ = Cheerio.load(html, {decodeEntities: false})
				, $list = $('.towntr a')
				, i, j, $t
				;
			for(i = 0, j = $list.length; i < j; i+=2){
				$t = $list.eq(i);

				//console.log($t.attr('href'), $t.text());

				//rs.push({
				//	code: $t.text()
				//	, name: $list.eq(i+1).text()
				//	, district: code
				//});
				db.query(townSql, [$list.eq(i+1).text(), $t.text(), code], cb);
				village(url, $t.attr('href'), $t.text());
			}
			//townArr[code] = rs;
			//console.log('town', townArr)
		});
	});
}
function village(u, href, code){
	var url = u.split('/')
		, rs = []
		;
	url[url.length-1] = href;
	url = url.join('/');
	console.log(u, url);

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
				$t = $list.eq(i);

				//console.log($t.attr('href'), $t.text());

				//rs.push({
				//	code: $t.text()
				//	, type: $list.eq(i+1).text()
				//	, name: $list.eq(i+2).text()
				//	, town: code
				//});
				db.query(villageSql, [$list.eq(i+2).text(), $t.text(), code, $list.eq(i+1).text()], cb);
				//town(url, $t.attr('href'));
			}
			//villageArr[code] = rs;
			//console.log('village', villageArr)
		});
	});
}
//db.query('select * from basedata_province', function(err, rs){
//	var i, j = rs.length;
//	if( !err ){
//
//		while( j-- ){
//			province[rs[j].name] = rs[j].code;
//		}
//
//		console.log('province', province);
////		http.get(u, function(res){
////			var chunks = [];
////
////			res.on('data', function(chunkBuffer){
////				chunks.push( chunkBuffer );
////			});
////			res.on('end', function(){
////				var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
////					, $ = Cheerio.load(html, {decodeEntities: false})
////					, $list = $('.provincetr a')
////					, i, j, $t
////					;
////				for(i = 31, j = 32; i < j; i++){
////					$t = $list.eq(i);
////
////					console.log( $t.attr('href'), $t.text() );
////
////					city(u, $t.attr('href'), province[$t.text()]);
////				}
////				//console.log( $list );
////				//console.log(decodedBody);
////
////			});
////		});
//
//		//console.log(province);
//
//		//var all_univ = allUnivList[0].provs
//		//	, t, m, n, s, code;
//		//for( i = 1, j = all_univ.length
//		//	; i < j; i++ ){
//		//	t = all_univ[i];console.log(t.name);
//		//	code = province[t.name];
//		//	t = t.univs;
//		//	for( m = 0, n = t.length; m < n; m++){
//		//		s = t[m];
//		//		db.query('insert into basedata_university(name,province,code) values(?,?,?)', [s.name, code, s.id], function(err, rs){
//		//			if( !err ){
//		//				console.log(rs.insertId);
//		//			}
//		//		});
//		//	}
//		//}
//	}
//});

//db.query('insert into tag(name) select :name from dual where not exists (select * from tag where name like :name)', {
//	name: 'jQuery'
//}, function(err, rs){
//	console.log(rs);
//})
//console.log( db.format('insert into tag(name) select :name from dual where not exists (select * from tag where name like :name)', {name: 'jQuery'}) )
var tags = {};
function saveOrUpdate(name, num){
	db.query('select * from tag where name=?', [name], function(err, rs){
		if( !err ){
			if( rs && rs.length ){
				db.query('update tag set num=? where name=?', [num, name], function(){console.log(1)});
			}
			else{
				db.query('insert into tag(name,num) value(?,?)', [name, num], function(){console.log(2)});
			}
		}
	});
}
//db.query('(select tags from blog) union (select tags from blog) union (select tags from bookmark where status=2) union (select tags from editor) union (select tags from reader) union (select tags from ui_lib)', function(err, rs){
//	var i, t
//		, m, k
//		;
//	if( !err ){
//		//console.log( rs );
//		i = rs.length;
//
//		while( i-- ){
//			t = rs[i].tags;
//
//			if( t ){
//				t = t.split(',');
//			}
//			else{
//				continue;
//			}
//
//			m = t.length;
//
//			while( m-- ){
//				k = t[m];
//
//				if( k in tags ){
//					tags[k]++;
//				}
//				else{
//					tags[k] = 1;
//				}
//			}
//		}
//
//		console.log(tags)
//
//		for( k in tags ) if( tags.hasOwnProperty(k) ){
//			saveOrUpdate( k, tags[k] );
//		}
//	}
//});

//var func = function(str){
//	var p = new Promise();
//
//	setTimeout(function(){
//		p.resolve('123,'+str);
//	}, 1000)
//};
//func('hello').then(function(str){
//	console.log(str);
//});

//var createEmmet = function(html){
//	var $ = Cheerio.load;
//	var $html = $('<template>'+ html +'</template>')
//		, $children = $html('template').children()
//		, k, i, j, t, $t
//		, attribs, attr
//		, index, $node
//		, cache = [{
//			$node: $children
//			, index: 0
//		}]
//		, emmet = ''
//		;
//
//	while( cache.length ){
//
//		index = cache.pop();
//		$node = index.$node;
//
//		i = index.index;
//		j = $node.length;
//
//		if( i > 0 ){
//			if( cache.length || i !== j ){
//				emmet += '^';
//			}
//		}
//
//		for(; i < j; i++ ){
//			$t = $node.eq(i);
//			t = $t[0];
//
//			if( t.type == 'tag' || t.type === 'script' || t.type === 'style' ){
//
//				attribs = t.attribs;
//
//				emmet += t.name;
//
//				if( 'id' in attribs ){
//					emmet += '#'+ attribs['id'];
//				}
//				if( 'class' in attribs ){
//					emmet += '.'+ attribs['class'].split(' ').join('.');
//				}
//
//				attr = [];
//				for(k in attribs) if( attribs.hasOwnProperty(k) && k !== 'id' && k !== 'class' ){
//					attr.push( k +(attribs[k] ? '='+ attribs[k] : '') );
//				}
//
//				emmet += attr.length ? '['+ attr.join(' ') +']' : '';
//
//				if( $t.children().length ){
//
//					emmet += '>';
//
//					cache.push({
//						$node: $node
//						, index: i+1
//					}, {
//						$node: $t.children()
//						, index: 0
//					});
//
//					break;
//				}
//				else{
//					if( i !== j -1 ) emmet += '+';
//				}
//			}
//		}
//	}
//
//	return emmet.replace(/([^\^])(\^*)$/, '$1');
//};
//
//var fs = require('fs')
//	, html = fs.readFileSync(__dirname + '/tpl/page.html').toString()
//	;
//
//var createEmmet = require('./module/emmet/htmlToEmmet.js');
//
//console.log(1, createEmmet(
//	Cheerio.load, html
// //'<style>' +
//	//'%script%' +
//	//'</style>'
//) );

//var st = Cheerio.load('<script>' +
//	'%script%' +
//	'</script>');
//console.log(st('script'))

//var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//var c = [{i: 0}, {i: 1}, {i: 2}, {i: 3}, {i: 4}, {i: 5}, {i: 6}, {i: 7}, {i: 8}, {i: 9}, {i: 10}, {i: 11}]
//console.log(arr.map(function(d, i){console.log(d, i);return d}));
//console.log(c.map(function(d, i){console.log(d.i, i);return d}));
//var BlogError = function(msg){
//	this.message = '[Blog Error]' +msg;
//}
//;
//
//BlogError.prototype = new Error();
//
//var pro = function(v){   console.log(1)
//	return new Promise(function(resolve, reject){
//		resolve(v)
//	});
//};
//
//pro(123).then(function(v){console.log(2)
//	throw new BlogError('123123123');
//}).catch(function(e){    console.log(3)
//	if( e instanceof BlogError){
//		console.log(4)
//	}
//	else{
//		throw e;
//	}
//}).catch(function(e){
//	console.log(5)
//});

var n = Promise.reject('123123')//.catch(function(s){console.log(s, 2); return s;})
	, m = Promise.resolve('1111')
	;
n.then(function(s){console.log(s, 1);return s;}).then(function(s){console.log(s, 2);})
	.catch(function(s){console.log(s, 3);return s}).then(function(s){console.log(s, 7)}, function(s){console.log(s, 8)});
m.catch(function(s){console.log(s, 4);}).then(function(s){console.log(s, 5)}, function(s){console.log(s, 6)});

//n.then(function(s){
//	console.log(1)
//}, function(str){
//	console.log(str);
//	return Promise.reject(1123);
//}).then(function(s){console.log(5)}, function(s){console.log(2)});
//
//m.then(function(str){
//	console.log(str);
//
//	return Promise.reject( new Error('error') );
//}, function(s){
//	console.log(2)
//}).then(function(e){
//	console.log(e)
//}, function(s){console.log(1)
//	console.log(s);
//});