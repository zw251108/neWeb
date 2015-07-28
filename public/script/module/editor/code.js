/**
 *
 * */
require(['../config'], function(config){
	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'codeEditor', 'tag', config.dataSource.tag, 'template'], function($, g, socket, codeArea, tag, tagsData){
		var $editor = $('#editor')
			, $form = $editor.find('#editorForm')
			, $toolbar = $editor.find('.toolbar')
			, $id = $editor.find('#id')
			, $cssLib = $editor.find('#cssLib')
			, $jsLib = $editor.find('#jsLib')

			, $editorTitle = $('#editorTitle')
			, html = $editor.find('#html')
			, css = $editor.find('#css')
			, js = $editor.find('#js')
			, $rs = $editor.find('#result')

			, isEdit = false
			, runCode = function(html, css, js, cssLib, jsLib){
				return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/>' +
					'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' +
					'<title>前端代码运行结果</title>' +
					(cssLib ? $.map(cssLib.split(','), function(d){return '<link rel="stylesheet" href="../lib/'+ d +'">'}).join('') : '') +
					'<style>' +	css + '</style>' +
					'</head><body>' + html +
					(jsLib ? $.map(jsLib.split(','), function(d){return '<script src="../lib/'+ d +'"></script>'}).join('') : '') +
					'<script>' + js + '</script>' +
					'</body></html>';
			}

			, $skinLink = $('<link />', {rel: 'stylesheet'}).appendTo('head')

			// 素材图片大小
			, DEMO_IMG_SIZE = 100

			// 各个模板引擎
			, listTpl = $.template({
				template: 'li[title=%name% data-type=%type%]{%name%}'
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
			, pathTpl = $.template({
				template: 'div>label>input[type=checkbox value=%path%]+span.left.icon.icon-checkbox{%path%}'
			})

			, $skinList = $toolbar.find('#changeSkin').on('click', function(){
				$layoutList.slideUp().prev().hide();
				$skinList.slideToggle().prev().toggle();
			}).after('<span class="arrow hidden"></span><ul class="list skinList hidden"></ul>').nextAll('ul').append(listTpl([{
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

				$layoutList.slideUp().prev().hide();
				$skinLink.attr('href', skin !== 'default' ? '../script/plugin/codeMirror/theme/'+ skin +'.css' : '');

				html.setOption('theme', skin);
				css.setOption('theme', skin);
				js.setOption('theme', skin);

				$skinList.slideUp().prev().hide();
			})
			, $layoutList = $toolbar.find('#changeLayout').on('click', function(){
				$skinList.slideUp().prev().hide();
				$layoutList.slideToggle().prev().toggle();
			}).after('<span class="arrow hidden"></span><ul class="list layoutList hidden"></ul>').nextAll('ul').append(listTpl([{
				name: '四行布局', type: '1'}, {
				name: '四列布局', type: '2'}, {
				name: '四角布局', type: '3'}, {
				name: '回到默认', type: '0'
			}]).join('')).on('click', 'li', function(){
				var $that = $(this)
					, type = $that.data('type')
					;

				$skinList.slideUp().prev().hide();
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

				$layoutList.slideUp().prev().hide();
				html.refresh();
				css.refresh();
				js.refresh();
			})

			// 各个弹窗
			, $savePopup = $('#editorSave').on('click', '#codeSave', function(){
				socket.emit('data', {
					topic: 'editor/code/save'
					, query: {
						id: $id.val()
						, codeName: $codeName.val()
						, html: html.getValue()
						, css: css.getValue()
						, js: js.getValue()
						, cssLib: $cssLib.val()
						, jsLib: $jsLib.val()
						, tags: $tags.val()
					}
				});

				$editorTitle.html( $codeName.val() );

				isEdit = false;
			})
			, $libPopup = $('#uiLib').on('click', 'dt input:checkbox', function(){
				$(this).parents('dt').next().find('input:checkbox').prop('checked', this.checked);
			}).on('click', 'dd input:checkbox', function(){
				var $parent = $(this).parents('dd')
					, $checkbox = $parent.find('input:checkbox')
					, lChecked = $checkbox.filter(':checked').length
					;
				$parent.prev().find('input:checkbox').prop('checked', lChecked === $checkbox.length);
			}).on('click', 'button.btn', function(){
				var $checked = $libPopup.find('input:checkbox:checked')
					, jsLib = []
					, cssLib = [];

				$libPopup.trigger('closeDialog');
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
			, $demoImgLibPopup = $('#demoImgLib').on('submit', '#demoImgUploadForm', function(e){
				if( !$(this).find(':file').val() ){
					e.preventDefault();
				}
			})
			, $alert = $('#alert')

			, $codeName = $savePopup.find('#codeName')
			, $tags = $('#tags')
			;

		tag( tagsData );
		tag.setAdd( $savePopup );
		//$savePopup.find('')

		$toolbar.on('click', '#save', function(){
			$codeName.val( $editor.find('h3').html() );
			$savePopup.trigger('showDialog');
		}).on('click', '#run', function(){
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
		}).on('click', '#newWin', function(){
			var  newWin = window.open('').document
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			newWin.open();
			newWin.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			newWin.close();
		}).on('click', '#getUiLib', function(){
			$libPopup.data('data') ? $libPopup.trigger('showDialog') : socket.emit('data', {
				topic: 'bower/editor/lib'
			});
		}).on('click', '#getDemoImg', function(){
			$demoImgLibPopup.data('data') ? $demoImgLibPopup.trigger('showDialog') : socket.emit('data', {
				topic: 'editor/demoImgLib'
			});
		});

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

		// 素材图片上传结果
		$('#demoImgUploadRs').on('load', function(){
			var res = this.contentDocument.body.innerHTML;

			res = $.parseJSON( res );

			$demoImgLibPopup.find('#demoImgList').prepend( demoImgLibTpl(res) );
		});
		$('#editorSaveRs').on('load', function(){
			var res = this.contentDocument.body.innerHTML;

			res = $.parseJSON( res );


		});

		$(window).bind('beforeunload', function(){
			if( isEdit ){
				return '确定不保存您幸苦写下的代码么？';
			}
		});

		socket.register({
			'editor/code/save': function(data){
				$savePopup.trigger('closeDialog');

				if( 'error' in data ){
					$alert.find('#alertConternt').html('保存失败' + data.msg)
						.end().trigger('showDialog');
				}
				else{
					if( data.msg === 'success' && location.search !== '?id='+ data.id ){
						location.search = '?id='+ data.id;
					}
					else{
						$alert.find('#alertContent').html('保存成功')
							.end().trigger('showDialog');
					}
				}
			}
			, 'editor/lib': function(data){
				var cssLib = $cssLib.val()
					, jsLib = $jsLib.val()
					;
				cssLib = cssLib ? cssLib.split(',') : [];
				jsLib = jsLib ? jsLib.split(',') : [];
				//con
				$libPopup.data('data', true)
					.find('#uiLibList').html( uiLibTpl(data.data).join('')).find('dd input:checkbox').each(function(){
						var v = this.value;

						if( $.inArray(v, jsLib) !== -1 || $.inArray(v, cssLib) !== -1 ){
							$(this).trigger('click');
						}
					}).end().trigger('showDialog');
			}
			, 'editor/demoImgLib': function(data){
				$demoImgLibPopup.data('data', true).find('#demoImgList').html( demoImgLibTpl(data.data).join('') ).end().trigger('showDialog');
			}
		});
	});
});