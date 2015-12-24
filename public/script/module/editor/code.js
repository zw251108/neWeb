/**
 * @module  editor UI 设置
 * */
define('editorLayout', ['jquery', 'global', 'template'], function($, g){
	var layoutListTpl = $.template({
			template: 'li.%on%.%sp%[title=%name% data-layout=%layout%]{%name%}'
			, filter: {
				on: function(d){
					return d.layout === DEFAULT_LAYOUT ? 'on' : '';
				}
			}
		})
		, layoutBtnTpl = $.template({
			template: 'button.icon.showSp[title=%name% data-layout=%layout%]{%content%}'
		})

		, LAYOUT_LIST = [{
			name: '默认布局', layout: 'editor-default', on: 'on'}, {
			name: '四行布局', layout: 'editor-4row'}, {
			name: '四列布局', layout: 'editor-4col'}, {
			name: '四角布局', layout: 'editor-4col'
		}]
		, FULL_SCREEN_LIST = [{
			name: '全屏 HTML', layout: 'editor-htmlFS', sp: 'sp', content: 'html'}, {
			name: '全屏 CSS', layout: 'editor-cssFS', sp: 'sp', content: 'css'}, {
			name: '全屏 JS', layout: 'editor-jsFS', sp: 'sp', content: 'js'}, {
			name: '全屏结果', layout: 'editor-rsFS', sp: 'sp', content: '结果'
		}]
		, DEFAULT_LAYOUT = 'editor-default'

		, $layout = $('#changeLayout').on({
			click: function(){
				var $that = $(this)
					, $parent = $that.parent()
					, parentWidth = $parent.width()
					, parentLeft = $parent.offset().left

					, width = $layoutList.width()
					, bdL = parseInt($layoutList.css('borderLeftWidth'), 10)
					, bdR = parseInt($layoutList.css('borderRightWidth'), 10)

					, $toolbar = $that.parents('.toolbar')
					, toolbarWidth = $toolbar.width()
					, toolbarLeft = $toolbar.offset().left
					;

				if( width + bdL + bdR === toolbarWidth ){
					$layoutList.css('right', (parentLeft + parentWidth - (toolbarLeft + toolbarWidth) ) + 'px');
				}
				else if( parentLeft < width ){
					$layoutList.css('right', (parentLeft + parentWidth - toolbarLeft - width) +'px');
				}
				else{
					$layoutList.css('right', 0);
				}

				layoutList.toggle();
			}
			, mouseover: function(){
				$layout.addClass('hover');
			}
			, mouseout: function(){
				$layout.removeClass('hover');
			}
		})
		, $layoutList = $layout.after('<div>' +
			layoutBtnTpl( FULL_SCREEN_LIST ).join('') +
			'</div><span class="arrow hidden"></span><ul class="list tiny scrollBar layoutList hidden"></ul>')
			.nextAll('ul').append( layoutListTpl( LAYOUT_LIST.concat( FULL_SCREEN_LIST ) ).join('') )
			.on('click', 'li', function(){
			$layoutList.triggerHandler('setLayout', [this.dataset ? this.dataset.layout : this.getAttribute('data-layout')]);
		}).on({
			setLayout: function(e, layout){

				g.$container[layout !== 'editor-default' ? 'addClass' : 'removeClass']('Container-eFS');

				$editor.removeClass('editor-4row editor-4col editor-4cor editor-htmlFS editor-cssFS editor-jsFS editor-rsFS').addClass( layout );

				$layoutList.find('[data-layout="'+ layout +'"]').addClass('on').siblings('.on').removeClass('on');
				$layoutBtns.find('[data-layout="'+ layout +'"]').addClass('on').siblings('.on').removeClass('on');

				html.refresh();
				css.refresh();
				js.refresh();
			}
			, 'mousewheel DOMMouseScroll': function(e){
				var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail
					, $that = $(this)
					;

				if( $that.height() !== this.scrollHeight ){
					if( delta < 0 ){
						if( this.scrollTop + $that.height() >= this.scrollHeight ){
							return false;
						}
					}
					else{
						if( this.scrollTop === 0 ){
							return false;
						}
					}
				}
			}
		})
		, $layoutBtns = $layout.nextAll('div').on('click', 'button', function(){
			$layoutList.triggerHandler('setLayout', [this.dataset ? this.dataset.layout : this.getAttribute('data-layout')]);
		})

		, $currentShow
		, $showHTML = $('#showHTML').on('click', function(){
			if( $currentShow !== $showHTML ){

				$layoutList.triggerHandler('setLayout', ['editor-htmlFS']);
			}
		})
		, $showCSS = $('#showCSS').on('click', function(){
			if( $currentShow !== $showCSS ){

				$layoutList.triggerHandler('setLayout', ['editor-cssFS']);
			}
		})
		, $showJS = $('#showJS').on('click', function(){
			if( $currentShow !== $showJS ){

				$layoutList.triggerHandler('setLayout', ['editor-jsFS']);
			}
		})
		, $showRS = $('#showRS').on('click', function(){
			if( $currentShow !== $showRS ){

				$layoutList.triggerHandler('setLayout', ['editor-rsFS']);
			}
		})

		, $editor
		, html
		, css
		, js

		, layoutList = {
			$target: $layoutList
			, toggle: function(){
				$layoutList.slideToggle().prev().toggle();
			}
			, show: function(){
				$layoutList.slideDown().prev().show();
			}
			, hide: function(){
				$layoutList.slideUp().prev().hide();
			}
			, setLayout: function(layout){
				$layoutList.triggerHandler('setLayout', [layout]);
			}
		}
		;

	$(document).on('click', function(){
		!$layout.hasClass('hover') && layoutList.hide();
	});

	return function($e, h, c, j){
		$editor = $e;
		html = h;
		css = c;
		js = j;

		return layoutList;
	};
});
/**
 * @module  组件选择弹窗
 * */
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
			$(this).next().removeClass('icon-checkbox-half').parents('dt').next().find('input:checkbox').prop('checked', this.checked);
		}).on('click', '.right', function(e){
			e.preventDefault();

			$(this).toggleClass('icon-down icon-up').parents('dt').next().slideToggle();
		}).on('click', 'dd input:checkbox', function(){
			var $parent = $(this).parents('dd')
				, $checkbox = $parent.find('input:checkbox')
				, lCheckbox = $checkbox.length
				, lChecked = $checkbox.filter(':checked').length
				;

			if( lChecked > 0 ){
				if( lChecked === lCheckbox ){
					$parent.prev().find('input:checkbox').prop({
						checked: true
						, indeterminate: false
					}).next().removeClass('icon-checkbox-half');
				}
				else{
					$parent.prev().find('input:checkbox').prop({
						checked: false
						, indeterminate: true
					}).next().addClass('icon-checkbox-half');
				}
			}
			else{
				$parent.prev().find('input:checkbox').prop('checked', false).next().removeClass('icon-checkbox-half');
			}
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
/**
 * @module  图片素材弹窗
 * */
define('demoImgLibPopup', ['jquery', 'socket', 'msgPopup', 'template'], function($, socket, msgPopup){
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
		var res = this.contentDocument.body.innerHTML
			;

		res = $.parseJSON( res );

		if( 'error' in res ){
			msgPopup.showMsg('图片上传失败！');
		}
		else{
			$demoImgLibPopup.find(':file').val('');
			$( demoImgLibTpl(res.info).join('') ).hide().prependTo( $demoImgLibPopup.find('#demoImgList')).fadeIn();
		}
	});

	socket.register('editor/demoImgLib', function(data){
		$demoImgLibPopup.data('data', true).find('#demoImgList').html( demoImgLibTpl(data.data).join('') ).end().trigger('showDialog');
	});
});
/**
 * @module  设置更多弹窗
 * */
