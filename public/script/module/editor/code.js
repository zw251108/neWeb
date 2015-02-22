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
		, $form = $editor.find('#editorForm')
		, $toolbar = $editor.find('.toolbar')
		, $cssLib = $editor.find('#cssLib')
		, $jsLib = $editor.find('#jsLib')

		, html = $editor.find('#html')
		, css = $editor.find('#css')
		, js = $editor.find('#js')
		, $rs = $editor.find('#result')

		, cmOptions = {
			lineNumbers : true
			, foldGutter: true
			, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
			, matchBrackets: true
			, indentUnit: 4
			, tabSize: 4
		}

		, $skinLink = $('<link />', {
			rel: 'stylesheet'
		}).appendTo('head')

		, listTpl = $.template({
			template: 'li[title=%name% data-type=%type%]{%name%}'
		})

		, $skinList = $toolbar.find('#changeSkin').on('click', function(){
			$(this).next().slideToggle();
		}).after('<ul class="list skinList hidden"></ul>').next('ul').append(listTpl([{
			name: 'default'}, {
			name: '3024-day'}, {
			name: '3024-night'}, {
			name: 'ambiance'}, {
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
		}]).join('')).on('click', 'li', function(){
			var skin = this.innerHTML;

			$layoutList.slideUp();
			$skinLink.attr('href', skin !== 'default' ? '../script/plugin/codeMirror/theme/'+ skin +'.css' : '');

			html.setOption('theme', skin);
			css.setOption('theme', skin);
			js.setOption('theme', skin);

			$skinList.slideUp();
		})

		, $layoutList = $toolbar.find('#changeLayout').on('click', function(){
			$(this).next().slideToggle();
		}).after('<ul class="list layoutList hidden"></ul>').next('ul').append(listTpl([{
			name: '四行布局', type: '1'}, {
			name: '四列布局', type: '2'}, {
			name: '四角布局', type: '3'}, {
			name: '回到默认', type: '0'}]).join('')).on('click', 'li', function(){
			var $that = $(this)
				, type = $that.data('type')
				;

			$skinList.slideUp();
			g.$container.addClass('fullScreen');
			$editor.addClass('fullScreen');

			switch( type ){
				case 1:
					$editor.removeClass('editor-4col editor-4cor').addClass('editor-4row');
					break;
				case 2:
					$editor.removeClass('editor-4row editor-4cor').addClass('editor-4col');
					break;
				case 3:
					$editor.removeClass('editor-4row editor-4col').addClass('editor-4cor');
					break;
				case 0:
				default:
					g.$container.removeClass('fullScreen');
					$editor.removeClass('fullScreen editor-4row editor-4col editor-4cor');
					break;
			}

			$layoutList.slideUp();
			html.refresh();
			css.refresh();
			js.refresh();
		})

		, $run = $toolbar.find('#run').on('click', function(){
			var frame
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			html.save();
			css.save();
			js.save();

			//$form.submit();

			$rs.removeAttr('src');
			frame = $rs[0];

			frame = frame.contentDocument || frame.contentWindow.document;
			frame.open();
			frame.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			frame.close();

		})

		//, $newWin = $toolbar.find('#newWin').on('click', function(){
		//	window.open( $rs.attr('src') );
		//})
		, runCode = function(html, css, js, cssLib, jsLib){
			return '<!DOCTYPE html>' +
				'<html lang="zh-CN">' +
				'<head>' +
				'<meta charset="utf-8"/>' +
				'<!--[if lt IE 9]><meta http-equiv="content-type" content="text/html; charset=utf-8" /><![endif]-->' +
				'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' +
				'<title>前端代码运行结果</title>' +
				(cssLib ? $.map(cssLib.split(','), function(d){return '<link rel="stylesheet" href="'+ d +'">'}).join('') : '') +
				'<style>' +
				css +
				'</style></head><body>' +
				html +
				(jsLib ? $.map(jsLib.split(','), function(d){return '<script src="'+ d +'"></script>'}).join('') : '') +
				'<script>' +
				js +
			'</script></body></html>';
		}
		;


	g.mod('$editor', $editor);

	cmOptions.mode = 'text/html';
	cmOptions.profile = 'xhtml';
	html = cm.fromTextArea(html[0], cmOptions);
	delete cmOptions.profile;

	cmOptions.mode = 'text/css';
	css = cm.fromTextArea(css[0], cmOptions);

	cmOptions.mode = 'javascript';
	cmOptions.extraKeys = {
		Enter:'newlineAndIndentContinueComment'
		, 'Ctrl-/': 'toggleComment'
	};
	js = cm.fromTextArea(js[0], cmOptions);

	$editor.on({
		mouseenter: function(){
			$(this).find('label').addClass('hidden');
		}
		, mouseleave: function(){
			$(this).find('label').removeClass('hidden');
		}
	}, '.editor_area');
});