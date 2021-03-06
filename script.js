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
	//, Promise = require('promise')
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
	, path  = require('path')
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
var fs = require('fs')
//	, html = fs.readFileSync(__dirname + '/template/page.html').toString()
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

//var n = Promise.reject('123123')//.catch(function(s){console.log(s, 2); return s;})
//	, m = Promise.resolve('1111')
//	;
//n.then(function(s){console.log(s, 1);return s;}).then(function(s){console.log(s, 2);})
//	.catch(function(s){console.log(s, 3);return s}).then(function(s){console.log(s, 7)}, function(s){console.log(s, 8)});
//m.catch(function(s){console.log(s, 4);}).then(function(s){console.log(s, 5)}, function(s){console.log(s, 6)});

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


//var xlsx = require('node-xlsx')
//	, list = xlsx.parse('./data.xlsx')
//	, i, j
//	, t, data
//	, m, n
//	, temp
//	, tree = []
//	, node, leave
//	, tempObj, tempNode
//	, bigData = []
//	, p, q
//	, r, s
//	;
//for( i = 0, j = list.length; i < j; i++){
//	t = list[i];
//
//	data = t.data;
//
//	tempObj = {
//		name: t.name
//	};
//
//	tree = [];
//	for( m = 0, n = data.length; m < n; m++ ){
//		temp = data[m][0];
//		if( temp ){
//			tree.push({
//				name: temp
//				, s: m
//				, n: 1
//			});
//		}
//		else{
//			tree[tree.length -1].n++;
//		}
//	}
//
//	for( m = 0, n = tree.length; m < n; m++ ){
//		temp = tree[m];
//
//		node = [];
//		for(p = temp.s, q = p +temp.n; p < q; p++){
//			tempNode = data[p][1];
//
//			if( tempNode ){
//				node.push({
//					name: tempNode
//					, s: p
//					, n: 1
//				});
//			}
//			else{
//				node[node.length -1].n++;
//			}
//		}
//
//		for( p = 0, q = node.length; p < q; p++ ){
//			leave = node[p];
//			leave.children = [];
//			for( r = leave.s, s = r +leave.n; r < s; r++ ){
//
//				data[r][2] && leave.children.push(data[r][2]);
//				data[r][3] && leave.children.push(data[r][3]);
//				data[r][4] && leave.children.push(data[r][4]);
//				data[r][5] && leave.children.push(data[r][5]);
//			}
//		}
//
//		temp.children = node;
//	}
//
//	tempObj.children = tree;
//	bigData.push( tempObj );
//
//	//console.log(temp);
//}
//console.log( JSON.stringify( bigData) );

