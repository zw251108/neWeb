'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';

class CodeServiceModel extends ServiceModel{
	constructor(config){
		super( config );
	}

	/**
	 * @summary 获取代码列表
	 * @param   {Object}    data
	 * @param   {Number}    data.page
	 * @param   {Number}    data.size
	 * @param   {String}    data.keyword
	 * @param   {String}    data.tags
	 * @return  {Promise}
	 * */
	getCodeList(data){
		return this.getData('/code/', {
			data
		});
	}
	/**
	 * @summary 获取代码
	 * @param   {Object}    data
	 * @param   {Number}    data.id
	 * @param   {String}    data.name
	 * */
	getCode(data){
		return this.getData('/code/editor', {
			data
		});
	}
	/**
	 * @summary 设置更多
	 * @param   {FormData}  formData
	 * @return  {Promise}
	 * */
	setMore(formData){
		return this.setMore('/code/setMore', {
			data: formData
		})
	}
}