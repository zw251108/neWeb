'use strict';

import report from 'report';

/**
 * @file    开启全局 scp 监听事件
 * @desc    利用事件捕获的机制来实现，触发时发送 scp，同时发送点击时的屏幕坐标、页面坐标
 * */

window.addEventListener('click', function(e){
	let target = e.target
		;

	if( target.dataset && target.dataset.scp ){
		report('', {
			scp: target.dataset.scp
			, clientX: e.clientX
			, clientY: e.clientY
			, pageX: e.pageX
			, pageY: e.pageY
		});
	}
}, true);
