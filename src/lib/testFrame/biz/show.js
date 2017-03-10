'use strict';

import ServiceModel from '../model/service.js';
import domain from '../domain.js';

/**
 * @class
 * @classdesc   试衣秀业务模块
 * @extends     ServiceModel
 * */
class ShowServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['show'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * 试衣秀相关 - 搭讪（关注某人）
	 * @param   {String|Number} favorMemberId   用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	friendRelationAdd(favorMemberId){
		return this.getData('/friendRelation/add', {
			method: 'POST'
			, data: {
				favorMemberId
			}
		})
	}
	/**
	 * 试衣秀相关 - 取消关注某人
	 * @param   {String|Number} favorMemberId   用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	friendRelationRemove(favorMemberId){
		return this.getData('/friendRelation/remove', {
			method: 'POST'
			, data: {
				favorMemberId
			}
		});
	}
	/**
	 * 试衣秀相关 - 删除试衣秀
	 * @param   {String|Number} buyerShowId     试衣秀 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	buyerShowClose(buyerShowId){
		return this.getData('/buyerShow/close', {
			method: 'POST'
			, data: {
				buyerShowId
			}
		})
	}
	/**
	 * 试衣秀相关 - 献花
	 * @param   {String|Number} buyerShowId     试衣秀 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	addFlower(buyerShowId){
		return this.getData('/buyerShow/addFlower', {
			method: 'POST'
			, data: {
				buyerShowId
			}
		})
	}
	/**
	 * 撒娇礼相关 - 添加撒娇
	 * @param   {String|Number} buyerShowId     试衣秀 id
	 * @param   {String|Number} skuId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	crowdAdd(buyerShowId, skuId){
		return this.getData('/crowd/item/add', {
			method: 'POST'
			, data: {
				buyerShowId
				, skuId
			}
		});
	}
	/**
	 * 撒娇礼相关 - 撒娇删除
	 * @param   {String|Number} crowdItemId     撒娇礼 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	crowdDelete(crowdItemId){
		return this.getData('/crowd/item/delete', {
			method: 'POST'
			, data: {
				crowdItemId
			}
		});
	}
	/**
	 * 撒娇礼相关 - 撒娇取消
	 * @param   {String|Number} crowdItemId     撒娇礼 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	crowdCancel(crowdItemId){
		return this.getData('/crowd/item/cancel', {
			method: 'POST'
			, data: {
				crowdItemId
			}
		});
	}
	/**
	 * 话题相关 - 查询推荐话题
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * */
	showSubjectQueryTop(){
		return this.getData('/showSubject/queryTop', {
			method: 'POST'
		});
	}
	/**
	 * 话题相关 - 添加关注专辑
	 * @param   {String|Number} labelId     专辑 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    未查到接口
	 * */
	followAdd(labelId){
		return this.getData('/label/follow/add', {
			method: 'POST'
			, data: {
				labelId
			}
		});
	}
	/**
	 * 话题相关 - 取消关注专辑
	 * @param   {String|Number} labelId     专辑 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    未查到接口
	 * */
	followCancel(labelId){
		return this.getData('/label/follow/cancel', {
			method: 'POST'
			, data: {
				labelId
			}
		});
	}
}

ServiceModel.register('show', ShowServiceModel);

export default ShowServiceModel;