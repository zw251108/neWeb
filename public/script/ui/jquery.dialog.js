/**
 * @file    基于 jquery 的 HTML5 dialog 标签兼容插件
 * @author  ZwB
 * @version 0.8
 * @require jquery
 * @method    $.dialog
 * @desc
 *  <pre>
 *  model alert
	 +------------------------------------+
	 |                                  |X|
	 |                                  +-+
	 |                                    |
	 |         model alert example        |
	 |                                    |
	 |                                    |
	 +------------------------------------+
	 |               +----+               |
	 |               | OK |               |
	 |               +----+               |
	 +------------------------------------+
	dialog.dialog.dialog-alert
	dialog form.dialog_operate[method=dialog]
	dialog form button:submit.dialog_btn.dialog_ok[value=ok]
	dialog form button:button.dialog_btn-custom#dialogCustom$
 *
 *  model confirm
	 +------------------------------------+
	 |                                  |X|
	 |                                  +-+
	 |                                    |
	 |        model confirm example       |
	 |                                    |
	 |                                    |
	 +------------------------------------+
	 |       +--------+  +--------+       |
	 |       |   OK   |  | Cancel |       |
	 |       +--------+  +--------+       |
	 +------------------------------------+
	dialog.dialog.dialog-alert
	dialog form.dialog_operate[method=dialog]
	dialog form button:submit.dialog_btn.dialog_ok[value=ok]
	dialog form button:submit.dialog_btn.dialog_cancel[value=cancel]
	dialog form button:button.dialog_btn-custom#dialogCustom$
 *  </pre>
 * @param   {object}    options
 *
 * @return  {object}    在页面内生成 dialog 标签所对应的 jQuery 对象
 * @example
	var $dialog = $.dialog({
		title: '弹窗示例'
		, content: '#content'
		, extendClass: 'module module-input'
	});

	@todo 添加 title 和 dialog_close 关闭按钮
	@todo 设置 dialog css 样式（宽度 高度 z-index）
 * */