//var data = [
//	{
//		"name": "IT.互联网",
//		"children": [
//			{
//				"name": "技术",
//				"s": 0,
//				"n": 18,
//				"children": [
//					{
//						"name": "开发",
//						"s": 0,
//						"n": 6,
//						"children": [
//							"技术研发",
//							"技术管理岗",
//							"Go",
//							"spark",
//							"搜索引擎",
//							"数据分析",
//							"HBase",
//							"实施顾问",
//							"Openstack",
//							"数据挖掘",
//							"自然语言处理",
//							"IE工程师",
//							"Decker",
//							"全栈工程师",
//							"推荐系统",
//							"数据库开发工程师",
//							"BI工程师",
//							"实施工程师",
//							"嵌入式软件",
//							"电子软件开发",
//							"ERP",
//							"Flash设计/开发",
//							"网优工程师"
//						]
//					},
//					{
//						"name": "移动开发及前端",
//						"s": 6,
//						"n": 2,
//						"children": [
//							"前端",
//							"Flash",
//							"COCOS2D-X",
//							"网页制作",
//							"U3D"
//						]
//					},
//					{
//						"name": "测试",
//						"s": 8,
//						"n": 3,
//						"children": [
//							"高级测试工程师",
//							"测试工程师",
//							"测试经理/组长",
//							"测试开发",
//							"软件测试",
//							"手机测试",
//							"自动化测试",
//							"游戏测试",
//							"性能测试",
//							"硬件测试",
//							"系统测试"
//						]
//					},
//					{
//						"name": "运维",
//						"s": 11,
//						"n": 5,
//						"children": [
//							"DBA",
//							"linux运维工程师",
//							"网络与信息安全工程师",
//							"维修工程师",
//							"安全工程师",
//							"维护工程师",
//							"网络工程师",
//							"维修技术员",
//							"计算机硬件维护工程师",
//							"网络管理岗",
//							"系统管理员",
//							"信息员",
//							"系统运维",
//							"网络维护",
//							"系统集成工程师",
//							"运维总监",
//							"运维经理/主管",
//							"网络优化",
//							"信息技术经理/主管",
//							"信息技术专员"
//						]
//					},
//					{
//						"name": "高端职位",
//						"s": 16,
//						"n": 2,
//						"children": [
//							"技术管理岗",
//							"架构师",
//							"项目管理岗",
//							"系统工程师",
//							"安全专家"
//						]
//					}
//				]
//			},
//			{
//				"name": "产品",
//				"s": 18,
//				"n": 5,
//				"children": [
//					{
//						"name": "产品经理",
//						"s": 18,
//						"n": 3,
//						"children": [
//							"产品经理/主管",
//							"产品助理",
//							"产品专员",
//							"互联网产品经理",
//							"互联网产品专员",
//							"数据产品经理",
//							"移动产品经理",
//							"游戏策划",
//							"电商产品经理"
//						]
//					},
//					{
//						"name": "产品设计",
//						"s": 21,
//						"n": 1,
//						"children": [
//							"产品设计师",
//							"需求分析师",
//							"网页产品设计",
//							"移动产品设计"
//						]
//					},
//					{
//						"name": "高端职位",
//						"s": 22,
//						"n": 1,
//						"children": [
//							"产品总监",
//							"产品部经理",
//							"游戏制作人",
//							"计算机辅助设计工程师"
//						]
//					}
//				]
//			},
//			{
//				"name": "设计",
//				"s": 23,
//				"n": 11,
//				"children": [
//					{
//						"name": "视觉设计",
//						"s": 23,
//						"n": 6,
//						"children": [
//							"UI设计",
//							"视觉设计",
//							"网页设计",
//							"APP设计",
//							"平面设计",
//							"flash设计",
//							"美术设计",
//							"特效设计",
//							"广告设计",
//							"多媒体设计",
//							"原画师",
//							"游戏界面设计",
//							"游戏场景",
//							"游戏角色",
//							"游戏动作",
//							"游戏设计/开发",
//							"视频编辑",
//							"美工",
//							"绘画",
//							"后期制作",
//							"影视策划/制作人员",
//							"摄影师",
//							"多媒体/动画/3D设计"
//						]
//					},
//					{
//						"name": "交互设计",
//						"s": 29,
//						"n": 1,
//						"children": [
//							"交互设计师",
//							"网页交互设计师",
//							"无线交互设计师",
//							"硬件交互设计师"
//						]
//					},
//					{
//						"name": "用户研究",
//						"s": 30,
//						"n": 2,
//						"children": [
//							"系统策划",
//							"用户体验研究员",
//							"游戏数值分析",
//							"游戏策划",
//							"数值策划",
//							"系统分析员"
//						]
//					},
//					{
//						"name": "高端职位",
//						"s": 32,
//						"n": 2,
//						"children": [
//							"设计总监",
//							"艺术/设计总监",
//							"设计经理/主管",
//							"交互设计总监",
//							"交互设计经理",
//							"用户研究总监",
//							"用户研究经理"
//						]
//					}
//				]
//			},
//			{
//				"name": "运营",
//				"s": 34,
//				"n": 11,
//				"children": [
//					{
//						"name": "运营",
//						"s": 34,
//						"n": 3,
//						"children": [
//							"产品运营",
//							"电商运营",
//							"运营推广",
//							"运营策划",
//							"新媒体运营",
//							"游戏运营",
//							"活动执行",
//							"会展策划/设计",
//							"运营管理岗",
//							"网络推广",
//							"活动策划",
//							"电子商务"
//						]
//					},
//					{
//						"name": "编辑",
//						"s": 37,
//						"n": 3,
//						"children": [
//							"记者",
//							"文案策划",
//							"编辑",
//							"主编",
//							"编导",
//							"执行策划",
//							"策划总监",
//							"策划经理/主管",
//							"策划专员/助理",
//							"策划师"
//						]
//					},
//					{
//						"name": "客服",
//						"s": 40,
//						"n": 4,
//						"children": [
//							"售前/售后咨询",
//							"客户服务管理",
//							"淘宝客服",
//							"天猫客服",
//							"FAE",
//							"Helpdesk",
//							"网络/在线客服",
//							"服务工程师",
//							"游戏客服",
//							"售前客服",
//							"售后客服",
//							"服务顾问",
//							"电话客服",
//							"客服经理/主管",
//							"客服专员/助理",
//							"投诉专员"
//						]
//					},
//					{
//						"name": "高端职位",
//						"s": 44,
//						"n": 1,
//						"children": [
//							"首席运营官COO",
//							"高级运营总监",
//							"客服总监"
//						]
//					}
//				]
//			},
//			{
//				"name": "通用",
//				"s": 45,
//				"n": 73,
//				"children": [
//					{
//						"name": "人事行政",
//						"s": 45,
//						"n": 3,
//						"children": [
//							"培训策划",
//							"培训讲师",
//							"培训/招生/课程顾问",
//							"行政专员/助理",
//							"行政总裁",
//							"员工关系/企业文化/工会",
//							"猎头/人才中介",
//							"行政经理/主管",
//							"行政总监"
//						]
//					},
//					{
//						"name": "市场销售",
//						"s": 48,
//						"n": 7,
//						"children": [
//							"咨询总监",
//							"咨询经理/主管",
//							"咨询顾问/咨询员",
//							"咨询热线/呼叫中心",
//							"咨询师",
//							"咨询项目管理",
//							"培训经理/主管",
//							"培训专员/助理",
//							"商务经理/主管",
//							"商务专员/助理",
//							"商务代表",
//							"商务顾问",
//							"采购总监",
//							"采购经理/主管",
//							"采购工程师",
//							"客户经理",
//							"大客户销售",
//							"区域销售管理",
//							"销售",
//							"促销主管/督导",
//							"市场调研与分析",
//							"市场策划",
//							"客户关系/投诉/协调人员",
//							"客户执行",
//							"销售客服",
//							"经销商",
//							"文员",
//							"客户咨询热线/呼叫中心人员"
//						]
//					},
//					{
//						"name": "财务",
//						"s": 55,
//						"n": 3,
//						"children": [
//							"财务",
//							"财务分析",
//							"统计员",
//							"成本管理",
//							"会计",
//							"收银员",
//							"财务",
//							"审计",
//							"税务"
//						]
//					},
//					{
//						"name": "其他",
//						"s": 58,
//						"n": 60,
//						"children": [
//							"媒介经理/主管",
//							"媒介专员/助理",
//							"媒介策划",
//							"法律顾问",
//							"会务/会展经理",
//							"会务/会展专员",
//							"专职律师",
//							"高级顾问",
//							"法务总监",
//							"法务经理/主管",
//							"法务专员/助理",
//							"专业顾问"
//						]
//					}
//				]
//			}
//		]
//	},
//	{
//		"name": "房地产",
//		"children": [
//			{
//				"name": "房地产开发",
//				"s": 0,
//				"n": 5,
//				"children": [
//					{
//						"name": "成本",
//						"s": 0,
//						"n": 2,
//						"children": [
//							"成本总监",
//							"成本经理/主管",
//							"成本核算",
//							"预算",
//							"招投标工程师"
//						]
//					},
//					{
//						"name": "投融资",
//						"s": 2,
//						"n": 2,
//						"children": [
//							"投资总监",
//							"投资经理/主管",
//							"投资专员/助理",
//							"融资总监",
//							"融资经理/主管",
//							"融资专员/助理"
//						]
//					},
//					{
//						"name": "前期开发",
//						"s": 4,
//						"n": 1,
//						"children": [
//							"前期总监",
//							"前期经理/主管",
//							"前期开发"
//						]
//					}
//				]
//			},
//			{
//				"name": "土木/建筑工程",
//				"s": 5,
//				"n": 6,
//				"children": [
//					{
//						"name": "土建",
//						"s": 5,
//						"n": 6,
//						"children": [
//							"机电工程师",
//							"安全工程师",
//							"土建工程师",
//							"技术工程师",
//							"机电管理",
//							"安全管理",
//							"土建管理",
//							"技术管理",
//							"工程设备工程师",
//							"项目工程师",
//							"材料工程师",
//							"品质工程师",
//							"工程管理",
//							"项目管理",
//							"材料管理",
//							"施工工程师",
//							"水电工程师",
//							"建筑工程师",
//							"造价预算",
//							"测绘",
//							"工业工程师",
//							"制造工程师",
//							"需求工程师",
//							"服务工程师"
//						]
//					}
//				]
//			},
//			{
//				"name": "规划设计",
//				"s": 11,
//				"n": 5,
//				"children": [
//					{
//						"name": "设计",
//						"s": 11,
//						"n": 5,
//						"children": [
//							"建筑设计师",
//							"结构设计师",
//							"结构工程师",
//							"钢结构设计",
//							"电气设计",
//							"暖通设计",
//							"市政设计",
//							"给排水设计",
//							"总图设计师",
//							"CAD设计/制图",
//							"室内装潢设计",
//							"城市规划设计师",
//							"园艺/园林/景观设计师",
//							"土建工程师",
//							"设计类管理岗",
//							"模具工程师",
//							"机械设计师",
//							"工业设计"
//						]
//					}
//				]
//			},
//			{
//				"name": "物业服务",
//				"s": 16,
//				"n": 3,
//				"children": [
//					{
//						"name": "物业",
//						"s": 16,
//						"n": 1,
//						"children": [
//							"安全经理",
//							"物业管理",
//							"安全防护"
//						]
//					},
//					{
//						"name": "客服",
//						"s": 17,
//						"n": 2,
//						"children": [
//							"客服管理",
//							"客服文员",
//							"客户关系/投诉协调",
//							"咨询热线/呼叫中心服务人员"
//						]
//					}
//				]
//			},
//			{
//				"name": "市场营销",
//				"s": 19,
//				"n": 7,
//				"children": [
//					{
//						"name": "销售",
//						"s": 19,
//						"n": 2,
//						"children": [
//							"业务销售",
//							"区域销售",
//							"大客户销售",
//							"业务销售管理岗",
//							"客户服务",
//							"咨询服务",
//							"房地产中介"
//						]
//					},
//					{
//						"name": "策划",
//						"s": 21,
//						"n": 1,
//						"children": [
//							"策划总监",
//							"策划经理/主管",
//							"策划专员/助理",
//							"策划师"
//						]
//					},
//					{
//						"name": "市场",
//						"s": 22,
//						"n": 2,
//						"children": [
//							"市场总监",
//							"市场经理/主管",
//							"市场专员/助理",
//							"市场推广",
//							"市场督导",
//							"市场调研分析"
//						]
//					},
//					{
//						"name": "招商",
//						"s": 24,
//						"n": 2,
//						"children": [
//							"招商总监",
//							"招商经理/主管",
//							"招商专员/助理",
//							"招投标经理/主管",
//							"招投标专员",
//							"招投标工程师"
//						]
//					}
//				]
//			},
//			{
//				"name": "通用",
//				"s": 26,
//				"n": 34,
//				"children": [
//					{
//						"name": "财务",
//						"s": 26,
//						"n": 2,
//						"children": [
//							"首席财务官CFO/财务总监",
//							"财务经理/主管",
//							"财务专员/助理",
//							"财务规划师",
//							"会计/出纳",
//							"税务审计",
//							"预核算",
//							"资金经理/主管"
//						]
//					},
//					{
//						"name": "人事行政",
//						"s": 28,
//						"n": 32,
//						"children": [
//							"首席执行官CEO/总裁",
//							"行政总监",
//							"行政经理/主管",
//							"行政专员/助理",
//							"公关",
//							"采购管理",
//							"运营",
//							"管理培训生",
//							"员工关系/企业文化/工会",
//							"行政司机",
//							"薪酬福利管理",
//							"储备经理/干部",
//							"甲方代表",
//							"招聘培训主管/督导",
//							"招聘培训专员/顾问"
//						]
//					}
//				]
//			}
//		]
//	},
//	{
//		"name": "金融",
//		"children": [
//			{
//				"name": "银行",
//				"s": 0,
//				"n": 3,
//				"children": [
//					{
//						"name": "银行",
//						"s": 0,
//						"n": 3,
//						"children": [
//							"客户经理/主管",
//							"柜员",
//							"投资理财",
//							"行长",
//							"大堂经理",
//							"风险管理",
//							"授信审查岗",
//							"产品经理/主管",
//							"业务销售",
//							"业务销售管理",
//							"财务分析咨询",
//							"外汇交易"
//						]
//					}
//				]
//			},
//			{
//				"name": "保险",
//				"s": 3,
//				"n": 6,
//				"children": [
//					{
//						"name": "保险",
//						"s": 3,
//						"n": 6,
//						"children": [
//							"资产/资金管理",
//							"风险控制",
//							"合规法律",
//							"运营",
//							"运行维护",
//							"委托资产",
//							"理财规划师",
//							"渠道及年金",
//							"保险代理/经纪",
//							"保险理赔",
//							"寿险顾问",
//							"培训师",
//							"组训",
//							"业务销售",
//							"客户服务",
//							"客户经理",
//							"咨询顾问",
//							"产品经理",
//							"产品专员/助理",
//							"团队经理",
//							"储备干部/主管",
//							"品牌经理/主管",
//							"法务经理/主管",
//							"法务专员"
//						]
//					}
//				]
//			},
//			{
//				"name": "证券/基金",
//				"s": 9,
//				"n": 10,
//				"children": [
//					{
//						"name": "证券",
//						"s": 9,
//						"n": 6,
//						"children": [
//							"投资银行执行",
//							"投资银行项目负责人",
//							"并购项目经理",
//							"并购总监",
//							"债券发行执行岗",
//							"资产证券化项目经理",
//							"资产证券化产品经理",
//							"资本市场部经理",
//							"分析师",
//							"合规",
//							"系统开发",
//							"运行维护",
//							"清算",
//							"信用交易",
//							"客户经理",
//							"风险控制",
//							"柜员",
//							"投资理财",
//							"证券总监",
//							"证券经纪人",
//							"市场销售",
//							"证券事务代表",
//							"证券分析/金融研究"
//						]
//					},
//					{
//						"name": "基金",
//						"s": 15,
//						"n": 4,
//						"children": [
//							"运行维护",
//							"市场部经理",
//							"基金子公司投资经理",
//							"系统开发",
//							"投资经理",
//							"固定收益投资经理",
//							"基金会计",
//							"渠道经理",
//							"基金投资顾问",
//							"基金经理",
//							"行业研究员",
//							"交易员",
//							"基金营销经理",
//							"渠道项目经理",
//							"项目经理",
//							"客户经理"
//						]
//					}
//				]
//			},
//			{
//				"name": "信托/期货",
//				"s": 19,
//				"n": 2,
//				"children": [
//					{
//						"name": "信托",
//						"s": 19,
//						"n": 2,
//						"children": [
//							"信托管理岗",
//							"信托服务",
//							"风险管理/控制",
//							"行业研究员",
//							"资产证券化项目经理",
//							"资产证券化产品经理",
//							"产品经理"
//						]
//					}
//				]
//			},
//			{
//				"name": "其他金融服务",
//				"s": 21,
//				"n": 9,
//				"children": [
//					{
//						"name": "第三方理财",
//						"s": 21,
//						"n": 3,
//						"children": [
//							"产品经理/主管",
//							"数据分析",
//							"客户经理",
//							"业务销售",
//							"品牌策划",
//							"理财顾问",
//							"风险管理",
//							"培训讲师",
//							"股权投资经理"
//						]
//					},
//					{
//						"name": "其他金融服务",
//						"s": 24,
//						"n": 1,
//						"children": [
//							"拍卖/担保/典当业务",
//							"珠宝鉴定",
//							"收藏品鉴定"
//						]
//					},
//					{
//						"name": "PE/PV",
//						"s": 25,
//						"n": 2,
//						"children": [
//							"投资管理",
//							"定增业务",
//							"风险质控经理",
//							"资金募集岗",
//							"投资分析师"
//						]
//					},
//					{
//						"name": "财务",
//						"s": 27,
//						"n": 3,
//						"children": [
//							"资产管理",
//							"财务分析",
//							"统计员",
//							"成本管理",
//							"投资经理",
//							"收银员",
//							"财务",
//							"审计",
//							"财务",
//							"会计",
//							"税务"
//						]
//					}
//				]
//			},
//			{
//				"name": "通用",
//				"s": 30,
//				"n": 23,
//				"children": [
//					{
//						"name": "人事行政",
//						"s": 30,
//						"n": 23,
//						"children": [
//							"人事行政总监",
//							"人事行政经理/主管",
//							"人事行政专员/助理",
//							"储备干部",
//							"管理/培训",
//							"员工关系/企业文化/工会",
//							"文案策划",
//							"应届毕业生",
//							"运营",
//							"法务主管",
//							"法务专员/助理"
//						]
//					}
//				]
//			}
//		]
//	},
//	{
//		"name": "消费品",
//		"children": [
//			{
//				"name": "食品",
//				"s": 0,
//				"n": 15,
//				"children": [
//					{
//						"name": "研发/分析/注册",
//						"s": 0,
//						"n": 2,
//						"children": [
//							"产品研发",
//							"技术研发工程师",
//							"注册专员",
//							"研发工程师",
//							"注册总监",
//							"注册经理",
//							"数据分析",
//							"化学分析"
//						]
//					},
//					{
//						"name": "生产/工艺",
//						"s": 2,
//						"n": 5,
//						"children": [
//							"生产经理",
//							"生产运营管理",
//							"生产计划/物料管理",
//							"生产设备管理",
//							"生产文员",
//							"生产助理",
//							"生产跟单",
//							"生产技术员",
//							"生产项目总监",
//							"生产项目经理/主管",
//							"生产项目专员/助理",
//							"生产项目工程师",
//							"产品/包装设计",
//							"工艺/制程工程师",
//							"运作经理",
//							"项目执行/协调人员",
//							"工艺设计经理",
//							"工厂经理/厂长"
//						]
//					},
//					{
//						"name": "产品及品牌策划",
//						"s": 7,
//						"n": 2,
//						"children": [
//							"品牌/连锁招商管理",
//							"产品经理/主管",
//							"产品运营",
//							"品牌总监",
//							"产品/包装设计"
//						]
//					},
//					{
//						"name": "采购及供应链",
//						"s": 9,
//						"n": 1,
//						"children": [
//							"采购",
//							"食品仓储/物流",
//							"供应链管理",
//							"货运代理"
//						]
//					},
//					{
//						"name": "质检",
//						"s": 10,
//						"n": 2,
//						"children": [
//							"质量管理/测试经理",
//							"质量工程师",
//							"测试工程师",
//							"认证工程师/审核员",
//							"化验/检验",
//							"可靠度工程师",
//							"体系工程师/审核员"
//						]
//					},
//					{
//						"name": "销售",
//						"s": 12,
//						"n": 3,
//						"children": [
//							"销售",
//							"售后服务/客户服务",
//							"开发经理",
//							"客户经理/主管",
//							"客户执行",
//							"销售内勤",
//							"销售数据分析",
//							"团购经理",
//							"分销经理",
//							"渠道总监",
//							"业务分析经理/主管",
//							"业务分析专员/助理"
//						]
//					}
//				]
//			},
//			{
//				"name": "日化",
//				"s": 15,
//				"n": 16,
//				"children": [
//					{
//						"name": "研发/分析/注册",
//						"s": 15,
//						"n": 2,
//						"children": [
//							"产品研发",
//							"技术研发经理/主管",
//							"数据分析",
//							"化学分析",
//							"注册总监",
//							"注册经理",
//							"注册专员"
//						]
//					},
//					{
//						"name": "生产/工艺",
//						"s": 17,
//						"n": 5,
//						"children": [
//							"生产经理",
//							"生产运营管理",
//							"生产计划/物料管理",
//							"生产设备管理",
//							"生产文员",
//							"生产助理",
//							"生产跟单",
//							"生产技术员",
//							"生产项目总监",
//							"生产项目经理/主管",
//							"生产项目专员/助理",
//							"生产项目工程师",
//							"产品/包装设计",
//							"工艺/制程工程师",
//							"运作经理",
//							"产品工程师",
//							"工艺设计经理",
//							"工厂经理/厂长",
//							"项目执行/协调人员",
//							"技术工程师"
//						]
//					},
//					{
//						"name": "产品及品牌策划",
//						"s": 22,
//						"n": 3,
//						"children": [
//							"品牌/连锁招商管理",
//							"产品经理/主管",
//							"产品运营",
//							"产品设计师",
//							"产品工程师",
//							"产品/包装设计",
//							"市场督导",
//							"品牌经理/主管",
//							"品牌总监"
//						]
//					},
//					{
//						"name": "采购及供应链",
//						"s": 25,
//						"n": 1,
//						"children": [
//							"采购",
//							"物流/仓储",
//							"供应链管理",
//							"货运代理"
//						]
//					},
//					{
//						"name": "质检",
//						"s": 26,
//						"n": 2,
//						"children": [
//							"质量管理/测试经理",
//							"质量工程师",
//							"测试工程师",
//							"认证工程师/审核员",
//							"化验/检验",
//							"可靠度工程师",
//							"体系工程师/审核员"
//						]
//					},
//					{
//						"name": "销售",
//						"s": 28,
//						"n": 3,
//						"children": [
//							"销售",
//							"售后服务/客户服务",
//							"开发经理",
//							"团购经理",
//							"客户执行",
//							"渠道总监",
//							"客户经理/主管",
//							"销售数据分析",
//							"业务分析专员/助理",
//							"分销经理",
//							"业务分析经理/主管",
//							"销售内勤"
//						]
//					}
//				]
//			},
//			{
//				"name": "服装首饰",
//				"s": 31,
//				"n": 17,
//				"children": [
//					{
//						"name": "研发/分析/注册",
//						"s": 31,
//						"n": 2,
//						"children": [
//							"产品研发",
//							"技术研发经理/主管",
//							"数据分析",
//							"化学分析",
//							"注册总监",
//							"注册经理",
//							"注册专员",
//							"技术工程师"
//						]
//					},
//					{
//						"name": "生产/工艺",
//						"s": 33,
//						"n": 6,
//						"children": [
//							"生产经理",
//							"生产运营管理",
//							"生产计划/物料管理",
//							"生产设备管理",
//							"生产文员",
//							"生产助理",
//							"生产跟单",
//							"生产技术员",
//							"生产项目总监",
//							"生产项目经理/主管",
//							"生产项目专员/助理",
//							"生产项目工程师",
//							"产品/包装设计",
//							"工艺/制程工程师",
//							"运作经理",
//							"产品工程师",
//							"工艺设计经理",
//							"工厂经理/厂长",
//							"项目执行/协调人员",
//							"技术工程师",
//							"服装/纺织/皮革工艺师",
//							"工艺品/珠宝设计鉴定"
//						]
//					},
//					{
//						"name": "产品及品牌策划",
//						"s": 39,
//						"n": 3,
//						"children": [
//							"品牌/连锁招商管理",
//							"产品经理/主管",
//							"产品运营",
//							"产品设计师",
//							"产品工程师",
//							"产品/包装设计",
//							"市场督导",
//							"品牌经理/主管",
//							"品牌总监"
//						]
//					},
//					{
//						"name": "采购及供应链",
//						"s": 42,
//						"n": 1,
//						"children": [
//							"采购",
//							"物流/仓储",
//							"供应链管理",
//							"货运代理"
//						]
//					},
//					{
//						"name": "质检",
//						"s": 43,
//						"n": 2,
//						"children": [
//							"质量管理/测试经理",
//							"质量工程师",
//							"测试工程师",
//							"认证工程师/审核员",
//							"化验/检验",
//							"可靠度工程师",
//							"体系工程师/审核员",
//							"服装/纺织品/皮革质量管理"
//						]
//					},
//					{
//						"name": "销售",
//						"s": 45,
//						"n": 3,
//						"children": [
//							"销售",
//							"售后服务/客户服务",
//							"开发经理",
//							"团购经理",
//							"客户执行",
//							"渠道总监",
//							"客户经理/主管",
//							"销售数据分析",
//							"业务分析专员/助理",
//							"分销经理",
//							"业务分析经理/主管",
//							"销售内勤"
//						]
//					}
//				]
//			},
//			{
//				"name": "家具家电",
//				"s": 48,
//				"n": 17,
//				"children": [
//					{
//						"name": "研发/分析/注册",
//						"s": 48,
//						"n": 2,
//						"children": [
//							"产品研发",
//							"技术研发经理/主管",
//							"数据分析",
//							"化学分析",
//							"注册总监",
//							"注册经理",
//							"注册专员",
//							"技术工程师"
//						]
//					},
//					{
//						"name": "生产/工艺",
//						"s": 50,
//						"n": 6,
//						"children": [
//							"生产经理",
//							"生产运营管理",
//							"生产计划/物料管理",
//							"生产设备管理",
//							"生产文员",
//							"生产助理",
//							"生产跟单",
//							"生产技术员",
//							"生产项目总监",
//							"生产项目经理/主管",
//							"生产项目专员/助理",
//							"生产项目工程师",
//							"产品/包装设计",
//							"工艺/制程工程师",
//							"运作经理",
//							"产品工程师",
//							"工艺设计经理",
//							"工厂经理/厂长",
//							"项目执行/协调人员",
//							"技术工程师",
//							"服装/纺织/皮革工艺师",
//							"工艺品/珠宝设计鉴定"
//						]
//					},
//					{
//						"name": "产品及品牌策划",
//						"s": 56,
//						"n": 3,
//						"children": [
//							"品牌/连锁招商管理",
//							"产品经理/主管",
//							"产品运营",
//							"产品设计师",
//							"产品工程师",
//							"产品/包装设计",
//							"市场督导",
//							"品牌经理/主管",
//							"品牌总监"
//						]
//					},
//					{
//						"name": "采购及供应链",
//						"s": 59,
//						"n": 1,
//						"children": [
//							"采购",
//							"物流/仓储",
//							"供应链管理",
//							"货运代理"
//						]
//					},
//					{
//						"name": "质检",
//						"s": 60,
//						"n": 2,
//						"children": [
//							"质量管理/测试经理",
//							"质量工程师",
//							"测试工程师",
//							"认证工程师/审核员",
//							"化验/检验",
//							"可靠度工程师",
//							"体系工程师/审核员",
//							"服装/纺织品/皮革质量管理"
//						]
//					},
//					{
//						"name": "销售",
//						"s": 62,
//						"n": 3,
//						"children": [
//							"销售",
//							"售后服务/客户服务",
//							"开发经理",
//							"团购经理",
//							"客户执行",
//							"渠道总监",
//							"客户经理/主管",
//							"销售数据分析",
//							"业务分析专员/助理",
//							"分销经理",
//							"业务分析经理/主管",
//							"销售内勤"
//						]
//					}
//				]
//			},
//			{
//				"name": "渠道",
//				"s": 65,
//				"n": 83,
//				"children": [
//					{
//						"name": "采购",
//						"s": 65,
//						"n": 2,
//						"children": [
//							"采购总监",
//							"采购经理/主管",
//							"采购专员/助理",
//							"采购工程师",
//							"采购跟单",
//							"供应商/采购质量管理"
//						]
//					},
//					{
//						"name": "运营",
//						"s": 67,
//						"n": 2,
//						"children": [
//							"渠道/分销",
//							"运营",
//							"客户关系",
//							"团购经理",
//							"店长",
//							"数据分析"
//						]
//					},
//					{
//						"name": "设计策划",
//						"s": 69,
//						"n": 1,
//						"children": [
//							"品牌设计师",
//							"空间设计师",
//							"活动策划"
//						]
//					},
//					{
//						"name": "供应链",
//						"s": 70,
//						"n": 78,
//						"children": [
//							"供应链管理",
//							"物流/仓储",
//							"货运代理"
//						]
//					}
//				]
//			}
//		]
//	},
//	{
//		"name": "汽车.制造",
//		"children": [
//			{
//				"name": "汽车制造",
//				"s": 0,
//				"n": 8,
//				"children": [
//					{
//						"name": "汽车研发&制造",
//						"s": 0,
//						"n": 4,
//						"children": [
//							"汽车动力系统工程师",
//							"汽车零部件设计师",
//							"汽车装配工艺工程师",
//							"底盘工程师",
//							"发动机工程师",
//							"安全性能工程师",
//							"总装工程师",
//							"试制工程师",
//							"涂装工程师",
//							"汽车电子工程师",
//							"汽车工程项目管理",
//							"机械设计师",
//							"材料工程师",
//							"车身设计工程师",
//							"汽车质量管理",
//							"汽车设计工程师"
//						]
//					},
//					{
//						"name": "汽车服务",
//						"s": 4,
//						"n": 2,
//						"children": [
//							"汽车造型设计师",
//							"汽车售后服务/客户服务",
//							"检验师",
//							"二手车评估师",
//							"汽车维修/保养",
//							"汽车定损/车险理赔"
//						]
//					},
//					{
//						"name": "汽车销售",
//						"s": 6,
//						"n": 2,
//						"children": [
//							"汽车销售",
//							"汽车零配件销售",
//							"4s店管理"
//						]
//					}
//				]
//			},
//			{
//				"name": "机械设计/制造",
//				"s": 8,
//				"n": 12,
//				"children": [
//					{
//						"name": "技术工程师",
//						"s": 8,
//						"n": 7,
//						"children": [
//							"模具设计",
//							"机电工程师",
//							"结构设计工程师",
//							"结构工程师",
//							"生产工艺工程师",
//							"技术员",
//							"焊接工程师",
//							"自动化工程师",
//							"CNC工程师模具工程师",
//							"冲压工程师",
//							"硬件工程师",
//							"精密机械",
//							"装配工程师/技师",
//							"液压工程师",
//							"机械设计工程师",
//							"飞机设计/制造",
//							"列车设计/制造",
//							"船舶设计/制造",
//							"夹具工程师",
//							"应用工程师",
//							"铸造/锻造工程师/技师",
//							"测试/可靠性工程师",
//							"材料工程师",
//							"CAE工程师",
//							"产品设计/开发/工艺",
//							"CNC/数控工程师",
//							"CAD设计/制图"
//						]
//					},
//					{
//						"name": "技术维修",
//						"s": 15,
//						"n": 2,
//						"children": [
//							"机械维修/保养",
//							"汽车维修/保养",
//							"列车维修/保养",
//							"船舶维修/保养",
//							"设备工程师",
//							"维修工程师"
//						]
//					},
//					{
//						"name": "技工&操作工",
//						"s": 17,
//						"n": 3,
//						"children": [
//							"电焊工/铆焊工",
//							"普工操作工/操作员",
//							"后勤维修",
//							"装配工",
//							"行车工",
//							"水工/木工/油漆工",
//							"模具工",
//							"水运/空运/陆运操作",
//							"铲车/叉车工"
//						]
//					}
//				]
//			},
//			{
//				"name": "仪器仪表自动化/电气",
//				"s": 20,
//				"n": 5,
//				"children": [
//					{
//						"name": "技术工程师",
//						"s": 20,
//						"n": 5,
//						"children": [
//							"仪器/仪表/计量工程师",
//							"射频工程师",
//							"电子工程师",
//							"电器工程师",
//							"嵌入式软件开发",
//							"机械工程师",
//							"电气工程师",
//							"自动化工程师",
//							"测试经理",
//							"维修工程师",
//							"机电工程师",
//							"模拟电路设计",
//							"空调工程",
//							"安防工程师",
//							"FAE现场应用工程师",
//							"工艺工程师",
//							"点子元器件工程师",
//							"IC设计工程师",
//							"音频工程师",
//							"视频工程师"
//						]
//					}
//				]
//			},
//			{
//				"name": "生产制造",
//				"s": 25,
//				"n": 7,
//				"children": [
//					{
//						"name": "生产管理",
//						"s": 25,
//						"n": 3,
//						"children": [
//							"厂长",
//							"生产管理岗",
//							"生产计划管理",
//							"生产运营管理",
//							"制造工程师",
//							"生产设备管理",
//							"生产督导/领班/组长",
//							"生产技术员",
//							"生产物料管理（PMC）",
//							"生产文员"
//						]
//					},
//					{
//						"name": "质量管理",
//						"s": 28,
//						"n": 2,
//						"children": [
//							"质量管理/测试工程师",
//							"质量检验员/测试员",
//							"安全员",
//							"品质工程师",
//							"品质管理",
//							"安全管理"
//						]
//					},
//					{
//						"name": "供应链",
//						"s": 30,
//						"n": 2,
//						"children": [
//							"采购",
//							"仓储/物流/运输",
//							"外贸业务员",
//							"仓库管理员",
//							"贸易管理",
//							"团购经理/主管",
//							"团购业务员",
//							"理货/分拣/打包"
//						]
//					}
//				]
//			},
//			{
//				"name": "市场营销及销售",
//				"s": 32,
//				"n": 43,
//				"children": [
//					{
//						"name": "市场",
//						"s": 32,
//						"n": 3,
//						"children": [
//							"市场/营销/拓展总监",
//							"市场/营销/拓展主管",
//							"市场/营销/拓展专员",
//							"市场推广",
//							"市场企划经理/主管",
//							"市场企划专员/助理",
//							"市场文案策划",
//							"市场调研与分析",
//							"渠道/分销"
//						]
//					},
//					{
//						"name": "销售",
//						"s": 35,
//						"n": 40,
//						"children": [
//							"销售",
//							"售后服务/客户服务",
//							"开发经理",
//							"销售内勤",
//							"客户执行",
//							"渠道总监",
//							"客户经理/主管",
//							"销售数据分析",
//							"业务分析专员/助理",
//							"分销经理",
//							"业务分析经理/主管"
//						]
//					}
//				]
//			}
//		]
//	},
//	{
//		"name": "医疗.化工",
//		"children": [
//			{
//				"name": "药品/生物制剂",
//				"s": 0,
//				"n": 14,
//				"children": [
//					{
//						"name": "研发与注册",
//						"s": 0,
//						"n": 4,
//						"children": [
//							"研发总监",
//							"研发经理/主管",
//							"研发专员/助理",
//							"测试工程师",
//							"注册经理",
//							"注册专员",
//							"数据分析员",
//							"注册总监",
//							"医疗/医护人员",
//							"药品注册",
//							"实验员",
//							"产品研发/注册",
//							"研发工程师",
//							"医药学检验"
//						]
//					},
//					{
//						"name": "生产",
//						"s": 4,
//						"n": 4,
//						"children": [
//							"生产总监",
//							"质量管理",
//							"工厂经理/厂长",
//							"产品经理/主管",
//							"化验/检验",
//							"工艺/制程工程师",
//							"药库主任/药剂师",
//							"产品工程师",
//							"认证工程师",
//							"审核员",
//							"生产计划/物料管理",
//							"生产运营管理",
//							"生产主管/督导/领班/组长",
//							"安全管理",
//							"生产经理/车间主任",
//							"制造工程师"
//						]
//					},
//					{
//						"name": "营销",
//						"s": 8,
//						"n": 2,
//						"children": [
//							"销售",
//							"仓库经理/主管",
//							"市场策划/企划",
//							"客户经理/主管",
//							"渠道/分销",
//							"医药学术推广",
//							"客户服务"
//						]
//					},
//					{
//						"name": "采购",
//						"s": 10,
//						"n": 2,
//						"children": [
//							"采购总监",
//							"采购经理/主管",
//							"采购专员/助理",
//							"仓库/物料管理员",
//							"采购工程师"
//						]
//					},
//					{
//						"name": "供应链",
//						"s": 12,
//						"n": 2,
//						"children": [
//							"供应链管理",
//							"物流管理",
//							"供应商管理",
//							"仓库经理/主管",
//							"货运代理"
//						]
//					}
//				]
//			},
//			{
//				"name": "器械耗材",
//				"s": 14,
//				"n": 11,
//				"children": [
//					{
//						"name": "研发与注册",
//						"s": 14,
//						"n": 2,
//						"children": [
//							"研发",
//							"注册",
//							"认证工程师",
//							"实验员",
//							"审核员"
//						]
//					},
//					{
//						"name": "生产",
//						"s": 16,
//						"n": 5,
//						"children": [
//							"生产总监",
//							"QA/QC",
//							"生产经理/车间主任",
//							"产品经理/主管",
//							"化验/检验",
//							"工艺/制程工程师",
//							"工厂经理/厂长",
//							"产品工程师",
//							"生产运营管理",
//							"安全管理",
//							"认证工程师",
//							"制造工程师",
//							"生产计划/物料管理",
//							"质量管理",
//							"医疗器械维修/保养",
//							"审核员"
//						]
//					},
//					{
//						"name": "营销",
//						"s": 21,
//						"n": 2,
//						"children": [
//							"销售",
//							"仓库经理/主管",
//							"市场策划/企划",
//							"客户服务",
//							"客户经理/主管",
//							"医疗器械市场推广",
//							"渠道/分销"
//						]
//					},
//					{
//						"name": "采购",
//						"s": 23,
//						"n": 2,
//						"children": [
//							"采购管理",
//							"物流",
//							"仓储调度",
//							"供应链管理",
//							"供应商管理",
//							"货运代理"
//						]
//					}
//				]
//			},
//			{
//				"name": "精细化工/新材料/环保技术",
//				"s": 25,
//				"n": 11,
//				"children": [
//					{
//						"name": "研发",
//						"s": 25,
//						"n": 3,
//						"children": [
//							"材料工程师",
//							"工艺工程师",
//							"分析与监测",
//							"研发工程师",
//							"合成工程师",
//							"产品研发/注册",
//							"认证工程师",
//							"实验员",
//							"研发总监",
//							"研发经理/主管",
//							"研发专员/助理"
//						]
//					},
//					{
//						"name": "生产",
//						"s": 28,
//						"n": 4,
//						"children": [
//							"环保工程师",
//							"热能工程师",
//							"自控工程师",
//							"QA/QC",
//							"制冷工程师",
//							"化验/检验",
//							"工艺/制程工程师",
//							"生产运营管理",
//							"产品总监",
//							"产品经理/主管",
//							"产品专员/助理",
//							"产品工程师",
//							"生产经理/车间主任",
//							"生产计划/物料管理",
//							"质量管理",
//							"工厂经理/厂长"
//						]
//					},
//					{
//						"name": "营销",
//						"s": 32,
//						"n": 2,
//						"children": [
//							"销售",
//							"仓库经理/主管",
//							"市场策划/企划",
//							"客户服务",
//							"客户经理/主管",
//							"医疗器械市场推广",
//							"渠道/分销"
//						]
//					},
//					{
//						"name": "采购",
//						"s": 34,
//						"n": 2,
//						"children": [
//							"采购",
//							"供应链管理",
//							"物流",
//							"仓储调度",
//							"供应商管理",
//							"货运代理"
//						]
//					}
//				]
//			},
//			{
//				"name": "化工机械",
//				"s": 36,
//				"n": 10,
//				"children": [
//					{
//						"name": "仪器仪表",
//						"s": 36,
//						"n": 1,
//						"children": [
//							"机械工程师",
//							"设备工程师",
//							"总图工程师",
//							"压力容器"
//						]
//					},
//					{
//						"name": "生产",
//						"s": 37,
//						"n": 5,
//						"children": [
//							"热能工程师",
//							"自控工程师",
//							"防腐工程师",
//							"水处理",
//							"工厂经理/厂长",
//							"测试主管工程师",
//							"质量管理",
//							"生产运营管理",
//							"生产总监",
//							"生产计划/物料管理",
//							"生产经理/车间主任",
//							"制造工程师",
//							"安全管理",
//							"产品总监",
//							"产品经理/主管",
//							"产品专员/助理",
//							"计划调度",
//							"审核员",
//							"产品工程师",
//							"产品开发/技术/工艺"
//						]
//					},
//					{
//						"name": "营销",
//						"s": 42,
//						"n": 2,
//						"children": [
//							"销售",
//							"仓库经理/主管",
//							"市场策划/企划",
//							"客户服务",
//							"客户经理/主管",
//							"医疗器械市场推广",
//							"渠道/分销"
//						]
//					},
//					{
//						"name": "采购",
//						"s": 44,
//						"n": 2,
//						"children": [
//							"采购",
//							"供应链管理",
//							"物流",
//							"仓储调度",
//							"供应商管理",
//							"货运代理"
//						]
//					}
//				]
//			},
//			{
//				"name": "石油化工",
//				"s": 46,
//				"n": 63,
//				"children": [
//					{
//						"name": "研发",
//						"s": 46,
//						"n": 2,
//						"children": [
//							"材料工程师",
//							"工艺工程师",
//							"配方工程师",
//							"研发工程师",
//							"计划调度",
//							"研发总监",
//							"研发经理/主管",
//							"研发专员/助理"
//						]
//					},
//					{
//						"name": "生产",
//						"s": 48,
//						"n": 3,
//						"children": [
//							"热能工程师",
//							"防腐工程师",
//							"环保工程师",
//							"生产经理/车间主任",
//							"安全管理",
//							"生产总监",
//							"质量管理",
//							"水处理",
//							"计划调度",
//							"生产运营管理"
//						]
//					},
//					{
//						"name": "测绘勘探与设计",
//						"s": 51,
//						"n": 1,
//						"children": [
//							"地质工程师",
//							"测量测绘",
//							"管道设计",
//							"结构设计"
//						]
//					},
//					{
//						"name": "仪器仪表",
//						"s": 52,
//						"n": 1,
//						"children": [
//							"机械工程师",
//							"设备工程师",
//							"总图工程师"
//						]
//					},
//					{
//						"name": "营销",
//						"s": 53,
//						"n": 2,
//						"children": [
//							"销售",
//							"仓库经理/主管",
//							"市场策划/企划",
//							"客户服务",
//							"客户经理/主管",
//							"医疗器械市场推广",
//							"渠道/分销"
//						]
//					},
//					{
//						"name": "采购",
//						"s": 55,
//						"n": 54,
//						"children": [
//							"采购",
//							"供应链管理",
//							"物流",
//							"仓储调度",
//							"供应商管理",
//							"货运代理"
//						]
//					}
//				]
//			}
//		]
//	},
//	{
//		"name": "通用",
//		"children": [
//			{
//				"name": "财务",
//				"s": 0,
//				"n": 5,
//				"children": [
//					{
//						"name": "会计",
//						"s": 0,
//						"n": 1,
//						"children": [
//							"会计",
//							"会计文员",
//							"出纳"
//						]
//					},
//					{
//						"name": "财务",
//						"s": 1,
//						"n": 2,
//						"children": [
//							"财务总监",
//							"财务经理/主管",
//							"财务专员/助理",
//							"财务实习生",
//							"财务主管/总帐主管",
//							"财务文员",
//							"财务分析员",
//							"审计师"
//						]
//					},
//					{
//						"name": "审计",
//						"s": 3,
//						"n": 1,
//						"children": [
//							"审计总监",
//							"审计经理/主管",
//							"审计专员/助理",
//							"审计实习生"
//						]
//					},
//					{
//						"name": "税务",
//						"s": 4,
//						"n": 1,
//						"children": [
//							"税务经理/主管",
//							"税务专员/助理",
//							"高级税务顾问"
//						]
//					}
//				]
//			},
//			{
//				"name": "人事行政",
//				"s": 5,
//				"n": 5,
//				"children": [
//					{
//						"name": "人事行政",
//						"s": 5,
//						"n": 5,
//						"children": [
//							"人事行政总监",
//							"人事行政经理/主管",
//							"人事行政专员/助理",
//							"人力资源实习生",
//							"人事行政文员",
//							"人事信息系统(HRIS)管理",
//							"大堂经理/领班",
//							"行政后勤",
//							"行政客服",
//							"行政前台",
//							"法务经理/主管",
//							"绩效管理",
//							"薪资福利专员/助理",
//							"招聘培训",
//							"项目管理",
//							"法务专员/助理",
//							"员工关系/企业文化/工会",
//							"总监/经理/主管"
//						]
//					}
//				]
//			},
//			{
//				"name": "市场营销/销售",
//				"s": 10,
//				"n": 5,
//				"children": [
//					{
//						"name": "市场营销",
//						"s": 10,
//						"n": 2,
//						"children": [
//							"市场/营销/拓展总监",
//							"市场/营销/拓展主管",
//							"市场/营销/拓展专员",
//							"市场调研与分析",
//							"市场策划/企划经理/主管",
//							"市场策划/企划",
//							"策划经理"
//						]
//					},
//					{
//						"name": "销售",
//						"s": 12,
//						"n": 3,
//						"children": [
//							"销售",
//							"区域销售",
//							"大客户销售",
//							"销售文员",
//							"销售数据分析",
//							"促销主管/督导",
//							"销售管理培训生",
//							"销售培训师/讲师",
//							"销售业务跟单"
//						]
//					}
//				]
//			},
//			{
//				"name": "运营",
//				"s": 15,
//				"n": 2,
//				"children": [
//					{
//						"name": "运营",
//						"s": 15,
//						"n": 2,
//						"children": [
//							"首席运营官COO/运营总监",
//							"运营经理/主管",
//							"运营专员/助理",
//							"网站运营管理",
//							"网络运营专员/助理",
//							"产品/品牌经理"
//						]
//					}
//				]
//			},
//			{
//				"name": "客户管理",
//				"s": 17,
//				"n": 5,
//				"children": [
//					{
//						"name": "客户服务",
//						"s": 17,
//						"n": 2,
//						"children": [
//							"客户总监",
//							"客户经理/主管",
//							"客户服务专员/助理",
//							"咨询经理/主管",
//							"客户关系/投诉协调人员",
//							"客户咨询热线/呼叫中心人员",
//							"咨询总监"
//						]
//					},
//					{
//						"name": "客服",
//						"s": 19,
//						"n": 3,
//						"children": [
//							"客服经理/主管",
//							"客服专员/助理/代表",
//							"客服文员",
//							"销售客服",
//							"网店店长/客服",
//							"网络/在线客服",
//							"前台客服",
//							"淘宝客服",
//							"投诉专员"
//						]
//					}
//				]
//			},
//			{
//				"name": "采购",
//				"s": 22,
//				"n": 38,
//				"children": [
//					{
//						"name": "采购",
//						"s": 22,
//						"n": 38,
//						"children": [
//							"采购经理/主管",
//							"采购专员/助理",
//							"采购文员",
//							"渠道专员",
//							"渠道/分销总监",
//							"渠道/分销经理",
//							"渠道/分销主管",
//							"物流专员/助理",
//							"物流主管"
//						]
//					}
//				]
//			}
//		]
//	}
//]
//	, i, j
//	, m, n
//	, p, q
//	, r, s
//	, fillZero = function(i){
//		return i > 9 ? i : '0'+i;
//	}
//	, rs = {
//		list: {}
//		, relations: {}
//		, category: {
//			jobs: []
//		}
//	}
//	, tree
//	, node, leave
//	, index_1, index_2, index_3, index_4
//	;
//for( i = 0, j = data.length; i < j; i++ ){
//	index_1 = fillZero(i);
//
//	tree = data[i];
//	rs.list[index_1] = [tree.name];
//	rs.relations[index_1] = [];
//	rs.category.jobs.push( index_1 );
//
//	tree = tree.children;
//
//	for(m = 0, n = tree.length; m < n; m++){
//		index_2 = index_1 + fillZero(m);
//
//		node = tree[m];
//
//		rs.list[index_2] = [node.name];
//		rs.relations[index_1].push( index_2 );
//		rs.relations[index_2] = [];
//
//		node = node.children;
//
//		for( p = 0, q = node.length; p < q; p++ ){
//			index_3 = index_2 + fillZero(p);
//
//			leave = node[p];
//
//			rs.list[index_3] = [leave.name];
//			rs.relations[index_2].push( index_3 );
//			rs.relations[index_3] = [];
//
//			leave = leave.children;
//
//			for(r = 0, s = leave.length; r < s; r++ ){
//				index_4 = index_3 + fillZero(r);
//
//				rs.list[index_4] = [leave[r]];
//				rs.relations[index_3].push( index_4 );
//			}
//		}
//	}
//
//}
//console.log(rs);

