/**
 * @module  global
 * */
//----- 全局模块 -----
define(['jquery', 'socket'], function($){

	//ajax 全局设置
	$.ajaxSetup({
		dataType: 'json'
	});

	// 整理表单项数据，组成 json 格式，多选类格式为逗号分隔
	$.fn.serializeJSON = function(){
		var rs = {}
			, array
			, t
			;

		if( this.is('form') ){
			array = this.serializeArray();

			$.each(array, function(i, d){
				t = d.name;
				if( t in rs ){
					rs[t] += ','+ d.value;
				}
				else{
					rs[t] = d.value;
				}
			});
		}

		return rs;
	};

	// jquery 扩展 解析 url
	$.parseURL = function(url){
		var a =  document.createElement('a')
			;

		a.href = url || location.href;

		return {
			source: url
			, protocol: a.protocol.replace(':', '')
			, host: a.hostname
			, port: a.port
			, query: a.search
			, params: (function(){
				var ret = {}
					, seg = a.search.replace(/^\?/, '').split('&')
					, len = seg.length
					, i = 0
					, s
					;

				for(; i < len; i++ ){
					if( !seg[i] ){
						continue;
					}

					s = seg[i].split('=');

					ret[s[0]] = s[1];
				}

				return ret;
			})()
			, file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1]
			, hash: a.hash.replace('#', '')
			, path: a.pathname.replace(/^([^\/])/, '/$1')
			, relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1]
			, segments: a.pathname.replace(/^\//, '').split('/')
		};
	};

	// 数据补零
	$.fillZero = function(num, length){
		var l, i
			;

		num = num.toString();
		l = num.length;

		if( l < length ){
			for(i = length - l; i--;){
				num = '0' + num;
			}
		}

		return num;
	};

	// 全局图片加载错误处理
	$(document).on('error', 'img', function(){
		this.src = location.original +'/image/default/no-pic.png';
	});

	var ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd';

	// 单全局变量
	var g =  window.GLOBAL || {}
		;

	window.GLOBAL = g;// 释放到全局

	g.datetime = function(datetime){
		var today = datetime ? datetime : new Date()
			, type = typeof today
			, y, m, d, h, mm, s
			;

		if( type === 'string' || type === 'number' ){
			today = new Date( datetime );
		}

		if( !(today instanceof Date) || today.toString() === 'Invalid Date' ){
			today = new Date();
		}

		y = today.getFullYear();
		m = today.getMonth() +1;
		d = today.getDate();
		h = today.getHours();
		mm = today.getMinutes();
		s = today.getSeconds();

		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d;
		h = h < 10 ? '0' + h : h;
		mm = mm < 10 ? '0' + mm : mm;
		s = s < 10 ? '0' + s : s;
		datetime = y +'-'+ m +'-'+ d +' '+ h +':'+ mm +':'+ s;

		return datetime;
	};

	g.$body = $(document.body);
	g.$overlay = $('#overlay');

	g._MODULE = [];
	g._$MODULE = {};
	g.mod = function(moduleName, moduleValue){
		var type = typeof moduleName
			, rs = false
			;

		if( moduleValue && typeof type === 'string' ){

			g._MODULE.push(moduleName);
			g._$MODULE[moduleName] = moduleValue;

			rs = true;
		}
		else if( type === 'string' ){
			rs = moduleName in g._$MODULE ? g._$MODULE[moduleName] : null;
		}
		else if( type === 'number' ){
			rs = (moduleName >= 0 && moduleName < g._MODULE.length) ? g._$MODULE[g._MODULE[moduleName]] : null;
		}

		return rs;
	};
	g.numMod = function(){
		return g._MODULE.length;
	};

	g.eventType = {
		animationEnd: ANIMATION_END
	};

	// 全局事件代理
	var $container = $('#container')
		, target
		, SCORE_VALUE = ['', '还行', '不错', '好评', '推荐', '完美']
	;
	$container.length && $container.on({
		'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationend': function(){
			var $t = g.mod('$' + target);

			$container.addClass('animate-done');

			if( $container.hasClass('fadeOut') ){   // 淡出

				if( $container.hasClass('main-show') ){ // 显示 main 模块

					// 隐藏 metro 模块
					$container.addClass('hideMetro');

					// 切换 main 模块状态
					$t.removeClass('module-metro ' + $t.data('width')).addClass('module-main large');

					// todo
					if( $container.hasClass('main-data') ){
						$container.triggerHandler('showMain')
					}
				}
				else{   // 显示全部 metro 模块
					$t.removeClass('module-main large').addClass('module-metro ' + $t.data('width')).wrap('<a href="/'+ $t.attr('id') +'/"></a>');

					$container.triggerHandler('showMetro');
				}
			}
			else if( $container.hasClass('fadeIn') ){   // 淡入
				$container.removeClass('fadeIn animate-done');
			}
		}
		, dataReady: function(){
			if( $container.hasClass('animate-done') ){
				$container.triggerHandler('showMain');
			}
			else{
				$container.addClass('main-data');
			}
		}
		, showMain: function(){
			$container.removeClass('animate-done main-data fadeOut').addClass('fadeIn');
		}
		, showMetro: function(){
			$container.removeClass('animate-done fadeOut hideMetro').addClass('fadeIn');
		}
	})
	//	.on('click', '.module', function(e){
	//	e.preventDefault();
	//	e.stopImmediatePropagation();
	//
	//	var $target;
	//
	//	if( $container.hasClass('fadeOut') || $container.hasClass('fadeIn') ) return;
	//
	//	target = this.id;
	//	$target = g.mod('$'+ target);
	//
	//	if( !$target || !$target.hasClass('module-metro') ) return;
	//
	//	// todo 加入 本地存储
	//
	//	$target.unwrap();
	//	$container.addClass('main-show fadeOut');
	//
	//	if( $target.data('getData') ){  // 已获取基础数据
	//		// 展开
	//		$container.triggerHandler('dataReady');
	//	}
	//	else{   // 未获取基础数据
	//		require([target], function(){
	//			socket.emit('data', {
	//				topic: target
	//				, receive: 'get'+ target.replace(/^(.{1})/, function(s){return s.toUpperCase();}) +'Data'
	//			});
	//		});
	//	}
	//})
		.on({
			showDialog: function(){
				this.className = this.className.replace(/(^|\s)hidden(\s|$)/, '');
			}
			, closeDialog: function(){
				this.className += ' hidden';
			}
		}, '.module-popup')
		.on('click', '.module-popup .module_close', function(){
			$(this).parents('.module-popup').addClass('hidden');
		})
		.on('mousewheel DOMMouseScroll', '.module-popup .module_content', function(e){
			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail
				, $that = $(this)
				;

			if( $that.height() !== $that[0].scrollHeight ){
				if( delta < 0 ){
					if( $that[0].scrollTop + $that.height() >= $that[0].scrollHeight ){
						return false;
					}
				}
				else{
					if( $that[0].scrollTop === 0 ){
						return false;
					}
				}
			}
		})
		.on('click', '.module-main .module_close', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		if( $container.hasClass('fadeOut') || $container.hasClass('fadeIn') ) return;

		var $t = $(this).parents('.module');
		target = $t.attr('id');

		$container.removeClass('main-show').addClass('fadeOut');
	})
		.on('click', '.input-score :radio', function(){
			$(this).parent().nextAll('.score_value').html( SCORE_VALUE[this.value] );
		});

	g.$container = $container;

	// 默认分页数量
	g.PAGE_SIZE = 20;

	// 兼容 console
	if( !('console' in window) || !('log' in console) || (typeof console.log !== 'function') ){
		window.console = {
			logStack:[],
			log:function(value){
				this.logStack.push(value);
			}
		}
	}
	else{
		// 自娱自乐。。。
		console.log(
			'     __    __   __ __ __   __         __         __ __ __\n'  +
			'    /  /  /  / /   __ __/ /  /       /  /       /   __   /\n'  +
			'   /  /__/  / /  /__     /  /       /  /       /  /  /  /\n'   +
			'  /   __   / /   __/    /  /       /  /       /  /  /  /\n'    +
			' /  /  /  / /  /__ __  /  /__ __  /  /__ __  /  /__/  /\n'     +
			'/__/  /__/ /__ __ __/ /__ __ __/ /__ __ __/ /__ __ __/\n'      +
			'\n\n 有什么疑问吗？直接给我留言吧 :)');
	}

	var $main = $('.module-main')
		, $mainToolbar = $main.find('.toolbar')
		, width = $mainToolbar.width()
		, offset = $mainToolbar.offset()
		;

	if( !$mainToolbar.length ){
		offset = {
			top: 0
		};
	}

	var $footer = $('#footer')
		;
	$(window).on({
		scroll: function(){

			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
				, h = document.documentElement.clientHeight
				;

			if( scrollTop > h && ($footer.is(':hidden') || !$footer.is(':animated')) ){
				$footer.fadeIn();
			}
			else if( scrollTop <= h ){
				$footer.fadeOut();
			}

			if( scrollTop >= offset.top ){
				$mainToolbar.addClass('toolbar-fixed').width( width );
			}
			else{
				$mainToolbar.removeClass('toolbar-fixed');
			}
		}
		, resize: function(){
			width = $main.width();
			$mainToolbar.width( width );
		}
	});

	return g;
});