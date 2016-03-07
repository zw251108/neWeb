'use strict';

/**
 *
 * */
var Handler = function(){

};

Handler.prototype = {
	// 处理时间格式
	dateFormat: function(date){
		var m = date.getMonth() + 1
			, d = date.getDate()
			;

		if( !date || !(date instanceof Date) ){
			date = new Date();
		}

		return date.getFullYear() + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d);
	}
	// 复制继承对象
	, extend: function(target, ext){
		var k;

		if( arguments.length < 2 ){
			ext = target;
			target = this;
		}

		if( ext && typeof ext === 'object' ){
			for(k in ext) if( ext.hasOwnProperty(k) ){
				target[k] = ext[k];
			}
		}
	}
	// 变量格式转换
	, varTranslate: function(s){
		return s.replace(/_([a-z])/g, function(s, i){
			return i.toUpperCase();
		});
	}
};

module.exports = Handler;