//var xlsx = require('node-xlsx')
//	, list = xlsx.parse('./data2.xls')
//	, i, j
//	, t, data
//	, m, n
//	, temp
//	, tree = []
//	, node, leave
//	, tempObj, tempNode
//	, bigData = []
//	, p, q
//	, r, s
//	, hot
//	;
//for( i = 0, j = list.length; i < j; i++){
//	t = list[i];
//
//	data = t.data;
//
//	tempObj = {
//		name: t.name
//	};
//
//	tree = [];
//	for( m = 1, n = data.length; m < n; m++ ){
//		temp = data[m][2];
//		if( temp ){
//			tree.push({
//				name: temp
//				, s: m
//				, n: 1
//			});
//		}
//		else{
//			tree[tree.length -1].n++;
//		}
//	}
//
//	for( m = 0, n = tree.length; m < n; m++ ){
//		temp = tree[m];
//		hot = [];
//
//		for( p= temp.s, q = p + temp.n; p < q; p++ ){
//			tempNode = data[p][3];
//
//			tempNode && hot.push( tempNode );
//		}
//
//		temp.hot = hot;
//	}
//
//	for( m = 0, n = tree.length; m < n; m++ ){
//		temp = tree[m];
//
//		node = [];
//		for(p = temp.s, q = p +temp.n; p < q; p++){
//			tempNode = data[p][4];
//
//			if( tempNode ){
//				node.push({
//					name: tempNode
//					, s: p
//					, n: 1
//				});
//			}
//			else{
//				node[node.length -1].n++;
//			}
//		}
//
//		for( p = 0, q = node.length; p < q; p++ ){
//			leave = node[p];
//			leave.children = [];
//			for( r = leave.s, s = r +leave.n; r < s; r++ ){
//
//				//data[r][2] && leave.children.push(data[r][2]);
//				//data[r][3] && leave.children.push(data[r][3]);
//				//data[r][4] && leave.children.push(data[r][4]);
//				data[r][5] && leave.children.push(data[r][5]);
//			}
//		}
//
//		temp.children = node;
//	}
//
//	tempObj.children = tree;
//	bigData.push( tempObj );
//
//	//console.log(temp);
//}
//console.log( JSON.stringify( bigData) );
////console.log( JSON.stringify( list) );

