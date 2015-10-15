/**
 *
 * */

/**
 * @module  editor UI 设置
 * */
define('editorLayout', ['jquery', 'global', 'template'], function($, g){
	var listTpl = $.template({
			template: 'li.%on%.%sp%[title=%name% data-type=%type%]{%name%}'
		})

		, LAYOUT_LIST = [{
			name: '默认布局', type: '0', on: 'on'}, {
			name: '四行布局', type: '1'}, {
			name: '四列布局', type: '2'}, {
			name: '四角布局', type: '3'}, {
			name: '全屏 HTML', type: '4', sp: 'sp'}, {
			name: '全屏 CSS', type: '5', sp: 'sp'}, {
			name: '全屏 JS', type: '6', sp: 'sp'}, {
			name: '全屏结果', type: '7', sp: 'sp'
		}]
		, $layoutList = $('#changeLayout').on({
			click: function(){

				beforeCallback && beforeCallback();

				$layoutList.slideToggle().prev().toggle();
			}
		}).after('<button id="showHTML" class="icon showSp" title="更改布局">html</button>' +
			'<button id="showCSS" class="icon showSp" title="更改布局">css</button>' +
			'<button id="showJS" class="icon showSp" title="更改布局">js</button>' +
			'<button id="showRS" class="icon showSp" title="更改布局">结果</button>' +
			'<span class="arrow hidden"></span><ul class="list scrollBar layoutList hidden"></ul>')
			.nextAll('ul').append( listTpl(LAYOUT_LIST).join('') )
			.on('click', 'li', function(){
			var $that = $(this)
				, type = $that.data('type')
				;

			$that.addClass('on').siblings('.on').removeClass('on');

			$layoutList.triggerHandler('setLayout', [type]);
		})
			.on({
			setLayout: function(e, layout){

				beforeCallback && beforeCallback();

				g.$container.addClass('Container-eFS');

				$editor.removeClass('editor-4row editor-4col editor-4cor editor-htmlFS editor-cssFS editor-jsFS editor-rsFS');
				$currentShow && $currentShow.removeClass('on');

				switch( layout ){
					case 1:
						$editor.addClass('editor-4row');
						$currentShow = null;
						break;
					case 2:
						$editor.addClass('editor-4col');
						$currentShow = null;
						break;
					case 3:
						$editor.addClass('editor-4cor');
						$currentShow = null;
						break;
					case 4:
						$editor.addClass('editor-htmlFS');
						$currentShow = $showHTML.addClass('on');
						$layoutList.find('li.on').removeClass('on').end().find('li[data-type="4"]').addClass();
						break;
					case 5:
						$editor.addClass('editor-cssFS');
						$currentShow = $showCSS.addClass('on');
						$layoutList.find('li.on').removeClass('on').end().find('li[data-type="5"]').addClass();
						break;
					case 6:
						$editor.addClass('editor-jsFS');
						$currentShow = $showJS.addClass('on');
						$layoutList.find('li.on').removeClass('on').end().find('li[data-type="6"]').addClass();
						break;
					case 7:
						$editor.addClass('editor-rsFS');
						$currentShow = $showRS.addClass('on');
						$layoutList.find('li.on').removeClass('on').end().find('li[data-type="7"]').addClass();
						break;
					case 0:
					default:
						g.$container.removeClass('Container-eFS');
						$currentShow = null;
						break;
				}

				$layoutList.slideUp().prev().hide();
				html.refresh();
				css.refresh();
				js.refresh();
			}
		})

		, $currentShow
		, $showHTML = $('#showHTML').on('click', function(){
			if( $currentShow !== $showHTML ){

				$layoutList.triggerHandler('setLayout', [4]);
			}
		})
		, $showCSS = $('#showCSS').on('click', function(){
			if( $currentShow !== $showCSS ){

				$layoutList.triggerHandler('setLayout', [5]);
			}
		})
		, $showJS = $('#showJS').on('click', function(){
			if( $currentShow !== $showJS ){

				$layoutList.triggerHandler('setLayout', [6]);
			}
		})
		, $showRS = $('#showRS').on('click', function(){
			if( $currentShow !== $showRS ){

				$layoutList.triggerHandler('setLayout', [7]);
			}
		})

		, $editor
		, html
		, css
		, js
		, beforeCallback

		, layoutList = {
			$target: $layoutList
			, show: function(){
				$layoutList.slideDown().prev().show();
			}
			, hide: function(){
				$layoutList.slideUp().prev().hide();
			}
			, setSkin: function(skin){
				this.$target.triggerHandler('setLayout', [skin]);
			}
		}
		;

	return function($e, h, c, j, before){
		$editor = $e;
		html = h;
		css = c;
		js = j;

		beforeCallback = before;

		return layoutList;
	};
});
define('uiLibPopup', ['jquery', 'socket', 'template'], function($, socket){
	var // UI 库
		pathTpl = $.template({
			template: 'div>label>input[type=checkbox value=%path%]+span.left.icon.icon-checkbox[title=%path%]{%path%}'
		})
		, uiLibTpl = $.template({
			template: 'dt>label>span.right.icon.icon-down{%version%}+input[type=checkbox]+span.left.icon.icon-checkbox[title=%name%]{%name%}^^dd.hidden{%paths%}'
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
		}).on('click', '.right', function(){
			$(this).toggleClass('icon-down icon-up').parents('dt').next().slideToggle();
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

require(['../../config'], function(config){
	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket'
		, config.dataSource.skin
		, 'codeEditor'
		, 'codeEditorSkin'
		, 'editorLayout'
		, 'uiLibPopup'
		, 'demoImgLibPopup'
		, 'setMorePopup'
		, 'tag', config.dataSource.tag
		, 'msgPopup'
		, 'template'], function($, g, socket, skin, code, codeSkin, layout, initUiLib, demoImg, setMore, tag, tagsData, msgPopup){
		var $editor = $('#editor')
			, $form = $editor.find('#editorForm')
			, $toolbar = $editor.find('.toolbar')

			, $cssLib = $editor.find('#cssLib')
			, $jsLib = $editor.find('#jsLib')

			, html = $editor.find('#html')
			, css = $editor.find('#css')
			, js = $editor.find('#js')
			, $rs = $editor.find('#result')

			, $name = $editor.find('#name')

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

				$name.val( $codeName.val() );

				//isEdit = false;
				// todo 如果 isEdit === true 将代码提交
			})

			, $codeName = $setMorePopup.find('#codeName')

			, skinList
			, layoutList
			;

		tag($.parseJSON(tagsData) );
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

		html = code(html[0], 'html');
		css = code(css[0], 'css');
		js = code(js[0], 'js');

		html.on('change', editFunc);
		css.on('change', editFunc);
		js.on('change', editFunc);

		$('#save').on('click', function(e){
			e.preventDefault();

			html.save();
			css.save();
			js.save();

			var
				//form = $form.serializeArray()
				//,
				data = $form.serializeJson()
				//, t
				;
			//$.each(form, function(i, d){
			//	t = d.name;
			//
			//	if( t in data ){
			//		data[t] += ','+ d.value;
			//	}
			//	else{
			//		data[t] = d.value;
			//	}
			//});

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

		skin = $.parseJSON( skin );
		skinList = codeSkin(skin.skin, config.requireConfig.baseUrl, [html, css, js], function(){
			layoutList.hide();
		});
		layoutList = layout($editor, html, css, js, function(){
			skinList.hide();
		});
		initUiLib($jsLib, $cssLib);

		skinList.setSkin();

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
				msgPopup.showMsg('保存失败' + data.msg);
				//$alert.find('#alertConternt').html('保存失败' + data.msg).end().trigger('showDialog');
			}
			else{
				isEdit = false;

				if( location.search !== '?id='+ data.info.id ){
					location.search = '?id='+ data.info.id;
				}
				else{
					msgPopup.showMsg('保存成功');
					//$alert.find('#alertContent').html('保存成功').end().trigger('showDialog');
				}
			}
		});
	});
});