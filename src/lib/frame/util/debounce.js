'use strict';

var debounce = function (func, wait, immediate) {
	var timeout, result;

	var later = function (context, args) {
		timeout = null;
		if (args) result = func.apply(context, args);
	};

	var debounced = restArgs(function (args) {
		// 一旦存在timeout， 意味之前尝试调用过func
		// 由于debounce只认最新的一次调用， 所以之前等待执行的func都会被终止
		if (timeout) clearTimeout(timeout);
		// 如果允许新的调用尝试立即执行，
		if (immediate) {
			// 如果之前尚没有调用尝试，那么此次调用可以立马执行，否则一定得等待之前的执行完毕
			var callNow = !timeout;
			// 刷新timeout
			timeout = setTimeout(later, wait);
			// 如果能被立即执行，立即执行
			if (callNow) result = func.apply(this, args);
		} else {
			// 否则，这次尝试调用会延时wait个时间
			timeout = delay(later, wait, this, args);
		}

		return result;
	});

	debounced.cancel = function () {
		clearTimeout(timeout);
		timeout = null;
	};

	return debounced;
};

export default debounce;
