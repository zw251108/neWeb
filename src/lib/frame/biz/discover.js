'use strict';

/**
 * @file    发现频道相关操作
 * */

import model    from '../model/index.js';

let discover = model.factory('discover')
	;

export default {
	/**
	 * @summary 发现频道关注某人
	 * @param   {Number|String} memberIds
	 * @param   {Object}        data
	 * @return  {Promise}
	 * @desc    memberIds 可以为多个 memberId 逗号分隔，data 为完整的发现数据，其中应包含 hasConcerned 属性
	 * */
	concern(memberIds, data){
		return discover.concern( memberIds ).then(()=>{
			data.hasConcerned = true;
		});
	}
	/**
	 * @summary 发现频道取消关注某人
	 * @param   {Number|String} memberId
	 * @param   {Object}        data
	 * @return  {Promise}
	 * @desc    data 为完整的发现数据，其中应包含 hasConcerned 属性
	 * */
	, notConcern(memberId, data){
		return discover.unconcern( memberId ).then(()=>{
			data.hasConcerned = false;
		});
	}
}