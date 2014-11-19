/**
 * 首页
 * 全局设置
 * */
require.config({
	packages: [{
		name: 'plugin/syntaxhighlighter'
		, main: 'XRegExp'
	}]
	, shim: {
		template: ['jquery']
	}
	, paths: {
		'socket.io': '../socket.io/socket.io'
		, jquery: 'lib/jquery/jquery.min'
		, template: 'ui/jquery.template'

		// 全局模块设置

		// 应用模块设置
		, blog: 'module/blog'
		, document: 'module/document'
		, talk: 'module/talk'
		, time: 'module/time'
	}
});

/***** 公用基础模块 ******/
/**
 * 全局模块
 * */
define('global', ['jquery'], function($){
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
			'      __    __   __ __ __   __         __         __ __ __\n'  +
			'    /  /  /  / /   __ __/ /  /       /  /       /   __   /\n'  +
			'   /  /__/  / /  /__     /  /       /  /       /  /  /  /\n'   +
			'  /   __   / /   __/    /  /       /  /       /  /  /  /\n'    +
			' /  /  /  / /  /__ __  /  /__ __  /  /__ __  /  /__/  /\n'     +
			'/__/  /__/ /__ __ __/ /__ __ __/ /__ __ __/ /__ __ __/\n'      +
			'\n\n 有什么疑问吗？直接给我留言吧 :)');
	}

	var g =  window.GLOBAL || {}
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
		, showMain
		;
	$container.on({
//		fadeIn: function(){
//			$container.addClass('fadeIn');
//		}
//		, fadeOut: function(){
//			$container.addClass('fadeOut');
//		}
//		,
		'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd': function(){
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
					$t.removeClass('module-main large').addClass('module-metro ' + $t.data('width'));

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
	}).on('click', 'a .module-metro', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		target = this.id;
		g.mod('$' + target).unwrap();

		$container.addClass('main-show fadeOut');
	}).on('click', '.module-main .module_close', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var $t = $(this).parents('.module');
		target = $t.attr('id');
		$t.wrap('<a href="'+ target + '/"></a>');

		$container.removeClass('main-show').addClass('fadeOut');
	});

	g.$container = $container;
//	$body.on({
//		hideMetro: function(){
//			var l = g.numMod();
//
//			while( l-- ){
//				g.mod(l).addClass('module-fadeOut');
//			}
//		}
//		, showMetro: function(){
//			var l = g.numMod();
//
//			while( l-- ){
//				g.mod(l).removeClass('hidden').addClass('module-fadeIn');
//			}
//		}
//		, hideMain: function(e, $target){
//			$target.addClass('module-fadeOut module-hide');
//		}
//		, showMain: function(e, $target){
//			$target.removeClass('module-metro hidden ' + $target.data('width')).addClass('module-main large module-fadeIn');
//		}
//	}).on(animationEnd, '.module-fadeIn', function(){
//		g.mod('$' + this.id).removeClass('module-fadeIn');
//	}).on(animationEnd, '.module-fadeOut', function(){
//		g.mod('$' + this.id).addClass('hidden').removeClass('module-fadeOut');
//	}).on(animationEnd, '.module-main', function(){
//		g.mod('$' + this.id).removeClass('module-fadeOut module-fadeIn');
//	}).on(animationEnd, '.module-show', function(){
//		$body.triggerHandler('showMain', [g.mod('$'+ this.id).removeClass('module-show')]);
//	}).on(animationEnd, '.module-hide', function(){
//		var t = g.mod('$' + this.id);
//		t.removeClass('module-main large module-hide').addClass('module-metro ' + t.data('width'));
//		$body.triggerHandler('showMetro');
//	}).on('click', '.module-metro', function(e){
//		e.preventDefault();
//		$body.triggerHandler('hideMetro');
//	});

	return g;
});
/**
 * web socket 模块
 *  目前基于 socket.io
 * */
define('socket', ['socket.io'], function(io){
	var socket = io('http://localhost:9001');

	socket.on('error', function(err){

		if( err === 'session not found' ){
			/**
			 * session 失效
			 *  todo
			 *  断开连接
			 *  提示用户
			 * */
			socket.disconnect();
 			console.log('断开连接')
		}
	});

	return socket;
});
/**
 * 地理定位
 * */
define('location', function(){

});
/**
 * 本地存储 模块
 * */
define('storage', [], function(){

});
/**
 * 页头 Header
 * */
define('header', ['jquery', 'global'], function($, g){
	var $header = $('#header')
		, $pageTitle = $header.find('#pageTitle')
		;

	return $header;
});

/***** 应用模块 *****/
/**
 * Document 文档模块
 * */
require(['jquery', 'global', 'socket'], function($, g, socket){
	var $document = $('#document')
		, $container = g.$container
		;

	g.mod('$document', $document);

	$document.data('width', 'small').on('click', function(){
		// 已处于展开状态
		if( !$document.hasClass('module-metro') ) return;

		/**
		 * todo 加入 本地存储
		 * */

		if( $document.data('getData') ){  // 已获取基础数据
			// 展开
			$container.triggerHandler('dataReady');
		}
		else{   // 未获取基础数据
			require(['document'], function(){
				socket.emit('getData', {
					topic: 'document'
					, receive: 'getDocData'
				});
			});
		}
	});
});

/**
 * Blog 模块
 * */
require(['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $blog = $('#blog')
		, $container = g.$container
		;

	g.mod('$blog', $blog);

	$blog.data('width', 'big').on('click', function(){

		// 已处于展开状态
		if( !$blog.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		if( $blog.data('getData') ){  // 已获取基础数据
			// 展开
			$container.triggerHandler('dataReady');
		}
		else{   // 未获取基础数据
			require(['blog'], function(){
				socket.emit('getData', {
					topic: 'blog'
					, receive: 'getBlogData'
				});
			});
		}
	});
});

/**
 * Talk 模块
 * */
require(['jquery', 'global', 'socket'], function($, g, socket){
	var $talk = $('#talk')
		, $container = g.$container
		;

	g.mod('$talk', $talk);

	$talk.data('width', 'small').on('click', function(){

		// 已处于展开状态
		if( !$talk.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		if( $talk.data('getData') ){  // 已获取基础数据
			// 展开
			$container.triggerHandler('dataReady');
		}
		else{   // 未获取基础数据
			require(['talk'], function(){
				socket.emit('getData', {
					topic: 'talk'
					, receive: 'getTalkData'
				});
			});
		}
	});
});

require(['jquery', 'global', 'socket', 'time'], function($, g, socket, $time){
	g.mod('$time', $time);

//	var $login = $('#login')
//		, $loginForm = $login.find('#loginForm')
//		;
//
//	$login.on('submit', '#loginForm', function(e){
//        var loginData = $loginForm.serializeArray()
//            , i = loginData.length
//            , data = {}
//            , temp
//            ;
//
//        while( i-- ){
//            temp = loginData[i];
////            if( temp.name in data ){
////                data[temp.name] += ',' + temp.value;
////            }
////            else
//            data[temp.name] = temp.value;
//        }
//
//        data.receive = 'login';
//
//        socket.on('login', function(data){
//            /**
//             * todo
//             *  登录成功
//             *  保存返回的用户数据
//             * */
//            if( 'error' in data ){
//                console.log('error');
//            }
//            else{
//                console.log('success');
//                g.user = data;
//            }
//
//        });
//
//        socket.emit('login', data);
//
//		e.preventDefault();
//		e.stopImmediatePropagation();
//	});
});