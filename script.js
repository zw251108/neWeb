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

var data = [
	{
		"name": "IT.互联网",
		"children": [
			{
				"name": "技术",
				"s": 0,
				"n": 18,
				"children": [
					{
						"name": "开发",
						"s": 0,
						"n": 6,
						"children": [
							"技术研发",
							"技术管理岗",
							"Go",
							"spark",
							"搜索引擎",
							"数据分析",
							"HBase",
							"实施顾问",
							"Openstack",
							"数据挖掘",
							"自然语言处理",
							"IE工程师",
							"Decker",
							"全栈工程师",
							"推荐系统",
							"数据库开发工程师",
							"BI工程师",
							"实施工程师",
							"嵌入式软件",
							"电子软件开发",
							"ERP",
							"Flash设计/开发",
							"网优工程师"
						]
					},
					{
						"name": "移动开发及前端",
						"s": 6,
						"n": 2,
						"children": [
							"前端",
							"Flash",
							"COCOS2D-X",
							"网页制作",
							"U3D"
						]
					},
					{
						"name": "测试",
						"s": 8,
						"n": 3,
						"children": [
							"高级测试工程师",
							"测试工程师",
							"测试经理/组长",
							"测试开发",
							"软件测试",
							"手机测试",
							"自动化测试",
							"游戏测试",
							"性能测试",
							"硬件测试",
							"系统测试"
						]
					},
					{
						"name": "运维",
						"s": 11,
						"n": 5,
						"children": [
							"DBA",
							"linux运维工程师",
							"网络与信息安全工程师",
							"维修工程师",
							"安全工程师",
							"维护工程师",
							"网络工程师",
							"维修技术员",
							"计算机硬件维护工程师",
							"网络管理岗",
							"系统管理员",
							"信息员",
							"系统运维",
							"网络维护",
							"系统集成工程师",
							"运维总监",
							"运维经理/主管",
							"网络优化",
							"信息技术经理/主管",
							"信息技术专员"
						]
					},
					{
						"name": "高端职位",
						"s": 16,
						"n": 2,
						"children": [
							"技术管理岗",
							"架构师",
							"项目管理岗",
							"系统工程师",
							"安全专家"
						]
					}
				]
			},
			{
				"name": "产品",
				"s": 18,
				"n": 5,
				"children": [
					{
						"name": "产品经理",
						"s": 18,
						"n": 3,
						"children": [
							"产品经理/主管",
							"产品助理",
							"产品专员",
							"互联网产品经理",
							"互联网产品专员",
							"数据产品经理",
							"移动产品经理",
							"游戏策划",
							"电商产品经理"
						]
					},
					{
						"name": "产品设计",
						"s": 21,
						"n": 1,
						"children": [
							"产品设计师",
							"需求分析师",
							"网页产品设计",
							"移动产品设计"
						]
					},
					{
						"name": "高端职位",
						"s": 22,
						"n": 1,
						"children": [
							"产品总监",
							"产品部经理",
							"游戏制作人",
							"计算机辅助设计工程师"
						]
					}
				]
			},
			{
				"name": "设计",
				"s": 23,
				"n": 11,
				"children": [
					{
						"name": "视觉设计",
						"s": 23,
						"n": 6,
						"children": [
							"UI设计",
							"视觉设计",
							"网页设计",
							"APP设计",
							"平面设计",
							"flash设计",
							"美术设计",
							"特效设计",
							"广告设计",
							"多媒体设计",
							"原画师",
							"游戏界面设计",
							"游戏场景",
							"游戏角色",
							"游戏动作",
							"游戏设计/开发",
							"视频编辑",
							"美工",
							"绘画",
							"后期制作",
							"影视策划/制作人员",
							"摄影师",
							"多媒体/动画/3D设计"
						]
					},
					{
						"name": "交互设计",
						"s": 29,
						"n": 1,
						"children": [
							"交互设计师",
							"网页交互设计师",
							"无线交互设计师",
							"硬件交互设计师"
						]
					},
					{
						"name": "用户研究",
						"s": 30,
						"n": 2,
						"children": [
							"系统策划",
							"用户体验研究员",
							"游戏数值分析",
							"游戏策划",
							"数值策划",
							"系统分析员"
						]
					},
					{
						"name": "高端职位",
						"s": 32,
						"n": 2,
						"children": [
							"设计总监",
							"艺术/设计总监",
							"设计经理/主管",
							"交互设计总监",
							"交互设计经理",
							"用户研究总监",
							"用户研究经理"
						]
					}
				]
			},
			{
				"name": "运营",
				"s": 34,
				"n": 11,
				"children": [
					{
						"name": "运营",
						"s": 34,
						"n": 3,
						"children": [
							"产品运营",
							"电商运营",
							"运营推广",
							"运营策划",
							"新媒体运营",
							"游戏运营",
							"活动执行",
							"会展策划/设计",
							"运营管理岗",
							"网络推广",
							"活动策划",
							"电子商务"
						]
					},
					{
						"name": "编辑",
						"s": 37,
						"n": 3,
						"children": [
							"记者",
							"文案策划",
							"编辑",
							"主编",
							"编导",
							"执行策划",
							"策划总监",
							"策划经理/主管",
							"策划专员/助理",
							"策划师"
						]
					},
					{
						"name": "客服",
						"s": 40,
						"n": 4,
						"children": [
							"售前/售后咨询",
							"客户服务管理",
							"淘宝客服",
							"天猫客服",
							"FAE",
							"Helpdesk",
							"网络/在线客服",
							"服务工程师",
							"游戏客服",
							"售前客服",
							"售后客服",
							"服务顾问",
							"电话客服",
							"客服经理/主管",
							"客服专员/助理",
							"投诉专员"
						]
					},
					{
						"name": "高端职位",
						"s": 44,
						"n": 1,
						"children": [
							"首席运营官COO",
							"高级运营总监",
							"客服总监"
						]
					}
				]
			},
			{
				"name": "通用",
				"s": 45,
				"n": 73,
				"children": [
					{
						"name": "人事行政",
						"s": 45,
						"n": 3,
						"children": [
							"培训策划",
							"培训讲师",
							"培训/招生/课程顾问",
							"行政专员/助理",
							"行政总裁",
							"员工关系/企业文化/工会",
							"猎头/人才中介",
							"行政经理/主管",
							"行政总监"
						]
					},
					{
						"name": "市场销售",
						"s": 48,
						"n": 7,
						"children": [
							"咨询总监",
							"咨询经理/主管",
							"咨询顾问/咨询员",
							"咨询热线/呼叫中心",
							"咨询师",
							"咨询项目管理",
							"培训经理/主管",
							"培训专员/助理",
							"商务经理/主管",
							"商务专员/助理",
							"商务代表",
							"商务顾问",
							"采购总监",
							"采购经理/主管",
							"采购工程师",
							"客户经理",
							"大客户销售",
							"区域销售管理",
							"销售",
							"促销主管/督导",
							"市场调研与分析",
							"市场策划",
							"客户关系/投诉/协调人员",
							"客户执行",
							"销售客服",
							"经销商",
							"文员",
							"客户咨询热线/呼叫中心人员"
						]
					},
					{
						"name": "财务",
						"s": 55,
						"n": 3,
						"children": [
							"财务",
							"财务分析",
							"统计员",
							"成本管理",
							"会计",
							"收银员",
							"财务",
							"审计",
							"税务"
						]
					},
					{
						"name": "其他",
						"s": 58,
						"n": 60,
						"children": [
							"媒介经理/主管",
							"媒介专员/助理",
							"媒介策划",
							"法律顾问",
							"会务/会展经理",
							"会务/会展专员",
							"专职律师",
							"高级顾问",
							"法务总监",
							"法务经理/主管",
							"法务专员/助理",
							"专业顾问"
						]
					}
				]
			}
		]
	},
	{
		"name": "房地产",
		"children": [
			{
				"name": "房地产开发",
				"s": 0,
				"n": 5,
				"children": [
					{
						"name": "成本",
						"s": 0,
						"n": 2,
						"children": [
							"成本总监",
							"成本经理/主管",
							"成本核算",
							"预算",
							"招投标工程师"
						]
					},
					{
						"name": "投融资",
						"s": 2,
						"n": 2,
						"children": [
							"投资总监",
							"投资经理/主管",
							"投资专员/助理",
							"融资总监",
							"融资经理/主管",
							"融资专员/助理"
						]
					},
					{
						"name": "前期开发",
						"s": 4,
						"n": 1,
						"children": [
							"前期总监",
							"前期经理/主管",
							"前期开发"
						]
					}
				]
			},
			{
				"name": "土木/建筑工程",
				"s": 5,
				"n": 6,
				"children": [
					{
						"name": "土建",
						"s": 5,
						"n": 6,
						"children": [
							"机电工程师",
							"安全工程师",
							"土建工程师",
							"技术工程师",
							"机电管理",
							"安全管理",
							"土建管理",
							"技术管理",
							"工程设备工程师",
							"项目工程师",
							"材料工程师",
							"品质工程师",
							"工程管理",
							"项目管理",
							"材料管理",
							"施工工程师",
							"水电工程师",
							"建筑工程师",
							"造价预算",
							"测绘",
							"工业工程师",
							"制造工程师",
							"需求工程师",
							"服务工程师"
						]
					}
				]
			},
			{
				"name": "规划设计",
				"s": 11,
				"n": 5,
				"children": [
					{
						"name": "设计",
						"s": 11,
						"n": 5,
						"children": [
							"建筑设计师",
							"结构设计师",
							"结构工程师",
							"钢结构设计",
							"电气设计",
							"暖通设计",
							"市政设计",
							"给排水设计",
							"总图设计师",
							"CAD设计/制图",
							"室内装潢设计",
							"城市规划设计师",
							"园艺/园林/景观设计师",
							"土建工程师",
							"设计类管理岗",
							"模具工程师",
							"机械设计师",
							"工业设计"
						]
					}
				]
			},
			{
				"name": "物业服务",
				"s": 16,
				"n": 3,
				"children": [
					{
						"name": "物业",
						"s": 16,
						"n": 1,
						"children": [
							"安全经理",
							"物业管理",
							"安全防护"
						]
					},
					{
						"name": "客服",
						"s": 17,
						"n": 2,
						"children": [
							"客服管理",
							"客服文员",
							"客户关系/投诉协调",
							"咨询热线/呼叫中心服务人员"
						]
					}
				]
			},
			{
				"name": "市场营销",
				"s": 19,
				"n": 7,
				"children": [
					{
						"name": "销售",
						"s": 19,
						"n": 2,
						"children": [
							"业务销售",
							"区域销售",
							"大客户销售",
							"业务销售管理岗",
							"客户服务",
							"咨询服务",
							"房地产中介"
						]
					},
					{
						"name": "策划",
						"s": 21,
						"n": 1,
						"children": [
							"策划总监",
							"策划经理/主管",
							"策划专员/助理",
							"策划师"
						]
					},
					{
						"name": "市场",
						"s": 22,
						"n": 2,
						"children": [
							"市场总监",
							"市场经理/主管",
							"市场专员/助理",
							"市场推广",
							"市场督导",
							"市场调研分析"
						]
					},
					{
						"name": "招商",
						"s": 24,
						"n": 2,
						"children": [
							"招商总监",
							"招商经理/主管",
							"招商专员/助理",
							"招投标经理/主管",
							"招投标专员",
							"招投标工程师"
						]
					}
				]
			},
			{
				"name": "通用",
				"s": 26,
				"n": 34,
				"children": [
					{
						"name": "财务",
						"s": 26,
						"n": 2,
						"children": [
							"首席财务官CFO/财务总监",
							"财务经理/主管",
							"财务专员/助理",
							"财务规划师",
							"会计/出纳",
							"税务审计",
							"预核算",
							"资金经理/主管"
						]
					},
					{
						"name": "人事行政",
						"s": 28,
						"n": 32,
						"children": [
							"首席执行官CEO/总裁",
							"行政总监",
							"行政经理/主管",
							"行政专员/助理",
							"公关",
							"采购管理",
							"运营",
							"管理培训生",
							"员工关系/企业文化/工会",
							"行政司机",
							"薪酬福利管理",
							"储备经理/干部",
							"甲方代表",
							"招聘培训主管/督导",
							"招聘培训专员/顾问"
						]
					}
				]
			}
		]
	},
	{
		"name": "金融",
		"children": [
			{
				"name": "银行",
				"s": 0,
				"n": 3,
				"children": [
					{
						"name": "银行",
						"s": 0,
						"n": 3,
						"children": [
							"客户经理/主管",
							"柜员",
							"投资理财",
							"行长",
							"大堂经理",
							"风险管理",
							"授信审查岗",
							"产品经理/主管",
							"业务销售",
							"业务销售管理",
							"财务分析咨询",
							"外汇交易"
						]
					}
				]
			},
			{
				"name": "保险",
				"s": 3,
				"n": 6,
				"children": [
					{
						"name": "保险",
						"s": 3,
						"n": 6,
						"children": [
							"资产/资金管理",
							"风险控制",
							"合规法律",
							"运营",
							"运行维护",
							"委托资产",
							"理财规划师",
							"渠道及年金",
							"保险代理/经纪",
							"保险理赔",
							"寿险顾问",
							"培训师",
							"组训",
							"业务销售",
							"客户服务",
							"客户经理",
							"咨询顾问",
							"产品经理",
							"产品专员/助理",
							"团队经理",
							"储备干部/主管",
							"品牌经理/主管",
							"法务经理/主管",
							"法务专员"
						]
					}
				]
			},
			{
				"name": "证券/基金",
				"s": 9,
				"n": 10,
				"children": [
					{
						"name": "证券",
						"s": 9,
						"n": 6,
						"children": [
							"投资银行执行",
							"投资银行项目负责人",
							"并购项目经理",
							"并购总监",
							"债券发行执行岗",
							"资产证券化项目经理",
							"资产证券化产品经理",
							"资本市场部经理",
							"分析师",
							"合规",
							"系统开发",
							"运行维护",
							"清算",
							"信用交易",
							"客户经理",
							"风险控制",
							"柜员",
							"投资理财",
							"证券总监",
							"证券经纪人",
							"市场销售",
							"证券事务代表",
							"证券分析/金融研究"
						]
					},
					{
						"name": "基金",
						"s": 15,
						"n": 4,
						"children": [
							"运行维护",
							"市场部经理",
							"基金子公司投资经理",
							"系统开发",
							"投资经理",
							"固定收益投资经理",
							"基金会计",
							"渠道经理",
							"基金投资顾问",
							"基金经理",
							"行业研究员",
							"交易员",
							"基金营销经理",
							"渠道项目经理",
							"项目经理",
							"客户经理"
						]
					}
				]
			},
			{
				"name": "信托/期货",
				"s": 19,
				"n": 2,
				"children": [
					{
						"name": "信托",
						"s": 19,
						"n": 2,
						"children": [
							"信托管理岗",
							"信托服务",
							"风险管理/控制",
							"行业研究员",
							"资产证券化项目经理",
							"资产证券化产品经理",
							"产品经理"
						]
					}
				]
			},
			{
				"name": "其他金融服务",
				"s": 21,
				"n": 9,
				"children": [
					{
						"name": "第三方理财",
						"s": 21,
						"n": 3,
						"children": [
							"产品经理/主管",
							"数据分析",
							"客户经理",
							"业务销售",
							"品牌策划",
							"理财顾问",
							"风险管理",
							"培训讲师",
							"股权投资经理"
						]
					},
					{
						"name": "其他金融服务",
						"s": 24,
						"n": 1,
						"children": [
							"拍卖/担保/典当业务",
							"珠宝鉴定",
							"收藏品鉴定"
						]
					},
					{
						"name": "PE/PV",
						"s": 25,
						"n": 2,
						"children": [
							"投资管理",
							"定增业务",
							"风险质控经理",
							"资金募集岗",
							"投资分析师"
						]
					},
					{
						"name": "财务",
						"s": 27,
						"n": 3,
						"children": [
							"资产管理",
							"财务分析",
							"统计员",
							"成本管理",
							"投资经理",
							"收银员",
							"财务",
							"审计",
							"财务",
							"会计",
							"税务"
						]
					}
				]
			},
			{
				"name": "通用",
				"s": 30,
				"n": 23,
				"children": [
					{
						"name": "人事行政",
						"s": 30,
						"n": 23,
						"children": [
							"人事行政总监",
							"人事行政经理/主管",
							"人事行政专员/助理",
							"储备干部",
							"管理/培训",
							"员工关系/企业文化/工会",
							"文案策划",
							"应届毕业生",
							"运营",
							"法务主管",
							"法务专员/助理"
						]
					}
				]
			}
		]
	},
	{
		"name": "消费品",
		"children": [
			{
				"name": "食品",
				"s": 0,
				"n": 15,
				"children": [
					{
						"name": "研发/分析/注册",
						"s": 0,
						"n": 2,
						"children": [
							"产品研发",
							"技术研发工程师",
							"注册专员",
							"研发工程师",
							"注册总监",
							"注册经理",
							"数据分析",
							"化学分析"
						]
					},
					{
						"name": "生产/工艺",
						"s": 2,
						"n": 5,
						"children": [
							"生产经理",
							"生产运营管理",
							"生产计划/物料管理",
							"生产设备管理",
							"生产文员",
							"生产助理",
							"生产跟单",
							"生产技术员",
							"生产项目总监",
							"生产项目经理/主管",
							"生产项目专员/助理",
							"生产项目工程师",
							"产品/包装设计",
							"工艺/制程工程师",
							"运作经理",
							"项目执行/协调人员",
							"工艺设计经理",
							"工厂经理/厂长"
						]
					},
					{
						"name": "产品及品牌策划",
						"s": 7,
						"n": 2,
						"children": [
							"品牌/连锁招商管理",
							"产品经理/主管",
							"产品运营",
							"品牌总监",
							"产品/包装设计"
						]
					},
					{
						"name": "采购及供应链",
						"s": 9,
						"n": 1,
						"children": [
							"采购",
							"食品仓储/物流",
							"供应链管理",
							"货运代理"
						]
					},
					{
						"name": "质检",
						"s": 10,
						"n": 2,
						"children": [
							"质量管理/测试经理",
							"质量工程师",
							"测试工程师",
							"认证工程师/审核员",
							"化验/检验",
							"可靠度工程师",
							"体系工程师/审核员"
						]
					},
					{
						"name": "销售",
						"s": 12,
						"n": 3,
						"children": [
							"销售",
							"售后服务/客户服务",
							"开发经理",
							"客户经理/主管",
							"客户执行",
							"销售内勤",
							"销售数据分析",
							"团购经理",
							"分销经理",
							"渠道总监",
							"业务分析经理/主管",
							"业务分析专员/助理"
						]
					}
				]
			},
			{
				"name": "日化",
				"s": 15,
				"n": 16,
				"children": [
					{
						"name": "研发/分析/注册",
						"s": 15,
						"n": 2,
						"children": [
							"产品研发",
							"技术研发经理/主管",
							"数据分析",
							"化学分析",
							"注册总监",
							"注册经理",
							"注册专员"
						]
					},
					{
						"name": "生产/工艺",
						"s": 17,
						"n": 5,
						"children": [
							"生产经理",
							"生产运营管理",
							"生产计划/物料管理",
							"生产设备管理",
							"生产文员",
							"生产助理",
							"生产跟单",
							"生产技术员",
							"生产项目总监",
							"生产项目经理/主管",
							"生产项目专员/助理",
							"生产项目工程师",
							"产品/包装设计",
							"工艺/制程工程师",
							"运作经理",
							"产品工程师",
							"工艺设计经理",
							"工厂经理/厂长",
							"项目执行/协调人员",
							"技术工程师"
						]
					},
					{
						"name": "产品及品牌策划",
						"s": 22,
						"n": 3,
						"children": [
							"品牌/连锁招商管理",
							"产品经理/主管",
							"产品运营",
							"产品设计师",
							"产品工程师",
							"产品/包装设计",
							"市场督导",
							"品牌经理/主管",
							"品牌总监"
						]
					},
					{
						"name": "采购及供应链",
						"s": 25,
						"n": 1,
						"children": [
							"采购",
							"物流/仓储",
							"供应链管理",
							"货运代理"
						]
					},
					{
						"name": "质检",
						"s": 26,
						"n": 2,
						"children": [
							"质量管理/测试经理",
							"质量工程师",
							"测试工程师",
							"认证工程师/审核员",
							"化验/检验",
							"可靠度工程师",
							"体系工程师/审核员"
						]
					},
					{
						"name": "销售",
						"s": 28,
						"n": 3,
						"children": [
							"销售",
							"售后服务/客户服务",
							"开发经理",
							"团购经理",
							"客户执行",
							"渠道总监",
							"客户经理/主管",
							"销售数据分析",
							"业务分析专员/助理",
							"分销经理",
							"业务分析经理/主管",
							"销售内勤"
						]
					}
				]
			},
			{
				"name": "服装首饰",
				"s": 31,
				"n": 17,
				"children": [
					{
						"name": "研发/分析/注册",
						"s": 31,
						"n": 2,
						"children": [
							"产品研发",
							"技术研发经理/主管",
							"数据分析",
							"化学分析",
							"注册总监",
							"注册经理",
							"注册专员",
							"技术工程师"
						]
					},
					{
						"name": "生产/工艺",
						"s": 33,
						"n": 6,
						"children": [
							"生产经理",
							"生产运营管理",
							"生产计划/物料管理",
							"生产设备管理",
							"生产文员",
							"生产助理",
							"生产跟单",
							"生产技术员",
							"生产项目总监",
							"生产项目经理/主管",
							"生产项目专员/助理",
							"生产项目工程师",
							"产品/包装设计",
							"工艺/制程工程师",
							"运作经理",
							"产品工程师",
							"工艺设计经理",
							"工厂经理/厂长",
							"项目执行/协调人员",
							"技术工程师",
							"服装/纺织/皮革工艺师",
							"工艺品/珠宝设计鉴定"
						]
					},
					{
						"name": "产品及品牌策划",
						"s": 39,
						"n": 3,
						"children": [
							"品牌/连锁招商管理",
							"产品经理/主管",
							"产品运营",
							"产品设计师",
							"产品工程师",
							"产品/包装设计",
							"市场督导",
							"品牌经理/主管",
							"品牌总监"
						]
					},
					{
						"name": "采购及供应链",
						"s": 42,
						"n": 1,
						"children": [
							"采购",
							"物流/仓储",
							"供应链管理",
							"货运代理"
						]
					},
					{
						"name": "质检",
						"s": 43,
						"n": 2,
						"children": [
							"质量管理/测试经理",
							"质量工程师",
							"测试工程师",
							"认证工程师/审核员",
							"化验/检验",
							"可靠度工程师",
							"体系工程师/审核员",
							"服装/纺织品/皮革质量管理"
						]
					},
					{
						"name": "销售",
						"s": 45,
						"n": 3,
						"children": [
							"销售",
							"售后服务/客户服务",
							"开发经理",
							"团购经理",
							"客户执行",
							"渠道总监",
							"客户经理/主管",
							"销售数据分析",
							"业务分析专员/助理",
							"分销经理",
							"业务分析经理/主管",
							"销售内勤"
						]
					}
				]
			},
			{
				"name": "家具家电",
				"s": 48,
				"n": 17,
				"children": [
					{
						"name": "研发/分析/注册",
						"s": 48,
						"n": 2,
						"children": [
							"产品研发",
							"技术研发经理/主管",
							"数据分析",
							"化学分析",
							"注册总监",
							"注册经理",
							"注册专员",
							"技术工程师"
						]
					},
					{
						"name": "生产/工艺",
						"s": 50,
						"n": 6,
						"children": [
							"生产经理",
							"生产运营管理",
							"生产计划/物料管理",
							"生产设备管理",
							"生产文员",
							"生产助理",
							"生产跟单",
							"生产技术员",
							"生产项目总监",
							"生产项目经理/主管",
							"生产项目专员/助理",
							"生产项目工程师",
							"产品/包装设计",
							"工艺/制程工程师",
							"运作经理",
							"产品工程师",
							"工艺设计经理",
							"工厂经理/厂长",
							"项目执行/协调人员",
							"技术工程师",
							"服装/纺织/皮革工艺师",
							"工艺品/珠宝设计鉴定"
						]
					},
					{
						"name": "产品及品牌策划",
						"s": 56,
						"n": 3,
						"children": [
							"品牌/连锁招商管理",
							"产品经理/主管",
							"产品运营",
							"产品设计师",
							"产品工程师",
							"产品/包装设计",
							"市场督导",
							"品牌经理/主管",
							"品牌总监"
						]
					},
					{
						"name": "采购及供应链",
						"s": 59,
						"n": 1,
						"children": [
							"采购",
							"物流/仓储",
							"供应链管理",
							"货运代理"
						]
					},
					{
						"name": "质检",
						"s": 60,
						"n": 2,
						"children": [
							"质量管理/测试经理",
							"质量工程师",
							"测试工程师",
							"认证工程师/审核员",
							"化验/检验",
							"可靠度工程师",
							"体系工程师/审核员",
							"服装/纺织品/皮革质量管理"
						]
					},
					{
						"name": "销售",
						"s": 62,
						"n": 3,
						"children": [
							"销售",
							"售后服务/客户服务",
							"开发经理",
							"团购经理",
							"客户执行",
							"渠道总监",
							"客户经理/主管",
							"销售数据分析",
							"业务分析专员/助理",
							"分销经理",
							"业务分析经理/主管",
							"销售内勤"
						]
					}
				]
			},
			{
				"name": "渠道",
				"s": 65,
				"n": 83,
				"children": [
					{
						"name": "采购",
						"s": 65,
						"n": 2,
						"children": [
							"采购总监",
							"采购经理/主管",
							"采购专员/助理",
							"采购工程师",
							"采购跟单",
							"供应商/采购质量管理"
						]
					},
					{
						"name": "运营",
						"s": 67,
						"n": 2,
						"children": [
							"渠道/分销",
							"运营",
							"客户关系",
							"团购经理",
							"店长",
							"数据分析"
						]
					},
					{
						"name": "设计策划",
						"s": 69,
						"n": 1,
						"children": [
							"品牌设计师",
							"空间设计师",
							"活动策划"
						]
					},
					{
						"name": "供应链",
						"s": 70,
						"n": 78,
						"children": [
							"供应链管理",
							"物流/仓储",
							"货运代理"
						]
					}
				]
			}
		]
	},
	{
		"name": "汽车.制造",
		"children": [
			{
				"name": "汽车制造",
				"s": 0,
				"n": 8,
				"children": [
					{
						"name": "汽车研发&制造",
						"s": 0,
						"n": 4,
						"children": [
							"汽车动力系统工程师",
							"汽车零部件设计师",
							"汽车装配工艺工程师",
							"底盘工程师",
							"发动机工程师",
							"安全性能工程师",
							"总装工程师",
							"试制工程师",
							"涂装工程师",
							"汽车电子工程师",
							"汽车工程项目管理",
							"机械设计师",
							"材料工程师",
							"车身设计工程师",
							"汽车质量管理",
							"汽车设计工程师"
						]
					},
					{
						"name": "汽车服务",
						"s": 4,
						"n": 2,
						"children": [
							"汽车造型设计师",
							"汽车售后服务/客户服务",
							"检验师",
							"二手车评估师",
							"汽车维修/保养",
							"汽车定损/车险理赔"
						]
					},
					{
						"name": "汽车销售",
						"s": 6,
						"n": 2,
						"children": [
							"汽车销售",
							"汽车零配件销售",
							"4s店管理"
						]
					}
				]
			},
			{
				"name": "机械设计/制造",
				"s": 8,
				"n": 12,
				"children": [
					{
						"name": "技术工程师",
						"s": 8,
						"n": 7,
						"children": [
							"模具设计",
							"机电工程师",
							"结构设计工程师",
							"结构工程师",
							"生产工艺工程师",
							"技术员",
							"焊接工程师",
							"自动化工程师",
							"CNC工程师模具工程师",
							"冲压工程师",
							"硬件工程师",
							"精密机械",
							"装配工程师/技师",
							"液压工程师",
							"机械设计工程师",
							"飞机设计/制造",
							"列车设计/制造",
							"船舶设计/制造",
							"夹具工程师",
							"应用工程师",
							"铸造/锻造工程师/技师",
							"测试/可靠性工程师",
							"材料工程师",
							"CAE工程师",
							"产品设计/开发/工艺",
							"CNC/数控工程师",
							"CAD设计/制图"
						]
					},
					{
						"name": "技术维修",
						"s": 15,
						"n": 2,
						"children": [
							"机械维修/保养",
							"汽车维修/保养",
							"列车维修/保养",
							"船舶维修/保养",
							"设备工程师",
							"维修工程师"
						]
					},
					{
						"name": "技工&操作工",
						"s": 17,
						"n": 3,
						"children": [
							"电焊工/铆焊工",
							"普工操作工/操作员",
							"后勤维修",
							"装配工",
							"行车工",
							"水工/木工/油漆工",
							"模具工",
							"水运/空运/陆运操作",
							"铲车/叉车工"
						]
					}
				]
			},
			{
				"name": "仪器仪表自动化/电气",
				"s": 20,
				"n": 5,
				"children": [
					{
						"name": "技术工程师",
						"s": 20,
						"n": 5,
						"children": [
							"仪器/仪表/计量工程师",
							"射频工程师",
							"电子工程师",
							"电器工程师",
							"嵌入式软件开发",
							"机械工程师",
							"电气工程师",
							"自动化工程师",
							"测试经理",
							"维修工程师",
							"机电工程师",
							"模拟电路设计",
							"空调工程",
							"安防工程师",
							"FAE现场应用工程师",
							"工艺工程师",
							"点子元器件工程师",
							"IC设计工程师",
							"音频工程师",
							"视频工程师"
						]
					}
				]
			},
			{
				"name": "生产制造",
				"s": 25,
				"n": 7,
				"children": [
					{
						"name": "生产管理",
						"s": 25,
						"n": 3,
						"children": [
							"厂长",
							"生产管理岗",
							"生产计划管理",
							"生产运营管理",
							"制造工程师",
							"生产设备管理",
							"生产督导/领班/组长",
							"生产技术员",
							"生产物料管理（PMC）",
							"生产文员"
						]
					},
					{
						"name": "质量管理",
						"s": 28,
						"n": 2,
						"children": [
							"质量管理/测试工程师",
							"质量检验员/测试员",
							"安全员",
							"品质工程师",
							"品质管理",
							"安全管理"
						]
					},
					{
						"name": "供应链",
						"s": 30,
						"n": 2,
						"children": [
							"采购",
							"仓储/物流/运输",
							"外贸业务员",
							"仓库管理员",
							"贸易管理",
							"团购经理/主管",
							"团购业务员",
							"理货/分拣/打包"
						]
					}
				]
			},
			{
				"name": "市场营销及销售",
				"s": 32,
				"n": 43,
				"children": [
					{
						"name": "市场",
						"s": 32,
						"n": 3,
						"children": [
							"市场/营销/拓展总监",
							"市场/营销/拓展主管",
							"市场/营销/拓展专员",
							"市场推广",
							"市场企划经理/主管",
							"市场企划专员/助理",
							"市场文案策划",
							"市场调研与分析",
							"渠道/分销"
						]
					},
					{
						"name": "销售",
						"s": 35,
						"n": 40,
						"children": [
							"销售",
							"售后服务/客户服务",
							"开发经理",
							"销售内勤",
							"客户执行",
							"渠道总监",
							"客户经理/主管",
							"销售数据分析",
							"业务分析专员/助理",
							"分销经理",
							"业务分析经理/主管"
						]
					}
				]
			}
		]
	},
	{
		"name": "医疗.化工",
		"children": [
			{
				"name": "药品/生物制剂",
				"s": 0,
				"n": 14,
				"children": [
					{
						"name": "研发与注册",
						"s": 0,
						"n": 4,
						"children": [
							"研发总监",
							"研发经理/主管",
							"研发专员/助理",
							"测试工程师",
							"注册经理",
							"注册专员",
							"数据分析员",
							"注册总监",
							"医疗/医护人员",
							"药品注册",
							"实验员",
							"产品研发/注册",
							"研发工程师",
							"医药学检验"
						]
					},
					{
						"name": "生产",
						"s": 4,
						"n": 4,
						"children": [
							"生产总监",
							"质量管理",
							"工厂经理/厂长",
							"产品经理/主管",
							"化验/检验",
							"工艺/制程工程师",
							"药库主任/药剂师",
							"产品工程师",
							"认证工程师",
							"审核员",
							"生产计划/物料管理",
							"生产运营管理",
							"生产主管/督导/领班/组长",
							"安全管理",
							"生产经理/车间主任",
							"制造工程师"
						]
					},
					{
						"name": "营销",
						"s": 8,
						"n": 2,
						"children": [
							"销售",
							"仓库经理/主管",
							"市场策划/企划",
							"客户经理/主管",
							"渠道/分销",
							"医药学术推广",
							"客户服务"
						]
					},
					{
						"name": "采购",
						"s": 10,
						"n": 2,
						"children": [
							"采购总监",
							"采购经理/主管",
							"采购专员/助理",
							"仓库/物料管理员",
							"采购工程师"
						]
					},
					{
						"name": "供应链",
						"s": 12,
						"n": 2,
						"children": [
							"供应链管理",
							"物流管理",
							"供应商管理",
							"仓库经理/主管",
							"货运代理"
						]
					}
				]
			},
			{
				"name": "器械耗材",
				"s": 14,
				"n": 11,
				"children": [
					{
						"name": "研发与注册",
						"s": 14,
						"n": 2,
						"children": [
							"研发",
							"注册",
							"认证工程师",
							"实验员",
							"审核员"
						]
					},
					{
						"name": "生产",
						"s": 16,
						"n": 5,
						"children": [
							"生产总监",
							"QA/QC",
							"生产经理/车间主任",
							"产品经理/主管",
							"化验/检验",
							"工艺/制程工程师",
							"工厂经理/厂长",
							"产品工程师",
							"生产运营管理",
							"安全管理",
							"认证工程师",
							"制造工程师",
							"生产计划/物料管理",
							"质量管理",
							"医疗器械维修/保养",
							"审核员"
						]
					},
					{
						"name": "营销",
						"s": 21,
						"n": 2,
						"children": [
							"销售",
							"仓库经理/主管",
							"市场策划/企划",
							"客户服务",
							"客户经理/主管",
							"医疗器械市场推广",
							"渠道/分销"
						]
					},
					{
						"name": "采购",
						"s": 23,
						"n": 2,
						"children": [
							"采购管理",
							"物流",
							"仓储调度",
							"供应链管理",
							"供应商管理",
							"货运代理"
						]
					}
				]
			},
			{
				"name": "精细化工/新材料/环保技术",
				"s": 25,
				"n": 11,
				"children": [
					{
						"name": "研发",
						"s": 25,
						"n": 3,
						"children": [
							"材料工程师",
							"工艺工程师",
							"分析与监测",
							"研发工程师",
							"合成工程师",
							"产品研发/注册",
							"认证工程师",
							"实验员",
							"研发总监",
							"研发经理/主管",
							"研发专员/助理"
						]
					},
					{
						"name": "生产",
						"s": 28,
						"n": 4,
						"children": [
							"环保工程师",
							"热能工程师",
							"自控工程师",
							"QA/QC",
							"制冷工程师",
							"化验/检验",
							"工艺/制程工程师",
							"生产运营管理",
							"产品总监",
							"产品经理/主管",
							"产品专员/助理",
							"产品工程师",
							"生产经理/车间主任",
							"生产计划/物料管理",
							"质量管理",
							"工厂经理/厂长"
						]
					},
					{
						"name": "营销",
						"s": 32,
						"n": 2,
						"children": [
							"销售",
							"仓库经理/主管",
							"市场策划/企划",
							"客户服务",
							"客户经理/主管",
							"医疗器械市场推广",
							"渠道/分销"
						]
					},
					{
						"name": "采购",
						"s": 34,
						"n": 2,
						"children": [
							"采购",
							"供应链管理",
							"物流",
							"仓储调度",
							"供应商管理",
							"货运代理"
						]
					}
				]
			},
			{
				"name": "化工机械",
				"s": 36,
				"n": 10,
				"children": [
					{
						"name": "仪器仪表",
						"s": 36,
						"n": 1,
						"children": [
							"机械工程师",
							"设备工程师",
							"总图工程师",
							"压力容器"
						]
					},
					{
						"name": "生产",
						"s": 37,
						"n": 5,
						"children": [
							"热能工程师",
							"自控工程师",
							"防腐工程师",
							"水处理",
							"工厂经理/厂长",
							"测试主管工程师",
							"质量管理",
							"生产运营管理",
							"生产总监",
							"生产计划/物料管理",
							"生产经理/车间主任",
							"制造工程师",
							"安全管理",
							"产品总监",
							"产品经理/主管",
							"产品专员/助理",
							"计划调度",
							"审核员",
							"产品工程师",
							"产品开发/技术/工艺"
						]
					},
					{
						"name": "营销",
						"s": 42,
						"n": 2,
						"children": [
							"销售",
							"仓库经理/主管",
							"市场策划/企划",
							"客户服务",
							"客户经理/主管",
							"医疗器械市场推广",
							"渠道/分销"
						]
					},
					{
						"name": "采购",
						"s": 44,
						"n": 2,
						"children": [
							"采购",
							"供应链管理",
							"物流",
							"仓储调度",
							"供应商管理",
							"货运代理"
						]
					}
				]
			},
			{
				"name": "石油化工",
				"s": 46,
				"n": 63,
				"children": [
					{
						"name": "研发",
						"s": 46,
						"n": 2,
						"children": [
							"材料工程师",
							"工艺工程师",
							"配方工程师",
							"研发工程师",
							"计划调度",
							"研发总监",
							"研发经理/主管",
							"研发专员/助理"
						]
					},
					{
						"name": "生产",
						"s": 48,
						"n": 3,
						"children": [
							"热能工程师",
							"防腐工程师",
							"环保工程师",
							"生产经理/车间主任",
							"安全管理",
							"生产总监",
							"质量管理",
							"水处理",
							"计划调度",
							"生产运营管理"
						]
					},
					{
						"name": "测绘勘探与设计",
						"s": 51,
						"n": 1,
						"children": [
							"地质工程师",
							"测量测绘",
							"管道设计",
							"结构设计"
						]
					},
					{
						"name": "仪器仪表",
						"s": 52,
						"n": 1,
						"children": [
							"机械工程师",
							"设备工程师",
							"总图工程师"
						]
					},
					{
						"name": "营销",
						"s": 53,
						"n": 2,
						"children": [
							"销售",
							"仓库经理/主管",
							"市场策划/企划",
							"客户服务",
							"客户经理/主管",
							"医疗器械市场推广",
							"渠道/分销"
						]
					},
					{
						"name": "采购",
						"s": 55,
						"n": 54,
						"children": [
							"采购",
							"供应链管理",
							"物流",
							"仓储调度",
							"供应商管理",
							"货运代理"
						]
					}
				]
			}
		]
	},
	{
		"name": "通用",
		"children": [
			{
				"name": "财务",
				"s": 0,
				"n": 5,
				"children": [
					{
						"name": "会计",
						"s": 0,
						"n": 1,
						"children": [
							"会计",
							"会计文员",
							"出纳"
						]
					},
					{
						"name": "财务",
						"s": 1,
						"n": 2,
						"children": [
							"财务总监",
							"财务经理/主管",
							"财务专员/助理",
							"财务实习生",
							"财务主管/总帐主管",
							"财务文员",
							"财务分析员",
							"审计师"
						]
					},
					{
						"name": "审计",
						"s": 3,
						"n": 1,
						"children": [
							"审计总监",
							"审计经理/主管",
							"审计专员/助理",
							"审计实习生"
						]
					},
					{
						"name": "税务",
						"s": 4,
						"n": 1,
						"children": [
							"税务经理/主管",
							"税务专员/助理",
							"高级税务顾问"
						]
					}
				]
			},
			{
				"name": "人事行政",
				"s": 5,
				"n": 5,
				"children": [
					{
						"name": "人事行政",
						"s": 5,
						"n": 5,
						"children": [
							"人事行政总监",
							"人事行政经理/主管",
							"人事行政专员/助理",
							"人力资源实习生",
							"人事行政文员",
							"人事信息系统(HRIS)管理",
							"大堂经理/领班",
							"行政后勤",
							"行政客服",
							"行政前台",
							"法务经理/主管",
							"绩效管理",
							"薪资福利专员/助理",
							"招聘培训",
							"项目管理",
							"法务专员/助理",
							"员工关系/企业文化/工会",
							"总监/经理/主管"
						]
					}
				]
			},
			{
				"name": "市场营销/销售",
				"s": 10,
				"n": 5,
				"children": [
					{
						"name": "市场营销",
						"s": 10,
						"n": 2,
						"children": [
							"市场/营销/拓展总监",
							"市场/营销/拓展主管",
							"市场/营销/拓展专员",
							"市场调研与分析",
							"市场策划/企划经理/主管",
							"市场策划/企划",
							"策划经理"
						]
					},
					{
						"name": "销售",
						"s": 12,
						"n": 3,
						"children": [
							"销售",
							"区域销售",
							"大客户销售",
							"销售文员",
							"销售数据分析",
							"促销主管/督导",
							"销售管理培训生",
							"销售培训师/讲师",
							"销售业务跟单"
						]
					}
				]
			},
			{
				"name": "运营",
				"s": 15,
				"n": 2,
				"children": [
					{
						"name": "运营",
						"s": 15,
						"n": 2,
						"children": [
							"首席运营官COO/运营总监",
							"运营经理/主管",
							"运营专员/助理",
							"网站运营管理",
							"网络运营专员/助理",
							"产品/品牌经理"
						]
					}
				]
			},
			{
				"name": "客户管理",
				"s": 17,
				"n": 5,
				"children": [
					{
						"name": "客户服务",
						"s": 17,
						"n": 2,
						"children": [
							"客户总监",
							"客户经理/主管",
							"客户服务专员/助理",
							"咨询经理/主管",
							"客户关系/投诉协调人员",
							"客户咨询热线/呼叫中心人员",
							"咨询总监"
						]
					},
					{
						"name": "客服",
						"s": 19,
						"n": 3,
						"children": [
							"客服经理/主管",
							"客服专员/助理/代表",
							"客服文员",
							"销售客服",
							"网店店长/客服",
							"网络/在线客服",
							"前台客服",
							"淘宝客服",
							"投诉专员"
						]
					}
				]
			},
			{
				"name": "采购",
				"s": 22,
				"n": 38,
				"children": [
					{
						"name": "采购",
						"s": 22,
						"n": 38,
						"children": [
							"采购经理/主管",
							"采购专员/助理",
							"采购文员",
							"渠道专员",
							"渠道/分销总监",
							"渠道/分销经理",
							"渠道/分销主管",
							"物流专员/助理",
							"物流主管"
						]
					}
				]
			}
		]
	}
]
	, i, j
	, m, n
	, p, q
	, r, s
	, fillZero = function(i){
		return i > 9 ? i : '0'+i;
	}
	, rs = {
		list: {}
		, relations: {}
		, category: {
			jobs: []
		}
	}
	, tree
	, node, leave
	, index_1, index_2, index_3, index_4
	;
for( i = 0, j = data.length; i < j; i++ ){
	index_1 = fillZero(i);

	tree = data[i];
	rs.list[index_1] = [tree.name];
	rs.relations[index_1] = [];
	rs.category.jobs.push( index_1 );

	tree = tree.children;

	for(m = 0, n = tree.length; m < n; m++){
		index_2 = index_1 + fillZero(m);

		node = tree[m];

		rs.list[index_2] = [node.name];
		rs.relations[index_1].push( index_2 );
		rs.relations[index_2] = [];

		node = node.children;

		for( p = 0, q = node.length; p < q; p++ ){
			index_3 = index_2 + fillZero(p);

			leave = node[p];

			rs.list[index_3] = [leave.name];
			rs.relations[index_2].push( index_3 );
			rs.relations[index_3] = [];

			leave = leave.children;

			for(r = 0, s = leave.length; r < s; r++ ){
				index_4 = index_3 + fillZero(r);

				rs.list[index_4] = [leave[r]];
				rs.relations[index_3].push( index_4 );
			}
		}
	}

}
console.log(rs);