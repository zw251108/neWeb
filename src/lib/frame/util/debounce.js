'use strict';

/**
 * @file    防抖函数
 * @desc    保证函数只在固定时间内最后一次触发才执行
 * */

/**
 * @function
 * @param   {Function}  func
 * @param   {Number}    wait
 * @return  {Function}
 * */
function debounce(func, wait){
	let timeout = null
		, result = function(){
			let that = this || null
				;

			if( timeout ){
				clearTimeout( timeout );
			}

			timeout = setTimeout(function(){
				func.apply(that, arguments || []);
			}, wait);
		}
		;

	/**
	 * 取消计时器
	 * */
	result.cancel = function(){
		if( timeout ){
			clearTimeout( timeout );
			timeout = null;
		}
	};

	/**
	 * 立刻调用函数
	 * */
	result.immediate = function(context=null, argv=[]){
		result.cancel();

		func.apply(context, argv);
	};


	return result;
}

export default debounce;