define('setMorePopup', ['jquery', 'socket', 'msgPopup', 'tag', 'template'], function($, socket, msgPopup, tag){
	var $setMorePopup = $('#setMore').on('click', '#codeSave', function(){ // 点击保存
			if( $codeId.val() ){
				$setMoreForm.trigger('submit');
				$name.val( $codeName.val() );
			}
			else{
				msgPopup.showMsg('请先保存代码');
			}
		}).on('submit', '#setMoreForm', function(e){ // 提交
			if( !$codeId.val() ){
				msgPopup.showMsg('请先保存代码');
				e.preventDefault();
			}
		}).on('change', '#preview', function(e){    // 本地预览图片
			if( 'FileReader' in window ){
				var reader = new FileReader()
					, files, file
					;
				if( reader ){
					reader.onload = function(e){
						$editorPreview.find('img').removeAttr('width').removeAttr('height').attr('src', e.target.result);
					};

					files = e.target.files || e.dataTransfer.files;
					file = files[0];

					if( /image\/(?:jpeg|png|gif|jpg)/.test( file.type ) ){
						reader.readAsDataURL(file);
					}
				}
				else{
					// todo IE8 滤镜
				}
			}
		})
		, $codeId = $setMorePopup.find('#codeId')
		, $codeName = $setMorePopup.find('#codeName')
		, $setMoreForm = $setMorePopup.find('#setMoreForm')
		, $editorPreview = $setMorePopup.find('#editorPreview')
		, $setM = $setMorePopup.find('#setM').on('click', function(){   // 更多设置
			$setM.parents('legend').next().slideToggle();
		})
		, $name
		, $form
		;


	tag.setAdd( $setMorePopup );

	$('#set').on('click', function(){
		$codeName.val( $name.val() );
		$setMorePopup.trigger('showDialog');
	});

	// 预览图片上传结果
	$('#editorSetMoreRs').on('load', function(){
		var res = this.contentDocument.body.innerHTML;

		res = $.parseJSON( res );

		if( 'error' in res ){
			msgPopup.showMsg('设置失败');
		}
		else{
			msgPopup.showMsg('设置成功');
			$setMorePopup.trigger('closeDialog');
		}
	});

	return function(name, form, tagsData){
		$name = name;
		$form = form;

		tag( $.parseJSON(tagsData) );
	};
});

