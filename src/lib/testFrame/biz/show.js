'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   试衣秀业务模块，在 Model.factory 工厂方法注册为 show，将可以使用工厂方法生成
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
	 * @desc    试衣秀相关 - 搭讪（关注某人）
	 * @param   {Number|String} favorMemberId   用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1835}
	 * */
	friendRelationAdd(favorMemberId){
		let result
		;

		if( favorMemberId ){
			result = this.getData('/friendRelation/add', {
				method: 'POST'
				, data: {
					favorMemberId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    关注某人，与 friendRelationAdd 调用相同接口，整理为内部调用 friendRelationAdd
	 * @param   {Number|String} favorMemberId   被关注者 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link ShowServiceModel#friendRelationAdd}
	 * */
	addWatch(favorMemberId){
		return this.friendRelationAdd( favorMemberId );
	}
	/**
	 * @desc    试衣秀相关 - 取消关注某人
	 * @param   {Number|String} favorMemberId   用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1891}
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
	 * @desc    取消关注某人，与 friendRelationRemove 调用相同接口，整理为内部调用 friendRelationRemove
	 * @param   {Number|String} favorMemberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link ShowServiceModel#friendRelationRemove}
	 * */
	remove(favorMemberId){
		return this.friendRelationRemove( favorMemberId );
	}
	/**
	 * @desc    我的粉丝
	 * @param   {Object}    [data={}]
	 * @param   {Number}    [data.startNum=0]
	 * @param   {Number}    [data.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1837}
	 * */
	myFan(data={}){

		data.startNum = data.startNum || 0;
		data.pageCount = data.pageCount || 10;

		return this.getData('/friendRelation/myFan', {
			data
		});
	}
	/**
	 * @desc    我的关注
	 * @param   {Object}    [data={}]
	 * @param   {Number}    [data.startNum=0]
	 * @param   {Number}    [data.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1839}
	 * */
	myFavor(data={}){

		data.startNum = data.startNum || 0;
		data.pageCount = data.pageCount || 10;

		return this.getData('/friendRelation/myFavor', {
			data
		});
	}
	/**
	 * @desc    某人信息
	 * @param   {Number|String} favorMemberId   被观察者 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1841}
	 * */
	info(favorMemberId){
		return this.getData('/friendRelation/info', {
			data: {
				favorMemberId
			}
		});
	}
	/**
	 * @desc    他们的粉丝
	 * @param   {Number|String} currentMemberId 关注人 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2745}
	 * */
	theirFan(currentMemberId){
		return this.getData('/friendRelation/theirFan', {
			method: 'POST'
			, data: {
				currentMemberId
			}
		});
	}
	/**
	 * @desc    他们的感兴趣的人
	 * @param   {Number|String} currentMemberId 关注人 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2747}
	 * */
	theirFavor(currentMemberId){
		return this.getData('/friendRelation/theirFavor', {
			method: 'POST'
			, data: {
				currentMemberId
			}
		});
	}

	/**
	 * @desc    发布试衣秀，fittingItemId 和 itemId 必须传一个
	 * @param   {String}        imageListStr            图片地址数组
	 * @param   {String}        content                 要发布的内容
	 * @param   {Object}        options
	 * @param   {Number|String} [options.itemId]        营销商品 id
	 * @param   {number|String} [options.fittingItemId] 试衣品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1807}
	 * */
	add(imageListStr, content, options){
		return this.getData('/buyerShow/add', {
			method: 'POST'
			, data: {

			}
		});
	}
	/**
	 * @desc    试衣秀相关 - 删除试衣秀
	 * @param   {Number|String} buyerShowId     试衣秀 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1947}
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
	 * @desc    删除试衣秀，与 buyerShowClose 调用相同接口，整理为内部调用 buyerShowClose
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link ShowServiceModel#buyerShowClose}
	 * */
	close(buyerShowId){
		return this.buyerShowClose( buyerShowId );
	}
	/**
	 * @desc    试衣秀相关 - 献花
	 * @param   {Number|String} buyerShowId     试衣秀 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1815}
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
	 * @desc    献花
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1829}
	 * */
	count(){
		return this.getData('/buyerShow/count', {
			method: 'POST'
		});
	}
	/**
	 * @desc    批量清空试衣秀
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2445}
	 * */
	batchDeleteFailed(){
		return this.getData('/buyerShow/batchDeleteFailed', {
			method: 'POST'
		});
	}
	/**
	 * @desc    试衣秀详情
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1823}
	 * */
	buyerShowDetail(buyerShowId){
		let result
		;

		if( buyerShowId ){
			result = this.getData('/buyerShow/detail', {
				method: 'POST'
				, data: {
					buyerShowId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    查看全部试衣秀
	 * @param   {Object}        data
	 * @param   {Boolean}       [data.cache]        是否启用缓存
	 * @param   {Number|String} [data.subjectId]    话题 id
	 * @param   {String}        [data.orderColumn]
	 * @param   {String}        [data.orderType]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1819}
	 * */
	queryAll(data){
		return this.getData('/buyerShow/queryAll', {
			data
		});
	}
	/**
	 * @desc    查看全部试衣秀
	 * @param   {Object}    data
	 * @param   {Number}    [data.startNum]
	 * @param   {Number}    [data.pageCount]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1821}
	 * */
	queryFriends(data){
		return this.getData('/buyerShow/queryFriends', {
			data
		});
	}
	/**
	 * @desc    查询待发布的试衣秀数据
	 * @param   {Number|String} fittingItemId   试衣品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1825}
	 * @todo    页面没有调用到，取消？
	 * */
	queryStore(fittingItemId){
		return this.getData('/buyerShow/queryStore', {
			method: 'POST'
			, data: {
				fittingItemId
			}
		});
	}
	/**
	 * @desc    某人动态
	 * @param   {Number|String} favorMemberId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1827}
	 * */
	querySomeOne(favorMemberId, options={}){
		let data = {
				favorMemberId
			}
		;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/buyerShow/querySomeOne', {
			data
		});
	}
	/**
	 * @desc    查看热门推荐
	 * @param   {Object}        [data={}]
	 * @param   {String}        [data.orderColumn]  排序字段，推荐时传 'flower_count'
	 * @param   {String}        [data.orderType]    'asc' 或者 'desc'
	 * @param   {Boolean}       [data.cache]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2137}
	 * */
	queryRecommand(data={}){
		return this.getData('/buyerShow/queryRecommand', {
			method: 'POST'
			, data
		});
	}
	/**
	 * @desc    详情页查看推荐试衣秀
	 * @param   {Number|String} buyerShowId
	 * @param   {Number}        [total=6]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2577}
	 * */
	queryDetailRecommend(buyerShowId, total=6){
		return this.getData('/buyerShow/queryDetailRecommend', {
			method: 'POST'
			, data: {
				buyerShowId
				, total
			}
		});
	}
	/**
	 * @desc    专题下查询本周最热
	 * @param   {Number|String} subjectId   专题 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2743}
	 * */
	weekHot(subjectId){
		return this.getData('/buyerShow/query/weekHot', {
			method: 'POST'
			, data: {
				subjectId
			}
		});
	}

	/**
	 * @desc    添加评论
	 * @param   {Number|String} buyerShowId
	 * @param   {String}        content         要发布的内容
	 * @param   {Number|String} replyCommentId  被回复的消息 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1831}
	 * */
	addComment(buyerShowId, content, replyCommentId){
		let result
		;

		if( buyerShowId && content ){
			result = this.getData('/buyerShowComment/add', {
				data: {
					buyerShowId
					, content
					, replyCommentId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    删除评论
	 * @param   {Number|String} buyerShowCommentId  试衣秀评论 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1945}
	 * */
	removeComment(buyerShowCommentId){
		return this.getData('/buyerShowComment/delete', {
			method: 'POST'
			, data: {
				buyerShowCommentId
			}
		});
	}
	/**
	 * @desc    查询评论
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1833}
	 * */
	showCommentQuery(buyerShowId){
		let result
		;

		if( buyerShowId ){
			result = this.getData('/buyerShowComment/query', {
				buyerShowId
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    查询我的评论
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2339}
	 * */
	showCommentQueryMine(buyerShowId){
		let result
		;

		if( buyerShowId ){
			result = this.getData('/buyerShowComment/queryMine', {
				data: {
					buyerShowId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}

	/**
	 * @desc    撒娇礼相关 - 添加撒娇
	 * @param   {Number|String} buyerShowId     试衣秀 id
	 * @param   {Number|String} skuId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2895}
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
	 * @desc    撒娇礼相关 - 撒娇删除
	 * @param   {Number|String} crowdItemId     撒娇礼 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2861}
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
	 * @desc    撒娇礼相关 - 撒娇取消
	 * @param   {Number|String} crowdItemId     撒娇礼 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2859}
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
	 * @desc    打赏支付
	 * @param   {Number|String} crowdRecordId
	 * @param   {Number|String} storeId
	 * @param   {Number}        type
	 * @param   {String}        openId
	 * @param   {String}        appDeviceInfo
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	crowdRecordPay(crowdRecordId, storeId, type, openId, appDeviceInfo){
		return this.getData('/crowd/record/pay', {
			method: 'POST'
			, data: {
				crowdRecordId
				, storeId
				, type
				, openId
				, appDeviceInfo
			}
		});
	}
	/**
	 * @desc    众筹打赏
	 * @param   {Number|String} crowItemId      撒娇礼 id
	 * @param   {Number}        amount          打赏金额
	 * @param   {Boolean}       [showName=true]
	 * @param   {Object}        [options={}]    微信免登陆的情况下传
	 * @param   {String}        options.openId
	 * @param   {String}        options.wechatPhoto
	 * @param   {String}        options.wechatNickname
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2857}
	 * */
	crowdRecordAdd(crowItemId, amount, showName=true, options={}){
		let data = {
				crowItemId
				, amount
				, showName
			}
		;

		if( Object.keys(options).length ){
			data.openId = options.openId;
			data.wechatPhoto = options.wechatPhoto;
			data.wechatNickname = options.wechatNickname;
		}

		return this.getData('/crowd/record/add', {
			method: 'POST'
			, data
		});
	}

	/**
	 * @desc    获取商品所包含的专题
	 * @param   {Number|String} itemId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	querySubjectWithItem(itemId){
		return this.getData('/showSubject/queryWithItem', {
			method: 'POST'
			, data: {
				itemId
			}
		});
	}
	/**
	 * @desc    查询单个话题
	 * @param   {Number|String} subjectId
	 * @param   {String}        name
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=1953}
	 * */
	getSubject(subjectId, name){
		let result
			;

		if( validate.isInteger(subjectId) || name ){
			result = this.getData('/showSubject/getSubject', {
				method: 'POST'
				, data: {
					subjectId
					, name
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @desc    话题相关 - 查询推荐话题
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2139}
	 * */
	showSubjectQueryTop(){
		return this.getData('/showSubject/queryTop', {
			method: 'POST'
		});
	}
	/**
	 * @desc    查询推荐话题，内部调用接口与 showSubjectQueryTop 相同
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link ShowService#showSubjectQueryTop}
	 * @todo    与 showSubjectQueryTop 取其一
	 * */
	queryTop(){
		return this.showSubjectQueryTop();
	}
	/**
	 * @desc    搜索话题
	 * @param   {String}    name                    话题名称
	 * @param   {Boolean}   [needDetail=true]
	 * @param   {Object}    [options={}]
	 * @param   {Number}    [options.startNum=0]
	 * @param   {Number}    [options.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2141}
	 * */
	searchTopic(name, needDetail=true, options={}){
		let data = {
				name
				, needDetail
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.getData('/showSubject/search', {
			method: 'POST'
			, data
		});
	}

	/**
	 * @desc    我的页面获取会员身份标签
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2295}
	 * */
	getMemberLabel(){
		return this.getData('/label/getMemberLabel');
	}
	/**
	 * @desc    发布后用后查询推荐标签
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2291}
	 * @todo    有一次调用，但是被注释，取消？
	 * */
	getLabel(){
		return this.getData('/label/getRecommand');
	}
	/**
	 * @desc    发布试衣秀后添加标签
	 * @param   {Number|String} buyerShowId
	 * @param   {String}        memberLabel     选择的会员标签
	 * @param   {String}        showLabelArr    选择的多个试衣标签
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2293}
	 * */
	addLabelsByAddShow(buyerShowId, memberLabel, showLabelArr){
		return this.getData('/label/addLabelsByAddShow', {
			method: 'POST'
			, data: {
				buyerShowId
				, memberLabel
				, showLabelArr
			}
		});
	}
	/**
	 * @desc    查询可选择的会员标签
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	queryMemeberLabels(){
		return this.getData('/label/queryMemberLabels');
	}
	/**
	 * @desc    选择会员标签
	 * @param   {String}    memberLabel 选择的会员标签
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2299}
	 * */
	addMemberLabel(memberLabel){
		return this.getData('/label/addMemberLabel', {
			method: 'POST'
			, data: {
				memberLabel
			}
		});
	}
	/**
	 * @desc    话题相关 - 添加关注专辑
	 * @param   {Number|String} labelId     专辑 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
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
	 * @desc    话题相关 - 取消关注专辑
	 * @param   {Number|String} labelId     专辑 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @todo    接口中心未查到
	 * */
	followCancel(labelId){
		return this.getData('/label/follow/cancel', {
			method: 'POST'
			, data: {
				labelId
			}
		});
	}

	/**
	 * @desc    举报试衣秀
	 * @param   {Number|String} buyerShowId
	 * @param   {Number|String} reasonId    原因 id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2447}
	 * */
	addReportShow(buyerShowId, reasonId){
		return this.getData('/showReport/addShowReport', {
			method: 'POST'
			, data: {
				buyerShowId
				, reasonId
			}
		});
	}
	/**
	 * @desc    举报评论
	 * @param   {Number|String} commentId   评论 id
	 * @param   {Number|String} reasonId    原因 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2449}
	 * */
	addReportComment(commentId, reasonId){
		return this.getData('/showReport/addCommentReport', {
			method: 'POST'
			, data: {
				commentId
				, reasonId
			}
		});
	}
	/**
	 * @desc    查询举报原因
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     {@link http://dev.51tiangou.com/interfaces/detail.html?id=2499}
	 * */
	queryReason(){
		return this.getData('/showReport/query/reasons', {
			method: 'POST'
		});
	}
}

Model.register('show', ShowServiceModel);

export default ShowServiceModel;