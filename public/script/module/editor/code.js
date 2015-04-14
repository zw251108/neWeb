/**
 * @module  code
 * */
require(['../config'], function(config){
	require.config(config);
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

			, isEdit = false
			, runCode = function(html, css, js, cssLib, jsLib){
				return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/>' +
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
			, libTpl = $.template({
				template: ''
				, filter: {}
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
				isEdit = false;
				$savePopup.addClass('');
			}).on('click', '.module_close', function(){
				$savePopup.addClass('hidden');
			})
			, $codeName = $savePopup.find('#codeName')

			, $libPopup = $('editorLib').on('click').on('click', '.module_close', function(){
				$libPopup.addClass('hidden');
			})
			;

		$toolbar.on('click', '#save', function(){
			$codeName.val( $editor.find('h3').html() );
			$savePopup.removeClass('hidden');
		})
			.on('click', '#run', function(){
			var frame = $rs[0]
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			html.save();
			css.save();
			js.save();

			frame = frame.contentDocument || frame.contentWindow.document;
			frame.open();
			frame.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			frame.close();
		})
			.on('click', '#newWin', function(){
			var  newWin = window.open('').document
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			newWin.open();
			newWin.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			newWin.close();
		})
			.on('click', '#lib', function(){
				socket.emit('getData', {
					topic: 'bower/editor/lib'
				});
			})
			;

		g.mod('$editor', $editor);

		html = codeArea(html[0], 'html');
		css = codeArea(css[0], 'css');
		js = codeArea(js[0], 'js');

		html.on('change', function(){
			isEdit = true;
		});
		css.on('change', function(){
			isEdit = true;
		});
		js.on('change', function(){
			isEdit = true;
		});

		$toolbar.find('#run').trigger('click');

		$editor.find('label').removeClass('hidden');

		$(window).bind('beforeunload', function(){
			if( isEdit ){
				return '确定不保存您幸苦写下的代码么？';
			}
		});

		socket.register({
			'editor/save': function(data){
				$savePopup.addClass('hidden');
				if( data.msg === 'success' && location.search !== '?id='+ data.id ){
					location.search = '?id='+ data.id;
				}
			}
			, 'editor/lib': function(data){
				$
				console.dir(data)
			}
		});
	});
});