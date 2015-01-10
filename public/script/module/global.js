/**
 * @module  global
 * */
//----- 全局模块 -----
define(['jquery', 'socket'], function($, socket){
	var
		// 单全局变量
		g =  window.GLOBAL || {}
		, animationEnd = 'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd'
		;

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
		animationEnd: animationEnd
	};

	window.GLOBAL = g;// 释放到全局

	var $container = $('#container')
		, target
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
	}).on('click', '.module', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var $target;

		if( $container.hasClass('fadeOut') || $container.hasClass('fadeIn') ) return;

		target = this.id;
		$target = g.mod('$'+ target);

		if( !$target.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		$target.unwrap();
		$container.addClass('main-show fadeOut');

		if( $target.data('getData') ){  // 已获取基础数据
			// 展开
			$container.triggerHandler('dataReady');
		}
		else{   // 未获取基础数据
			require([target], function(){
				socket.emit('getData', {
					topic: target
					, receive: 'get'+ target.replace(/^(.{1})/, function(s){return s.toUpperCase();}) +'Data'
				});
			});
		}
	}).on('click', '.module-main .module_close', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		if( $container.hasClass('fadeOut') || $container.hasClass('fadeIn') ) return;

		var $t = $(this).parents('.module');
		target = $t.attr('id');

		$container.removeClass('main-show').addClass('fadeOut');
	});

	g.$container = $container;

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

	return g;
});