//var data = [
//		{
//			"name": "IT·互联网",
//			"children": [
//				{
//					"name": "技术",
//					"s": 1,
//					"n": 49,
//					"hot": [
//						"PHP",
//						"Java",
//						"数据挖掘",
//						"iOS",
//						"HTML5",
//						"Web前端"
//					],
//					"children": [
//						{
//							"name": "开发",
//							"s": 1,
//							"n": 22,
//							"children": [
//								"Java",
//								"PHP",
//								"Python",
//								"Ruby",
//								"Node.JS",
//								".NET",
//								"ASP",
//								"C#",
//								"C++",
//								"C",
//								"Delphi",
//								"Go",
//								"Docker",
//								"Hadoop",
//								"Spark",
//								"HBase",
//								"Openstack",
//								"数据挖掘",
//								"自然语言处理",
//								"推荐系统",
//								"搜索引擎",
//								"全栈工程师"
//							]
//						},
//						{
//							"name": "移动开发及前端",
//							"s": 23,
//							"n": 8,
//							"children": [
//								"iOS",
//								"Android",
//								"U3D",
//								"COCOS2D-X",
//								"HTML5",
//								"Web前端",
//								"Flash",
//								"Javascript"
//							]
//						},
//						{
//							"name": "测试",
//							"s": 31,
//							"n": 6,
//							"children": [
//								"测试工程师",
//								"自动化测试",
//								"功能测试",
//								"性能测试",
//								"测试开发",
//								"硬件测试"
//							]
//						},
//						{
//							"name": "运维",
//							"s": 37,
//							"n": 5,
//							"children": [
//								"运维工程师",
//								"系统工程师",
//								"网络工程师",
//								"运维开发",
//								"DBA"
//							]
//						},
//						{
//							"name": "高端职位",
//							"s": 42,
//							"n": 8,
//							"children": [
//								"技术经理",
//								"架构师",
//								"技术总监",
//								"CTO",
//								"技术合伙人",
//								"运维总监",
//								"安全专家",
//								"项目总监"
//							]
//						}
//					]
//				},
//				{
//					"name": "产品",
//					"s": 50,
//					"n": 12,
//					"hot": [
//						"产品经理",
//						"移动产品经理",
//						"产品总监",
//						"电商产品经理"
//					],
//					"children": [
//						{
//							"name": "产品经理",
//							"s": 50,
//							"n": 7,
//							"children": [
//								"产品经理",
//								"网页产品经理",
//								"移动产品经理",
//								"产品助理",
//								"数据产品经理",
//								"游戏策划",
//								"电商产品经理"
//							]
//						},
//						{
//							"name": "产品设计师",
//							"s": 57,
//							"n": 2,
//							"children": [
//								"网页产品设计师",
//								"移动产品设计师"
//							]
//						},
//						{
//							"name": "高端职位",
//							"s": 59,
//							"n": 3,
//							"children": [
//								"产品总监",
//								"游戏制作人",
//								"产品部经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "设计",
//					"s": 62,
//					"n": 28,
//					"hot": [
//						"UI设计师",
//						"APP设计师",
//						"交互设计师",
//						"设计总监"
//					],
//					"children": [
//						{
//							"name": "视觉设计",
//							"s": 62,
//							"n": 15,
//							"children": [
//								"UI设计师",
//								"视觉设计师",
//								"网页设计师",
//								"APP设计师",
//								"平面设计师",
//								"flash设计师",
//								"美术设计师",
//								"广告设计师",
//								"多媒体设计师",
//								"原画师",
//								"游戏特效",
//								"游戏界面设计师",
//								"游戏场景",
//								"游戏角色",
//								"游戏动作"
//							]
//						},
//						{
//							"name": "交互设计",
//							"s": 77,
//							"n": 4,
//							"children": [
//								"交互设计师",
//								"网页交互设计师",
//								"无线交互设计师",
//								"硬件交互设计师"
//							]
//						},
//						{
//							"name": "用户研究",
//							"s": 81,
//							"n": 3,
//							"children": [
//								"数据分析师",
//								"用户研究员",
//								"游戏数值策划"
//							]
//						},
//						{
//							"name": "高端职位",
//							"s": 84,
//							"n": 6,
//							"children": [
//								"设计经理",
//								"设计总监",
//								"交互设计经理",
//								"交互设计总监",
//								"用户研究经理",
//								"用户研究总监"
//							]
//						}
//					]
//				},
//				{
//					"name": "运营",
//					"s": 90,
//					"n": 26,
//					"hot": [
//						"内容运营",
//						"产品运营",
//						"用户运营",
//						"新媒体运营",
//						"游戏运营"
//					],
//					"children": [
//						{
//							"name": "运营",
//							"s": 90,
//							"n": 14,
//							"children": [
//								"运营经理",
//								"运营专员",
//								"内容运营",
//								"产品运营",
//								"用户运营",
//								"活动运营",
//								"数据运营",
//								"新媒体运营",
//								"商家运营",
//								"品类运营",
//								"游戏运营",
//								"网络推广",
//								"海外运营",
//								"网站运营"
//							]
//						},
//						{
//							"name": "编辑",
//							"s": 104,
//							"n": 4,
//							"children": [
//								"副主编",
//								"内容编辑",
//								"文案策划",
//								"记者"
//							]
//						},
//						{
//							"name": "客服",
//							"s": 108,
//							"n": 4,
//							"children": [
//								"售前咨询",
//								"售后服务",
//								"淘宝客服",
//								"客服经理"
//							]
//						},
//						{
//							"name": "高端职位",
//							"s": 112,
//							"n": 4,
//							"children": [
//								"运营总监",
//								"主编",
//								"COO",
//								"客服总监"
//							]
//						}
//					]
//				}
//			]
//		},
//		{
//			"name": "房地产",
//			"children": [
//				{
//					"name": "房地产开发",
//					"s": 1,
//					"n": 10,
//					"hot": [
//						"投资总监",
//						"融资总监",
//						"成本经理"
//					],
//					"children": [
//						{
//							"name": "成本",
//							"s": 1,
//							"n": 4,
//							"children": [
//								"成本经理",
//								"成本主管",
//								"土建预算员",
//								"招投标工程师"
//							]
//						},
//						{
//							"name": "投融资",
//							"s": 5,
//							"n": 4,
//							"children": [
//								"投资总监",
//								"投资经理",
//								"融资总监",
//								"融资经理"
//							]
//						},
//						{
//							"name": "前期开发",
//							"s": 9,
//							"n": 2,
//							"children": [
//								"前期经理",
//								"前期主管"
//							]
//						}
//					]
//				},
//				{
//					"name": "土木/建筑工程",
//					"s": 11,
//					"n": 20,
//					"hot": [
//						"项目总监",
//						"项目经理",
//						"预算工程师"
//					],
//					"children": [
//						{
//							"name": "土建  ",
//							"s": 11,
//							"n": 20,
//							"children": [
//								"建筑工程师",
//								"机电工程师",
//								"技术工程师",
//								"预算工程师",
//								"土建工程师",
//								"水电工程师",
//								"质检工程师",
//								"安全工程师",
//								"材料主管",
//								"施工员",
//								"测绘",
//								"工程监理",
//								"安全管理",
//								"项目总监",
//								"项目经理",
//								"项目主管",
//								"项目专员",
//								"项目助理",
//								"项目工程师",
//								"项目总经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "规划设计",
//					"s": 31,
//					"n": 18,
//					"hot": [
//						"精装设计",
//						"建筑设计师",
//						"设计总监"
//					],
//					"children": [
//						{
//							"name": "设计",
//							"s": 31,
//							"n": 18,
//							"children": [
//								"建筑设计师",
//								"结构设计师",
//								"结构工程师",
//								"钢结构设计",
//								"电气设计",
//								"暖通设计",
//								"给排水设计",
//								"总图工程师",
//								"室内设计",
//								"土建工程师",
//								"经营人员",
//								"CAD绘图员",
//								"城市规划",
//								"景观设计",
//								"装潢设计",
//								"规划设计师",
//								"设计总监",
//								"市政设计"
//							]
//						}
//					]
//				},
//				{
//					"name": "物业服务",
//					"s": 49,
//					"n": 9,
//					"hot": [
//						"物业经理",
//						"客服经理",
//						"工程经理"
//					],
//					"children": [
//						{
//							"name": "物业",
//							"s": 49,
//							"n": 7,
//							"children": [
//								"物业租赁",
//								"工程经理",
//								"客服经理",
//								"客服主管",
//								"物业经理",
//								"项目经理",
//								"安全经理"
//							]
//						},
//						{
//							"name": "客服",
//							"s": 56,
//							"n": 2,
//							"children": [
//								"客服经理",
//								"客服主管"
//							]
//						}
//					]
//				},
//				{
//					"name": "市场营销",
//					"s": 58,
//					"n": 9,
//					"hot": [
//						"销售经理",
//						"策划经理",
//						"招商经理"
//					],
//					"children": [
//						{
//							"name": "销售",
//							"s": 58,
//							"n": 4,
//							"children": [
//								"销售总监",
//								"销售经理",
//								"销售主管",
//								"置业顾问"
//							]
//						},
//						{
//							"name": "策划",
//							"s": 62,
//							"n": 3,
//							"children": [
//								"策划经理",
//								"策划主管",
//								"市场部经理"
//							]
//						},
//						{
//							"name": "招商",
//							"s": 65,
//							"n": 2,
//							"children": [
//								"招商经理",
//								"招商总监"
//							]
//						}
//					]
//				}
//			]
//		},
//		{
//			"name": "金融",
//			"children": [
//				{
//					"name": "银行",
//					"s": 1,
//					"n": 28,
//					"hot": [
//						"客户经理",
//						"投资银行项目经理"
//					],
//					"children": [
//						{
//							"name": "银行",
//							"s": 1,
//							"n": 28,
//							"children": [
//								"客户经理",
//								"支行行长",
//								"综合柜员",
//								"理财经理",
//								"柜员",
//								"公司业务客户经理",
//								"大堂经理",
//								"销售代表",
//								"零售客户经理",
//								"支行副行长",
//								"公司客户经理",
//								"高级客户经理",
//								"产品经理",
//								"风险经理",
//								"财务管理岗",
//								"对公客户经理",
//								"授信审查岗",
//								"业务代表",
//								"财富管理客户经理",
//								"个人银行业务部",
//								"副行长",
//								"银行柜员",
//								"零售业务客户经理",
//								"销售经理",
//								"Teller",
//								"风险管理岗",
//								"投资银行项目经理",
//								"投资银行高级项目经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "保险",
//					"s": 29,
//					"n": 33,
//					"hot": [
//						"固定收益",
//						"销售代表",
//						"销售经理"
//					],
//					"children": [
//						{
//							"name": "保险",
//							"s": 29,
//							"n": 33,
//							"children": [
//								"固定收益",
//								"资产管理",
//								"风险控制",
//								"合规法律",
//								"运营",
//								"系统开发",
//								"运行维护",
//								"委托资产",
//								"金融市场业岗",
//								"渠道及年金",
//								"产品研发",
//								"保险经纪",
//								"理财规划师",
//								"经理助理",
//								"理财顾问",
//								"培训讲师",
//								"储备干部",
//								"销售代表",
//								"销售助理",
//								"销售经理",
//								"组训",
//								"业务员",
//								"储备主管",
//								"综合内勤",
//								"业务经理",
//								"讲师",
//								"寿险顾问",
//								"销售主管",
//								"银行保险客户经理",
//								"业务主管",
//								"客户服务专员",
//								"银保客户经理",
//								"电话销售"
//							]
//						}
//					]
//				},
//				{
//					"name": "证券/基金",
//					"s": 62,
//					"n": 62,
//					"hot": [
//						"理财顾问",
//						"基金经理",
//						"行业研究员"
//					],
//					"children": [
//						{
//							"name": "证券",
//							"s": 62,
//							"n": 45,
//							"children": [
//								"投资银行执行岗",
//								"投资银行项目负责人",
//								"并购项目经理",
//								"并购总监",
//								"债券发行执行岗",
//								"销售经理",
//								"资本市场部经理",
//								"资产证券化项目经理",
//								"资产证券化产品经理",
//								"首席分析师",
//								"宏观分析师",
//								"策略分析师",
//								"金融工程分析师",
//								"证券分析师",
//								"上市公司分析师",
//								"信用交易",
//								"合规",
//								"系统开发",
//								"运行维护",
//								"风险控制",
//								"清算",
//								"客户经理",
//								"投资顾问",
//								"区域经理",
//								"证券经纪人",
//								"证券分析师",
//								"高级客户经理",
//								"营销总监",
//								"理财经理",
//								"理财顾问",
//								"营销经理",
//								"渠道经理",
//								"市场部经理",
//								"证券客户经理",
//								"投资顾问助理",
//								"投资经理",
//								"客户经理",
//								"团队经理",
//								"高级投资顾问",
//								"资深客户经理",
//								"经纪人",
//								"柜员",
//								"营销主管",
//								"银行驻点客户经理",
//								"证券投资顾问"
//							]
//						},
//						{
//							"name": "基金",
//							"s": 107,
//							"n": 17,
//							"children": [
//								"营销经理",
//								"市场部经理",
//								"基金子公司投资经理",
//								"系统开发",
//								"运行维护",
//								"固定收益投资经理",
//								"基金会计",
//								"渠道经理",
//								"投资经理",
//								"基金经理",
//								"行业研究员",
//								"交易员",
//								"基金投资顾问",
//								"基金营销经理",
//								"渠道销售经理",
//								"项目经理",
//								"客户经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "信托/期货",
//					"s": 124,
//					"n": 37,
//					"hot": [
//						"信托经理",
//						"资产管理",
//						"资产证券化"
//					],
//					"children": [
//						{
//							"name": "信托",
//							"s": 124,
//							"n": 12,
//							"children": [
//								"信托部门负责人",
//								"信托经理",
//								"高级信托经理",
//								"产品经理",
//								"信托财富中心理财经理",
//								"高级理财经理",
//								"渠道销售",
//								"个人销售",
//								"资产证券化项目经理",
//								"资产证券化产品经理",
//								"风控经理",
//								"风控总监"
//							]
//						},
//						{
//							"name": "期货",
//							"s": 136,
//							"n": 25,
//							"children": [
//								"客户经理",
//								"投资顾问",
//								"市场部经理",
//								"期货经纪人",
//								"市场开发人员",
//								"期货居间人",
//								"市场开发",
//								"业务经理",
//								"营销总监",
//								"交易员",
//								"期货分析师",
//								"高级客户经理",
//								"客服专员",
//								"研究员",
//								"营业部副总经理",
//								"客户人员",
//								"市场总监",
//								"居间人",
//								"操盘手",
//								"区域经理",
//								"营业部总经理",
//								"分析师",
//								"研发人员",
//								"客户服务",
//								"市场营销人员"
//							]
//						}
//					]
//				},
//				{
//					"name": "其他金融服务",
//					"s": 161,
//					"n": 48,
//					"hot": [
//						"客户经理",
//						"投资经理",
//						"财务分析"
//					],
//					"children": [
//						{
//							"name": "第三方理财",
//							"s": 161,
//							"n": 27,
//							"children": [
//								"产品主管",
//								"产品经理",
//								"理财顾问",
//								"渠道专员",
//								"培训讲师",
//								"品牌策划",
//								"销售助理",
//								"销售经理",
//								"业务推动主管",
//								"业务推动专员",
//								"运营经理",
//								"企划经理",
//								"高级企划经理",
//								"业务经理",
//								"高级业务经理",
//								"区域经理",
//								"团队经理",
//								"高级客户经理",
//								"客户经理",
//								"大区经理",
//								"营业部经理",
//								"渠道经理",
//								"数据分析岗",
//								"渠道拓展经理",
//								"股权投资经理",
//								"风险管理",
//								"市场业务岗"
//							]
//						},
//						{
//							"name": "其他金融服务",
//							"s": 188,
//							"n": 4,
//							"children": [
//								"担保业务",
//								"拍卖师",
//								"珠宝鉴定",
//								"收藏品鉴定"
//							]
//						},
//						{
//							"name": "PE/VC",
//							"s": 192,
//							"n": 6,
//							"children": [
//								"投资经理",
//								"投资总监",
//								"资金募集岗",
//								"定增业务",
//								"风险质控经理",
//								"投后管理经理"
//							]
//						},
//						{
//							"name": "会计/审计/财务",
//							"s": 198,
//							"n": 11,
//							"children": [
//								"首席财务官CFO",
//								"财务总监",
//								"财务分析",
//								"财务顾问",
//								"会计经理",
//								"资产管理",
//								"成本管理",
//								"审计经理",
//								"税务经理",
//								"统计员",
//								"投资经理"
//							]
//						}
//					]
//				}
//			]
//		},
//		{
//			"name": "消费品",
//			"children": [
//				{
//					"name": "食品",
//					"s": 1,
//					"n": 69,
//					"hot": [
//						"销售经理",
//						"品牌经理",
//						"市场营销经理"
//					],
//					"children": [
//						{
//							"name": "研发/分析/注册",
//							"s": 1,
//							"n": 8,
//							"children": [
//								"研发总监",
//								"研发经理",
//								"研发专员",
//								"测试工程师",
//								"数据分析员",
//								"注册总监",
//								"注册经理",
//								"注册专员"
//							]
//						},
//						{
//							"name": "生产/工艺",
//							"s": 9,
//							"n": 14,
//							"children": [
//								"生产/工艺",
//								"工厂经理",
//								"工厂厂长",
//								"生产经理",
//								"车间主任",
//								"运作经理",
//								"产品开发",
//								"总工程师",
//								"副总工程师",
//								"工艺设计经理",
//								"包装工程师",
//								"项目工程师",
//								"技术工程师",
//								"产品工程师"
//							]
//						},
//						{
//							"name": "产品及品牌策划",
//							"s": 23,
//							"n": 13,
//							"children": [
//								"产品总监",
//								"产品经理",
//								"产品专员",
//								"市场总监",
//								"市场经理",
//								"市场主管",
//								"市场专员",
//								"市场营销助理",
//								"品牌总监",
//								"品牌经理",
//								"品牌助理",
//								"活动策划",
//								"促销主管"
//							]
//						},
//						{
//							"name": "采购及供应链",
//							"s": 36,
//							"n": 12,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员",
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员",
//								"仓库经理",
//								"仓储调度"
//							]
//						},
//						{
//							"name": "质检",
//							"s": 48,
//							"n": 9,
//							"children": [
//								"质检",
//								"QA经理",
//								"测试主管",
//								"质量检测员",
//								"认证工程师",
//								"审核员",
//								"体系工程师",
//								"可靠度工程师",
//								"化验员"
//							]
//						},
//						{
//							"name": "销售",
//							"s": 57,
//							"n": 13,
//							"children": [
//								"销售总监",
//								"销售经理",
//								"销售主管",
//								"销售专员",
//								"客户总监",
//								"客户经理",
//								"客户专员",
//								"渠道总监",
//								"分销经理",
//								"大区总监",
//								"城市经理",
//								"大客户销售经理",
//								"开发经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "日化",
//					"s": 70,
//					"n": 72,
//					"hot": [
//						"研发总监",
//						"质量管理",
//						"采购总监"
//					],
//					"children": [
//						{
//							"name": "研发/分析/注册",
//							"s": 70,
//							"n": 8,
//							"children": [
//								"研发总监",
//								"研发经理",
//								"研发专员",
//								"测试工程师",
//								"数据分析员",
//								"注册总监",
//								"注册经理",
//								"注册专员"
//							]
//						},
//						{
//							"name": "生产/工艺",
//							"s": 78,
//							"n": 14,
//							"children": [
//								"生产总监",
//								"工厂经理",
//								"工厂厂长",
//								"生产经理",
//								"车间主任",
//								"运作经理",
//								"产品开发",
//								"总工程师",
//								"副总工程师",
//								"工艺设计经理",
//								"包装工程师",
//								"项目工程师",
//								"技术工程师",
//								"产品工程师"
//							]
//						},
//						{
//							"name": "产品及品牌策划",
//							"s": 92,
//							"n": 14,
//							"children": [
//								"产品总监",
//								"产品经理",
//								"产品专员",
//								"市场总监",
//								"市场经理",
//								"市场主管",
//								"市场专员",
//								"市场营销经理",
//								"市场营销助理",
//								"品牌总监",
//								"品牌经理",
//								"品牌助理",
//								"活动策划",
//								"促销主管"
//							]
//						},
//						{
//							"name": "采购及供应链",
//							"s": 106,
//							"n": 13,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员",
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员",
//								"仓库经理",
//								"货运代理",
//								"仓储调度"
//							]
//						},
//						{
//							"name": "质检",
//							"s": 119,
//							"n": 9,
//							"children": [
//								"质量管理",
//								"QA经理",
//								"测试主管",
//								"质量检测员",
//								"认证工程师",
//								"审核员",
//								"体系工程师",
//								"可靠度工程师",
//								"化验员"
//							]
//						},
//						{
//							"name": "销售",
//							"s": 128,
//							"n": 14,
//							"children": [
//								"销售总监",
//								"销售经理",
//								"销售主管",
//								"销售专员",
//								"客户总监",
//								"客户经理",
//								"客户专员",
//								"渠道总监",
//								"分销经理",
//								"团购经理",
//								"大区总监",
//								"城市经理",
//								"大客户销售经理",
//								"开发经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "服装首饰",
//					"s": 142,
//					"n": 71,
//					"hot": [
//						"市场总监",
//						"总工程师",
//						"销售总监"
//					],
//					"children": [
//						{
//							"name": "研发/分析/注册",
//							"s": 142,
//							"n": 8,
//							"children": [
//								"研发总监",
//								"研发经理",
//								"研发专员",
//								"测试工程师",
//								"数据分析员",
//								"注册总监",
//								"注册经理",
//								"注册专员"
//							]
//						},
//						{
//							"name": "生产/工艺",
//							"s": 150,
//							"n": 14,
//							"children": [
//								"生产总监",
//								"工厂经理",
//								"工厂厂长",
//								"生产经理",
//								"车间主任",
//								"运作经理",
//								"产品开发",
//								"总工程师",
//								"副总工程师",
//								"工艺设计经理",
//								"包装工程师",
//								"项目工程师",
//								"技术工程师",
//								"产品工程师"
//							]
//						},
//						{
//							"name": "产品及品牌策划",
//							"s": 164,
//							"n": 13,
//							"children": [
//								"产品总监",
//								"产品经理",
//								"产品专员",
//								"市场总监",
//								"市场经理",
//								"市场主管",
//								"市场专员",
//								"市场营销经理",
//								"品牌总监",
//								"品牌经理",
//								"品牌助理",
//								"活动策划",
//								"促销主管"
//							]
//						},
//						{
//							"name": "采购及供应链",
//							"s": 177,
//							"n": 13,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员",
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员",
//								"仓库经理",
//								"货运代理",
//								"仓储调度"
//							]
//						},
//						{
//							"name": "质检",
//							"s": 190,
//							"n": 9,
//							"children": [
//								"质量管理",
//								"QA经理",
//								"测试主管",
//								"质量检测员",
//								"认证工程师",
//								"审核员",
//								"体系工程师",
//								"可靠度工程师",
//								"化验员"
//							]
//						},
//						{
//							"name": "销售",
//							"s": 199,
//							"n": 14,
//							"children": [
//								"销售总监",
//								"销售经理",
//								"销售主管",
//								"销售专员",
//								"客户总监",
//								"客户经理",
//								"客户专员",
//								"渠道总监",
//								"分销经理",
//								"团购经理",
//								"大区总监",
//								"城市经理",
//								"大客户销售经理",
//								"开发经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "家具家电",
//					"s": 213,
//					"n": 72,
//					"hot": [
//						"销售经理",
//						"研发总监",
//						"产品经理"
//					],
//					"children": [
//						{
//							"name": "研发/分析/注册",
//							"s": 213,
//							"n": 8,
//							"children": [
//								"研发总监",
//								"研发经理",
//								"研发专员",
//								"测试工程师",
//								"数据分析员",
//								"注册总监",
//								"注册经理",
//								"注册专员"
//							]
//						},
//						{
//							"name": "生产/工艺",
//							"s": 221,
//							"n": 14,
//							"children": [
//								"生产总监",
//								"工厂经理",
//								"工厂厂长",
//								"生产经理",
//								"车间主任",
//								"运作经理",
//								"产品开发",
//								"总工程师",
//								"副总工程师",
//								"工艺设计经理",
//								"包装工程师",
//								"项目工程师",
//								"技术工程师",
//								"产品工程师"
//							]
//						},
//						{
//							"name": "产品及品牌策划",
//							"s": 235,
//							"n": 14,
//							"children": [
//								"产品总监",
//								"产品经理",
//								"产品专员",
//								"市场总监",
//								"市场经理",
//								"市场主管",
//								"市场专员",
//								"市场营销经理",
//								"市场营销助理",
//								"品牌总监",
//								"品牌经理",
//								"品牌助理",
//								"活动策划",
//								"促销主管"
//							]
//						},
//						{
//							"name": "采购及供应链",
//							"s": 249,
//							"n": 13,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员",
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员",
//								"仓库经理",
//								"货运代理",
//								"仓储调度"
//							]
//						},
//						{
//							"name": "质检",
//							"s": 262,
//							"n": 9,
//							"children": [
//								"质量管理",
//								"QA经理",
//								"测试主管",
//								"质量检测员",
//								"认证工程师",
//								"审核员",
//								"体系工程师",
//								"可靠度工程师",
//								"化验员"
//							]
//						},
//						{
//							"name": "销售",
//							"s": 271,
//							"n": 14,
//							"children": [
//								"销售总监",
//								"销售经理",
//								"销售主管",
//								"销售专员",
//								"客户总监",
//								"客户经理",
//								"客户专员",
//								"渠道总监",
//								"分销经理",
//								"团购经理",
//								"大区总监",
//								"城市经理",
//								"大客户销售经理",
//								"开发经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "渠道",
//					"s": 285,
//					"n": 26,
//					"hot": [
//						"运营总监",
//						"店长",
//						"大客户经理"
//					],
//					"children": [
//						{
//							"name": "采购",
//							"s": 285,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员"
//							]
//						},
//						{
//							"name": "运营",
//							"s": 288,
//							"n": 10,
//							"children": [
//								"运营总监",
//								"楼层经理",
//								"大客户总监",
//								"大客户经理",
//								"分销总监",
//								"分销经理",
//								"团购经理",
//								"数据分析员",
//								"店长",
//								"督导"
//							]
//						},
//						{
//							"name": "设计策划",
//							"s": 298,
//							"n": 3,
//							"children": [
//								"品牌设计师",
//								"空间设计师",
//								"活动策划"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 301,
//							"n": 10,
//							"children": [
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员",
//								"仓库经理",
//								"货运代理",
//								"仓储调度"
//							]
//						}
//					]
//				}
//			]
//		},
//		{
//			"name": "汽车·制造",
//			"children": [
//				{
//					"name": "汽车制造",
//					"s": 1,
//					"n": 23,
//					"hot": [
//						"机械设计师",
//						"试验计师"
//					],
//					"children": [
//						{
//							"name": "汽车研发&制造",
//							"s": 1,
//							"n": 14,
//							"children": [
//								"汽车动力系统工程师",
//								"底盘工程师",
//								"总装工程师",
//								"汽车电子工程师",
//								"汽车装配工艺工程师",
//								"汽车零部件设计师",
//								"安全性能工程师",
//								"机械设计师",
//								"材料工程师",
//								"汽车项目管理",
//								"装配工艺工程师",
//								"发动机工程师",
//								"涂装工程师",
//								"试制工程师"
//							]
//						},
//						{
//							"name": "汽车服务",
//							"s": 15,
//							"n": 5,
//							"children": [
//								"汽车造型设计师",
//								"售后服务",
//								"检验师",
//								"二手车评估师",
//								"维修工程师"
//							]
//						},
//						{
//							"name": "汽车销售",
//							"s": 20,
//							"n": 4,
//							"children": [
//								"汽车销售",
//								"汽车零部件销售",
//								"4S店管理",
//								"汽车装饰美容"
//							]
//						}
//					]
//				},
//				{
//					"name": "机械设计/制造",
//					"s": 24,
//					"n": 32,
//					"hot": [
//						"机械工程师",
//						"自动化工程师"
//					],
//					"children": [
//						{
//							"name": "技术工程师",
//							"s": 24,
//							"n": 21,
//							"children": [
//								"模具工程师",
//								"机电工程师",
//								"机械设计工程师",
//								"结构工程师",
//								"生产工艺工程师",
//								"模具工程师",
//								"电控工程师",
//								"技术员",
//								"自动化工程师",
//								"焊接工程师",
//								"液压工程师",
//								"电路工程师",
//								"机械装配工程师",
//								"精密机械",
//								"CNC工程师模具工程师",
//								"冲压工程师",
//								"焊接工程师",
//								"飞机设计/制造",
//								"列车设计/制造",
//								"船舶设计/制造",
//								"夹具工程师"
//							]
//						},
//						{
//							"name": "技术维修",
//							"s": 45,
//							"n": 5,
//							"children": [
//								"机械维修/保养",
//								"汽车维修/保养",
//								"列车维修/保养",
//								"船舶维修/保养",
//								"设备工程师"
//							]
//						},
//						{
//							"name": "技工&操作工",
//							"s": 50,
//							"n": 6,
//							"children": [
//								"铆工",
//								"操作工",
//								"电工",
//								"钳工",
//								"行车工",
//								"油漆工"
//							]
//						}
//					]
//				},
//				{
//					"name": "仪器仪表自动化/电气",
//					"s": 56,
//					"n": 20,
//					"hot": [
//						"电气工程师"
//					],
//					"children": [
//						{
//							"name": "技术工程师",
//							"s": 56,
//							"n": 20,
//							"children": [
//								"电子工程师",
//								"射频工程师",
//								"电器工程师",
//								"嵌入式软件开发",
//								"机械工程师",
//								"电气工程师",
//								"自动化工程师",
//								"测试经理",
//								"维修工程师",
//								"机电工程师",
//								"模拟电路设计",
//								"空调工程",
//								"安防工程师",
//								"FAE现场应用工程师",
//								"工艺工程师",
//								"电子元器件工程师",
//								"IC设计工程师",
//								"仪器仪表工程师",
//								"音频工程师",
//								"视频工程师"
//							]
//						}
//					]
//				},
//				{
//					"name": "生产制造",
//					"s": 76,
//					"n": 13,
//					"hot": [
//						"采购经理",
//						"生产经理",
//						"质量管理"
//					],
//					"children": [
//						{
//							"name": "生产管理",
//							"s": 76,
//							"n": 6,
//							"children": [
//								"工厂厂长",
//								"生产总监",
//								"生产经理",
//								"车间主任",
//								"制造工程师",
//								"生产设备管理"
//							]
//						},
//						{
//							"name": "质量管理",
//							"s": 82,
//							"n": 4,
//							"children": [
//								"测试经理",
//								"质量检测员",
//								"安全性能工程师",
//								"质量管理"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 86,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"外贸经理"
//							]
//						}
//					]
//				},
//				{
//					"name": "市场营销及销售",
//					"s": 89,
//					"n": 23,
//					"hot": [
//						"商务经理",
//						"市场总监",
//						"销售总监"
//					],
//					"children": [
//						{
//							"name": "市场",
//							"s": 89,
//							"n": 6,
//							"children": [
//								"市场总监",
//								"市场经理",
//								"市场主管",
//								"市场专员/助理",
//								"市场营销经理",
//								"市场营销专员/助理"
//							]
//						},
//						{
//							"name": "销售",
//							"s": 95,
//							"n": 17,
//							"children": [
//								"销售总监",
//								"销售经理",
//								"销售主管",
//								"销售专员",
//								"客户总监",
//								"客户经理",
//								"客户专员",
//								"分销/渠道经理",
//								"团购经理",
//								"大区总监",
//								"城市经理",
//								"大客户销售经理",
//								"开发经理",
//								"商务经理",
//								"业务跟单",
//								"贸易主管",
//								"渠道/分销总监"
//							]
//						}
//					]
//				}
//			]
//		},
//		{
//			"name": "医疗·化工",
//			"children": [
//				{
//					"name": "药品/生物制剂",
//					"s": 1,
//					"n": 39,
//					"hot": [
//						"市场总监",
//						"研发经理",
//						"销售经理"
//					],
//					"children": [
//						{
//							"name": "研发与注册",
//							"s": 1,
//							"n": 8,
//							"children": [
//								"研发总监",
//								"研发经理 ",
//								"研发专员/助理",
//								"测试工程师",
//								"数据分析员",
//								"注册总监",
//								"注册经理",
//								"注册专员"
//							]
//						},
//						{
//							"name": "生产",
//							"s": 9,
//							"n": 10,
//							"children": [
//								"生产总监",
//								"QA经理",
//								"测试主管",
//								"质量检测员",
//								"认证工程师",
//								"审核员",
//								"化验/检验",
//								"产品总监",
//								"产品经理",
//								"产品专员"
//							]
//						},
//						{
//							"name": "营销",
//							"s": 19,
//							"n": 9,
//							"children": [
//								"销售经理",
//								"客户总监",
//								"客户专员",
//								"渠道/分销总监",
//								"分销/渠道经理",
//								"大客户销售经理",
//								"市场总监",
//								"市场经理",
//								"市场主管"
//							]
//						},
//						{
//							"name": "采购",
//							"s": 28,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员/助理"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 31,
//							"n": 9,
//							"children": [
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员/助理",
//								"仓库经理/主管",
//								"货运代理"
//							]
//						}
//					]
//				},
//				{
//					"name": "器械耗材",
//					"s": 40,
//					"n": 40,
//					"hot": [
//						"质量管理",
//						"采购总监",
//						"产品总监"
//					],
//					"children": [
//						{
//							"name": "研发与注册",
//							"s": 40,
//							"n": 8,
//							"children": [
//								"研发总监",
//								"研发经理 ",
//								"研发专员/助理",
//								"测试工程师",
//								"数据分析员",
//								"注册总监",
//								"注册经理",
//								"注册专员"
//							]
//						},
//						{
//							"name": "生产",
//							"s": 48,
//							"n": 10,
//							"children": [
//								"生产总监",
//								"QA经理",
//								"测试主管",
//								"质量检测员",
//								"认证工程师",
//								"审核员",
//								"化验/检验",
//								"产品总监",
//								"产品经理",
//								"产品专员"
//							]
//						},
//						{
//							"name": "营销",
//							"s": 58,
//							"n": 9,
//							"children": [
//								"销售经理",
//								"客户总监",
//								"客户专员",
//								"渠道/分销总监",
//								"分销/渠道经理",
//								"大客户销售经理",
//								"市场总监",
//								"市场经理",
//								"市场主管"
//							]
//						},
//						{
//							"name": "采购",
//							"s": 67,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员/助理"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 70,
//							"n": 10,
//							"children": [
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员/助理",
//								"仓库经理/主管",
//								"货运代理",
//								"仓储调度"
//							]
//						}
//					]
//				},
//				{
//					"name": "精细化工/新材料/环保技术",
//					"s": 80,
//					"n": 33,
//					"hot": [
//						"研发工程师",
//						"采购经理",
//						"工艺工程师"
//					],
//					"children": [
//						{
//							"name": "研发",
//							"s": 80,
//							"n": 5,
//							"children": [
//								"材料工程师",
//								"工艺工程师",
//								"分析与监测",
//								"研发工程师",
//								"合成工程师"
//							]
//						},
//						{
//							"name": "生产",
//							"s": 85,
//							"n": 7,
//							"children": [
//								"环保工程师",
//								"热能工程师",
//								"自控工程师",
//								"QA/QC",
//								"生产经理",
//								"车间主任",
//								"制冷工程师"
//							]
//						},
//						{
//							"name": "营销",
//							"s": 92,
//							"n": 9,
//							"children": [
//								"销售经理",
//								"客户总监",
//								"客户专员",
//								"渠道/分销总监",
//								"分销/渠道经理",
//								"大客户销售经理",
//								"市场总监",
//								"市场经理",
//								"市场主管"
//							]
//						},
//						{
//							"name": "采购",
//							"s": 101,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员/助理"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 104,
//							"n": 9,
//							"children": [
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流经理",
//								"物流专员/助理",
//								"仓库经理/主管",
//								"货运代理",
//								"仓储调度"
//							]
//						}
//					]
//				},
//				{
//					"name": "化工机械",
//					"s": 113,
//					"n": 35,
//					"hot": [
//						"客户经理",
//						"销售经理",
//						"市场总监"
//					],
//					"children": [
//						{
//							"name": "仪器仪表",
//							"s": 113,
//							"n": 6,
//							"children": [
//								"机械工程师",
//								"设备工程师",
//								"总图工程师",
//								"压力容器",
//								"管道设计",
//								"结构设计"
//							]
//						},
//						{
//							"name": "生产",
//							"s": 119,
//							"n": 7,
//							"children": [
//								"热能工程师",
//								"自控工程师",
//								"防腐工程师",
//								"水处理",
//								"生产经理",
//								"计划调度",
//								"QA/QC"
//							]
//						},
//						{
//							"name": "营销",
//							"s": 126,
//							"n": 9,
//							"children": [
//								"销售经理",
//								"客户总监",
//								"客户专员",
//								"渠道/分销总监",
//								"分销/渠道经理",
//								"大客户销售经理",
//								"市场总监",
//								"市场经理",
//								"市场主管"
//							]
//						},
//						{
//							"name": "采购",
//							"s": 135,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员/助理"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 138,
//							"n": 10,
//							"children": [
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员/助理",
//								"仓库经理/主管",
//								"货运代理",
//								"仓储调度"
//							]
//						}
//					]
//				},
//				{
//					"name": "石油石化",
//					"s": 148,
//					"n": 37,
//					"hot": [
//						"供应链总监",
//						"销售经理",
//						"市场总监"
//					],
//					"children": [
//						{
//							"name": "研发",
//							"s": 148,
//							"n": 3,
//							"children": [
//								"材料工程师",
//								"工艺工程师",
//								"配方工程师"
//							]
//						},
//						{
//							"name": "生产",
//							"s": 151,
//							"n": 5,
//							"children": [
//								"热能工程师",
//								"防腐工程师",
//								"环保工程师",
//								"生产经理",
//								"计划调度"
//							]
//						},
//						{
//							"name": "测绘勘探与设计",
//							"s": 156,
//							"n": 4,
//							"children": [
//								"地质工程师",
//								"测量测绘",
//								"管道设计",
//								"结构设计"
//							]
//						},
//						{
//							"name": "仪器仪表",
//							"s": 160,
//							"n": 3,
//							"children": [
//								"机械工程师",
//								"设备工程师",
//								"总图工程师"
//							]
//						},
//						{
//							"name": "营销",
//							"s": 163,
//							"n": 9,
//							"children": [
//								"销售经理",
//								"客户总监",
//								"客户专员",
//								"渠道/分销总监",
//								"分销/渠道经理",
//								"大客户销售经理",
//								"市场总监",
//								"市场经理",
//								"市场主管"
//							]
//						},
//						{
//							"name": "采购",
//							"s": 172,
//							"n": 3,
//							"children": [
//								"采购总监",
//								"采购经理",
//								"采购专员/助理"
//							]
//						},
//						{
//							"name": "供应链",
//							"s": 175,
//							"n": 10,
//							"children": [
//								"供应链总监",
//								"供应链经理",
//								"供应链主管",
//								"供应链专员",
//								"物流总监",
//								"物流经理",
//								"物流专员/助理",
//								"仓库经理/主管",
//								"货运代理",
//								"仓储调度"
//							]
//						}
//					]
//				}
//			]
//		},
//		{
//			"name": "通用",
//			"children": [
//				{
//					"name": "财务",
//					"s": 1,
//					"n": 18,
//					"hot": [
//						"会计","出纳","审计师"
//					],
//					"children": [
//						{
//							"name": "会计",
//							"s": 1,
//							"n": 3,
//							"children": [
//								"会计",
//								"会计文员",
//								"出纳"
//							]
//						},
//						{
//							"name": "财务",
//							"s": 4,
//							"n": 8,
//							"children": [
//								"财务总监",
//								"财务经理",
//								"财务专员",
//								"财务实习生",
//								"财务主管",
//								"财务文员",
//								"财务分析员",
//								"审计师"
//							]
//						},
//						{
//							"name": "审计",
//							"s": 12,
//							"n": 4,
//							"children": [
//								"审计总监",
//								"审计经理",
//								"审计专员/助理",
//								"审计实习生"
//							]
//						},
//						{
//							"name": "税务",
//							"s": 16,
//							"n": 3,
//							"children": [
//								"税务经理",
//								"税务专员",
//								"高级税务顾问"
//							]
//						}
//					]
//				},
//				{
//					"name": "人事行政",
//					"s": 19,
//					"n": 16,
//					"hot": [
//						"人事行政专员","行政后勤"
//					],
//					"children": [
//						{
//							"name": "人事行政",
//							"s": 19,
//							"n": 16,
//							"children": [
//								"人事行政总监",
//								"人事行政经理",
//								"人事行政专员",
//								"人力资源实习生",
//								"人事行政文员",
//								"人事信息系统(HRIS)管理",
//								"大堂经理/领班",
//								"行政后勤",
//								"行政客服",
//								"行政前台",
//								"法务经理",
//								"绩效管理",
//								"薪资福利专员",
//								"招聘培训",
//								"项目管理",
//								"法务专员"
//							]
//						}
//					]
//				},
//				{
//					"name": "市场营销/销售",
//					"s": 35,
//					"n": 15,
//					"hot": [
//						"市场专员","销售"
//					],
//					"children": [
//						{
//							"name": "市场营销",
//							"s": 35,
//							"n": 6,
//							"children": [
//								"市场总监",
//								"市场主管",
//								"市场专员",
//								"市场调研与分析",
//								"市场策划",
//								"策划经理"
//							]
//						},
//						{
//							"name": "销售",
//							"s": 41,
//							"n": 9,
//							"children": [
//								"销售",
//								"区域销售",
//								"大客户销售",
//								"销售文员",
//								"销售数据分析",
//								"促销主管",
//								"销售管理培训生",
//								"销售培训师",
//								"销售业务跟单"
//							]
//						}
//					]
//				},
//				{
//					"name": "客户管理",
//					"s": 50,
//					"n": 16,
//					"hot": [
//						"客户经理","客服经理"
//					],
//					"children": [
//						{
//							"name": "客户服务",
//							"s": 50,
//							"n": 7,
//							"children": [
//								"客户总监",
//								"客户经理",
//								"客户服务专员",
//								"咨询经理",
//								"客户关系",
//								"客户咨询热线",
//								"咨询总监"
//							]
//						},
//						{
//							"name": "客服",
//							"s": 57,
//							"n": 9,
//							"children": [
//								"客服经理",
//								"客服专员",
//								"客服文员",
//								"销售客服",
//								"网店店长",
//								"网络/在线客服",
//								"前台客服",
//								"淘宝客服",
//								"投诉专员"
//							]
//						}
//					]
//				},
//				{
//					"name": "采购",
//					"s": 66,
//					"n": 9,
//					"hot": [
//						"采购经理","采购专员"
//					],
//					"children": [
//						{
//							"name": "采购",
//							"s": 66,
//							"n": 9,
//							"children": [
//								"采购经理",
//								"采购专员",
//								"采购文员",
//								"渠道专员",
//								"渠道总监",
//								"渠道经理",
//								"渠道主管",
//								"物流专员",
//								"物流主管"
//							]
//						}
//					]
//				}
//			]
//		}
//	]
//	, i, j
//	, m, n
//	, p, q
//	, r, s
//	, fillZero = function(i){
//		return i > 9 ? i : '0'+i;
//	}
//	, rs = {
//		list: {}
//		, relations: {}
//		, category: {
//			jobs: []
//		}
//		, hot: {}
//	}
//	, tree
//	, node, leave
//	, index_1, index_2, index_3, index_4
//	, hot, hotArray
//	, inArray = function(value, arr){
//		if( !arr ) return -1;
//
//		var i = 0, j = arr.length;
//
//		for(; i < j; i++){
//			if( value === arr[i] ) break;
//		}
//
//		return i === j ? -1 : i;
//	}
//	;
//for( i = 0, j = data.length; i < j; i++ ){
//	index_1 = fillZero(i);
//
//	tree = data[i];
//	rs.list[index_1] = [tree.name];
//	rs.relations[index_1] = [];
//	rs.category.jobs.push( index_1 );
//
//	tree = tree.children;
//
//	for(m = 0, n = tree.length; m < n; m++){
//		index_2 = index_1 + fillZero(m);
//
//		node = tree[m];
//
//		if( node.hot ){
//			hot = node.hot;
//			hotArray = [];
//			rs.hot[index_2] = hotArray;
//		}
//
//		rs.list[index_2] = [node.name];
//		rs.relations[index_1].push( index_2 );
//		rs.relations[index_2] = [];
//
//		node = node.children;
//
//		for( p = 0, q = node.length; p < q; p++ ){
//			index_3 = index_2 + fillZero(p);
//
//			leave = node[p];
//
//			rs.list[index_3] = [leave.name];
//			rs.relations[index_2].push( index_3 );
//			rs.relations[index_3] = [];
//
//			leave = leave.children;
//
//			for(r = 0, s = leave.length; r < s; r++ ){
//				index_4 = index_3 + fillZero(r);
//
//				rs.list[index_4] = [leave[r]];
//				rs.relations[index_3].push( index_4 );
//
//				if( hot ){  // console.log(hot, leave[r])
//					if( inArray(leave[r], hot) !== -1 ){
//						hotArray.push( index_4 );
//					}
//				}
//			}
//		}
//	}
//
//}
//console.log( JSON.stringify(rs) );

