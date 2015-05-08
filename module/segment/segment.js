/**
 * @module
 */
/**
 * 定义常量
 * */
var CONST_VAR = {}
	, FEED_URL_ARRAY = [
		//'http://feed.feedsky.com/programmer'
		'http://www.huxiu.com/rss/0.xml'
	]
	, ARTICLE_URL_ARRAY = [
//		'http://zw150026.com/blog/detail.php?id=14&type=1'
//		, 'http://blog.csdn.net/zuoninger/article/details/38842823'
//		,
		'http://www.iteye.com/news/26243'
	]
	, mainContent = {
		'www.csdn.net': '.news_content'
		, 'blog.csdn.net': '#article_content'
		, 'www.iteye.com': '#news_content'
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
	 * segment
	 *  分词
	 * */
	, Segment = require('segment').Segment // 载入模块
	, segment = new Segment()   // 创建实例

	/**
	 * cheerio
	 *  解析 HTML 结构
	 * */
	, Cheerio = require('cheerio')
	;

/**
 * 配置，可根据实际情况增删，详见segment.useDefault()方法
 * */
segment
	.use( require(__dirname +'/HtmlTagTokenizer.js') )

	// 载入识别模块，强制分割类单词识别，详见 lib/module 目录，或者是自定义模块的绝对路径
	.use('URLTokenizer')            // URL 识别
	.use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
	.use('PunctuationTokenizer')    // 标点符号识别
	.use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
	// 中文单词识别
	.use('DictTokenizer')           // 词典识别
	.use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后

	// 优化模块
	.use('EmailOptimizer')          // 邮箱地址识别
	.use('ChsNameOptimizer')        // 人名识别优化
	.use('DictOptimizer')           // 词典识别优化
	.use('DatetimeOptimizer')       // 日期时间识别优化

	// 载入字典，详见 dicts 目录，或者是自定义字典文件的绝对路径
	.loadDict('dict.txt')           // 盘古词典
	.loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
	.loadDict('names.txt')          // 常见名词、人名
	.loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
	;
//segment.loadDict(__dirname + '/web.txt', 'Web', true);  // 自定义

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
function getArticle(url){
//	var host = URL.parse(url, true).host;

	var req = HTTP.get(url, function(res){
		var html = '';
		res.setEncoding('utf8');
		res.on('data', function(c){
			html += c;
		});
		res.on('end', function(){
			var
//				segment = new Segment()
//				, $ = Cheerio.load(html)
				content
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

			content = html.replace(/<\/?.*?>/g, ' ');

//			// 使用默认的识别模块及字典
//			segment.useDefault();
			// 分词
			rs = segment.doSegment( content );

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
					obj[w] = filterRs.length -1;
				}
			}

			// 排序
			filterRs.sort(function(a, b){
				return b.n - a.n;
			});

			w = 0;
			j = filterRs.length;
			while( w < j ){
				console.log('\n', filterRs[w]);

				w++;
			}
		});
	}).on('error', function(e){
		console.log('Error: ' + e.message);
	});
	req.end();
}
//ARTICLE_URL_ARRAY.forEach(getArticle);

module.exports = function(url){
	var rs = [];

	return rs;
};

// 开始分词
console.log('\n', segment.doSegment('<a href="http://12311.com">http://www.baidu.com</a><p> http:// 前端工程师，http://www.baidu.com 有一个人 </p>这是一个基于Node.js的中文分词模块。互联网，Java'));