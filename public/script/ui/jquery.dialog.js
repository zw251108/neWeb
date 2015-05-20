/**
 * @file
 * @author  ZwB
 * @version 0.1
 * @function    $.dialog
 * @param   {object}    options
 *
 * @return  {object}(jQuery)
 * @desc
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
 *
 * todo model prompt ?
	 +------------------------------------+
	 |                                  |X|
	 |                                  +-+
	 |                                    |
	 |    model alert example             |
	 |   +----------------------------+   |
	 |   |  input something           |   |
	 |   +----------------------------+   |
	 |                                    |
	 +------------------------------------+
	 |       +--------+  +--------+       |
	 |       |   OK   |  | Cancel |       |
	 |       +--------+  +--------+       |
	 +------------------------------------+
 *
 * @example
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
					this[0].returnValue = v;
					this.trigger('close');
				} : function(v){
					this.data('returnValue', v)
						.hide()
						.triggerHandler('close');
				};
				// todo 将 content 还原到原来位置
			})()
		}
		, dialogEvent = {
			show: (function(){
				return isOrigin ? function(){
					this.show()
				} : function(){
					$(this).show();
				}
			})()
			, close: (function(){
				return isOrigin ? function(e, v){
					callback(v || this.returnValue || 0, $(this))
				} : function(e, v){
					var $dialog = $(this);

					callback(v || $dialog.data('returnValue') || 0, $dialog);
				}
			})()
		}
		, dialogCloseEvent = (function(){
			return isOrigin ? function(){
				var $dialog = $(this)
					, opts = $dialog.data('options')
					;

				this.returnValue = opts.model !== 'alert' ? 'cancel' : 'ok';

				$dialog.trigger('close');
			} : function(){
				var $dialog = $(this)
					, opts = $dialog.data('options')
					;

				$dialog.data('returnValue', opts.model !== 'alert' ? 'cancel' : 'ok')
					.hide()
					.triggerHandler('close');
			}
		})()
		, callback = function(returnValue, $dialog){
			var opts = $dialog.data('options')
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
					if( returnValue > 0 && returnValue < opts.buttons.length ){
						cb = opts.buttons[returnValue];
					}
					break;
			}

			cb && cb.call( $dialog );
		}
		, log = function( msg ){
			console && console.log && console.log( msg );
		}
		;

	var Dialog = function( options ){
		var model = options.model || 'dialog'
			, opts = $.extend({}, Dialog.defaults, Dialog.model[model], options)
			, $dialog
			, dialog
			, $dialogOperate
			, $content = opts.content

			, okOpts = opts.ok
			, okBtn = ''

			, cancelOpts = opts.cancel
			, cancelBtn = ''

			, btnOpts = opts.buttons || []
			, btn = []
			, btnCb = {}
			, i, j, t, h
			;

		$dialog = $('<dialog class="dialog"></dialog>').appendTo(document.body);
		!isOrigin && $dialog.hide();
		dialog = $dialog[0];

		opts.className && $dialog.addClass( opts.className );
		opts.extendClass && $dialog.addClass( opts.extendClass );
		opts.overlay && $dialog.addClass('dialog-bg');

		// 绑定事件
		$dialog.data('options', opts).on( dialogEvent ).on('click', '.dialog_close', dialogCloseEvent);
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
					cancelOpts.text = cancelOpts.text || 'OK';
					btnOpts.push( cancelBtn );
					cancelOpts = null;
				}
				btnOpts = btnOpts.sort(function(a, b){
					return a.index - b.index;
				});
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

					if( 'value' in t && !(t.value in btnCb) && 'text' in t ){
						h = '<button type="submit"';
						h += ' value="' + t.value +'"';
						h += ' class="dialog_btn' + (t.extendClass ? ' '+ t.extendClass : '') +'"'
						t.id && (h += ' id="' + t.id +'"');

						h += '>' + t.text + '</button>';

						t.callback && (btnCb[t.value] = t.callback);

						btn.push( h );
					}
					else if( t.value in btnCb ){
						log('value 为 '+ t.value +' 的 button 已存在');
					}
				}
			}

			$dialogOperate.append( okBtn + btnOpts.join('') + cancelBtn );
		}

		$content = (typeof $content === 'object' && $content.jquery) ? $content : $($content);
		$dialog.data('dialogContent', $content);
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
		, overlay: 'true'
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

	$.dialog = Dialog;

	return Dialog;
}, '');