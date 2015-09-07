/**
 * todo 前后端通用 数据控制接口
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
})(function(model){
	'use strict';

	return {
		getList: function(){
			return model({
				topic: 'blog/list'
			});
		}
		, getArticle: function(articleId){
			return model({
				topic: 'blog/article'
				, data: {
					articleId: articleId
				}
			});
		}
	}
}, this, 'blog');