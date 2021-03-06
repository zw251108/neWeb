/**
 *
 * */
;(function(factory, jqPath, namespace){
	// 后端
	if( typeof exports === 'object' && typeof module === 'object' ){

	}
	// 前端
	else if( typeof define === 'function' && define.amd ){
		define(function(){
			var $ = require(jqPath || 'jquery');
			return factory($);
		});
	}
	else{
		(jQuery || this)[namespace] = factory((jQuery || this), namespace);
	}
})(function($){
	'use strict';

	$ = $ || jQuery || {};

	var elemExpr = /(\w*)((?:#[\w%]*)?)((?:\.[\w\-%]*)*)((?:\[[\w\-%]*(?:=.*?)?(?:(?:\s[\w\-%]*)(?:=.*?)?)*\])?)((?:\{.*?\})?)/
		, keyListExpr = /%\w*?%/g
		, keyExpr = /%(.*)%/
		, extend = $.extend || function(target, defaults, options){
			var k;
			for( k in defaults ) if( defaults.hasOwnProperty(k) ){
				target[k] = (k in options) ? options[k] : defaults[k];
			}
			return target;
		}
		, isArray = $.isArray || Array.isArray
		, defaults = {
			template: ''
			, handler: {}
		}
		;

	var methods = {
		specialTag: {    // 特别标签
			input: ''
			, img: ''
			, br: ''
			, hr: ''
			, link: ''
			, meta: ''
		}
		, specialAttr: {    // 特殊属性
			disabled: 'disabled'
			, checked: 'checked'
		}
		, createHTML: function(rs, front, end){   // 构建元素
			var html = []
				, temp
				, tag = rs[1] || ''
				, i, j, t
				;

			// 若没有 tag 但有 id class 属性等值，tag 设为 div
			if( !tag && ( rs[2] || rs[3] || rs[4] ) ){
				tag = 'div';
			}

			if( tag ){
				// 添加标签
				html.push('<', tag);

				// 添加 id 属性
				temp = rs[2];
				html.push(temp ? ' id="' + /#(.*)/.exec(temp)[1] + '"' : '');

				// 添加 class 属性
				temp = rs[3];
				html.push(temp ? ' class="' + temp.split('.').slice(1).join(' ') + '"' : '');

				// 添加属性
				temp = rs[4];
				if( temp ){
					temp = temp.replace(/\[|\]/g, '');
					temp = temp.split(' ');

					for(i = 0, j = temp.length; i < j; i++){
						t = temp[i];

						if( t.indexOf('=') === -1 ){
							html.push(' ' + t + '="' + (t in this.specialAttr ? this.specialAttr[t] : '') +'"');
						}
						else{
							html.push(' ' + t.replace(/=(.*)$/g, '="$1"'));
						}
					}
				}

				// 判断标签是否闭合
				if( tag in this.specialTag ){
					html.push('/>');
					end.unshift('');
				}
				else{
					html.push('>');
					end.unshift('</' + tag + '>');
				}
			}

			temp = /\{(.*)\}/.exec(rs[5]);
			html.push(temp ? temp[1] : '');
			temp = html.join('');
			front.push(temp);
		}
		, operator: function(template, front, end){  // 处理操作符
			var tempArr = template.split('')
				, operate = tempArr.shift()
				, temp
				;

			switch( operate ){
				case '>':
					template = tempArr.join('');
					break;
				case '+':
					temp = end.shift();
					front.push(temp);
					template = tempArr.join('');
					break;
				case '^':
					temp = end.shift();
					front.push(temp);
					operate = tempArr.shift();
					if( operate !== '^' ){
						temp = end.shift();
						front.push(temp);
					}
					tempArr.unshift(operate);
					template = tempArr.join('');
					break;
				default:
					break;
			}

			return template;
		}
		, handleData: function(template, data, filter, keyList, index){  // 处理数据
			var i = 0
				, j = keyList ? keyList.length : 0
				, tempData
				, temp
				, key
				;

			for(; i < j; i++){
				temp = keyList[i];
				key = keyExpr.exec(temp)[1];
				tempData = key in data ? data[key] : '';

				if( filter && (key in filter) ){
					tempData = filter[key](data, index);
				}
				template = template.replace(temp, tempData);
			}
			return template;
		}
	};

	var template = function(options){
		var opts = {}
			, template
			, filter
			, front = []
			, end = []
			, rs
			, keyList
			;

		opts = extend(opts, defaults, options);

		template = opts.template;
		filter = opts.filter;

		while( template ){
			rs = elemExpr.exec(template);

			if( rs.join('') !== '' ){
				methods.createHTML(rs, front, end);
				template = template.replace(rs[0], '');
			}
			template = methods.operator(template, front, end);
		}
		front = front.concat(end);
		template = front.join('');

		keyList = template.match(keyListExpr);

		return function(data, start, end){
			data = isArray(data) ? data : [data];
			var i = end
				, j = data.length
				, temp = []
				;

			j = (i > 0 && i < j) ? i : j;
			i = start > 0 ? start : 0;
			for(; i < j; i++){
				temp.push(methods.handleData(template, data[i], filter, keyList, i));
			}

			return temp;
		};
	};

	$.template = template;

	return template;

}, '', 'emmetTpl');