;(function(factory, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		factory( require(jqPath || 'jquery') );
	}
	else if( typeof define === 'function' && define.amd){
		define([jqPath || 'jquery'], factory);
	}
	else{
		factory(jQuery);
	}
})(function($){
	'use strict';

	var isOrigin = (function(){
			var dialog = document.createElement('dialog');

			return 'returnValue' in dialog;
		})()
		, methods = {
			open: function(){
				var $content = this.data('dialogContent');

				// 在显示 dialog 前将 content 插入到 dialog 中
				$content.appendTo(this).show();

				this.triggerHandler('show');
			}
			, close: (function(){
				return isOrigin ? function(v){
					v = v || 0;
					this[0].returnValue = v;
					this.trigger('close', [v]);
				} : function(v){
					v = v || 0;
					this.data('returnValue', v)
						.hide()
						.triggerHandler('close', [v]);
				};
				// todo 将 content 还原到原来位置
			})()
		}
		, dialogEvent = {
			show: (function(){
				return isOrigin ? function(e){
					e.data.overlay ? this.showModal() : this.show();
				} : function(){
					$(this).show();
				}
			})()
			, close: (function(){
				return isOrigin ? function(e, returnValue){
					$(this).triggerHandler('handleCallback', [returnValue || this.returnValue]);
				} : function(e, returnValue){
					var $dialog = $(this);
					$dialog.triggerHandler('handleCallback', [returnValue || $dialog.data('returnValue')]);
				}
			})()
			, handleCallback: function(e, returnValue){
				var $dialog = $(this)
					, opts = e.data
					, cb
					;

				switch( returnValue ){
					case 0:         // 直接退出程序
						break;
					case 'ok':      // 执行 ok 按钮的回调函数
						cb = opts.ok.callback;
						break;
					case 'cancel':  // 执行 cancel 按钮的回调函数
						cb = opts.cancel.callback;
						break;
					default:        // 自定义按钮的回调函数 returnValue 与定义的按钮的 value 相同
						cb = opts.buttons.callbackList;

						if( returnValue in cb ){
							cb = cb[returnValue];
						}
						break;
				}
				cb && cb.call( $dialog );
			}
		}
		, dialogCloseEvent = (function(){
			return isOrigin ? function(e){
				var $dialog = $(this)
					, model = e.data.model
					;

				this.returnValue = model !== 'alert' ? 'cancel' : 'ok';

				$dialog.trigger('close');
			} : function(e){
				var $dialog = $(this)
					, model = e.data.model
					;

				$dialog.data('returnValue', model !== 'alert' ? 'cancel' : 'ok')
					.hide()
					.triggerHandler('close');
			}
		})()
		, log = function( msg ){
			console && console.log && console.log( msg );
		}
		;

	var Dialog = function( options ){
		var model = options.model || 'dialog'
			, opts = $.extend({}, Dialog.defaults, Dialog.model[model], options)

			, okOpts = opts.ok && (opts.ok = $.extend(opts.ok, Dialog.okOpts))
			, okBtn = ''

			, cancelOpts = opts.cancel && (opts.cancel = $.extend(opts.cancel, Dialog.cancelOpts))
			, cancelBtn = ''

			, btnOpts = opts.buttons || []
			, btn = []
			, btnCb = {
				'0': null   // 0 为默认退出状态
			}

			, $dialog, dialog
			, $dialogOperate
			, $content = opts.content

			, i, j, t, h
			;

		$dialog = $('<dialog class="dialog"></dialog>').appendTo(document.body);
		!isOrigin && $dialog.hide();
		dialog = $dialog[0];

		opts.className && $dialog.addClass( opts.className );
		opts.extendClass && $dialog.addClass( opts.extendClass );
		opts.overlay && $dialog.addClass('dialog-bg');

		// 绑定事件
		$dialog.on(dialogEvent, opts).on('click', '.dialog_close', opts, dialogCloseEvent);
		if( !isOrigin ){
			$dialog.on('click', 'form.dialog_operate button.dialog_btn', function(){
				$dialog.data('returnValue', this.value).triggerHandler('hide');
			});
		}
		//else{
		//	$dialog.on('click', 'form.dialog_operate button:button.dialog_btn', function(){
		//		dialog.returnValue = this.value;
		//		$dialog.triggerHandler('hide');
		//	});
		//}

		// 生成按钮
		if( model !== 'tips' && (okOpts || cancelOpts || btnOpts) ){
			$dialogOperate = $('<form class="dialog_operate" method="dialog"></form>').appendTo( $dialog );

			// 按钮排序
			if( opts.sort ){
				if( okOpts ){
					okOpts.value = 'ok';
					okOpts.text = okOpts.text || 'OK';
					btnOpts.push( okOpts );
					okOpts = null;
				}
				if( cancelOpts ){
					cancelOpts.value = 'cancel';
					cancelOpts.text = cancelOpts.text || 'Cancel';
					btnOpts.push( cancelOpts );
					cancelOpts = null;
				}
				btnOpts = btnOpts.sort(function(a, b){
					return a.index - b.index;
				});

				opts.buttons = btnOpts;
			}

			if( okOpts ){
				okBtn = '<button type="submit" value="ok" class="dialog_btn dialog_ok';
				okOpts.extendClass && (okBtn += ' '+ okOpts.extendClass);
				okBtn += '">' + okOpts.text || 'OK' +'</button>';
			}

			if( cancelOpts ){
				cancelBtn = '<button type="submit" value="cancel"';
				cancelBtn += ' class="dialog_btn dialog_cancel' + (cancelOpts.extendClass ? ' '+ cancelOpts.extendClass : '') +'"';
				cancelBtn += '">' + cancelOpts.text || 'Cancel' +'</button>';
			}

			if( btnOpts && $.isArray( btnOpts ) ){
				for(i = 0, j = btnOpts.length; i < j; i++){
					t = btnOpts[i];

					if( !(t.value && t.value in btnCb) ){
						h = '<button type="submit"';
						h += ' value="' + (t.value || i) +'"';
						h += ' class="dialog_btn' + (t.extendClass ? ' '+ t.extendClass : '') +'"';
						t.id && (h += ' id="' + t.id +'"');

						h += '>' + (t.text || i) + '</button>';

						t.callback && (btnCb[t.value || i] = t.callback);

						btn.push( h );
					}
					else if( t.value in btnCb ){
						log('value 为 '+ t.value +' 的 button 已存在');
					}
				}

				btnOpts.callbackList = btnCb;
			}

			$dialogOperate.append( okBtn + btn.join('') + cancelBtn );
		}

		$content = (typeof $content === 'object' && $content.jquery) ? $content : $($content);

		$dialog.data({
			options: opts
			, dialogContent: $content
		});
		//switch( model ){
		//	case 'alert':
		//
		//		$dialogOperate.append('<button class="dialog_btn" type="submit"></button>')
		//
		//		break;
		//	case 'confirm':
		//		break;
		//	case 'dialog':
		//		break;
		//	case 'tips':
		//		break;
		//}

		$.extend($dialog, methods);

		return $dialog;
	};

	Dialog.defaults = {
		title: ''
		, content: ''
		//, ok: {}
		//, cancel: {}
		//, buttons: []
		, sort: false
		, minHeight: ''
		, minWidth: ''
		, height: ''
		, width: ''
		, zIndex: 100
		, extendClass: ''
		, overlay: true
		, model: 'dialog'
	};
	Dialog.model = {
		dialog: {
			title: ''
			, content: ''
		}
		, tips: {
			className: 'dialog-tips'
			, content: ''
		}
		, alert: {
			title: ''
			, content: ''
			, className: 'dialog-alert'
			, ok: {
				text: 'OK'
			}
		}
		, confirm: {
			title: ''
			, content: ''
			, className: 'dialog-confirm'
			, ok: {
				text: 'OK'
			}
			, cancel: {
				text: 'Cancel'
			}
		}
		//, prompt: {
		//	title: ''
		//	, content: ''
		//	, className: 'dialog-prompt'
		//	, ok: {}
		//	, cancel: {}
		//}
	};

	Dialog.cancelOpts ={
		value: 'cancel'
		, text: 'Cancel'
	};
	Dialog.okOpts = {
		value: 'ok'
		, text: 'OK'
	};

	$.dialog = Dialog;

	return Dialog;
}, '');