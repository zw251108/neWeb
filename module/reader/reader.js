/**
 *
 * */

var Promise     = require('promise')

	, Url       = require('url')

	, superAgent    = require('superagent')

	, Cheerio   = require('cheerio')

	, segment   = require('../segment/segment.js')

	, tagModel  = require('../tag/model.js')

	, TAG_CACHE
	, TAG_INDEX

	, ReaderError   = require('./error.js')

	, Reader    = {
		crawler: function(url){
			return new Promise(function(resolve, reject){
				if( url ){
					superAgent.get(url).buffer(true).end(function(err, res){
						if( !err ){
							resolve({
								res: res
								, url: url
							});
						}
						else{
							reject( err );
						}
					});
				}
				else{
					reject( new ReaderError('获取页面内容失败！') );
				}
			});
		}
		, handleFeed: function(result){
			var res = result.res
				, rss = res.text
				, charset = res.charset
				, $
				, $items
				, i, j, temp, $t, t
				, rs = []
				;

			if( rss ){
				$ = Cheerio.load(rss, {xmlMode: true});
				$items = $('item,entry');

				for(i = 0, j = $items.length; i < j; i++){
					temp = {};
					$t = $items.eq(i);

					temp.title = $t.find('title').text();

					t = $t.find('link');

					temp.url = t.text() || t.attr('href');
					!temp.url && (temp.url = $t.find('id').text());

					temp.content = $t.find('description').text();
					!temp.content && (temp.content = $t.find('summary').text());

					temp.author = $t.find('author').text();
					!temp.author && (temp.author = $t.find('dc\\:creator').text());

					temp.tags = $t.find('cateory').map(function(){
						var t = $(this);
						return t.text() || t.attr('term');
					}).get().join();
					temp.datetime = $t.find('pubDate,published').text();

					rs.push( temp );
				}
			}
			else{
				rs = Promise.reject( new ReaderError('获取内容为空') );
			}

			return rs;
		}
		, handleArticle: function(result){
			var res = result.res
				, url = result.url
				, html = res.text
				, charset = res.charset

				, urlResult = Url.parse(url)
				, source = urlResult.protocol +'//' + urlResult.host
				, $, $main
				, title, content

				, segmentResult = []
				, indexCache = {}
				, filterResult = []

				, prefix = '_'+ (+new Date())
				, index
				, j, temp, w, p

				, tagsData = TAG_CACHE || tagModel.TAG_CACHE || []
				, tagsIndex = TAG_INDEX || tagModel.TAG_INDEX || {}
				, tagsRs

				, rs = null
				;

			TAG_CACHE = tagsData;
			TAG_INDEX = tagsIndex;

			if( !charset || charset.toUpperCase() !== 'UTF-8' ){
				// todo 转码：将 GBK 转成 UTF-8
			}

			if( html ){
				$ = Cheerio.load(html, {
					decodeEntities: false
				});

				// todo 删除代码片段 script style

				title = $('title').text();

				// 读标题进行分词
				segmentResult = segment.doSegment( title );

				// todo 根据不同网站 获取不同内容
				// 获取页面主内容
				$main = $('article');
				content = $main.length ? $main.html() : $('body').html();

				// 连接分词结果
				segmentResult = segmentResult.concat( segment.doSegment(content) );

				// 统计
				j = segmentResult.length;
				while( j-- ){
					temp = segmentResult[j];
					p = temp.p;
					w = temp.w;

					/**
					 * 过滤，只统计
					 *  8       专有名词
					 *  16      外文字符
					 *  32      机构团体
					 *  64      地名
					 *  128     人名
					 *  4096    动词
					 *  1048576 名词
					 * */
					if( !(p === 8 || p === 16 || p === 32 || p === 64 || p === 128 || p === 4096 || p === 1048576) ) continue;

					// 将单个字符排除
					if( w.length < 2 ) continue;

					/**
					 * 对分出来的词加个前缀作为 key 存在 indexCache 对象中
					 *  防止分出来的词存在 toString 一类已存在于对象中的属性的关键字
					 * */
					index = prefix + w;

					if( index in indexCache ){
						filterResult[indexCache[index]].n++;
					}
					else{
						filterResult.push({
							tagName: w
							, rank: (w in tagsIndex && tagsIndex.hasOwnProperty(w) ) ? tagsData[tagsIndex[w]].num : 0
							, p: p
							, n: 1
						});

						indexCache[index] = filterResult.length - 1;
					}
				}

				// 按钮权重排序
				filterResult.sort(function(a, b){
					var rs = b.rank - a.rank;

					if( rs === 0 ){
						rs = b.n - a.n;
					}

					return rs;
				});

				tagsRs = filterResult.slice(0, 15);

				// 按分词数量排序
				tagsRs = tagsRs.concat( filterResult.slice(16).sort(function(a, b){
					return b.n - a.n;
				}).slice(0, 5) );

				//console.log('\n', tagsRs);

				rs = {
					url: url
					, title: title
					, tags: tagsRs.map(function(d){return d.tagName;}).join()
					, source: source
				};
				console.log(rs);
			}
			else{
				rs = Promise.reject( new ReaderError('获取内容失败') );
			}
			return rs;
		}
	}
	;

module.exports = Reader;