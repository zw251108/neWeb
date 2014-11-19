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
		, $body = $(document.body)
		, animationEnd = 'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd'
		;

	g.$body = $body;
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

	$body.on({
		hideMetro: function(){
			var l = g.numMod();

			while( l-- ){
				g.mod(l).addClass('module-fadeOut');
			}
		}
		, showMetro: function(){
			var l = g.numMod();

			while( l-- ){
				g.mod(l).removeClass('hidden').addClass('module-fadeIn');
			}
		}
		, hideMain: function(e, $target){
			$target.addClass('module-fadeOut');
			g.$body.triggerHandler('showMetro');
		}
		, showMain: function(e, $target){
			$target.removeClass('hidden module-metro ' + $target.data('width')).addClass('module-main large module-fadeIn');
		}
	}).on(animationEnd, '.module-fadeIn', function(){
		g.mod('$' + this.id).removeClass('module-fadeIn');
	}).on(animationEnd, '.module-fadeOut', function(){
		g.mod('$' + this.id).addClass('hidden').removeClass('module-fadeOut');
	}).on(animationEnd, '.module-show', function(){
		g.$body.triggerHandler('showMain', [g.mod( '$'+ this.id).removeClass('module-show')]);
	}).on(animationEnd, '.module-main', function(){
		g.mod('$' + this.id).removeClass('module-fadeOut module-fadeIn');
	}).on('click', '.Container > a', function(e){
		e.preventDefault();
		$body.triggerHandler('hideMetro');
//	}).on('click', '.module-main .module_close', function(e){
//		e.stopImmediatePropagation();
//
//
//		g.$body.triggerHandler('hideMain', [$blog]);
	});

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
 * 本地存储 模块
 * */
define('storage', [], function(){

});
/**
 * 页头 Header
 * */
define('header', ['jquery'], function($){
	var $header = $('#header')
		, $pageTitle = $header.find('#pageTitle')
		;

	return $header;
});

define('time', ['jquery', 'global'], function($, g){
	var $time = $('#time')
		, $watch = $('#watch')
		, $hourHand
		, $minuteHand
		, $secondHand
		, setTime
		;

	$time.on({
		init: function(){}

		, watchStop: function(){}
	});

	if( !g.ie ){
		var prefix = '',
			temp = document.createElement('div').style;

		if( '-webkit-transform' in temp ){
			prefix = '-webkit-';
		}
		else if( '-moz-transform' in temp ){
			prefix = '-moz-';
		}
		else if( '-ms-transform' in temp ){
			prefix = '-ms-';
		}
		else if( '-o-transform' in temp ){
			prefix = '-o-';
		}

		$hourHand = $watch.find('#hourHand');
		$minuteHand = $watch.find('#minuteHand');
		$secondHand = $watch.find('#secondHand');
		setTime = function(){
			var time = new Date(),
				d = time.getHours(),
				m = time.getMinutes();
			$hourHand.get(0).style[prefix +'transform'] = 'rotate('+ ((d >11 ? d -12 : d)*30 + Math.floor( m /12 )*6) +'deg)';
			$minuteHand.get(0).style[prefix +'transform'] = 'rotate('+ m *6 +'deg)';
			$secondHand.get(0).style[prefix +'transform'] = 'rotate('+ time.getSeconds()*6 +'deg)';
		};
	}
	else{
		$watch.empty().addClass('watch_wrap-info');
		setTime = function(){
			var time = new Date();

			$watch.html( time.toLocaleTimeString() );
		};
	}

	$watch.removeClass('hidden');
	setTime();
	setInterval(setTime, 1000);

	return $time;
});

/**
 * Document 文档模块
 * */