require(['../../config'], function(config){
	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket'
		, config.dataSource.skin, 'codeEditor', 'codeEditorSkin'
		, 'editorLayout'
		, config.dataSource.tag, 'setMorePopup'
		, 'uiLibPopup'
		, 'msgPopup'
		, 'demoImgLibPopup'
		, 'template'
	], function($, g, socket, skin, code, codeSkin, layoutList, tagsData, setMore, uiLibPopup, msgPopup){
		var $editor = $('#editor')
			, $form = $editor.find('#editorForm')

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
					'<html lang="cmn">' +
						'<head>' +
							'<meta charset="UTF-8"/>' +
							'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' +
							'<title>前端代码运行结果</title>' +
							(cssLib ? $.map(cssLib.split(','), function(d){return '<link rel="stylesheet" href="../lib/'+ d +'"/>'}).join('') : '') +
							'<style>' +	css + '</style>' +
						'</head>' +
						'<body>' +
							html +
							(jsLib ? $.map(jsLib.split(','), function(d){return '<script src="../lib/'+ d +'"></script>'}).join('') : '') +
							'<script>' + js + '</script>' +
						'</body>' +
					'</html>';
			}
			;

		g.mod('$editor', $editor);

		html = code(html[0], 'html');
		css = code(css[0], 'css');
		js = code(js[0], 'js');

		html.on('change', editFunc);
		css.on('change', editFunc);
		js.on('change', editFunc);

		// toolbar 功能按钮
		$('#newWin').on('click', function(){
			var  newWin = window.open('').document
				, cssLib = $cssLib.val()
				, jsLib = $jsLib.val()
				;

			newWin.open();
			newWin.write( runCode(html.getValue(), css.getValue(), js.getValue(), cssLib, jsLib) );
			newWin.close();
		});
		$('#save').on('click', function(e){
			e.preventDefault();

			html.save();
			css.save();
			js.save();

			var data = $form.serializeJSON()
				;

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

		layoutList = layoutList($editor, html, css, js);

		skin = $.parseJSON( skin );
		codeSkin = codeSkin(skin.skin, config.requireConfig.baseUrl, [html, css, js]);

		setMore($name, $form, tagsData);

		uiLibPopup($jsLib, $cssLib);

		$(window).on('beforeunload', function(){
			if( isEdit ){
				return '确定不保存您幸苦写下的代码么？';
			}
		});

		socket.register('editor/code/save', function(data){

			if( 'error' in data ){
				msgPopup.showMsg('保存失败' + data.msg);
			}
			else{
				isEdit = false;

				if( location.search !== '?id='+ data.info.id ){
					location.search = '?id='+ data.info.id;
				}
				else{
					msgPopup.showMsg('保存成功');
				}
			}
		});
	});
});