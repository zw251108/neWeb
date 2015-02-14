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

	cmOptions.mode = 'text/html';
	html = cm.fromTextArea(html, cmOptions);
	$html = $(html.display.wrapper).parent();

	cmOptions.mode = 'text/css';
	css = cm.fromTextArea(css, cmOptions);
	$css = $(html.display.wrapper).parent();

	cmOptions.mode = 'javascript';
	js = cm.fromTextArea(js, cmOptions);
	$js = $(html.display.wrapper).parent();
	console.log($js)
	var listTpl = $.template({
			template: 'li[title=%name% data-type=%type%]{%name%}'
			, filter: {
				type: function(d){
					return d.id || '';
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
			       console.log(type)
			switch( type ){
				case 1:
					$html.css({
						position: 'fixed'
						, top: '0'
						, left: '0'
						, height: '25%'
						, width: '100%'
						, padding: '5px'
					});
					$css.css({
						position: 'fixed'
						, top: '25%'
						, left: '0'
						, height: '25%'
						, width: '100%'
						, padding: '5px'
					});
					$js.css({
						position: 'fixed'
						, top: '50%'
						, left: '0'
						, height: '25%'
						, width: '100%'
						, padding: '5px'
					});
					$rs.css({
						position: 'fixed'
						, top: '75%'
						, left: '0'
						, height: '25%'
						, width: '100%'
						, padding: '5px'
					});
					break;
				case 2:
					$html.css({
						position: 'fixed'
						, top: '0'
						, left: '0'
						, height: '100%'
						, width: '25%'
						, padding: '5px'
					});
					$css.css({
						position: 'fixed'
						, top: '0'
						, left: '25%'
						, height: '100%'
						, width: '25%'
						, padding: '5px'
					});
					$js.css({
						position: 'fixed'
						, top: '0'
						, left: '50%'
						, height: '100%'
						, width: '25%'
						, padding: '5px'
					});
					$rs.css({
						position: 'fixed'
						, top: '0'
						, left: '75%'
						, height: '100%'
						, width: '25%'
						, padding: '5px'
					});
					break;
				case 3:
					$html.css({
						position: 'fixed'
						, top: '0'
						, left: '0'
						, height: '40%'
						, width: '40%'
						, padding: '5px'
					});
					$css.css({
						position: 'fixed'
						, top: '0'
						, left: '40%'
						, height: '40%'
						, width: '60%'
						, padding: '5px'
					});
					$js.css({
						position: 'fixed'
						, top: '40%'
						, left: '0'
						, height: '60%'
						, width: '40%'
						, padding: '5px'
					});
					$rs.css({
						position: 'fixed'
						, top: '40%'
						, left: '40%'
						, height: '60%'
						, width: '60%'
						, padding: '5px'
					});
					break;
			}

			$skin.find('ul').slideUp();
			//html.fr
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