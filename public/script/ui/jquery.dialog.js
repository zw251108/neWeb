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
	dialog form button:submit.dialog_btn.dialog_ok[value=1]
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
	dialog form button:submit.dialog_btn.dialog_ok[value=1]
	dialog form button:submit.dialog_btn.dialog_cancel[value=0]
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
	var methods = {

		}
		, isOrigin = (function(){
			var dialog = document.createElement('dialog');

			return 'returnValue' in dialog;
		})()
		, log = function( msg ){
			console && console.log && console.log( msg );
		}
		;

	var Dialog = function( options ){
		var model = options.model
			, opts = $.extend({}, Dialog.model[model], options)
			, $dialog
			, dialog
			, $dialogOperate
			, btns = []
			;

		$dialog = $('<dialog class="dialog"></dialog>').appendTo(document.body);
		dialog = $dialog[0];

		opts.extendClass && $dialog.addClass( opts.extendClass );

		$dialog.data('options', opts).on({
			show: function(){
				isOrigin ? this.show() : $dialog.show();
			}
			, close: function(){
				var returnValue = isOrigin ? this.returnValue : $dialog.data('returnValue')
					, cb
					;
				if( returnValue === '1' ){  // OK
					cb = opts.ok.callback;
					cb && cb.call($dialog);
				}
				else if( returnValue === '0' ){ // cancel
					cb = opts.cancel.callback;
					cb && cb.call($dialog);
				}
				else{   // 自定义事件
					returnValue = +returnValue - 2;

					cb = opts.buttons[returnValue];
					cb && cb.callback.call($dialog)
				}

				cb && cb.call( $dialog );

				//if( model === 'alert' ){
				//
				//}
			}
			, hide: function(){
				isOrigin ? this.close() : $dialog.hide();
				$dialog.triggerHandler('close');
			}
		}).on('click', '.dialog_close', function(){
			var rv = model !== 'alert' ? '0' : '1';

			isOrigin ? (dialog.returnValue = rv) : $dialog.data('returnValue', rv);

			$dialog.triggerHandler('hide');
		});

		if( model !== 'tips' ){
			$dialogOperate = $('<form class="dialog_operate" method="dialog"></form>').appendTo( $dialog );

			btns.push(opts.ok);

			if( model === 'dialog' ){
				btns.push.apply(btns, opts.buttons);
			}

			btns.push(opts.cancel);

			btns = btns.sort(function(a, b){
				return a.index - b.index;
			});

			$dialogOperate.append( $.map(btns, function(d, k){
				return '<button type=""'+d +''
			}).join('') );
		}

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

	};

	Dialog.defaults = {
		title: ''
		, content: ''
		, ok: {}
		, cancel: {}
		, buttons: []
		, minHeight: ''
		, minWidth: ''
		, height: ''
		, width: ''
		, zIndex: 100
		, extendClass: ''
		, model: 'dialog'
	};
	Dialog.model = {
		dialog: {
			title: ''
			, content: ''

		}
		, tips: {
			content: ''
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