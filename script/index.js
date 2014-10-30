/**
 * 首页
 * 全局设置
 */
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

	g.$body = $('body').on('click', 'a', function(e){
		e.preventDefault();

		g.$body.addClass('main');
	});

	window.GLOBAL = g;// 释放到全局

	return g;
});

define('socket', ['../socket.io/socket.io'], function(io){
	return io('http://localhost:9001');
});

/**
 * 侧边栏
 * */
define('sideBar', ['jquery'], function($){
	var $sideBar = $('#sideBar');

	return $sideBar;
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
define('shCore', ['plugin/syntaxhighlighter', 'plugin/syntaxhighlighter/shCore'], function(){
	return {
		SyntaxHighlighter: SyntaxHighlighter
	}
});
require(['jquery', 'socket', 'global',
	'shCore',
	'plugin/syntaxhighlighter/shBrushCss',
	'plugin/syntaxhighlighter/shBrushJScript',
	'plugin/syntaxhighlighter/shBrushXml',
	'template'], function($, socket, g, s){
	var $document = $('#document')
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

	s = s.SyntaxHighlighter;

	socket.on('getDocData', function(data){

		setTimeout(function(){
			$document.unwrap().append( '<div class="module_content">'+
				sectionTmpl(data).join('')
				+'</div>' ).toggleClass('module-metro').removeClass('tiny small normal big').height();

			s.highlight();

			$document.addClass('large module-main');
		}, 1000);
	});

	$document.on({
		click: function(e){
			if( !$document.hasClass('module-metro') ) return;

			if( !$document.find('.module_content').length ){
				socket.emit('getData', {
					topic: 'document'
					, receive: 'getDocData'
				});
			}
			else{
				setTimeout(function(){
					$document.addClass('large module-main');
				}, 1000);
			}
		}
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
});

/**
 * Blog 模块
 * */
require(['jquery', 'socket', 'template'], function($, socket){
	var $blog = $('#blog')
		, articleTmpl = $.template({
			template:'article#blogArt%Id%.article>a[href=blog/detail/?id=%Id%]>h3.article_title{%title%}' +
				'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
		})
		;

	socket.on('getBlogData', function(data){
		console.log(data);

		setTimeout(function(){
			$blog.unwrap().append( '<div class="module_content blog-list" id="blogList">'+
				articleTmpl(data).join('') +
				'</div>').toggleClass('module-metro').removeClass('tiny small normal big').height();
			$blog.addClass('large module-main');
		}, 1000);
	}).on('getArticleData', function(data){
		console.log(data);

		$('<div class="article_content">'+ data.content +'</div>').hide()
			.insertAfter( $blog.find('#blogArt'+ data.id).find('a').data('deploy', true) ).slideDown();
	});

	$blog.on({
		click: function(e){
			if( !$blog.find('.module_content').length ){
				socket.emit('getData', {
					topic: 'blog'
					, receive: 'getBlogData'
				});
			}
			else{
			}
		}
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
	});
});