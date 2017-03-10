'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   图片相关操作模块，将 CDN 相关操作整合
 * @extends     ServiceModel
 * */
class ImageServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = [];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push('test.img.tg-img.com');
		}
		else{
			this._config.domainList.push('image1');
			this._config.domainList.push( domain.host );
		}

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * 获取图片的绝对路径，并添加相关后缀（与又拍云相关）
	 * @param   {String}    url
	 * @param   {String}    [type='y']
	 * @return  {String}
	 * */
	getImageUrl(url, type='y'){
		let rs = ''
			;

		if( url ){
			if( domain.protocolExpr.test(url) ){
				rs = url + (ImageServiceModel.POSTFIX[type] || '');
			}
			else{
				rs = this._config.baseUrl + url + (ImageServiceModel.POSTFIX[type] || '');
			}
		}

		return rs;
	}

	/**
	 * 占位图路径处理
	 * @param   {String}    [imgType='']
	 * @return  {String}    图片路径
	 * */
	errorHandler(imgType=''){

	}
}

// todo prefixed 似乎已经没有用处？
// ImageServiceModel.PREFIXED = {
// 	e: ''
// 	, s: ''
// 	, v: ''
// 	, m: ''
// 	, y: ''
// 	, "640x260": ''
// 	, "580x220": ''
// };

/**
 * 又拍云后缀设置
 * @static
 * */
ImageServiceModel.POSTFIX = {
	e: '!e'
	, s: '!s'
	, v: '!y'
	, m: '!m'
	, y: '!y'
	, "640x260": '!640x260'
	, "580x220": '!580x220'
};

ServiceModel.register('image', ImageServiceModel);

ServiceModel.registerAlias('image', 'img');

export default ImageServiceModel;