//db.query('insert into web(url) values(\'1\'),(\'2\')', function(e, rs){
//	console.log(arguments);
//	console.log(1)
//});
//db.query('insert into web(url) values(\'3\'),(\'4\'),(\'5\')', function(e, rs){
//	console.log(arguments);
//	console.log(2)
//});

//console.log( Promise );

var cheerio = require('cheerio')
	;

//console.log( cheerio('template', '<template id="123" class="12311"><div></div><div></div><div></div><div></div><div></div></template>').attr() )

//db.query('select id,url from web', function(e, rs){
//	if( e ){
//		return;
//	}
//
//	console.log(rs.length)
//
//	rs.forEach(function(d){
//		console.log('获取 ', d.url);
//		superAgent.get( d.url ).buffer( true ).end(function(e, res){
//			if( !e ){
//				var html = res.text
//					, $
//					, $link
//					, i, t
//					;
//				if( html ){
//					$ = cheerio.load(html, {
//						decodeEntities: false
//					});
//
//					$link = $('link');
//
//					i = $link.length;
//
//					while( i-- ){
//						if( $link.eq(i).attr('rel') === 'shortcut icon' ){
//							t =  $link.eq(i).attr('href');
//							console.log(d.url, ' icon ', t);
//
//							if( !/^http/.test( t ) ){
//								if( /data:/.test( t ) ){
//								}
//								else if( /\/\//.test( t ) ){
//									t = 'http:'+ t;
//								}
//								else if( /^[^\/]/.test( t ) ){
//									t = d.url +'\/'+ t;
//								}
//								else{
//									t = d.url + t;
//								}
//							}
//
//							console.log(d.url, '保存 icon ', t );
//							db.query('update web set ico=\''+ t +'\' where id='+ d.id, function(e){
//								if( e ){
//									console.log(e);
//								}
//							});
//							break;
//						}
//					}
//				}
//			}
//			else{
//				console.log(d.url, '获取失败')
//			}
//		});
//	});
//});

