/**
 * @file    基于 jQuery 的分页插件
 * @author  ZwB
 * @version 0.9
 * @method  $.pagination
 * @param   {object}    options
 * @param   {string|object} options.container   jQuery 选择器|jQuery 对象
 * @param   {number}    options.count   数据总条数
 * @param   {number}    options.pageIndex   当前显示的页面码 默认为 1
 * @param   {number}    options.pageSize    每页显示条数 默认为 20
 * @param   {number}    options.pageShow    显示页码的数量
 * @param   {string}    options.paramName   页码的参数名 默认为 'page'
 * @param   {function|string}   options.action  点击页码时的操作 为函数或字符串 字符串视作链接 添加 ?paramName=pageIndex 跳转
 * @param   {object}    options.styleConfig 样式配置
 * @param   {object}    options.styleConfig.first   首页 样式配置
 * @param   {string}    options.styleConfig.first.show  首页 是否显示 设置为 false 时才不显示
 * @param   {string}    options.styleConfig.first.text  首页 设置文本
 * @param   {string}    options.styleConfig.first.extendClass   首页 样式的扩展 class 名
 * @param   {object}    options.styleConfig.last    末页 样式配置
 * @param   {string}    options.styleConfig.last.show   末页 是否显示 设置为 false 时才不显示
 * @param   {string}    options.styleConfig.last.text   末页 设置文本
 * @param   {string}    options.styleConfig.last.extendClass    末页 样式的扩展 class 名
 * @param   {object}    options.styleConfig.prev    上一页 样式配置
 * @param   {string}    options.styleConfig.prev.show   上一页 是否显示 设置为 false 时才不显示
 * @param   {string}    options.styleConfig.prev.text   上一页 设置文本
 * @param   {string}    options.styleConfig.prev.extendClass    上一页 样式的扩展 class 名
 * @param   {object}    options.styleConfig.next    下一页 样式配置
 * @param   {string}    options.styleConfig.next.show   下一页 是否显示 设置为 false 时才不显示
 * @param   {string}    options.styleConfig.next.text   下一页 设置文本
 * @param   {string}    options.styleConfig.next.extendClass    下一页 样式的扩展 class 名
  * @param   {object}    options.styleConfig.current 当前页码 样式配置
 * @param   {string}    options.styleConfig.current.text    当前页码 设置文本
 * @param   {string}    options.styleConfig.current.extendClass 当前页码 样式的扩展 class 名
 * @param   {object}    options.styleConfig.page    数字页码 样式配置
 * @param   {function}  options.styleConfig.page.pageText    数字页码 设置文本 函数传入参数为 pageIndex
 * @param   {string}    options.styleConfig.page.extendClass    数字页码 样式的扩展 class 名
 * @param   {object}    options.styleConfig.form    页面跳转表单
 * @return  {object(jQuery)}    参数 container 所对应的 jQuery 对象
 * @require jquery
 * @desc
 *  页码的 class 为 page 为 a 标签
 *  首页的 class 为 page-first
 *  末页的 class 为 page-last
 *  上一页的 class 为 page-prev
 *  下一页的 class 为 page-next
 *  当前页码 class 为 page-current
 * @example
	var $pagination = $.pagination({
	    container: '#pagination'
	    , count: 100
	    , pageIndex: 2
	    , action: function(page, size){
	    }
	});
 * */
