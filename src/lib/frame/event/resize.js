'use strict';

/**
 * @file    全局事件 resize
 * @desc    使用捕捉方式
 * */

import debounce from '../util/debounce.js';

const RESIZE_EVENT_QUEUE = []
	;

/**
 * @callback    resize 事件触发时的回调函数
 * */
let queueExecute = function(e){
		let i = 0
			, j = RESIZE_EVENT_QUEUE.length
			, rs = true
			;

		for(; i < j; i++){
			rs = RESIZE_EVENT_QUEUE[i].call(this, e);

			if( rs === false ){
				return false;
			}
		}
	}
	, isListening = false
	, listener = queueExecute
	;

/**
 * @exports {Object}    event/resize
 * */
export default {
	/**
	 * @summary 添加执行函数
	 * @param   {Function}  resizeCallback
	 * */
	add(resizeCallback){
		if( RESIZE_EVENT_QUEUE.indexOf( resizeCallback ) !== -1 ){
			RESIZE_EVENT_QUEUE.push( resizeCallback );
		}
		else{
			console.log('该函数以及存在于队列中');
		}
	}
	/**
	 * @summary 监听 resize 事件
	 * @param   {Boolean}   [useDebounce]   是否使用弹性
	 * @param   {Number}    [wait]          若使用弹性则必填，为弹性时间，单位为毫秒
	 * */
	, on(useDebounce=false, wait){

		if( isListening ){
			return;
		}

		if( useDebounce ){
			listener = debounce(queueExecute, wait);
		}

		document.addEventListener('resize', listener, true);

		isListening = true;
	}
	/**
	 * @summary 取消监听
	 * */
	, off(){
		document.removeEventListener('resize', listener, true);

		if( 'cancel' in listener ){
			listener.cancel();

			listener = queueExecute;
		}

		isListening = false;
	}
	/**
	 * @summary 立即执行
	 * */
	, trigger(){
		if( 'immediate' in listener ){
			listener.immediate();
		}
		else{
			listener();
		}
	}
};