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
;(function(factory, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		factory( require( jqPath || 'jquery') );
	}
	else if( typeof define === 'function' && define.amd ){
		define([jqPath || 'jquery'], factory);
	}
	else{
		factory(jQuery);
	}
})(function($){
	var Slider = function(options){
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

	Slider.defaults = {
		container: ''
		, items: ''
		, render: 'css'
		, mode: 'slider'
		, next: true
		, prev: true
		, controls: true
	};

	$.slider = Slider;
}, '');


/**
 * @file
 * @author  ZwB
 * @version 0.1
 * @function    $.slider
 * @param   {object}    options
 * @param   {string|object} options.container
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
	$.slider = function(options){
		var opts = $.extend({}, $.slider.defaults, options)
			, $container = opts.container
			;

		$container = (typeof $container === 'object' && $container.jQuery) ? $container : $($container);

		$container.each(function(){
			animate(this, opts);
		});
	};

	var animate = function(container, opts){
		var $container = $(container)
			, $items
			, currId
			, $currFrame
			, l
			, sliderInterval
			, animating = false
			, run = function(i){
				$currFrame = $items.eq(currId);
				$container.find('.slider_controls li:eq('+ currId +')').removeClass('slider_on');

				currId = i || (++currId) % l;
				var $t = $items.eq( currId );

				animating = true;
				$currFrame.css('left', 0).animate({
					left: '-100%'
				}, 1000);
				$t.css('left', '100%').animate({
					left: '0'
				}, 1000, function(){
					animating = false;
				});
				$container.find('.slider_controls li:eq('+ currId +')').addClass('slider_on');
			}
			, startX
		//, startY
			;

		$items = $container.find('.slider_frame');
		l = $items.length;

		if( opts.next ){
			$container.append('<a class="slider_next" href="#"></a>').on('click', '.slider_next', function(e){
				e.preventDefault();
				if( animating ) return;
				run();
				clearInterval( sliderInterval );
				sliderInterval = setInterval(run, 3000);
			});
		}
		if( opts.prev ){
			$container.append('<a class="slider_prev" href="#"></a>').on('click', '.slider_prev', function(e){
				e.preventDefault();
				if( animating ) return;

				$currFrame = $items.eq(currId);
				$container.find('.slider_controls li:eq('+ currId +')').removeClass('slider_on');

				currId = (--currId) % l;
				var $t = $items.eq( currId );

				$currFrame.css('left', 0).animate({
					left: '100%'
				}, 1000);
				$t.css('left', '-100%').animate({
					left: 0
				}, 1000);
				$container.find('.slider_controls li:eq('+ currId +')').addClass('slider_on');

				clearInterval( sliderInterval );
				sliderInterval = setInterval(run, 3000);
			});
		}
		if( opts.controls ){
			var temp = new Array(l);

			$container.append('<ul class="slider_controls">' +
			$.map(temp, function(d, i){
				return '<li>'+ (i +1) +'</li>';
			}).join('') +
			'</ul>').on('click', 'li', function(e){
				if( animating ) return;

				clearInterval( sliderInterval );

				run( $(this).index() );

				sliderInterval = setInterval(run, 3000);
			});
		}

		if( opts.touch ){
			$container.on({
				touchstart: function(e){
					e.preventDefault();
					if( !e.originalEvent.touches.length ) return;

					var touch = e.originalEvent.touches[0];

					startX = touch.pageX;
					//startY = touch.pageY;
				}
				, touchend: function(e){
					e.preventDefault();

					if( animating ) return;

					if( !e.originalEvent.changedTouches.length ) return;

					var touch = e.originalEvent.changedTouches[0]
						, moveX = touch.pageX - startX
					//, moveY = touch.pageY - startY
						, tX
					//, tY
						;

					tX = moveX >= 0 ? moveX : -moveX;
					//tY = moveY >= 0 ? moveY : -moveY;

					if( tX >5 ){
						if( moveX > 0 ){    // 向右滑动

							$currFrame = $items.eq(currId);
							$container.find('.slider_controls li:eq('+ currId +')').removeClass('slider_on');

							currId = (--currId) % l;
							var $t = $items.eq( currId );

							$currFrame.css('left', 0).animate({
								left: '100%'
							}, 1000);
							$t.css('left', '-100%').animate({
								left: 0
							}, 1000);
							$container.find('.slider_controls li:eq('+ currId +')').addClass('slider_on');

							clearInterval( sliderInterval );
							sliderInterval = setInterval(run, 3000);
						}
						else{   // 向左滑动

							run();
							clearInterval( sliderInterval );
							sliderInterval = setInterval(run, 3000);
						}
					}
				}
			});
		}

		currId = 0;
		$container.find('.slider_controls li:eq('+ currId +')').addClass('slider_on');
		$items.slice(1).css('left', '100%');

		sliderInterval = setInterval(run, 3000);
	};
	$.slider.defaults = {
		container: ''
		, next: true
		, prev: true
		, controls: true
		, touch: false
	};
}, '');