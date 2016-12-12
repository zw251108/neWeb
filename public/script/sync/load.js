'use strict';

import Sync from './sync.js';

/**
 * @class   Load
 * */
class Load extends Sync{
	/**
	 * @constructor
	 * */
	constructor(){
		super();
	}

	send(){}

	/**
	 * @desc    加载文件
	 * @param   {Object}    options
	 * @param   {String}    options.url     加载文件的地址
	 * @param   {String}    options.type    兼职文件的类型
	 * @return  {Promise}
	 * */
	get(options){
		return new Promise(function(resolve, reject){
			let type = options.type
				, url = options.url
				, dom
				;

			if( url ){
				switch( type ){
					case 'img':
					case 'image':
						dom = document.createElement('image');
						dom.src = options.url;
						break;
					case 'iframe':
						dom = document.createElement('iframe');
						dom.src = options.url;
						dom.style.display = 'none';
						document.body.appendChild( dom );
						break;
					case 'script':
						dom = document.createElement('script');
						dom.src = options.url;
						break;
					case 'css':
						dom = document.createElement('link');
						dom.href = options.url;
						break;
				}

				if( dom ){
					dom.onload = function(){
						resolve(dom);
					};
					dom.onerror = function(e){
						console.log( e );
						reject( e );
					};
				}
				else{
					reject(new Error('缺少文件类型'));
				}
			}
			else{
				reject(new Error('缺少文件路径'));
			}
		});
	}
}

Sync.register('load', Load);

export default Load;