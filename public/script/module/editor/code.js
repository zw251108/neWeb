/**
 * @module  code
 * */
require.config({
	paths: {
		jquery: 'lib/jquery.min'
		, css: 'lib/css'

		, global: 'module/global'
		, socket: 'module/socket'
		, codeEditor: 'module/codeEditor'
		, template: 'ui/jquery.emmetTpl'
	}
	, baseUrl: '../script/'
});
require(['jquery', 'global', 'socket', 'codeEditor', 'template'], function($, g, socket, codeArea){
	var $editor = $('#editor')
		, $form = $editor.find('#editorForm')
		, $toolbar = $editor.find('.toolbar')
		, $id = $editor.find('#id')
		, $cssLib = $editor.find('#cssLib')
		, $jsLib = $editor.find('#jsLib')

		, html = $editor.find('#html')
		, css = $editor.find('#css')
		, js = $editor.find('#js')
		, $rs = $editor.find('#result')

		, runCode = function(html, css, js, cssLib, jsLib){
			return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"/>' +
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

		, $skinLink = $('<link />', {rel: 'stylesheet'}).appendTo('head')

		, listTpl = $.template({
			template: 'li[title=%name% data-type=%type%]{%name%}'
		})

		, $skinList = $toolbar.find('#changeSkin').on('click', function(){
			$layoutList.slideUp();
			$skinList.slideToggle();
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
			$skinList.slideUp();
			$layoutList.slideToggle();
		}).after('<ul class="list layoutList hidden"></ul>').next('ul').append(listTpl([{
			name: '四行布局', type: '1'}, {
			name: '四列布局', type: '2'}, {
			name: '四角布局', type: '3'}, {
			name: '回到默认', type: '0'
		}]).join('')).on('click', 'li', function(){
			var $that = $(this)
				, type = $that.data('type')
				;

			$skinList.slideUp();
			g.$container.addClass('Container-eFS');

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
					g.$container.removeClass('Container-eFS');
					$editor.removeClass('editor-4row editor-4col editor-4cor');
					break;
			}

			$layoutList.slideUp();
			html.refresh();
			css.refresh();
			js.refresh();
		})

		, $newWin = $toolbar.find('#newWin').on('click', function(){
			var  newWin = window.open()
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			newWin.document.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
		})

		, $run = $toolbar.find('#run').on('click', function(){
			var frame = $rs[0]
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			html.save();
			css.save();
			js.save();

			//$form.submit();

			//$rs.removeAttr('src');
			//frame = $rs[0];

			frame = frame.contentDocument || frame.contentWindow.document;
			frame.open();
			frame.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			frame.close();

		})

		, $savePopup = $('#editorSave').on('click', '#codeSave', function(){

			socket.emit('getData', {
				topic: 'editor/save'
				, query: {
					id: $id.val()
					, codeName: $codeName.val()
					, html: html.getValue()
					, css: css.getValue()
					, js: js.getValue()
					, cssLib: $cssLib.val()
					, jsLib: $jsLib.val()
				}
			});
			$savePopup.addClass('');
		}).on('click', '.module_close', function(){
			$savePopup.addClass('hidden');
		})
		, $codeName = $savePopup.find('#codeName')
		, $save  = $toolbar.find('#save').on('click', function(){
			$codeName.val( $editor.find('h3').html() );
			$savePopup.removeClass('hidden');
		})
		;

	g.mod('$editor', $editor);

	html = codeArea(html[0], 'html');
	css = codeArea(css[0], 'css');
	js = codeArea(js[0], 'js');

	$run.triggerHandler('click');

	$editor.find('label').removeClass('hidden');

	socket.register({
		'editor/save': function(data){
			alert(data.msg);
		}
		, 'editor/lib': function(data){

		}
	});
});