//db.query('select url from web', function(e, rs){
//	if( e ){
//		return;
//	}
//
//	var obj = rs.reduce(function(all, d){
//		all[d.url] = 1;
//
//		return all;
//	}, {});
//
//	db.query('select source from reader_bookmark group by source', function(e, rs){
//		if( e ){
//			return;
//		}
//
//		rs.forEach(function(d){
//			if( d.source in obj ){}
//			else{
//				console.log('插入', d.source)
//				db.query('insert into web(url) value(\''+ d.source +'\')');
//			}
//		});
//	});
//});

// db.query('select * from web where ico=\'0\'', function(e, rs){
// 	if( e ){
// 		return;
// 	}
//
// 	rs.forEach(function(d){
// 		db.query('update web set ico=\''+ d.url +'/favicon.ico\' where id='+ d.id)
// 	});
// });

// db.query('select count(*) as count from user_reader_bookmark', function(e, rs){console.log(rs)
// 	var l = rs[0].count
// 		;
//
// 	for(let i = 0; i < l; i++ ){
// 		db.query('select * from user_reader_bookmark where id='+i, function(e, rs){
// 			if( rs && rs.length ){
//
// 			}
// 			else{
// 				console.log('缺少 ', i)
// 			}
// 		})
// 	}
// })

// var sass = require('node-sass');

