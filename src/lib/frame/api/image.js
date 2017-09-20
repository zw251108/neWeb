'use strict';

import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';
import domain       from 'domainConfig';

/**
 * @class
 * @classdesc   图片相关操作模块，将 CDN 相关操作整合，二/三级域名 img，在 Model.factory 工厂方法注册为 image，别名 img，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class ImageServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['img'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
			this._config.imagePath = 'test.img.tg-img.com';
		}
		else{
			this._config.domainList.push( domain.host );
			this._config.imagePath = 'image1.' + domain.host
		}

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 获取图片的绝对路径，并添加相关后缀（与又拍云相关）
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
				rs = this._config.imagePath + url + (ImageServiceModel.POSTFIX[type] || '');
			}
		}

		return rs;
	}
	/**
	 * @summary 占位图路径处理
	 * @param   {String}    [imgType='']
	 * @return  {String}    图片路径
	 * @todo    未实现
	 * */
	errorHandler(imgType=''){

	}

	/**
	 * @summary 异步上传图片
	 * @param   {FormData}  formData
	 * @param   {File}      formData.file
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://img.test.66buy.com.cn/fileUploader/syncImg]
	 * @todo    接口中未查到
	 * */
	syncImg(formData){
		return this.setData('/fileUploader/syncImg', {
			data: formData
			, processData: false
			, contentType: false
		});
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

Model.register('image', ImageServiceModel);

Model.registerAlias('image', 'img');

export default ImageServiceModel;