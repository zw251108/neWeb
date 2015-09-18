//'use strict';
//
//var error       = require('./error.js')
//	, tpl       = require('./emmetTpl/tpl.js')
//	, emmetTpl  = require('./emmetTpl/emmetTpl.js')
//
//	, pageFirst
//	, pageLast
//	, pageCurrent
//	, pagePrev
//	, pageNext
//
//	, pagination = emmetTpl({
//		template: ''
//		, filter: {
//
//		}
//	})
//
//	/**
//	 * @namespace   Pagination
//	 * */
//	, Pagination = {
//
//		/**
//		 * @namespace   Model
//		 * @memberof    Pagination
//		 * @desc    业务相关 sql 语句集合
//		 * */
//		Model: {}
//
//		/**
//		 * @namespace   Handler
//		 * @memberof    Pagination
//		 * @desc    数据处理方法集合
//		 * */
//		, Handler: {}
//
//		/**
//		 * @namespace   View
//		 * @memberof    Pagination
//		 * @desc    视图模板集合
//		 * */
//		, View: {}
//
//		/**
//		 * @method  setPage
//		 * @memberof    Pagination
//		 * @param   {number}    count       分页数据总条数
//		 * @param   {number=}   page        当前页码
//		 * @param   {number=}   pageSize    每页数据条数
//		 * */
//		, setPage: function(count, page, pageSize){
//			var lPart
//				, rPart
//				, current
//				, pageShow = 10
//
//				, pageN = Math.ceil(count / pageSize)
//
//				, isOdd = pageShow & 1 === 1
//				;
//
//			lPart = Math.floor( pageShow/2 );
//			rPart = isOdd ? lPart : lPart +1;
//
//			if( page === 1 ){   // 当前页码为 1 时
//
//			}
//			else if( page === pageNum ){    // 当前页码为 最大页码
//
//			}
//			else if( page - lPart < 1 ){    // 当前页码在 1-lPart 之间
//
//			}
//			else if( page + rPart > pageNum ){  // 当前页码在 rPart-pageNum
//
//			}
//
//			//lPart = Math.floor( isOdd ? (pageShow-1)/2 : (pageShow/2)-1 );
//			//rPart = Math.floor( isOdd ? pageShow /2 );
//
//			page = page || 1;
//			pageSize = pageSize || 20;
//		}
//		, defaults: {
//
//		}
//	}
//	;
//
//module.exports = Pagination;

var pageFirst = '<a href="%href%?%param%=1" class="page page-first">%page%</a>'
	, pageLast = '<a href="%href%?%param%=%pageSize%" class="page page-last">%page%</a>'

	, pagePrev = '<a href="%href%?%param%=%pagePrev%" class="page page-prev">%page%</a>'
	, pageNext = '<a href="%href%?%param%=%pageNext%" class="page page-next">%page%</a>'

	, page = '<a href="%href%?%param%=%page%" class="page">%page%</a>'
	, pageCurrent = '<a href="%href%?%param%=%pageCurrent%" class="page page-current">%page%</a>'
	, point = '<b>...</b>'
	, count = '<span>共 %pageSize% 页</span>'
	, form = '<form action="%href%"><label><input type="number" name="%param%"/></label><button type="submit">%btnText%</button></form>'

/**
 *
 * */
//;(function(factory, namespace){
//	// 后端
//	if( typeof exports === 'object' && typeof module === 'object' ){
//		module.exports = factory;
//	}
//	// 前端
//	else if( typeof define === 'function' && define.amd ){
//		define(factory);
//	}
//	else{
//		(jQuery || this)[namespace] = factory;
//	}
//})(function($, options){
//	'use strict';
//
//	var extend = $.extend || function(){}
//});

var PAGE_SHOW_NUM = 10;
var pagination = function(index, size, count, urlCallback){
	var pageNum
		, left = Math.ceil( PAGE_SHOW_NUM /2 -1 )
		, right
		, html = []
		, i = 0, t
		;

	size = +size || 20;
	index = +index || 1;
	count = +count || 1;

	pageNum = Math.ceil( count / size );

	index = index < 1 ? 1 : index;
	index = index > pageNum ? pageNum : index;

	left = index > left ? (index - left + PAGE_SHOW_NUM > pageNum ? (pageNum - PAGE_SHOW_NUM +1 <= 0 ? 1 : pageNum - PAGE_SHOW_NUM +1) : index - left) : 1;
	right = left + PAGE_SHOW_NUM -1 > pageNum ? pageNum : left + PAGE_SHOW_NUM -1;

	//html.push('<a href="'+ urlCallback(1) +'" class="page page-first" title="第 1 页">1</a>');

	html.push( index === 1 ? '<a href="'+ urlCallback(1) +'" data-page="'+ index +'" title="上一页" class="page page-prev">上一页</a>' : '<a href="'+ urlCallback(index -1) +'" data-page="'+ (index-1) +'" title="上一页" class="page page-prev">上一页</a>' );
	html.push( left === 1 ? '' : '<a href="'+ urlCallback(1) +'" data-page="'+ index +'" title="第 1 页" class="page page-first">1</a>' );
	html.push( left > 2 ? '<b>...</b>' : '' );

	for(; left < index; left++, i++){
		html.push('<a href="'+ urlCallback(left) +'" data-page="'+ index +'" title="第 '+ left +' 页" class="page">'+ left +'</a>');
	}

	html.push('<a href="'+ urlCallback(index) +'" data-page="'+ index +'" title="第 '+ index +' 页" class="page page-current">'+ index +'</a>');
	i++;

	for( left = index +1 ; left <= pageNum && i !== PAGE_SHOW_NUM; i++, left++){
		html.push( '<a href="'+ urlCallback(left) +'" data-page="'+ index +'" title="第 '+ left +' 页" class="page">'+ left +'</a>' );
	}

	html.push( pageNum - right >= 2 ? '<b>...</b>' : '' );
	html.push( right === pageNum ? '' : '<a href="'+ urlCallback(pageNum) +'" data-page="'+ index +'" title="第 '+ pageNum +' 页" class="page page-last">'+ pageNum +'</a>' );
	html.push( index === pageNum ? '<a href="'+ urlCallback(pageNum) +'" data-page="'+ index +'" title="下一页" class="page page-next">下一页</a>' : '<a href="'+ urlCallback(index+1) +'" data-page="'+ (index+1) +'" title="下一页" class="page page-next">下一页</a>' );

	//html.push('<label>共'+ pageNum +'页 到第<input type="text" id="jumpPage">页<a class="list_num_btn" href="#">确定</a></label>');

	//last.show && html.push('<a href="javascript:;" class="page page-last "'+ last.extendClass +'" title="'+ last.text +'">'+ last.text +'</a>');
	return html.join('');
};

module.exports = pagination;