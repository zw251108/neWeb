'use strict';

/**
 * @file    兼容上一框架代码
 * */

import tg   from './index.js';

let t = tg.api
	;

Object.keys( t ).forEach((d)=>{console.log(d)
	d = t[d];
console.log(d.constructor);
for( let k in d.constructor.prototype ){console.log(k)
// 	if( d.hasOwnProperty(k) && typeof d[k] === 'function' ){console.log(k)
// 		d['_$'+ k] = d[k];
//
// 		let temp = d[k].toString()
// 			, args
// 		;
//
// 		args = /\(([a-zA-Z_$,]*?)\)/.exec( temp );
//
// 		if( args ){
// 			args = args[1].split(',');
// 		}
// 		else{
// 			args = [];
// 		}
//
// 		d[k] = function(params={}){
// 			params.data = params.data || {};
// 			params.success = params.success || function(){};
// 			params.tgError = params.tgError || function(){};
//
// 			this['_$'+ k].apply(this, args.map((a)=>{
// 				if( a === 'options' || a === 'data' ){
// 					return params.data;
// 				}
// 				else{
// 					return params.data[a];
// 				}
// 			})).then(params.success, params.tgError);
// 		}
// 	}
}
	// Object.keys( d ).forEach((k)=>{console.log(k)
	// 	if( typeof d[k] === 'function' ){console.log(k)
	//
	// 	}
	// });
});