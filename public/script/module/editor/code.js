/**
 *
 * */

/**
 * @module  editor UI 设置
 * */
define('editorUISet', ['jquery', 'global', 'template'], function($, g){
	var listTpl = $.template({
			template: 'li.%on%[title=%name% data-type=%type%]{%name%}'
			, filter: {
				on: function(d){
					return d.on ? 'on' : '';
				}
			}
		})

		, $skinLink = $('<link />', {rel: 'stylesheet'}).appendTo('head')
		, $skinList = $('#changeSkin').on('click', function(){
			$layoutList.slideUp().prev().hide();
			$skinList.slideToggle().prev().toggle();
		}).after('<span class="arrow hidden"></span><ul class="list skinList hidden"></ul>').nextAll('ul').append(listTpl([{
			name: 'default', on: true}, {
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

			$(this).addClass('on').siblings('.on').removeClass('on');

			$layoutList.slideUp().prev().hide();
			$skinLink.attr('href', skin !== 'default' ? '../script/plugin/codeMirror/theme/'+ skin +'.css' : '');

			html.setOption('theme', skin);
			css.setOption('theme', skin);
			js.setOption('theme', skin);

			$skinList.slideUp().prev().hide();
		})
		, $layoutList = $('#changeLayout').on('click', function(){
			$skinList.slideUp().prev().hide();
			$layoutList.slideToggle().prev().toggle();
		}).after('<span class="arrow hidden"></span><ul class="list layoutList hidden"></ul>').nextAll('ul').append(listTpl([{
			name: '四行布局', type: '1'}, {
			name: '四列布局', type: '2'}, {
			name: '四角布局', type: '3'}, {
			name: '全屏 HTML', type: '4'}, {
			name: '全屏 CSS', type: '5'}, {
			name: '全屏 JS', type: '6'}, {
			name: '全屏结果', type: '7'}, {
			name: '回到默认', type: '0', on: true
		}]).join('')).on('click', 'li', function(){
			var $that = $(this)
				, type = $that.data('type')
				;

			$that.addClass('on').siblings('.on').removeClass('on');

			$skinList.slideUp().prev().hide();
			g.$container.addClass('Container-eFS');

			switch( type ){
				case 1:
					$editor.removeClass('editor-4col editor-4cor editor-htmlFS editor-cssFS editor-jsFS editor-rsFS').addClass('editor-4row');
					break;
				case 2:
					$editor.removeClass('editor-4row editor-4cor editor-htmlFS editor-cssFS editor-jsFS editor-rsFS').addClass('editor-4col');
					break;
				case 3:
					$editor.removeClass('editor-4row editor-4col editor-htmlFS editor-cssFS editor-jsFS editor-rsFS').addClass('editor-4cor');
					break;
				case 4:
					$editor.removeClass('editor-4row editor-4col editor-4cor editor-cssFS editor-jsFS editor-rsFS').addClass('editor-htmlFS');
					break;
				case 5:
					$editor.removeClass('editor-4row editor-4col editor-4cor editor-htmlFS editor-jsFS editor-rsFS').addClass('editor-cssFS');
					break;
				case 6:
					$editor.removeClass('editor-4row editor-4col editor-4cor editor-htmlFS editor-cssFS editor-rsFS').addClass('editor-jsFS');
					break;
				case 7:
					$editor.removeClass('editor-4row editor-4col editor-4cor editor-htmlFS editor-cssFS editor-jsFS').addClass('editor-rsFS');
					break;
				case 0:
				default:
					g.$container.removeClass('Container-eFS');
					$editor.removeClass('editor-4row editor-4col editor-4cor editor-htmlFS editor-cssFS editor-jsFS editor-rsFS');
					break;
			}

			$layoutList.slideUp().prev().hide();
			html.refresh();
			css.refresh();
			js.refresh();
		})

		, $editor
		, html
		, css
		, js;

	return function($e, h, c, j){
		$editor = $e;
		html = h;
		css = c;
		js = j;
	};
});
define('uiLibPopup', ['jquery', 'socket', 'template'], function($, socket){
	var // UI 库
		pathTpl = $.template({
			template: 'div>label>input[type=checkbox value=%path%]+span.left.icon.icon-checkbox{%path%}'
		})
		, uiLibTpl = $.template({
			template: 'dt>label>input[type=checkbox]+span.left.icon.icon-checkbox{%name%}^span.right{%version%}^dd{%paths%}'
			, filter: {
				paths: function(d){
					var css = d.css_path
						, js = d.js_path
						;
					css = css ? $.map(css.split(','), function(d){
						return {path: d};
					}) : [];
					js = js ? $.map(js.split(','), function(d){
						return {path: d};
					}) : [];

					return pathTpl( css.concat(js) ).join('');
				}
			}
		})

		, $uiLibPopup = $('#uiLib').on('click', 'dt input:checkbox', function(){
			$(this).parents('dt').next().find('input:checkbox').prop('checked', this.checked);
		}).on('click', 'dd input:checkbox', function(){
			var $parent = $(this).parents('dd')
				, $checkbox = $parent.find('input:checkbox')
				, lChecked = $checkbox.filter(':checked').length
				;
			$parent.prev().find('input:checkbox').prop('checked', lChecked === $checkbox.length);
		}).on('click', 'button.btn', function(){
			var $checked = $uiLibPopup.find('input:checkbox:checked')
				, jsLib = []
				, cssLib = [];

			$uiLibPopup.trigger('closeDialog');
			$checked.each(function(){
				var val = this.value;

				if( /\.js$/.test( val ) ){
					jsLib.push( val );
				}
				else if( /\.css$/.test( val ) ){
					cssLib.push( val );
				}
			});

			$jsLib.val( jsLib.join() );
			$cssLib.val( cssLib.join() );
		})

		, $cssLib
		, $jsLib
		;

	$('#getUiLib').on('click', function(){
		$uiLibPopup.data('data') ? $uiLibPopup.trigger('showDialog') : socket.emit('data', {
			topic: 'editor/lib'
		});
	});

	socket.register('editor/lib', function( data){
		var cssLib = $cssLib.val()
			, jsLib = $jsLib.val()
			;

		cssLib = cssLib ? cssLib.split(',') : [];
		jsLib = jsLib ? jsLib.split(',') : [];

		$uiLibPopup.data('data', true).find('#uiLibList').html( uiLibTpl(data.data).join('') ).find('dd input:checkbox').each(function(){
			var v = this.value;

			if( $.inArray(v, jsLib) !== -1 || $.inArray(v, cssLib) !== -1 ){
				$(this).trigger('click');
			}
		}).end().trigger('showDialog');
	});

	return function($jLib, $cLib){
		$jsLib = $jLib;
		$cssLib = $cLib;
	};
});
define('demoImgLibPopup', ['jquery', 'socket', 'template'], function($, socket){
	var // 素材图片大小
		DEMO_IMG_SIZE = 100
		, demoImgLibTpl = $.template({
			template: 'li>div.img>img[src=%src% width=%showWidth% height=%showHeight%]^div.src>input[value=%src%]^div.desc{%width% * %height%}'
			, filter: {
				showWidth: function(d){
					var w = d.width
						, h = d.height
						, rs
						;
					if( w <= DEMO_IMG_SIZE && h <= DEMO_IMG_SIZE ){
						rs = w;
					}
					else if( w >= h ){
						rs = DEMO_IMG_SIZE;
					}
					else{
						rs = Math.floor( DEMO_IMG_SIZE/h * w );
					}

					return rs;
				}
				, showHeight: function(d){
					var w = d.width
						, h = d.height
						, rs
						;
					if( w <= DEMO_IMG_SIZE && h <= DEMO_IMG_SIZE ){
						rs = h;
					}
					else if( h >= w ){
						rs = DEMO_IMG_SIZE;
					}
					else{
						rs = Math.floor( DEMO_IMG_SIZE/w * h );
					}

					return rs;
				}
			}
		})
		, $demoImgLibPopup = $('#demoImgLib').on('submit', '#demoImgUploadForm', function(e){
			if( !$(this).find(':file').val() ){
				e.preventDefault();
			}
		})
		;

	$('#getDemoImg').on('click', function(){
		$demoImgLibPopup.data('data') ? $demoImgLibPopup.trigger('showDialog') : socket.emit('data', {
			topic: 'editor/demoImgLib'
		});
	});

	// 素材图片上传结果
	$('#demoImgUploadRs').on('load', function(){
		var res = this.contentDocument.body.innerHTML;

		res = $.parseJSON( res );

		$demoImgLibPopup.find('#demoImgList').prepend( demoImgLibTpl(res) );
	});

	socket.register('editor/demoImgLib', function(data){
		$demoImgLibPopup.data('data', true).find('#demoImgList').html( demoImgLibTpl(data.data).join('') ).end().trigger('showDialog');
	});
});
define('setMorePopup', ['jquery', 'socket', 'template'], function($, socket){
	var $setM = $('#setM').on('click', function(){
		$setM.parents('legend').next().slideToggle();
	});
});


require(['../config'], function(config){
	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket'
		, 'codeEditor'
		, 'editorUISet'
		, 'uiLibPopup'
		, 'demoImgLibPopup'
		, 'setMorePopup'
		, 'tag', config.dataSource.tag
		, 'template'], function($, g, socket, codeArea, initUI, initUiLib, demoImg, setMore, tag, tagsData){
		var $editor = $('#editor')
			, $form = $editor.find('#editorForm')
			, $toolbar = $editor.find('.toolbar')

			, $cssLib = $editor.find('#cssLib')
			, $jsLib = $editor.find('#jsLib')

			, html = $editor.find('#html')
			, css = $editor.find('#css')
			, js = $editor.find('#js')

			, $name = $editor.find('#name')
			, $id = $editor.find('#id')

			//, $editorTitle = $('#editorTitle')
			, $rs = $editor.find('#result')

			, isEdit = false
			, editFunc = function(){isEdit = true;}

			, runCode = function(html, css, js, cssLib, jsLib){
				return '<!DOCTYPE html>' +
					'<html lang="zh-CN">' +
						'<head>' +
							'<meta charset="UTF-8"/>' +
							'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' +
							'<title>前端代码运行结果</title>' +
							(cssLib ? $.map(cssLib.split(','), function(d){return '<link rel="stylesheet" href="../lib/'+ d +'">'}).join('') : '') +
							'<style>' +	css + '</style>' +
						'</head>' +
						'<body>' +
							html +
							(jsLib ? $.map(jsLib.split(','), function(d){return '<script src="../lib/'+ d +'"></script>'}).join('') : '') +
							'<script>' + js + '</script>' +
						'</body>' +
					'</html>';
			}

			, $setMoreForm = $('#setMoreForm')

			// 各个弹窗
			, $setMorePopup = $('#setMore').on('click', '#codeSave', function(){

				$setMoreForm.find('#codeId');

				//$editorTitle.html( $codeName.val() );
				$name.val( $codeName.val() );

				//isEdit = false;
				// todo 如果 isEdit === true 将代码提交
			})
			, $alert = $('#alert')

			, $codeName = $setMorePopup.find('#codeName')
			, $tags = $('#tags')
			;

		tag( tagsData );
		tag.setAdd( $setMorePopup );

		$toolbar.on('click', '#newWin', function(){
			var  newWin = window.open('').document
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			newWin.open();
			newWin.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			newWin.close();
		}).on('click', '#set', function(){
			$setMorePopup.trigger('showDialog');
		});

		g.mod('$editor', $editor);

		html = codeArea(html[0], 'html');
		css = codeArea(css[0], 'css');
		js = codeArea(js[0], 'js');

		html.on('change', editFunc);
		css.on('change', editFunc);
		js.on('change', editFunc);

		$('#save').on('click', function(e){
			e.preventDefault();

			var form = $form.serializeArray()
				, data = {}
				, t
				;
			$.each(form, function(i, d){
				t = d.name;

				if( t in data ){
					data[t] += ','+ d.value;
				}
				else{
					data[t] = d.value;
				}
			});

			socket.emit('data', {
				topic: 'editor/code/save'
				, query: data
			});
		});
		$('#run').on('click', function(){
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
		}).trigger('click');

		$editor.find('label').removeClass('hidden');

		initUI($editor, html, css, js);
		initUiLib($jsLib, $cssLib);

		$('#editorSetMoreRs').on('load', function(){
			var res = this.contentDocument.body.innerHTML;

			res = $.parseJSON( res );

			if( location.search !== '?id=' + res.Id ){
				location.search = '?id=' + res.Id
			}
		});

		$(window).bind('beforeunload', function(){
			if( isEdit ){
				return '确定不保存您幸苦写下的代码么？';
			}
		});

		socket.register('editor/code/save', function(data){

			if( 'error' in data ){
				$alert.find('#alertConternt').html('保存失败' + data.msg).end().trigger('showDialog');
			}
			else{
				if( location.search !== '?id='+ data.info.id ){
					location.search = '?id='+ data.info.id;
				}
				else{
					$alert.find('#alertContent').html('保存成功')
						.end().trigger('showDialog');

					isEdit = false;
				}
			}
		});
	});
});