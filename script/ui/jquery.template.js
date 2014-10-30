/**
 * @fileOverview    HTML 模板引擎
 * @author  ZwB
 * @version 0.9
 * @function
 * @param   {object}
 *  template    {string}    模板字符串   符合 emmet 编写规则 其中 %key% 为动态插入数据
 *  filter      {object}    数据过滤操作 key 对应数据处理函数
 * @return  {function}      构造模板 HTML 代码函数
 * @description
 * @example
    var html = $.template({
        template: 'span{%sex%}',
        filter:{
            sex: function(data, i){
                return data[key] === 1?'男':'女';
            }
        }
    });
    html([{sex:1}]); // <span>男</span>
 */
;(function(p, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		p( require( jqPath || 'jquery' ) );
	}
	else if( typeof define === 'function' && define.amd ){
		define([ jqPath || 'jquery' ], p);
	}
	else{
		p();
	}
})(function($){
	'use strict';

	$ = $ || jQuery;

    var elemExpr = /(\w*)((?:#[\w%]*)?)((?:\.[\w\-%]*)*)((?:\[[\w\-%]*(?:=.*?)?(?:(?:\s[\w\-%]*)(?:=.*?)?)*\])?)((?:\{.*?\})?)/
	    , keyListExpr = /%\w*?%/g
	    , keyExpr = /%(.*)%/
	    ;

    var methods = {
        specialTag: {    // 特别标签
            input: ''
	        , img: ''
	        , br: ''
	        , hr: ''
        }
	    , attrDefault: {    // 属性默认值
		    disabled: 'disabled'
		    , checked: 'checked'

	    }
	    , createElement: function(rs, front, end){   // 构建元素
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
			    html.push( temp ? ' id="'+ /#(.*)/.exec(temp)[1] +'"' : '' );

			    // 添加 class 属性
			    temp = rs[3];
			    html.push( temp ? ' class="'+ temp.split('.').slice(1).join(' ')+ '"' : '');

			    // 添加属性
			    temp = rs[4];
			    if( temp ){
				    temp = temp.replace(/\[|\]/g, '');
				    temp = temp.split(' ');

				    for(i = 0, j = temp.length; i < j; i++){
					    t = temp[i];

					    if( t.indexOf('=') === -1 ){
						    html.push( t in this.attrDefault ? ' '+ t +'="'+ this.attrDefault[t] : t );
					    }
					    else{
						    html.push( ' '+ t.replace(/=(.*)$/g, '="$1"') );
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
				    end.unshift('</'+ tag +'>');
			    }
		    }

		    temp = /\{(.*)\}/.exec( rs[5] );
		    html.push( temp ? temp[1] : '' );
		    temp = html.join('');
		    front.push( temp );
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
                front.push( temp );
                template = tempArr.join('');
                break;
            case '^':
                temp = end.shift();
                front.push( temp );
                operate = tempArr.shift();
                if( operate !== '^' ){
                    temp = end.shift();
                    front.push( temp );
                }
                tempArr.unshift( operate );
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

            for(; i<j; i++ ){
                temp = keyList[i];
                key = keyExpr.exec(temp)[1];
                tempData =  key in data ? data[key] : '';

                if( filter && (key in filter) ){
                    tempData = filter[key](data, index);
                }
                template = template.replace(temp, tempData);
            }
            return template;
        }
    };

    $.template = function(options){
        var opts = $.extend({}, $.template.defaults, options)
	        , template = opts.template
	        , filter = opts.filter
	        , front = []
	        , end = []
	        , rs
	        , keyList;

        while( template ){
            rs = elemExpr.exec( template );

	        if( rs.join('') !== '' ){
                methods.createElement(rs, front, end);
                template = template.replace(rs[0], '');
            }
            template = methods.operator(template, front, end);
        }
        front = front.concat( end );
        template = front.join('');

        keyList = template.match( keyListExpr );

        return function(data, start, end){
	        data = $.isArray( data ) ? data : [].push( data );

            var i = end
	            , j = data.length
	            , temp = []
	            ;

            j = (i > 0 && i < j)? i : j;
            i = start > 0 ? start : 0;
            for(; i<j; i++ ){
	            temp.push( methods.handleData(template, data[i], filter, keyList, i) );
            }

            return temp;
        };
    };
    $.template.defaults = {
        template: ''
	    , filter: {}
    };

	$.template.emmet = function(html, openTag, closeTag){
		var htmlStartExpr = /^<(\w+)((?:\s[\w\-]*(?:="[\w\s\-]*"))*)\s*(\/?)>/
//			, htmlEndExpr = /<\/\w+>$/  // ?
			, attrExpr = /([\w\-]+)(?:="([\w\-\s]*)")/
			, idExpr = /id="(\w*)"/
			, classExpr = /class="([\w\s]*)"/
			, tagExpr = new RegExp( openTag +'.*?'+ closeTag )

			, $html = $( html ) // 将 HTML 代码转换成 DOM 对象
			, temp
			, $temp
			, tag
			, isClose
			, id
			, klass
			, i = 0, j = $html.length
			, rs = []
			, t
			, attArr
			, attr
			, m, n
			;

		for(; i < j; i++){
			temp = $html.get(i);
//			$temp = $html.eq(i);

			tag = htmlStartExpr( temp.outerHTML );
//			tag = htmlStartExpr( $temp[0].outerHTML );

			if( tag ){

				// 添加标签
				rs.push( tag[1] );

				if( tag[2] ){
					t = $.trim( tag[2] ).split(' ');
					attArr = [];

					for(m = 0, n = t.length; m < n; m++){

						attr = t[m];

						if( attr.indexOf('id') !== -1 ){
							id = idExpr.exec( attr )[1];
						}
						else if( attr.indexOf('class') !== -1 ){
							klass = classExpr.exec( attr )[1].split(' ').join('.');
						}
						else{
							attArr.push( attr.replace('"', '') );
						}
					}
				}
				// 判断标签是否为闭合标签
				isClose = !!tag[3];
			}

			if( temp.childNodes.length ){

			}
		}
	};
}, '');