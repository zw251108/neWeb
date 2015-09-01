'use strict';

(function(factory, global, namespace){
	// 后端
	if( typeof exports === 'object' && typeof module === 'object' ){
		module.exports = factory;
	}
	// 前端 AMD 规范
	else if( typeof define === 'function' && define.amd ){
		define(factory);
	}
	else{
		global[namespace] = factory;
	}
})(function(data){
	'use strict';


	return {
		getList: function(){
			return data.namespace('blog.list')()
		}
		, getArticle: function(){

		}
	}

}, this, 'blog');