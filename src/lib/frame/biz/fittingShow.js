'use strict';

/**
 * @file    试衣秀相关操作
 * */

import model    from '../model/index.js';
import notice   from '../component/notice/index.js';

let show = model.factory('show')
	;

export default {
	/**
	 * @summary 试衣秀搭讪功能
	 * @param   {Number|String} memberId
	 * @param   {Object}        data
	 * @return  {Promise}
	 * @desc    data 为试衣秀或用户数据，其中应包含 friendState 属性，发送请求成功时，friendState 属性将被设置为 1
	 * */
	follow(memberId, data){
		return show.friendRelationAdd( memberId ).then(()=>{
			data.friendState = 1;
		});
	}
	/**
	 * @summary 试衣秀取消关注功能
	 * @param   {Number|String} memberId
	 * @param   {Object}        data
	 * @return  {Promise}
	 * @desc    data 为试衣秀或用户数据，其中应包含 friendState 属性，发送请求成功时，friendState 属性将被设置为 0
	 * */
	, notFollow(memberId, data){
		return show.friendRelationRemove( memberId ).then(()=>{
			notice('取消关注成功');
			
			data.friendState = 0;
		});
	}
	/**
	 * @summary 试衣秀献花功能
	 * @param   {Number|String} buyerShowId
	 * @param   {Object}        buyerShow
	 * @return  {Promise}
	 * @desc    buyerShow 为试衣秀数据，应该包含 flowerCount、hasFlower 属性，发送请求成功时，flowerCount +1，hasFlower 设为 true
	 * */
	, addFlower(buyerShowId, buyerShow){
		return show.addFlower( buyerShowId ).then(()=>{
			buyerShow.flowerCount += 1;
			buyerShow.hasFlower = true;
		});
	}
}
