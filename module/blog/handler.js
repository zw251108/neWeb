/**
 *
 * */
(function(factory, global, namespace){
	// 后端
	if( typeof module === 'object' && module.exports ){
		module.exports = factory;
	}
	// 前端 AMD 规范
	else if( typeof define === 'function' && define.amd ){
		define(factory);
	}
	// 前端全局
	else{
		global[namespace] = factory;
	}
})(function(data){
	'use strict';

	var Blog = function(data){
		return {
			getList: function(){
				return data({
					topic: 'blog/list'
				});
				//return data.namespace('blog.list')();
			}
			, getArticle: function(articleId){
				return data({
					topic: 'blog/article'
					, data: {
						articleId: articleId
					}
				});
				//return data.namespace('blog.article')(articleId);
			}
		}
	};


	return Blog;

}, this, 'blog');