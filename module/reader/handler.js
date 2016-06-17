'use strict';

var Url = require('url')
	, SuperAgent    = require('superagent')
	, Cheerio       = require('cheerio')
	, segment       = require('../segment/segment.js')

	, CONFIG = require('../../config.js')
	, UserHandler   = require('../user/handler.js')
	, TagHandler    = require('../tag/handler.js')
	, TAG_CACHE
	, TAG_INDEX

	, ReaderModel = require('./model.js')
	, ReaderError   = require('./error.js')
	, ReaderHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new ReaderError(msg) );
		}

		/**
		 * @param   url     String
		 * @return  Object
		 *      Promise.resolve( res )  抓取内容
		 *      Promise.reject( err )   错误信息
		 * */
		, crawler: function(url){
			console.log('正在获取 url: ' + url);

			return new Promise(function(resolve, reject){
				SuperAgent.get( url ).buffer( true ).end(function(err, res){
					if( !err ){
						resolve( res );
						console.log('获取 url: ' + url + ' 成功');
					}
					else{
						reject( err );
					}
				});
			});
		}
		/**
		 * @param   res     Object  crawler 函数抓取内容
		 * @return  Array
		 *      [{
		 *          title,
		 *          url,
		 *          content,
		 *          author,
		 *          tags,
		 *          datetime
		 *      }]
		 * */
		, handleFeed: function(res){
			var rss = res.text
				, charset = res.charset

				, $, $items
				, $temp
				, temp
				, i, j, t
				, result = []
				;

			if( rss ){
				$ = Cheerio.load(rss, {
					xmlMode: true
				});

				$items = $('item,entry');

				for(i = 0, j = $items.length; i < j; i++){
					temp = {};
					$temp = $items.eq(i);

					// 获取文字标题
					temp.title = $temp.find('title').text();

					// 获取文章 url
					t = $temp.find('link');
					temp.url = t.text() || t.attr('href');
					!temp.url && (temp.url = $temp.find('id').text());

					// 获取文章内容
					temp.content = $temp.find('description').text();
					!temp.content && (temp.content = $temp.find('summary').text());

					// 获取文章作者
					temp.author = $temp.find('author').text();
					!temp.author && (temp.author = $temp.find('dc\\:creator').text());

					// 获取文章标签
					temp.tags = $temp.find('cateory,category').map(function(){
						var t = $(this);
						return t.text() || t.attr('term');
					}).get().join();

					// 获取文章发布时间
					temp.datetime = $temp.find('pubDate,published').text();

					result.push( temp );
				}
			}
			else{
				result = ReaderHandler.getError('获取内容为空');
			}

			return result;
		}
		/**
		 * @param   res     Object  crawler 函数抓取内容
		 * @return  Object
		 *      {
		 *          title,
		 *          tags
		 *      }
		 * */
		, handleArticle: function(res){
			var html = res.text
				, charset = res.charset

				, $, $main
				, title, content

				, segmentResult = []
				, indexCache = {}
				, filterResult = []

				, prefix = '_'+ (+new Date())
				, index
				, temp
				, j
				, w, p

				, tagsData = TAG_CACHE || TagHandler.TAG_CACHE || []
				, tagsIndex = TAG_INDEX || TagHandler.TAG_INDEX || {}
				, tagsRs

				, result
				;

			TAG_CACHE = tagsData;
			TAG_INDEX = tagsIndex;

			if( html ){
				if( !charset || charset.toUpperCase() !== 'UTF-8' ){
					// todo 转码：将 GBK 转成 UTF-8
				}

				$ = Cheerio.load(html, {
					decodeEntities: false
				});

				// todo 删除代码片段 script style
				//$('script,style').remove();

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
							, rank: ( w in tagsIndex && tagsIndex.hasOwnProperty(w) ) ? tagsData[tagsIndex[w]].num : 0
							, p: p
							, n: 1
						});

						indexCache[index] = filterResult.length - 1;
					}
				}

				/**
				 * 过滤标签数据
				 * 按数量权重排序
				 * */
				tagsRs = filterResult.filter(function(d){
					return d.rank;
				}).sort(function(a, b){
					var rs = b.n - a.n;

					if( rs === 0 ){
						rs = b.rank - a.rank;
					}

					return rs;
				});

				console.log('分词结果：\n', tagsRs);

				result = {
					title: title
					, tags: tagsRs.map(function(d){return d.tagName;}).join()
				};
			}
			else{
				result = Promise.reject( new ReaderError('获取内容失败') );
			}

			return result;
		}

		, getReaderList: function(user, query){
			var execute
				, page      = query.page || 1
				, size      = query.size || CONFIG.params.PAGE_SIZE
				, keyword   = query.keyword || ''
				, tags      = query.tags || ''
				, urlCallback
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = ReaderHandler.getError('用户尚未登录');
			}
			else{
				if( keyword ){
					execute = ReaderModel.searchReaderByName(keyword, page, size);
					urlCallback = function(index){
						return '?keyword='+ keyword +'&page='+ index;
					};
				}
				else if( tags ){
					execute = ReaderModel.filterReaderByTag(tags, page, size);
					urlCallback = function(index){
						return '?tags='+ tags +'&page='+ index;
					};
				}
				else{
					execute = ReaderModel.getReaderByPage(page, size);
					urlCallback = function(index){
						return '?page='+ index;
					};
				}

				execute = execute.then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = rs;
					}
					else{
						result = Promise.reject({
							data: rs
							, index: page
							, size: size
							, count: 0
							, urlCallback: urlCallback
						});
					}

					return result;
				}).then(function(rs){
					var result
						;

					if( keyword ){
						result = ReaderModel.countSearchReaderByName(keyword, page, size);
					}
					else if( tags ){
						result = ReaderModel.countFilterReaderByTag(tags, page, size);
					}
					else{
						result = ReaderModel.countReader(page, size);
					}

					return result.then(function(count){
						return {
							data: rs
							, index: page
							, size: size
							, count: count
							, urlCallback: urlCallback
						};
					});
				}, function(rs){
					return rs;
				});
			}

			return execute;
		}

		, getBookmarkList: function(user, query){
			var execute
				, page      = query.page || 1
				, size      = query.size || CONFIG.params.PAGE_SIZE
				, keyword   = query.keyword || ''
				, tags      = query.tags || ''
				, url       = query.url || ''
				, status    = query.status || 0
				, urlCallback
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = ReaderHandler.getError('用户尚未登录');
			}
			else{
				if( keyword ){
					execute = ReaderModel.searchBookmarkByTitle(user.id, keyword, status, page, size);
					urlCallback = function(index){
						return '?keyword='+ keyword +'&page='+ index;
					};
				}
				else if( tags ){
					execute = ReaderModel.filterBookmarkByTags(user.id, tags, status, page, size);
					urlCallback = function(index){
						return '?tags='+ tags +'&page='+ index;
					};
				}
				else if( url ){
					execute = ReaderModel.searchBookmarkByUrl(user.id, url, status, page, size);
					urlCallback = function(index){
						return '?url='+ url +'&page='+ index;
					};
				}
				else{
					execute = ReaderModel.getBookmarkByPage(user.id, status, page, size);
					urlCallback = function(index){
						return '?page='+ index;
					};
				}

				execute = execute.then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = rs;
					}
					else{
						result = Promise.reject({
							data: rs
							, index: page
							, size: size
							, count: 0
							, urlCallback: urlCallback
						});
					}

					return result;
				}).then(function(rs){
					var result
						;

					if( keyword ){
						result = ReaderModel.countSearchBookmarkByTitle(user.id, keyword, status);
					}
					else if( tags ){
						result = ReaderModel.countFilterBookmarkByTags(user.id, tags, status);
					}
					else if( url ){
						result = ReaderModel.countSearchBookmarkByUrl(user.id, url, status);
					}
					else{
						result = ReaderModel.countBookmark(user.id, status);
					}

					return result.then(function(count){
						return {
							data: rs
							, index: page
							, size: size
							, count: count
							, urlCallback: urlCallback
						};
					});
				}, function(rs){
					return rs;
				});
			}

			return execute;
		}

		/**
		 * @param   userId  String|Number   用户 Id
		 * @param   url     String          bookmark 的 url
		 * @return Object
		 *      Promise.resolve( Object )   该条数据
		 *      Promise.resolve( false )    该条
		 *      Promise.reject( false )     该条 url 不存在于 reader_bookmark 表中
		 * */
		, isExistUserBookmark: function(userId, url){
			return ReaderModel.isExistBookmark(url, true).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = ReaderModel.isExistUserBookmark(rs[0].id, userId, true).then(function(rs){
						var	result
							;

						if( rs && rs.length ){
							result = Promise.resolve( rs[0] );
						}
						else{
							result = Promise.resolve( false );
						}

						return result;
					});
				}
				else{
					result = Promise.reject( false );
				}

				return result;
			});
		}

		, newUserBookmark: function(user, data){
			var execute
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				execute = ReaderModel.addUserBookmark( data ).then(function(rs){
					var result
						;

					if( rs && rs.insertId ){

					}
					else{
						result = ReaderHandler.getError('')
					}
				});
			}

			return execute;
		}
		, newBookmark: function(user, data){
			var execute
				, url = data.url
				, tempId = data.tempId
				, title
				, tags
				, isGuest = UserHandler.isGuest( user )
				, source
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				// todo 验证 url
				if( url ){
					execute = ReaderHandler.isExistBookmark(user.id, url).then(function(info){  // 存在数据
						if( !info ){    // 用户已

						}
						else{   // 用户未添加该 url 添加到 user_reader_bookmark 表中
							source = Url.parse( url );
							source = source.protocol +'//'+ source.host;


						}
					}, function(isExist){   // reader_bookmark 表中不存在该 url
						var result
							;

						if( tempId ){   // 已有相关数据 添加到 reader_bookmark 表中
							result = Promise.resolve()
						}
						else{   // 没有相关数据 抓取 整理数据
							result = ReaderHandler.crawler( url ).then( ReaderHandler.handleArticle ).then(function(data){

							});
						}
					});
				}
				else{
					execute = Promise.reject( new ReaderError('缺少参数') );
				}
			}

			return execute;
		}

		, getBookmarkReadPerDay: function(user){
			return ReaderModel.statisticReadMarkByDate( user.id );
		}
	}
	;

module.exports = ReaderHandler;