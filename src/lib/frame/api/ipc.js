'use strict';

import Model        from '../model/index.js';
import ServiceModel from '../model/service.js';
import domain       from '../runtime/domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   ipc 异业联盟业务模块，二/三级域名 member，在 Model.factory 工厂方法注册为 ipc，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class IpcServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['member'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 联盟商家首页 tab
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://member.test.66buy.com.cn/publics/ipcType/listAll]
	 * @todo    接口中心未查到
	 * */
	listAll(){
		return this.getData('/publics/ipcType/listAll');
	}

	/**
	 * @summary 商家联盟
	 * @param   {Number|String} cityId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://member.test.66buy.com.cn/publics/ipcItem/storeIpc]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3325}
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
	 * @summary 加载列表
	 * @param   {Number}        ipcTypeId
	 * @param   {Number|String} storeId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://member.test.66buy.com.cn/publics/ipcItem/list]
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
	 * @summary 联盟商家详情页
	 * @param   {Number|String} id  商家联盟 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://member.test.66buy.com.cn/publics/ipcItem/detail]
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
	 * @summary 查询门店会员卡名称
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://member.test.66buy.com.cn/publics/storeCardInfo/getName]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3001}
	 * @todo    member 下有同名方法，调用相同接口，取消？
	 * */
	getName(storeId){
		return this.setData('/publics/storeCardInfo/getName', {
			data: {
				storeId
			}
		});
	}
}

Model.register('ipc', IpcServiceModel);

export default IpcServiceModel;