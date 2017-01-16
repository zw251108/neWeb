'use strict';

import Req from './req';

/**
 * @class
 * @extends Req
 * @desc    加载静态资源
 * */
class LoadReq extends Req{
	/**
	 * @constructor
	 * */
	constructor(){
		super();
	}

	/**
	 * 通过 HTML 标签的方式获取资源
	 * @private
	 * @param   {String}    url
	 * @param   {String}    type
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	_getByTag(url, type){
		return new Promise((resolve, reject)=>{
			let dom
				;

			switch( type ){
				case 'iframe':
					dom = document.createElement('iframe');
					dom.src = url;
					dom.style.display = 'none';
					document.body.appendChild( dom );
					break;
				case 'html':
					// todo
					break;
				case 'img':
				case 'image':
					dom = document.createElement('image');
					dom.src = url;
					break;
				case 'js':
				case 'script':
					dom = document.createElement('script');
					dom.src = url;
					break;
				case 'css':
				case 'style':
					dom = document.createElement('link');
					dom.href = url;
					break;
			}

			if( dom ){
				dom.onload = function(){
					resolve( dom );
				};
				dom.onerror = function(e){
					console.log( e );
					reject( e );
				};
			}
			else{
				reject( new Error('缺少文件类型') );
			}
		});
	}
	/**
	 * 通过 fetch 的方式获取资源
	 * @private
	 * @param   {String}    url
	 * @param   {String}    type
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	_getByFetch(url, type){
		return fetch( url )
		// 	.then((res)=>{
		// 	let buffer
		// 		, context
		// 		, source
		// 		, result
		// 		;
		//
		// 	switch( type ){
		// 		case 'iframe':
		// 			break;
		// 		case 'html':
		// 			// todo
		// 			break;
		// 		case 'img':
		// 		case 'image':
		// 			result = URL.createObjectURL( res.blob() );
		// 			break;
		// 		case 'js':
		// 		case 'script':
		// 			break;
		// 		case 'css':
		// 		case 'style':
		// 			break;
		// 		case 'json':
		// 			result = res.json();
		// 			break;
		// 		case 'audio':   // 音频
		// 		// case 'mp4':
		// 		// case 'webm':
		// 		// case 'mp3':
		// 		// case 'ogg':
		// 		// case 'wav':
		// 			buffer = res.arrayBuffer();
		// 			if( LoadReq._SUPPORT.audioContext ){
		// 				context = new LoadReq._SUPPORT.audioContext();
		// 				source = context.createBufferSource();
		// 				context.decodeAudioData(buffer, (decodedData)=>{
		// 					source.buffer = decodedData;
		// 					source.connect( context.destination );
		// 				});
		// 			}
		// 			break;
		// 		case 'video':   // 视频
		// 			result = res.arrayBuffer();
		// 			break;
		// 	}
		//
		// 	return result;
		// })
			;
	}

	/**
	 * 加载文件
	 * @param   {Object}    options
	 * @param   {String}    options.url     加载文件的地址
	 * @param   {String}    options.type    兼职文件的类型
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入返回结果，当支持 fetch 时，返回为 Response 对象，否则返回一个 DOM 对象
	 * */
	get(options){
		let type = (options.type || '').toLowerCase()
			, url = options.url
			, result
			;

		if( url ){
			if( LoadReq._SUPPORT.fetch ){
				result = this._getByFetch(url, type);
			}
			else{
				result = this._getByTag(url, type);
			}
		}
		else{
			result = Promise.reject( new Error('缺少文件路径') );
		}

		return result;
	}
}

LoadReq._SUPPORT = {
	fetch: 'fetch' in self
	, audioContext: (self.AudioContext || self.webkitAudioContext || null)
	, videoContext: (self.VideoContext || self.webkitVideoContext || null)
};

Req.register('load', LoadReq);

export default LoadReq;