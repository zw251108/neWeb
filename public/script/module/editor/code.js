/**
 * @module code
 * */
require.config({
	baseUrl: '../script/'
	, paths: {
		jquery: 'lib/jquery.min'
		, global: 'module/global'
		, socket: 'module/socket'
		, template: 'ui/jquery.emmetTpl'
	}
});
require(['jquery', 'global', 'socket'
	, 'plugin/codeMirror/lib/codemirror'
	, 'plugin/codeMirror/emmet/emmet.min'
	, 'plugin/codeMirror/mode/xml/xml'
	, 'plugin/codeMirror/mode/htmlmixed/htmlmixed'
	, 'plugin/codeMirror/mode/javascript/javascript'
	, 'plugin/codeMirror/mode/css/css'
	, 'plugin/codeMirror/addon/comment/comment'
	, 'plugin/codeMirror/addon/comment/continuecomment'
	, 'plugin/codeMirror/addon/fold/foldcode'
	, 'plugin/codeMirror/addon/fold/foldgutter'
	, 'plugin/codeMirror/addon/fold/brace-fold'
	, 'plugin/codeMirror/addon/fold/xml-fold'
	, 'template'
], function($, g, socket, cm){
	var $editor = $('#editor')
		, html  = $editor.find('#html')[0]
		, $html
		, css   = $editor.find('#css')[0]
		, $css
		, js    = $editor.find('#js')[0]
		, $js
		, $rs    = $editor.find('#result')
		, cmOptions = {
			lineNumbers : true
			, foldGutter: true
			, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
			, matchBrackets: true
		}
		;

	g.mod('$editor', $editor);

	cmOptions.mode = 'text/html';
	html = cm.fromTextArea(html, cmOptions);
	$html = $(html.display.wrapper).parent();

	cmOptions.mode = 'text/css';
	css = cm.fromTextArea(css, cmOptions);
	$css = $(css.display.wrapper).parent();

	cmOptions.mode = 'javascript';
	js = cm.fromTextArea(js, cmOptions);
	$js = $(js.display.wrapper).parent();

	console.log(js);

	var listTpl = $.template({
			template: 'li[title=%name% data-type=%type%]{%name%}'
			, filter: {
				type: function(d){
					return d.type || '';
				}
			}
		})
		, $skinLink = $('<link />', {
			rel: 'stylesheet'
		}).appendTo('head')
		, $skin = $('<div class="btnOptions"></div>').css({
			position: 'absolute'
			, top: 0
			, left: 0
		}).on('click', 'button', function(){
			$(this).next().slideToggle();
		}).on('click', 'li', function(){
			var skin = this.innerHTML;

			$skinLink.attr('href', skin !== 'default' ? '../script/plugin/codeMirror/theme/'+ skin +'.css' : '');

			html.setOption('theme', skin);
			css.setOption('theme', skin);
			js.setOption('theme', skin);

			$skin.find('ul').slideUp();
		}).append('<button class="btn icon icon-skin">更改皮肤</button><ul class="list skinList hidden"></ul>').find('ul').append(listTpl([{
			name: 'default'}, {
			name: '3024-day'}, {
			name: '3024-night'}, {
			name: 'ambiance'}, {
			name: 'ambiance-mobile'}, {
			name: 'base16-dark'}, {
			name: 'base16-light'}, {
			name: 'blackboard'}, {
			name: 'cobalt'}, {
			name: 'eclipse'}, {
			name: 'elegant'}, {
			name: 'erlang-dark'}, {
			name: 'lesser-dark'}, {
			name: 'mbo'}, {
			name: 'mdn-like'}, {
			name: 'midnight'}, {
			name: 'monokai'}, {
			name: 'neat'}, {
			name: 'neo'}, {
			name: 'night'}, {
			name: 'paraiso-dark'}, {
			name: 'paraiso-light'}, {
			name: 'pastel-on-dark'}, {
			name: 'rubyblue'}, {
			name: 'solarized'}, {
			name: 'the-matrix'}, {
			name: 'tomorrow-night-bright'}, {
			name: 'tomorrow-night-eighties'}, {
			name: 'twilight'}, {
			name: 'vibrant-ink'}, {
			name: 'xq-dark'}, {
			name: 'xq-light'}, {
			name: 'zenburn'
		}]).join('')).end().appendTo( $editor )

		, $layout = $('<div class="btnOptions"></div>').css({
			position: 'absolute'
			, top: 0
			, left: '150px'
		}).on('click', 'button', function(){
			$(this).next().slideToggle();
		}).on('click', 'li', function(){
			var $that = $(this)
				, type = $that.data('type')
				;

			$editor.addClass('fullScreen').parent().addClass('fullScreen');

			switch( type ){
				case 1:
					$html.addClass('row-1');
					$css.addClass('row-2');
					$js.addClass('row-3');
					$rs.addClass('row-4');
					break;
				case 2:
					$html.addClass('col-1');
					$css.addClass('col-2');
					$js.addClass('col-3');
					$rs.addClass('col-4');
					break;
				case 3:
					$html.addClass('corner-1');
					$css.addClass('corner-2');
					$js.addClass('corner-3');
					$rs.addClass('corner-4');
					break;
			}

			$layout.find('ul').slideUp();
			html.refresh();
			css.refresh();
			js.refresh();
		}).append('<button class="btn icon icon-layout">改变布局</button><ul class="list layoutList hidden"></ul>').find('ul').append(listTpl([{
			name: '四行布局'
			, type: '1'
		}, {
			name: '四列布局'
			, type: '2'
		}, {
		    name: '四角布局'
			, type: '3'
		}]).join('')).end().appendTo( $editor)

		, $hideHeader = $('<button />', {
			'class': 'btn icon'
			, text: '隐藏页头'
		}).css({
			position: 'absolute'
			, top: 0
			, left: '300px'
		}).appendTo( $editor).on('click', function(){
			$('#header').slideUp();
		})
		, $open = $('<button />', {
			'class': 'btn icon'
			, text: '打开新窗口'
		}).css({
			position: 'absolute'
			, top: 0
			, left: '250px'
		}).appendTo( $editor).on('click', function(){
			window.open( $rs.attr('src') );
		})
		;
});