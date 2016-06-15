'use strict';

var CONFIG = require('../../config.js')
	, UserHandler   = require('../user/handler.js')

	, BlogModel = require('./model.js')
	, BlogError = require('./error.js')
	, BlogHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new BlogError(msg) );
		}

		/**
		 * 过滤特殊标签
		 *  过滤 style script iframe frame 标签
		 * */
		, filterSpecialHTMLTag: function(content){
			return content.replace(/<(style|script|iframe|frameset)([^>]*)>(.*?)<\/\1>/g, '&lt;$1$2&gt;$3&lt;/$1&gt;').replace(/<frame([^>]*)\/>/g, '&lt;frame$1/&gt;');
		}

		, getBlogList: function(user, query){
			var execute
				, page      = query.page || 1
				, size      = query.size || CONFIG.params.PAGE_SIZE
				, keyword   = query.keyword
				, tags      = query.tags
				, urlCallback
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( keyword ){
					execute = BlogModel.searchBlogByTitle(user.id, keyword, page, size);
					urlCallback = function(index){
						return '?keyword='+ keyword +'&page='+ index;
					};
				}
				else if( tags ){
					execute = BlogModel.filterBlogByTags(user.id, tags, page, size);
					urlCallback = function(index){
						return '?tags='+ tags +'&page='+ index;
					};
				}
				else{
					execute = BlogModel.getBlogByPage(user.id, page, size);
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
						result = BlogModel.countSearchBlogByTitle(user.id, keyword);
					}
					else if( tags ){
						result = BlogModel.countFilterBlogByTags(user.id, tags);
					}
					else{
						result = BlogModel.countBlog( user.id );
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
		, getBlog: function(user, query){
			var execute
				, blogId = query.blogId || ''
				, isGuest = UserHandler.isGuest( user )
				;

			// todo 验证 blogId

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( blogId ){
					execute = BlogModel.getBlogById( blogId );
				}
				else{
					execute = BlogHandler.getError('缺少参数 id');
				}
			}

			return execute;
		}

		, newBlog: function(user, data){
			var execute
				, title = data.title
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( title ){
					execute = BlogModel.addBlog(user.id, title).then(function(rs){
						var result
							;

						if( rs.insertId ){
							result = {
								id: rs.insertId
							};
						}
						else{
							result = BlogHandler.getError(title + ' 文章创建失败');
						}

						return result;
					});
				}
				else{
					execute = BlogHandler.getError('缺少参数 title');
				}
			}

			return execute;
		}
		, saveBlog: function(user, data){
			var execute
				, title     = data.title
				, content   = data.content
				, tags      = data.tags
				, blogId    = data.blogId
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( blogId ){
					content = BlogHandler.filterSpecialHTMLTag( content );

					execute = BlogModel.updateBlog(title, content, tags, blogId).then(function(rs){
						var result
							;

						if( rs && rs.changedRows ){
							result = {
								id: blogId
							};
						}
						else{
							result = BlogHandler.getError('数据保存失败');
						}

						return result;
					});
				}
				else{
					execute = BlogHandler.getError('缺少参数 id');
				}
			}

			return execute;
		}
	}
	;

module.exports = BlogHandler;