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
		jquery: 'lib/jquery/jquery.min'
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

//	/**
//	 * ajax 全局设置
//	 * */
//	$.ajaxSetup({
//		dataType:'json',    // 数据交换类型 json
//		cache:false,    // 取消缓存
//		xhr:function(){ // 解决IE7 ajax XMLHttpRequest对象问题
//			return window.XMLHttpRequest?
//				new XMLHttpRequest():
//				window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
//		},
//		error:function(xhr, textStatus, errorThrown){
//		   // todo 统一错误处理函数
//		}
//	});

	var g =  window.GLOBAL || {};

	g.$body = $(document.body).on('click', 'a', function(e){
		e.preventDefault();

		g.$body.addClass('main');
		setTimeout(function(){
			g.$body.addClass('show');
		}, 1000);
	});

	g.$overlay = $('#overlay');

	window.GLOBAL = g;// 释放到全局

	return g;
});
/**
 * web socket 模块
 *  目前基于 socket.io
 * */
define('socket', ['../socket.io/socket.io'], function(io){
	return io('http://localhost:9001');
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
	var $document = g.$document || $('#document')
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

		setTimeout(function(){
			$document.data('getData', true).unwrap().append( '<ul class="toolbar">' +
				'<li><a class="module_close icon icon-close"></a></li>' +
				'</ul>' +
				'<div class="module_content">' +
				sectionTmpl(data).join('') +
				'</div>' ).toggleClass('module-metro').removeClass('tiny small normal big').height();

			highlight.highlight();

			$document.addClass('large module-main');
		}, 1000);
	});

	$document.on('click', '.icon-close', function(e){

		// todo 关闭显示
		// todo 检查是否有需要保存的数据

//		$document.toggleClass('module-main module-metro').wrap('<a href="document/"></a>');
//		g.$body.removeClass('show');
//		setTimeout(function(){
//			g.$body.toggleClass('main');
//		}, 1000);

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

	g.$document = $document;

	$document.on('click', function(e){

		// 已处于展开状态
		if( !$document.hasClass('module-metro') ) return;

		/**
		 * todo 加入 本地存储
		 * */

		if( $document.data('getData') ){  // 已获取基础数据
			// todo 展开
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
define('blog', ['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $blog = g.$blog || $('#blog')
		, articleTmpl = $.template({
			template:'article#blogArt%Id%.article>a[href=blog/detail/?id=%Id%]>h3.article_title{%title%}' +
				'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
		})
		;


	socket.on('getBlogData', function(data){
		console.log(data);

		setTimeout(function(){
			$blog.data('getData', true).unwrap().append( '<ul class="toolbar">' +
				'<li><a class="module_close icon icon-close"></a></li>' +
//				'<li><a class="module_close icon icon-write"></a></li>' +
				'</ul>' +
				'<div class="module_content blog-list" id="blogList">'+
				articleTmpl(data).join('') +
				'</div>').toggleClass('module-metro').removeClass('tiny small normal big').height();
			$blog.addClass('large module-main');
		}, 1000);
	}).on('getArticleData', function(data){
		console.log(data);

		$('<div class="article_content">'+ data.content +'</div>').hide()
			.insertAfter( $blog.find('#blogArt'+ data.id).find('a').data('deploy', true) ).slideDown();
	});

	$blog.on('click', '.icon-close', function(e){

		// todo 关闭显示
		// todo 检查是否有需要保存的数据

		e.preventDefault();
		e.stopImmediatePropagation();
	})
//		.on('click', '.icon-write', function(e){
//		// todo 弹窗 编辑模块
//
//		$('<div class="module module-popup module-blog normal"><form>' +
//			'<textarea name="content" rows="30" cols="5"></textarea>' +
//			'<input type="hidden" name="status" value="1"/> ' +
//			'<input type="button" value="保存"/><input type="submit" value="发布"/></form></div>').appendTo( g.$body );
//
//		e.preventDefault();
//		e.stopImmediatePropagation();
//	})
		.on('click', 'article > a', function(e){// 获得详细内容
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
//define('blog/write', ['jquery', 'global', 'socket'], function($, g, socket){
//	var $blogEdit = $('<div class="module module-popup module-blog normal" ')
//});

// 加载 Blog 模块
require(['jquery', 'global', 'socket', 'template'], function($, g, socket){
	var $blog = $('#blog')
		;

	g.$blog = $blog;

	$blog.on('click', function(){

		// 已处于展开状态
		if( !$blog.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		if( $blog.data('getData') ){  // 已获取基础数据
			// todo 展开
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
define('talk', ['jquery', 'global', 'socket'], function($, g, socket){
	var $talk = g.$talk || $('#talk')
		;

	socket.on('getTalkData', function(data){

	});


});
// 加载 Talk 模块
require(['jquery', 'global', 'socket'], function($, g, socket){
	var $talk = $('#talk')

		;

	g.$talk = $talk;

	$talk.on('click', function(e){

		// 已处于展开状态
		if( !$talk.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		if( $talk.data('getData') ){  // 已获取基础数据
			// todo 展开
		}
		else{   // 未获取基础数据
			require(['talk'], function(){
//				socket.emit('getData', {
//					topic: 'talk'
//					, receive: 'getBlogData'
//				});
			});
		}
	});
});

require(['time']);