// 兼容 CommonJS 加载模式
define('shCore', ['plugin/syntaxhighlighter', 'plugin/syntaxhighlighter/shCore'], function(){
	return {
		SyntaxHighlighter: SyntaxHighlighter
	}
});
define('document', ['jquery', 'global', 'socket', 'shCore', 'template',
	'plugin/syntaxhighlighter/shBrushCss',
	'plugin/syntaxhighlighter/shBrushJScript',
	'plugin/syntaxhighlighter/shBrushXml'], function($, g, socket, highlight){
	var $document = g.mod('$document') || $('#document')
		, $curr = null
		, $temp = $([])
		, dlTmpl = $.template({
			template: 'dt.icon.icon-arrow-r{%title%}+dd{%content%}'
		})
		, sectionTmpl = $.template({
			template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon-CSS.icon-minus^dl{%dl%}'
			, filter: {
				dl: function(d){
					return dlTmpl(d.dl).join('');
				}
			}
		})
		;

	highlight = highlight.SyntaxHighlighter;

	// 绑定 socket 回调 事件
	socket.on('getDocData', function(data){
		$document.data('getData', true).find('.module_content').append( sectionTmpl(data).join('') );

		highlight.highlight();

		// todo 判断是否已隐藏
		if( $document.hasClass('module-fadeOut') ){
			$document.addClass('module-show');
		}
		else{
			g.$body.triggerHandler('showMain', [$document, 'small']);
		}
	});

	$document.on({
		deploy: function(){
			$document.unwrap().removeClass('module-metro small').addClass('large module-main').height();
		}
	}).on('click', '.icon-close', function(e){
		g.$body.triggerHandler('hideMain', [$document]);

		e.preventDefault();
		e.stopImmediatePropagation();
	}).on('click', '.section_title', function(){
		$temp.add(this)
			.find('.icon-CSS').toggleClass('icon-plus icon-minus').end()
			.next('dl').slideToggle();
	}).on('click', 'dt', function(){
		if( $curr ){
			$curr.toggleClass('icon-arrow-r icon-arrow-d');

			if( $curr.is(this) ){
				$curr.next().slideToggle();
				$curr = null;
				return;
			}
		}

		$curr && $curr.next().hide();
		$curr = $temp.add(this);

		g.$body.animate({
			scrollTop: this.offsetTop -80
		}, function(){
			$curr.toggleClass('icon-arrow-r icon-arrow-d').next().slideToggle();
		});
	});

	return $document;
});
// 加载 Document 模块
require(['jquery', 'global', 'socket'], function($, g, socket){
	var $document = $('#document')
		;

	g.mod('$document', $document);

	$document.data('width', 'small').on('click', function(){
		                                                            console.log(345)
		// 已处于展开状态
		if( !$document.hasClass('module-metro') ) return;

		/**
		 * todo 加入 本地存储
		 * */

		if( $document.data('getData') ){  // 已获取基础数据
			// 展开
			g.$body.triggerHandler('showMain', [$document]);
		}
		else{   // 未获取基础数据
			require(['document'], function(){                                      console.log(456)
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
define('blog', ['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $blog = g.mod('$blog') || $('#blog')
		, articleTmpl = $.template({
			template:'article#blogArt%Id%.article>a[href=blog/detail/?id=%Id%]>h3.article_title{%title%}' +
				'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
		})
		;

	socket.on('getBlogData', function(data){

		$blog.data('getData', true).find('.module_content').append( articleTmpl(data).join('') );

		// 判断是否已隐藏
		if( $blog.hasClass('module-fadeOut') ){
			$blog.addClass('module-show');
		}
		else{
			g.$body.triggerHandler('showMain', [$blog, 'big']);
		}
	}).on('getArticleData', function(data){

		$('<div class="article_content">'+ data.content +'</div>').hide()
			.insertAfter( $blog.find('#blogArt'+ data.id).find('a').data('deploy', true) ).slideDown();
	});

	$blog.on({
		deploy: function(){
			$blog.unwrap().removeClass('module-metro big').addClass('large module-main').height();
		}
	}).on('click', '.icon-close', function(e){
		// todo 检查是否有需要保存的数据
		g.$body.triggerHandler('hideMain', [$blog]);

		e.preventDefault();
		e.stopImmediatePropagation();
	}).on('click', 'article > a', function(e){// 获得详细内容
		var $self = $(this)
			, isDeploy = $self.data('deploy')
			;

		if( isDeploy ){// 已获取数据
			$self.next().slideToggle();
		}
		else{
			socket.emit('getData', {
				topic: 'blog/detail'
				, receive: 'getArticleData'
				, id: /=(\d*)$/.exec($self.attr('href'))[1]
			});
		}

		e.preventDefault();
		e.stopImmediatePropagation();
	});
});
// 加载 Blog 模块
require(['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $blog = $('#blog')
		;

	g.mod('$blog', $blog);

	$blog.data('width', 'big').on('click', function(){

		// 已处于展开状态
		if( !$blog.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		if( $blog.data('getData') ){  // 已获取基础数据
			// 展开
			g.$body.triggerHandler('showMain', [$blog]);
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
define('talk', ['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $talk = g.mod('$talk') || $('#talk')
		, timeNodeTmpl = $.template({
			template: 'li.timeNode>a.icon.icon-user+div.message{%content%}>span.datetime{%datetime%}'
			, filter: {
				content: function(data){
					if( data.type === 'blog' ){
						return '发布了文章 <a class="link" href="blog/detail/?id=' + data.Id +
						 '">' + data.content +'</a>';
					}
					return data.content;
				}
			}
        })
		;

	socket.on('getTalkData', function(data){console.log(data);

		$talk.data('deploy', true).find('.module_content').append( '<form action="" method="post">' +
			'<textarea name="content" rows="5" cols="30"></textarea>' +
			'<input type="hidden" name="status" value="1"/> ' +
			'<input type="button" value="保存"/><input type="submit" value="发布"/></form>' +
			'<ul class="timeLine" id="timeLine">' +
			timeNodeTmpl(data).join('') +
			'</ul>' );

		// 判断是否已隐藏
		if( $talk.hasClass('module-fadeOut') ){
			$talk.addClass('module-show');
		}
		else{
            g.$body.triggerHandler('showMain', [$talk]);
		}
	});

	$talk.on({
		deploy: function(){
			$talk.unwrap().removeClass('module-metro small').addClass('large module-main').height();
		}
	}).on('submit', 'form', function(e){
        var postData = $talk.find('form').serializeArray()
            , i = postData.length
            , data = {}
            ;

        while( i-- ){
            if( postData[i].name in data ){
                data[postData[i].name] += ',' + postData[i].value;
            }
            else{
                data[postData[i].name] = postData[i].value;
            }
        }

        // todo 提交表单
        socket.emit('message', data);

		e.preventDefault();
		e.stopImmediatePropagation();
	}).on('click', '.icon-close', function(e){
		// todo 检查是否有需要保存的数据
		g.$body.triggerHandler('hideMain', [$talk]);

		e.preventDefault();
		e.stopImmediatePropagation();
	});

	return $talk;
});
// 加载 Talk 模块
require(['jquery', 'global', 'socket'], function($, g, socket){
	var $talk = $('#talk')
		;

	g.mod('$talk', $talk);

	$talk.data('width', 'small').on('click', function(){

		// 已处于展开状态
		if( !$talk.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		if( $talk.data('getData') ){  // 已获取基础数据
			// 展开
			g.$body.triggerHandler('showMain', [$talk]);
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