// sass.render({
// 	file: 'test/animate.scss'
// 	, outFile: 'build/animate.css'
// }, function(e, rs){
// 	if( e ){
// 		console.log(0, e );
// 	}
// 	else{
// 		console.log(1, rs );
//
// 		fs.writeFileSync(__dirname + '/public/style/animate.css', new Buffer(rs.css) );
// 	}
// });

// ftp
var FtpClient = require('ftp')
	// , client = new FtpClient()
	;

// client.on('ready', function(){
// 	client.cwd('tgou2/img2', function(err, list){
// 		if( !err ){
// 			client.list(function(err, list){
// 				if( err ){
// 					console.log('error ', err);
// 				}
// 				else{
// 					console.log('[\''+ list.filter(d=>d.type==='d').map(d=>'/'+d.name).sort().join('\',\'') +'\']');
// 				}
//
// 				client.end();
// 			});
// 		}
// 		else{
// 			console.log(err)
// 		}
// 	});
// });
//
// client.connect({
// 	host: 'v0.ftp.upyun.com'
// 	, user: 'tgouadmin/tg-image'
// 	, password: 'tgouadmin@'
// });

// var webpack = require('webpack')
// 	, webpackConfig = require('./webpack.config')
// 	, compiler = webpack( webpackConfig )
// 	;
// console.log(compiler);
// var WebSocketServer = require('ws').Server
// 	, wss = new WebSocketServer({
// 		port: 8181
// 	})
// 	;
// wss.on('connection', function(ws){
// 	console.log('connection');
// 	                        // console.log( Object.keys(ws) )
// 	ws.on('message', function(msg){
// 		console.log(msg);
//
// 		// console.log(ws)
//
// 		if( ws.readyState == 1 ){
// 			console.log(1);
//
// 			setTimeout(function(){
// 				ws.send(JSON.stringify({
// 					title: 'hello 1'
// 					, content: '1111'
// 				}));
// 			}, 2000);
// 			setTimeout(function(){
// 				ws.send(JSON.stringify({
// 					title: 'hello 2'
// 					, content: '2222'
// 				}));
// 			}, 5000);
//
// 			ws.send(JSON.stringify({
// 				title: 'hello 3'
// 				, content: '3333'
// 			}));
// 		}
// 	});
// });
// wss.on('close', function(){
// 	console.log(111);
// });

