'use strict';

var Tools = {
	prefixZero: function(num){
		return num > 9 ? num : '0'+ num;
	}

	// 处理时间格式
	, dateFormat: function(date){
		var m, d
			;

		if( !date || !(date instanceof Date) ){
			date = new Date();
		}

		m = date.getMonth() +1;
		d = date.getDate();

		return date.getFullYear() +'-'+ Tools.prefixZero( m ) +'-'+ Tools.prefixZero( d );
	}
	, datetimeFormat: function(date){
		var m, d, h, mm, s;

		if( !date || !(date instanceof Date) ){
			date = new Date();
		}

		m = date.getMonth() +1;
		d = date.getDate();
		h = date.getHours();
		mm = date.getMinutes();
		s = date.getSeconds();

		return date.getFullYear() +'-'+ Tools.prefixZero( m ) +'-'+ Tools.prefixZero( d ) +' '+ Tools.prefixZero( h ) +':'+ Tools.prefixZero( mm ) +':'+ Tools.prefixZero( s );
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

		return target;
	}
	// 变量格式转换
	, varTranslate: function(s){
		return s.replace(/_([a-z])/g, function(s, i){
			return i.toUpperCase();
		});
	}
	// HTML 转码
	, encodeHTML: function(html){
		return html.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\$/, '&#36;')
			;
	}
};

module.exports = Tools;