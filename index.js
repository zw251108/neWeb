/**
 * 定义常量
 * */
var CONST_VAR = {}
	, URL_ARRAY = [
		'http://zw150026.com/blog/detail.php?id=14&type=1'
		, 'http://blog.csdn.net/zuoninger/article/details/38842823'
	]
	, mainContent = {
		'blog.csdn.net': '#article_content'
	}
	;

/**
 * node-segment
 *  分词
 * */
var Segment = require('node-segment').Segment
	, segment = new Segment()
	;

// 使用默认的识别模块及字典
segment.useDefault();

/**
 * 分析 URL
 * */
var url = require('url')
	, myUrl = URL_ARRAY[1]
	, parsedUrl = url.parse( myUrl, true )
	, opts = {
		port: 80
	}
	;
opts.host = parsedUrl.host;
opts.path = parsedUrl.path;

/**
 * 解析 HTML 结构
 * */
var cheerio = require('cheerio')
	, html
	;

/**
 * HTTP GET 请求
 *  发送请求，获取网页
 * */
var http = require('http')
	, req = http.get(opts, function(res){
		html = '';
		res.setEncoding('utf8');
		res.on('data', function(c){
			html += c;
		});
		res.on('end', function(){
			var  str
				, rs
				, $
				, obj = {}
				, filterRs = []
				, i
				, j
				, temp
				;

			$ = cheerio.load(html);
			str = $('#article_content').text();

			// 分词
			rs = segment.doSegment( str );

			// 统计
			j = rs.length;
			var prefix = '_' + (+new Date())
				, w
				;
			while( j-- ){
				temp = rs[j];

				// 过滤 只统计 专有名词 外文字符 机构团体 地名 人名 动词 名词
				if( !(temp.p === 8 ||
					temp.p === 16 ||
					temp.p === 32 ||
					temp.p === 64 ||
					temp.p === 128 ||
					temp.p === 4096 ||
					temp.p === 1048576) ) continue;

				w = prefix + temp.w;

				if( w in obj ){
					filterRs[obj[w]].n++;
				}
				else{
					filterRs.push({
						tag: temp.w
						, p: temp.p
						, n: 1
					});
					obj[w] = filterRs.length -1;
				}
			}

			// 排序
			filterRs.sort(function(a, b){
				return b.n - a.n;
			});

			i = 0;
			j = filterRs.length;
			while( i !== 10 ){
				console.log(filterRs[i]);

				i++;
			}
		});
	})
	;
req.end();