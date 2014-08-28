/**
 * 定义常量
 * */
var CONST_VAR = {}
	, FEED_URL_ARRAY = [
		'http://feed.feedsky.com/programmer'
	]
	, ARTICLE_URL_ARRAY = [
		'http://zw150026.com/blog/detail.php?id=14&type=1'
		, 'http://blog.csdn.net/zuoninger/article/details/38842823'
	]
	, mainContent = {
		'www.csdn.net': '.news_content'
		, 'blog.csdn.net': '#article_content'
	}
	;
/**
 * 分析 URL
 * */
var URL = require('url')
	/**
	 * 创建 HTTP 请求
	 * */
	,  HTTP = require('http')
	/**
	 * node-segment
	 *  分词
	 * */
	, Segment = require('node-segment').Segment
	/**
	 * cheerio
	 *  解析 HTML 结构
	 * */
	, Cheerio = require('cheerio')
	;

//var parsedUrl = URL.parse( ARTICLE_URL_ARRAY[1], true )
//	, host = parsedUrl.host
//	;

/**
 * HTTP GET 请求
 *  发送请求，获取 RSS
 * */
var rssReq = HTTP.get(FEED_URL_ARRAY[0], function(res){
	var rss = '';
	res.setEncoding('utf8');
	res.on('data', function(c){
		rss += c;
	});
	res.on('end', function(){
		console.log( rss );
		var $ = Cheerio.load(rss)
			;
		var item = $('item');
		var item1 = item.eq(0);

//		console.log( item1.find('title').text() )
//		console.log( item1.find('link')[0].next.data )
//		console.log( item1.find('description').text() )
//		console.log( item1.find('author').text() );
		// title link description author

		getArticle( item1.find('link')[0].next.data );
	});
});
rssReq.end();


/**
 * HTTP GET 请求
 *  发送请求，获取网页
 * */
function getArticle(url){
	var host = URL.parse(url, true).host;

	var req = HTTP.get(url, function(res){
		var html = '';
		res.setEncoding('utf8');
		res.on('data', function(c){
			html += c;
		});
		res.on('end', function(){
			var segment = new Segment()
				, $ = Cheerio.load(html)
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
			if( host in mainContent ){
				content = $(mainContent[host]).text();
			}
			else{
				content = html;
			}

			// 使用默认的识别模块及字典
			segment.useDefault();
			// 分词
			rs = segment.doSegment( content );

			// 统计
			j = rs.length;
			while( j-- ){
				temp = rs[j];
				p = temp.p;

				/**
				 * 过滤
				 *  只统计 专有名词 外文字符 机构团体 地名 人名 动词 名词
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
					obj[w] = filterRs.length -1;
				}
			}

			// 排序
			filterRs.sort(function(a, b){
				return b.n - a.n;
			});

			w = 0;
			j = filterRs.length;
			while( w !== 10 && w < j ){
				console.log(filterRs[w]);

				w++;
			}
		});
	});
	req.end();
}