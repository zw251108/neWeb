'use strict';

import Model        from '../model/index.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   ipc 异业联盟业务模块
 * @extends     ServiceModel
 * @todo        在非线上环境使用 member 域名，取消？
 * */
class IpcServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = [domain.isOnline ? 'tt' : 'member'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @desc    联盟商家首页 tab
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	listAll(){
		return this.getData('/publics/ipcType/listAll');
	}

	/**
	 * @desc    商家联盟
	 * @param   {Number|String} cityId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3325}
	 * */
	storeIpc(cityId, options={}){
		let data = {
				cityId
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/publics/ipcItem/storeIpc', {
			data
		});
	}
	/**
	 * @desc    加载列表
	 * @param   {Number}        ipcTypeId
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	list(ipcTypeId, storeId, options={}){
		let data = {
				ipcTypeId
				, storeId
			}
			, result
			;

		if( ipcTypeId ){

			data.startNum = options.startNum || 0;
			data.pageCount = options.pageCount || 10;

			result = this.getData('/publics/ipcItem/list', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    联盟商家详情页
	 * @param   {Number|String} id  商家联盟 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	detail(id){
		let result
			;

		if( id && validate.isInteger(id) ){
			result = this.getData('/publics/ipcItem/detail', {
				data: {
					id
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    查询门店会员卡名称
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=3001}
	 * @todo    member 下有同名方法，调用相同接口，取消？
	 * */
	getName(storeId){
		return this.getData('/publics/storeCardInfo/getName', {
			method: 'POST'
			, data: {
				storeId
			}
		});
	}
}

Model.register('ipc', IpcServiceModel);

export default IpcServiceModel;