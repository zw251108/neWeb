/**
 * @fileOverview    流式布局
 * @author  ZwB
 * @version 1.0
 * @function    $.layout
 * @param   {object}    options
 * @param   {string|object} options.container   目标容器 jQuery 选择器 | jQuery 对象
 * @param   {string|object} options.items       目标元素 jQuery 选择器 | jQuery 对象
 * @param   {number}        options.top         容器内的上边距
 * @param   {number}        options.bottom      容器内的下边距
 * @param   {number}        options.left        容器内的左边距
 * @param   {number}        options.right       容器内的右边距
 * @param   {number}        options.colSpace    元素之间的列间距
 * @param   {number}        options.rowSpace    元素之间的行间距
 * @return  {object}(jQuery)    参数 container 所对应的 jQuery 对象
 * @description
 * @example
    var $container = $.layout({
        container: '#container'
        , items: '#container .items'
        , colSpace: 10
        , rowSpace: 10
    });
 */
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
		sortFunc: function(a, b){
			return a.y - b.y;
		}
	};

	$.layout = function(options){
		var opts = $.extend({}, $.layout.defaults, options)
			, $container = opts.container
			, $items = opts.items
			, rowSpace = opts.rowSpace
			, colSpace = opts.colSpace
			, left = opts.left
			, top = opts.top
			, width
			, i = 0
			, j
			, height = 0

			, sortFunc = methods.sortFunc
			, inArray = $.inArray
			, loopLines = function(ls, $item){
				var sortLines = ls.slice().sort(sortFunc)
					, line
					, index
					, lExtend, lWidth, lIndex
					, rExtend, rWidth, rIndex
					, tempWidth = $item.outerWidth() + rowSpace
					, tempHeight = $item.outerHeight() + colSpace
					, rs
					, i = 0, j = ls.length
					, m, n, t
					;
				for(; i < j; i++){
					line = sortLines[i];

					if( line.h && line.h < tempHeight ){    // 已为封闭区域 并且高度小于 $item 高度
						continue;
					}
					index = inArray(line, ls);

					for(lIndex = index - 1, lExtend = null; lIndex > -1; lIndex--){    // 向左扩展
						t = ls[lIndex];

						if( t.y > line.y ){
							break;
						}
						else{
							if( t.h && (t.y + t.h <= line.y || t.y + t.h - line.y < tempHeight) ){
							}
							else{
								lExtend = t;
							}
						}
					}

					lWidth = lExtend ? line.x - lExtend.x : 0;

					if( line.w + lWidth >= tempWidth ){ // line 线的宽度大于 $item 宽度

						$item.css({
							position: 'absolute'
							, left: (lExtend ? lExtend.x : line.x) + 'px'
							, top: line.y + 'px'
						});

						if( height < line.y + tempHeight ){ // 收集容器高度
							height = line.y + tempHeight;
						}

						if( lExtend ){  // 左边可扩展

							for(m = lIndex +1, n = index; m < n; m++){  // 封闭左边区域

								t = lines[m];
								if( !t.h || (t.y + t.h > line.y) ){ // 非闭合区域
									t.h = line.y - t.y;
								}
							}
						}

						if( line.w + lWidth === tempWidth ){
							line.y += tempHeight;

							if( line.h ){
								line.h -= tempHeight;
							}

							if( lExtend ){
								line.x = lExtend.x;
								line.w += line.x - lExtend.x;
							}
						}
						else{
							if( lExtend ){
								ls.splice(index, 1, {
									x: lExtend.x
									, y: line.y + tempHeight
									, w: tempWidth
									, h: line.h ? line.h - tempHeight : null
								}, {
									x: lExtend.x + tempWidth
									, y: line.y
									, w: line.w - tempWidth + (lExtend ? line.x - lExtend.x : 0)
									, h: line.h || null
								});
							}
							else{
								ls.splice(index, 1, {
									x: line.x
									, y: line.y + tempHeight
									, w: tempWidth
								}, {
									x: line.x + tempWidth
									, y: line.y
									, w: line.w - tempWidth
								});
							}
						}
						rs = true;
					}
					else{
						for(rIndex = index +1, rExtend = null; rIndex < j; rIndex++){ // 向右扩展
							t = ls[rIndex];

							if( t.y <= line.y ){
								if( !t.h ){

									rWidth = t.x + t.w - line.x - line.w;
									if( lWidth + line.w + rWidth >= tempWidth ){
										rExtend = t;
										break;
									}
								}
							}
							else{
								break;
							}
						}

						if( rExtend ){  // 右边可扩展

							$item.css({
								position: 'absolute'
								, left: (lExtend ? lExtend.x : line.x) + 'px'
								, top: line.y + 'px'
							});

							if( height < line.y + tempHeight ){
								height = line.y + tempHeight;
							}

							for(m = index +1, n = rIndex-1; m < n && m < j; m++){ // 封闭右边区域

								t = lines[m];
								if( !t.h ){ // 非闭合区域
									t.h = line.y - t.y;
								}
							}

							if( line.w + lWidth + rWidth === tempWidth ){

								line.y += tempHeight;
							}
							else{
								ls.splice(index, 1, {
									x: lExtend ? lExtend.x : line.x
									, y: line.y + tempHeight
									, w: tempWidth
								});

								ls.splice(rIndex, 1, {
									x: rExtend.x
									, y: rExtend.y
									, w: (lExtend ? lExtend.x : line.x) + tempWidth - rExtend.x
									, h: line.y - rExtend.y
								}, {
									x: (lExtend ? lExtend.x : line.x) + tempWidth
									, y: rExtend.y
									, w:  rExtend.x + rExtend.w - (lExtend ? lExtend.x : line.x) - tempWidth
								});
							}

							if( lExtend ){
								line.w += line.x - lExtend.x;

								for(m = lIndex +1, n = index; m < n; m++){  // 封闭左边区域

									t = lines[m];
									if( !t.h ){ // 非闭合区域
										t.h = line.y - t.y;
									}
								}
							}

							rs = true;
						}
					}

					if( rs ) break;
				}
			}

			, lines
			, $item
			;
		$container = (typeof $container === 'object' && $container.jQuery)? $container : $( $container );
		$items = (typeof $items === 'object' && $items.jQuery)? $items : $( $items );

		// 可用区域
		width = $container.css('position', 'relative').width() - left - opts.right;
		lines = [{
			x: left
			, y: top
			, w: width
		}];

		j = $items.length;
		for(; i < j; i++){
			$item = $items.eq(i);
			loopLines(lines, $item);
		}

		$container.height( height + opts.bottom );
	};
	$.layout.defaults = {
		container: 'body'
		, items: ''
		, left: 0
		, right: 0
		, bottom: 0
		, top: 0
		, colSpace: 0
		, rowSpace: 0
//		, animate: false
//		, placehold: ''
	};
}, '');