;(function(factory, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		factory( require( jqPath || 'jquery' ) );
	}
	else if( typeof define === 'function' && define.amd ){
		define([ jqPath || 'jquery' ], factory);
	}
	else{
		factory();
	}
})(function($){
	'use strict';

	$ = $ || jQuery;

	var methods = {
			page: function(index){
				this.triggerHandler('')
			}
		}
		, setPageEvent = function(e, index, size, count){
			var opts = e.data
				, $container = opts.container
				, pageShow = opts.pageShow
				, pageNum
				// 显示页码 最左边的值
				, left = Math.ceil( pageShow / 2 - 1 )
				// 显示页码 最右边的值
				, right
				, html = []
				, i = 0, t
				, styleConfig = opts.styleConfig
				, first = styleConfig.first || {}
				, last = styleConfig.last || {}
				, prev = styleConfig.prev || {}
				, next = styleConfig.next || {}
				, current = styleConfig.current || {}
				, page = styleConfig.page || {}
				, form = styleConfig.form || {}
				;

			count = count ? count : opts.count;
			size = size ? size : opts.pageSize;
			pageNum = Math.ceil( count / size );

			index = index < 1 ? 1 : index;
			index = index > pageNum ? pageNum : index;

			opts.pageNum = pageNum;
			opts.count = count;
			opts.pageIndex = index;
			opts.pageSize = size;

			left = index > left ? (index - left + pageShow > pageNum ? (pageNum-pageShow+1<=0 ? 1 : pageNum-pageShow+1) : index-left) : 1;
			right = left+pageShow-1>pageNum ? pageNum : left+pageShow-1;



            html.push( index===1 ? '<a class="page page-prev" href="javascript:;">上一页</a>' : '<a href="javascript:;" title="上一页" class="page page-prev">上一页</a>' );
            html.push( left===1 ? '' : '<a class="page" href="'+'1" title="第1页">1</a>' );
			html.push( left>2 ? '<b>...</b>' : '' );

            t = page.extendClass || '';
            for(; left<index; left++, i++){
				html.push('<a class="page '+ t +'" href="javascript:;" title="第'+ left +'页">'+ left +'</a>');
            }

            html.push('<a class="page page-current '+ (opts.styleConfig.current.extendClass || '') +'" href="javascript:;" title="第'+ index +'页">'+ index +'</a>');
            i++;

            for(left=index+1 ; left<=pageNum && i!==pageShow; i++, left++){
				html.push( '<a class="page '+ t +'" href="javascript:;" title="第'+ left +'页">'+ left +'</a>' );
            }

            html.push( pageNum-right>=2 ? '<b>...</b>' : '' );
            html.push( right===pageNum ? '' : '<a class="page" href="javascript:;" title="第'+pageNum+'页">'+pageNum+'</a>' );
            html.push( index===pageNum ? '<a class="page page-next" title="下一页" href="javascript:;">下一页</a>' : '<a title="下一页" href="javascript:;" class="page page-next">下一页</a>' );

			html.push('共'+ pageNum +'页 到第<input type="text" id="jumpPage">页<a class="list_num_btn" href="#">确定</a>');

			$container.html( html.join('') );
		}
		, getPageEvent = function(e, index){
			var opts = e.data
				, $container = opts.container
				, pageIndex
				;

			if( /current/.test(this.className) ){
				return;
			}
			else if( /first/.test(this.className) ){
				pageIndex = 1;
			}
			else if( /last/.test(this.className) ){
				pageIndex = opts.pageNum;
			}
			else if( /prev/.test(this.className) ){
				pageIndex = opts.pageIndex-1;
			}
			else if( /next/.test(this.className) ){
				pageIndex = opts.pageIndex+1;
			}
			else{
				pageIndex = this.innerHTML;
			}

			if( pageIndex > opts.pageNum || pageIndex < 1 || pageIndex === opts.pageIndex ) return;

			pageIndex = Number( pageIndex );
			if( opts.action ){
				if( typeof opts.action === 'function' ){
					opts.action(pageIndex , opts.pageSize );
				}
				else{
					location.href = opts.action + pageIndex;
				}
			}

			$container.triggerHandler('setPage', [pageIndex]);
		}
		;


	$.pagination = function( options ){
		var opts = $.extend({}, $.pagination.defaults, options)
			, $container = opts.container
			;

		$container = (typeof $container === 'object' && $container.jquery) ? $container : $( $container );

		opts.pageNum = Math.ceil( opts.count / opts.pageSize );
		opts.container = $container;

		$container.on('setPage', opts, setPageEvent).on('click', 'a', opts, getPageEvent);

		$.extend($container, methods);

		$container.triggerHandler('setPage', [1]);

		return $container;
	};

	$.pagination.defaults = {
		container: ''
		, action: null
		, count: 0
		, pageSize: 1
		, pageIndex: 1
		, pageNum: 0
		, pageShow: 10
		, error: null
		, styleConfig: {
			first: {

			}
			, last: {

			}
			, prev: {

			}
			, next: {}
			, page: {}
			, current: {}
			, form: {}
			, point: {}
		}
	};
}, '');