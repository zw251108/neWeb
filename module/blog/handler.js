'use strict';
///**
// * todo 前后端通用 数据控制接口
// * */
//(function(factory, global, namespace){
//	// 后端
//	if( typeof module === 'object' && module.exports ){
//		module.exports = factory;
//	}
//	// 前端 AMD 规范
//	else if( typeof define === 'function' && define.amd ){
//		define(factory);
//	}
//	// 前端全局
//	else{
//		global[namespace] = factory;
//	}
//})(function(model){
//	'use strict';
//
//	return {
//		getList: function(){
//			return model({
//				topic: 'blog/list'
//			});
//		}
//		, getArticle: function(articleId){
//			return model({
//				topic: 'blog/article'
//				, data: {
//					articleId: articleId
//				}
//			});
//		}
//	}
//}, this, 'blog');

var BlogModel   = require('./model.js')
	, BlogError = require('./error.js')

	, UserError = require('../user/error.js')
	, UserHandler   = require('../user/handler.js')

	, BlogHandler = {
		getBlogList: function(user, query){
			var execute
				, page = query.page || 1
				, size = query.size || 20
				, keyword = query.keyword
				, tags = query.tags
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = Promise.reject( new UserError('用户尚未登录') );
			}
			else{
				if( keyword ){
					execute = BlogModel.searchBlogByTitle(user.id, keyword, page, size).then(function(rs){
						return BlogModel.countSearchBlogByTitle(user.id, keyword).then(function(count){
							return {
								data: rs
								, index: page
								, size: size
								, count: count
								, urlCallback: function(index){
									return '??keyword='+ keyword +'&page='+ index;
								}
							}
						});
					});
				}
				else if( tags ){
					execute = BlogModel.filterBlogByTags(user.id, tags, page, size).then(function(rs){
						return BlogModel.countFilterBlogByTags(user.id, tags).then(function(count){
							return {
								data: rs
								, index: page
								, size: size
								, count: count
								, urlCallback: function(index){
									return '??tags='+ tags +'&page='+ index;
								}
							}
						});
					});
				}
				else{
					execute = BlogModel.getBlogByPage(user.id, page, size).then(function(rs){
						return BlogModel.countBlog( user.id ).then(function(count){
							return {
								data: rs
								, index: page
								, size: size
								, count: count
								, urlCallback: function(index){
									return '?page='+ index;
								}
							}
						});
					});
				}
			}

			return execute;
		}
		, getBlog: function(user, query){
			var execute
				, blogId = query.blogId || ''
				, isGuest = UserHandler.isGuest( user )
				;

			// todo 验证 blogId

			if( isGuest ){
				execute = Promise.reject( new UserError('用户尚未登录') );
			}
			else{
				if( blogId ){
					execute = BlogModel.getBlogById( blogId );
				}
				else{
					execute = Promise.reject( new BlogError('缺少参数 id') );
				}
			}

			return execute;
		}

		, newBlog: function(user, data){
			var title = data.title
				, execute
				;

			if( title ){
				execute = BlogModel.addBlog(user.id, title).then(function(rs){
					var result
						;

					if( rs.insertId ){
						result = {
							success: true
							, id: rs.insertId
						};
					}
					else{
						result = Promise.reject( new BlogError(title + ' 文章创建失败') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new BlogError('缺少参数 title') );
			}

			return execute;
		}
		, saveBlog: function(user, data){
			var title = data.title
				, content = data.content
				, tags = data.tags
				, blogId = data.blogId
				, execute
				;

			// 过滤 style script iframe frame 标签
			content = content.replace(/<(style|script|iframe|frameset)([^>]*)>(.*?)<\/\1>/g, '&lt;$1$2&gt;$3&lt;/$1&gt;').replace(/<frame([^>]*)\/>/g, '&lt;frame$1/&gt;');

			if( blogId ){
				execute = BlogModel.updateBlog(title, content, tags, blogId).then(function(rs){
					return {
						id: blogId
					};
				});
			}
			else{
				execute = Promise.reject( new BlogError('缺少参数 id') );
			}

			return execute;
		}
	}
	;

module.exports = BlogHandler;