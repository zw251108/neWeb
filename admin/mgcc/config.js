'use strict';

import maple    from 'cyan-maple';

maple.setDefaultDI();
maple.useAxios();

/**
 * @file 全局配置文件
 *
 * 这里可以根据环境变量来做一些配置
 * import.meta.env 为 vite 提供的环境变量
 * */

let baseUrl
	, imgRoot
	, env
	;

if( import.meta.env.DEV ){  // 开发模式
	baseUrl = '//localhost:9001';
	imgRoot = '//localhost:9001';
	env = 'dev';
}
else{
	baseUrl = '//zw150026.com';
	imgRoot = '//zw150026.com';
	env = 'online'
	maple.setDebug( false );
}

const CONFIG = {
		prefix: ''
		, baseUrl
		, imgRoot
	}
;

function prefix(title){
	return CONFIG.prefix ? `${CONFIG.prefix}-${title}` : title;
}

function imgPath(path){
	return `${CONFIG.imgRoot}${path}`;
}

export default CONFIG;

export {
	prefix
	, imgPath
	, baseUrl
	, env
};