// console.log(global)

// class Model{
// 	constructor(){
//
// 	}
// 	setData(){}
// 	getData(){}
// }

// import Model from './module/model.js';
// var Model = require('./module_new/model.js');
//
// var a = new Model();
//
// console.log(a);

var fs = require('fs');

var getSize = require('image-size')
	;
/*
 * @param path
 *
 */
// function geFileList(paths,list){
// 	if(typeof paths === 'string'){
// 		paths = [paths];
// 	}else if(!Array.isArray(paths)){
// 		return [];
// 	}
// 	paths.forEach(function(path){
// 		var files = fs.readdirSync(path);
// 		files.forEach(function(i){
// 			var state = fs.statSync(path + '/' + i);
// 			if(state.isDirectory()){
// 				geFileList(path + '/' + i,list)
// 			}else if(state.isFile() && (path + '/' + i).indexOf('.svn') < 0){
// 				list.push({
// 					path:path + '/' + i,
// 					name:i,
// 					size:state.size
// 				});
// 			}
// 		});
// 	})
// }
// var list = []
// 	;
//
// geFileList('../tiangou_fe_node/public/image/ftp', list);
//
// console.log(list.map(function(d){//console.log(d.path)
// 	var path = d.path.replace('../tiangou_fe_node/public/image/ftp/', '').split('/')
// 		, size = !/\.ico$/.test(d.path) ? getSize(d.path): {width: 0, height: 0}
// 		;
// 	path.pop();
//
// 	return {
// 		dir: path.join('/')
// 		, name: d.name
// 		, imgType: d.name.split('.')[1].toLowerCase()
// 		, size: d.size
// 		, width: size.width
// 		, height: size.height
// 	}
// }));

// var express = require('express')
// 	, React = require('react')
// 	, ReactDOMServer = require('react-dom/server')
// 	, app = express()
// 	;
//
// function renderFullPage(html, initialState) {
// 	return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//     </head>
//     <body>
//       <div id="root">
//         <div>
//           ${html}
//         </div>
//       </div>
//       <script>
//         window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
//       </script>
//       <script src="/static/bundle.js"></script>
//     </body>
//     </html>
//   `;
// }
// //
// app.use((req, res) => {
// 	match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
// 		if (err) {
// 			res.status(500).end(`Internal Server Error ${err}`);
// 		} else if (redirectLocation) {
// 			res.redirect(redirectLocation.pathname + redirectLocation.search);
// 		} else if (renderProps) {
// 			const store = configureStore();
// 			const state = store.getState();
//
// 			Promise.all([
// 				store.dispatch(fetchList()),
// 				store.dispatch(fetchItem(renderProps.params.id))
// 			])
// 				.then(() => {
// 					const html = renderToString(
// 						<Provider store={store}>
// 						<RoutingContext {...renderProps} />
// 					</Provider>
// 					);
// 					res.end(renderFullPage(html, store.getState()));
// 				});
// 		} else {
// 			res.status(404).end('Not found');
// 		}
// 	});
// });
//
// app.get('/', function(req, res){
// 	res.end(ReactDOMServer.renderToStaticMarkup(
// 		React.DOM.body(null, React.DOM.div({
// 			id: 'root'
// 		}))
// 	))
// });

// let text = fs.readFileSync('../Work/log/log.txt')
// 	, index
// 	;
//
// console.log( Object.keys( text.toString().split('----').reverse().map(function(d){
// 	let t = /【简 介】: (.*)/.exec( d );
// 	// t && console.log( t[1] );
//
// 	return t ? t[1] : '';
// }).reduce(function(all, d){
// 	all[d] = 1;
//
// 	return all;
// }, {}) ) );
//
// var cp = require('child_process')
// 	, spawn = cp.spawn
// 	, ls = spawn('npm run processTest', {
// 		shell: true
// 		// , detached : true
// 	})
// 	// , fork = cp.fork('npm run processTest')
// 	;
//
// // fork.on('message', function(m){
// // 	console.log(m);
// // });
//
// let i = 0;
//
// let interval = setInterval(function(){
//
// 	console.log( i++ );
//
// 	if( i > 10 ){
// 		clearInterval( interval );
//
// 		// process.exit(0);
// 	}
// }, 2000);
//
// console.log( process.cwd() );
//
// // process.stdin.setEncoding('utf8');
// //
// // process.stdin.on('readable', () => {
// // 	console.log('主线程可输入');
// // 	var chunk = process.stdin.read();
// // 	if (chunk !== null) {
// // 		process.stdout.write(`主线程输入：${chunk}`);
// // 	}
// //
// // 	if( ls ){
// // 		console.log(`子线程写入：${chunk}`);
// // 		ls.stdin.write(chunk);
// // 		ls.stdin.end();
// //
// // 		ls = null;
// //
// // 		process.stdin.emit('close');
// // 	}
// // 	else{
// // 		console.log(`子线程写入关闭，无法写入：${chunk}`);
// // 	}
// //
// // 	// process.stdin.end();
// // });
// //
// // process.stdin.on('close', ()=>{
// // 	console.log('主线程关闭输入');
// // });
// // process.stdin.on('end', () => {
// // 	console.log('主线程输入结束');
// // 	process.stdout.write('end');
// // });
//
// // process.stdout.on('data', ()=>{
// // 	console.log(111);
// // })
//
// ls.stdin.write('111');
// ls.stdin.end();
//
// ls.stdout.on('data', function(data){
//
// 	var str = data.toString();
//
// 	console.log('子线程输出：', str);
//
// 	if(/y\/n/.test( str ) ){
//
// 		// ls.stdin.write('111');
// 		// ls.stdin.end();
//
// 		console.log('向子线程输入 1');
//
// 		// ls.stdin
// 		// ls.stdin.write('1');
// 		// ls.stdin.emit('end');
// 	}
//
// 	// if( /stringLength/.test(str) ){
// 	// 	console.log('输入 y');
// 	// 	ls.stdin.write('y');
// 	// 	ls.stdin.end();
// 	// }
// });
// ls.stderr.on('data', function(data){
// 	console.log('子线程报错：', data.toString());
// });
// ls.on('close', function(){
// 	console.log('子线程 stdio 流关闭');
//
// 	process.stdin.emit('close');
//
// 	ls = null;
// });
// ls.on('error', function(){
// 	console.log('线程异常');
// });
// ls.on('exit', function(){
// 	console.log('子进程退出自身');
//
//
// 	ls = null;
// });
//
// // cp.exec('npm run processTest', {
// // 	encoding: 'buffer'
// // }, function(e, stdout, stderr){
// // 	console.log(123)
// // 	if( e ){
// // 		console.log(e);
// //
// // 		return;
// // 	}
// //
// // 	console.log( stdout );
// // });

// setImmediate(() => {
// 	console.log(1)
// 	setTimeout(() => {
// 		console.log(2)
// 	}, 100)
// 	setImmediate(() => {
// 		console.log(3)
// 	})
// 	process.nextTick(() => {
// 		console.log(4)
// 	})
// })
// process.nextTick(() => {
// 	console.log(5)
// 	setTimeout(() => {
// 		console.log(6)
// 	}, 100)
// 	setImmediate(() => {
// 		console.log(7)
// 	})
// 	process.nextTick(() => {
// 		console.log(8)
// 	})
// })
// console.log(9)

// setImmediate(()=>{
// 	console.log(1)
// });
//
// setTimeout(()=>{
// 	console.log(2)
// }, 0);
//
// process.nextTick(()=>{
// 	console.log(3)
// });
//
// Promise.resolve(4).then(()=>{
// 	console.log(4)
// }).then(()=>{
// 	console.log(5)
// });
//
// fs.writeFileSync('./config1.json', '[]');
//
// console.log(2)

const ora = require('ora');

// const spinner = ora('Loading unicorns').start();
//
// setTimeout(() => {
// 	spinner.color = 'yellow';
// 	spinner.text = 'Loading rainbows';
// }, 1000);

let i = 0;

let timer = setInterval(()=>{
	if( i > 100 ){
		clearInterval( timer );
	}
	process.stderr.clearLine()
	process.stderr.cursorTo(0)
	process.stderr.write( ''+ i++ );
}, 1000);