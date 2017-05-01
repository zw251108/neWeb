'use strict';

/**
 * @file    防止运营商劫持（待测试）
 * */

/**
 * 对 document.createElement 重写，要求最后一个参数为验证参数，若验证未通过则返回空对象
 * */
document._createElement = document.createElement;
document.createElement = function(){
	let argc = arguments.length
		, rs
		;

	if( argc > 1 && arguments[argc -1] === '' ){    // 最后一个参数为验证
		rs = document._createElement.apply(document, Array.prototype.slice.call(arguments, 0, argc -1));	}
	else{   // 未通过验证
		rs = {};
	}

	return rs;
};