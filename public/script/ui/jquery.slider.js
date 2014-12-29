/**
 * @file
 * @author  ZwB
 * @version 0.1
 * @function    $.slider
 * @param   {object}    options
 * @param   {string|object} options.container
 * @param   {string|object} options.items
 * @param   {string}    options.mode
 * @param   {string}    options.render
 * @param   {boolean}   options.next
 * @param   {boolean}   options.prev
 * @param   {boolean}   options.controls
 * @desc
 * @example
 * */
;(function(p, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		p( require( jqPath || 'jquery') );
	}
	else if( typeof define === 'function' && define.amd ){
		define([jqPath || 'jquery'], p);
	}
	else{
		p(jQuery);
	}
})(function($){
	var slider = function(options){
		var opts = $({}, slider.defaults, options)
			, $container = opts.container
			, $items = options.items
			, animationEnd = 'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd'
			, animationStart = 'webkitAnimationStart mozAnimationStart msAnimationStart animationStart'
			, currFrame
			, l
			, temp
			;

		$container = (typeof $container === 'object' && $container.jQuery) ? $container : $($container);
		$items = (typeof $items === 'object' && $items.jQuery) ? $items : $($items);

		if( $container.length > 1 ){
			$container = $container.eq(0);
		}
		l = $items.length;
		temp = new Array(l);

		// 动画的模式 值不是 css 的都认为是使用 js
		if( opts.render === 'css' ){
			$container.on(animationStart, opts.items, function(){

			}).on(animationEnd, opts.items, function(){

			}).on({
				mouseover: function(){

				}
				, mouseout: function(){

				}
			});
		}
		else{

		}

		if( opts.controls ){
			$container.append('<ul class="slider_controls">' +
				$.map(temp, function(){
					return '<li></li>';
				}).join('') +
			'</ul>').on('click', 'li', function(e){

			});
		}
	};

	slider.defaults = {
		container: ''
		, items: ''
		, render: 'css'
		, mode: 'slider'
		, next: true
		, prev: true
		, controls: true
	};

	$.slider = slider;
}, '');