'use strict';

/**
 * @namespace   maple.util.tools
 * */

/**
 * @summary     将数字转成字符串在前面补 0
 * @function    fillZero
 * @memberOf    maple.util.tools
 * @param       {Number|String}     str
 * @param       {Number}            len
 * @return      {String}
 * */
let fillZero = function(str, len){
	let i
		;

	str += '';

	if( len > str.length ){
		for(i = str.length; i < len; i++){
			str = '0'+ str;
		}
	}

	return str;
};

/**
 * @summary     统计字符串长度，其中汉字计数为 2
 * @param       {String}    str
 * @return      {Number}
 * */
let strLength = function(str){
	let l = str.length
		, i = 0
		, count = 0
		;

	for(; i < l; i++ ){
		if( str.charCodeAt(i) > 255 ){
			count += 2;
		}
		else{
			count++;
		}
	}

	return count;
};

let remove = function(){
	let argc = arguments.length
		, argv
		, arr
		, i
		, l
		, t
		, index
		;

	if( argc > 1 ){
		argv = Array.prototype.slice.call( arguments );
		arr = argv.shift();
		i = 0;
		l = argv.length;
		t = argv[0];
		index = arr.indexOf(t);

		for( ; i < l; ){
			t = argv[i];
			index = arr.indexOf(t);

			if( index === -1 ){
				i++;
			}
			else{
				arr.splice(index, 1);
			}
		}

		return arr;
	}
	else{
		return arguments[0];
	}
};
// a([1,2,3,4,5,1,2,3,4,5], 2, 3, 4);

export default {
	fillZero
	, strLength
};