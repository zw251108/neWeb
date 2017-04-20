'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   试衣秀业务模块，二/三级域名 show，在 Model.factory 工厂方法注册为 show，将可以使用工厂方法生成
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
	 * @summary 试衣秀相关 - 搭讪（关注某人）
	 * @param   {Number|String} favorMemberId   用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/friendRelation/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1835}
	 * */
	friendRelationAdd(favorMemberId){
		let result
		;

		if( favorMemberId ){
			result = this.setData('/friendRelation/add', {
				data: {
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
	 * @summary 关注某人
	 * @param   {Number|String} favorMemberId   被关注者 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 friendRelationAdd 调用相同接口，整理为内部调用 friendRelationAdd
	 * @see     [friendRelationAdd]{@link ShowServiceModel#friendRelationAdd}
	 * */
	addWatch(favorMemberId){
		return this.friendRelationAdd( favorMemberId );
	}
	/**
	 * @summary 试衣秀相关 - 取消关注某人
	 * @param   {Number|String} favorMemberId   用户 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/friendRelation/remove]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1891}
	 * */
	friendRelationRemove(favorMemberId){
		return this.setData('/friendRelation/remove', {
			data: {
				favorMemberId
			}
		});
	}
	/**
	 * @summary 取消关注某人
	 * @param   {Number|String} favorMemberId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 friendRelationRemove 调用相同接口，整理为内部调用 friendRelationRemove
	 * @see     [friendRelationRemove]{@link ShowServiceModel#friendRelationRemove}
	 * */
	remove(favorMemberId){
		return this.friendRelationRemove( favorMemberId );
	}
	/**
	 * @summary 我的粉丝
	 * @param   {Object}    [data={}]
	 * @param   {Number}    [data.startNum=0]
	 * @param   {Number}    [data.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/friendRelation/myFan]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1837}
	 * */
	myFan(data={}){

		data.startNum = data.startNum || 0;
		data.pageCount = data.pageCount || 10;

		return this.getData('/friendRelation/myFan', {
			data
		});
	}
	/**
	 * @summary 我的关注
	 * @param   {Object}    [data={}]
	 * @param   {Number}    [data.startNum=0]
	 * @param   {Number}    [data.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/friendRelation/myFavor]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1839}
	 * */
	myFavor(data={}){

		data.startNum = data.startNum || 0;
		data.pageCount = data.pageCount || 10;

		return this.getData('/friendRelation/myFavor', {
			data
		});
	}
	/**
	 * @summary 某人信息
	 * @param   {Number|String} favorMemberId   被观察者 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/friendRelation/info]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1841}
	 * */
	info(favorMemberId){
		return this.getData('/friendRelation/info', {
			data: {
				favorMemberId
			}
		});
	}
	/**
	 * @summary 他们的粉丝
	 * @param   {Number|String} currentMemberId 关注人 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/friendRelation/theirFan]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2745}
	 * */
	theirFan(currentMemberId){
		return this.setData('/friendRelation/theirFan', {
			data: {
				currentMemberId
			}
		});
	}
	/**
	 * @summary 他们的感兴趣的人
	 * @param   {Number|String} currentMemberId 关注人 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/friendRelation/theirFavor]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2747}
	 * */
	theirFavor(currentMemberId){
		return this.setData('/friendRelation/theirFavor', {
			data: {
				currentMemberId
			}
		});
	}

	/**
	 * @summary 发布试衣秀
	 * @param   {String}        imageListStr            图片地址数组
	 * @param   {String}        content                 要发布的内容
	 * @param   {Object}        options
	 * @param   {Number|String} [options.itemId]        营销商品 id
	 * @param   {number|String} [options.fittingItemId] 试衣品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    fittingItemId 和 itemId 必须传一个，使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1807}
	 * */
	add(imageListStr, content, options){
		return this.setData('/buyerShow/add', {
			data: {

			}
		});
	}
	/**
	 * @summary 试衣秀相关 - 删除试衣秀
	 * @param   {Number|String} buyerShowId     试衣秀 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/close]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1947}
	 * */
	buyerShowClose(buyerShowId){
		return this.setData('/buyerShow/close', {
			data: {
				buyerShowId
			}
		})
	}
	/**
	 * @summary 删除试衣秀
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 buyerShowClose 调用相同接口，整理为内部调用 buyerShowClose
	 * @see     [buyerShowClose]{@link ShowServiceModel#buyerShowClose}
	 * */
	close(buyerShowId){
		return this.buyerShowClose( buyerShowId );
	}
	/**
	 * @summary 试衣秀相关 - 献花
	 * @param   {Number|String} buyerShowId     试衣秀 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/addFlower]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1815}
	 * */
	addFlower(buyerShowId){
		return this.setData('/buyerShow/addFlower', {
			data: {
				buyerShowId
			}
		})
	}
	/**
	 * @summary 献花
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/count]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1829}
	 * */
	count(){
		return this.setData('/buyerShow/count');
	}
	/**
	 * @summary 批量清空试衣秀
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/batchDeleteFailed]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2445}
	 * */
	batchDeleteFailed(){
		return this.setData('/buyerShow/batchDeleteFailed');
	}
	/**
	 * @summary 试衣秀详情
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/detail]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1823}
	 * */
	buyerShowDetail(buyerShowId){
		let result
		;

		if( buyerShowId ){
			result = this.setData('/buyerShow/detail', {
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
	 * @summary 查看全部试衣秀
	 * @param   {Object}        data
	 * @param   {Boolean}       [data.cache]        是否启用缓存
	 * @param   {Number|String} [data.subjectId]    话题 id
	 * @param   {String}        [data.orderColumn]
	 * @param   {String}        [data.orderType]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/buyerShow/queryAll]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1819}
	 * */
	queryAll(data){
		return this.getData('/buyerShow/queryAll', {
			data
		});
	}
	/**
	 * @summary 查看关注的人的试衣秀
	 * @param   {Object}    data
	 * @param   {Number}    [data.startNum]
	 * @param   {Number}    [data.pageCount]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/buyerShow/queryFriends]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1821}
	 * */
	queryFriends(data){
		return this.getData('/buyerShow/queryFriends', {
			data
		});
	}
	/**
	 * @summary 查询待发布的试衣秀数据
	 * @param   {Number|String} fittingItemId   试衣品 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/queryStore]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1825}
	 * @todo    页面没有调用到，取消？
	 * */
	queryStore(fittingItemId){
		return this.setData('/buyerShow/queryStore', {
			data: {
				fittingItemId
			}
		});
	}
	/**
	 * @summary 某人动态
	 * @param   {Number|String} favorMemberId
	 * @param   {Object}        [options={}]
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/buyerShow/querySomeOne]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1827}
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
	 * @summary 查看热门推荐
	 * @param   {Object}        [data={}]
	 * @param   {String}        [data.orderColumn]  排序字段，推荐时传 'flower_count'
	 * @param   {String}        [data.orderType]    'asc' 或者 'desc'
	 * @param   {Boolean}       [data.cache]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/queryRecommand]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2137}
	 * */
	queryRecommand(data={}){
		return this.setData('/buyerShow/queryRecommand', {
			data
		});
	}
	/**
	 * @summary 详情页查看推荐试衣秀
	 * @param   {Number|String} buyerShowId
	 * @param   {Number}        [total=6]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/queryDetailRecommend]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2577}
	 * */
	queryDetailRecommend(buyerShowId, total=6){
		return this.setData('/buyerShow/queryDetailRecommend', {
			data: {
				buyerShowId
				, total
			}
		});
	}
	/**
	 * @summary 专题下查询本周最热
	 * @param   {Number|String} subjectId   专题 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShow/query/weekHot]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2743}
	 * */
	weekHot(subjectId){
		return this.setData('/buyerShow/query/weekHot', {
			data: {
				subjectId
			}
		});
	}

	/**
	 * @summary 添加评论
	 * @param   {Number|String} buyerShowId
	 * @param   {String}        content         要发布的内容
	 * @param   {Number|String} replyCommentId  被回复的消息 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/buyerShowComment/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1831}
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
	 * @summary 删除评论
	 * @param   {Number|String} buyerShowCommentId  试衣秀评论 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/buyerShowComment/delete]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1945}
	 * */
	removeComment(buyerShowCommentId){
		return this.setData('/buyerShowComment/delete', {
			data: {
				buyerShowCommentId
			}
		});
	}
	/**
	 * @summary 查询评论
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/buyerShowComment/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1833}
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
	 * @summary 查询我的评论
	 * @param   {Number|String} buyerShowId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/buyerShowComment/queryMine]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2339}
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
	 * @summary 撒娇礼相关 - 添加撒娇
	 * @param   {Number|String} buyerShowId     试衣秀 id
	 * @param   {Number|String} skuId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/crowd/item/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2895}
	 * */
	crowdAdd(buyerShowId, skuId){
		return this.setData('/crowd/item/add', {
			data: {
				buyerShowId
				, skuId
			}
		});
	}
	/**
	 * @summary 撒娇礼相关 - 撒娇删除
	 * @param   {Number|String} crowdItemId     撒娇礼 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/crowd/item/delete]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2861}
	 * */
	crowdDelete(crowdItemId){
		return this.setData('/crowd/item/delete', {
			data: {
				crowdItemId
			}
		});
	}
	/**
	 * @summary 撒娇礼相关 - 撒娇取消
	 * @param   {Number|String} crowdItemId     撒娇礼 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/crowd/item/cancel]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2859}
	 * */
	crowdCancel(crowdItemId){
		return this.setData('/crowd/item/cancel', {
			data: {
				crowdItemId
			}
		});
	}
	/**
	 * @summary 打赏支付
	 * @param   {Number|String} crowdRecordId
	 * @param   {Number|String} storeId
	 * @param   {Number}        type
	 * @param   {String}        openId
	 * @param   {String}        appDeviceInfo
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/crowd/record/pay]
	 * @todo    接口中心未查到
	 * */
	crowdRecordPay(crowdRecordId, storeId, type, openId, appDeviceInfo){
		return this.setData('/crowd/record/pay', {
			data: {
				crowdRecordId
				, storeId
				, type
				, openId
				, appDeviceInfo
			}
		});
	}
	/**
	 * @summary 众筹打赏
	 * @param   {Number|String} crowItemId      撒娇礼 id
	 * @param   {Number}        amount          打赏金额
	 * @param   {Boolean}       [showName=true]
	 * @param   {Object}        [options={}]    微信免登陆的情况下传
	 * @param   {String}        options.openId
	 * @param   {String}        options.wechatPhoto
	 * @param   {String}        options.wechatNickname
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/crowd/record/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2857}
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

		return this.setData('/crowd/record/add', {
			data
		});
	}

	/**
	 * @summary 获取商品所包含的专题
	 * @param   {Number|String} itemId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showSubject/queryWithItem]
	 * @todo    接口中心未查到
	 * */
	querySubjectWithItem(itemId){
		return this.setData('/showSubject/queryWithItem', {
			data: {
				itemId
			}
		});
	}
	/**
	 * @summary 查询单个话题
	 * @param   {Number|String} subjectId
	 * @param   {String}        name
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showSubject/getSubject]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1953}
	 * */
	getSubject(subjectId, name){
		let result
			;

		if( validate.isInteger(subjectId) || name ){
			result = this.setData('/showSubject/getSubject', {
				data: {
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
	 * @summary 话题相关 - 查询推荐话题
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showSubject/queryTop]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2139}
	 * */
	showSubjectQueryTop(){
		return this.setData('/showSubject/queryTop');
	}
	/**
	 * @summary 查询推荐话题
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部调用接口与 showSubjectQueryTop 相同
	 * @see     [showSubjectQueryTop]{@link ShowService#showSubjectQueryTop}
	 * @todo    与 showSubjectQueryTop 取其一
	 * */
	queryTop(){
		return this.showSubjectQueryTop();
	}
	/**
	 * @summary 搜索话题
	 * @param   {String}    name                    话题名称
	 * @param   {Boolean}   [needDetail=true]
	 * @param   {Object}    [options={}]
	 * @param   {Number}    [options.startNum=0]
	 * @param   {Number}    [options.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showSubject/search]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2141}
	 * */
	searchTopic(name, needDetail=true, options={}){
		let data = {
				name
				, needDetail
			}
			;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.setData('/showSubject/search', {
			data
		});
	}

	/**
	 * @summary 我的页面获取会员身份标签
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/label/getMemberLabel]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2295}
	 * */
	getMemberLabel(){
		return this.getData('/label/getMemberLabel');
	}
	/**
	 * @summary 发布后用后查询推荐标签
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/label/getRecommand]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2291}
	 * @todo    有一次调用，但是被注释，取消？
	 * */
	getLabel(){
		return this.getData('/label/getRecommand');
	}
	/**
	 * @summary 发布试衣秀后添加标签
	 * @param   {Number|String} buyerShowId
	 * @param   {String}        memberLabel     选择的会员标签
	 * @param   {String}        showLabelArr    选择的多个试衣标签
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/label/addLabelsByAddShow]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2293}
	 * */
	addLabelsByAddShow(buyerShowId, memberLabel, showLabelArr){
		return this.setData('/label/addLabelsByAddShow', {
			data: {
				buyerShowId
				, memberLabel
				, showLabelArr
			}
		});
	}
	/**
	 * @summary 查询可选择的会员标签
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://show.test.66buy.com.cn/label/queryMemberLabels]
	 * @todo    接口中心未查到
	 * */
	queryMemeberLabels(){
		return this.getData('/label/queryMemberLabels');
	}
	/**
	 * @summary 选择会员标签
	 * @param   {String}    memberLabel 选择的会员标签
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/label/addMemberLabel]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2299}
	 * */
	addMemberLabel(memberLabel){
		return this.setData('/label/addMemberLabel', {
			data: {
				memberLabel
			}
		});
	}
	/**
	 * @summary 话题相关 - 添加关注专辑
	 * @param   {Number|String} labelId     专辑 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/label/follow/add]
	 * @todo    接口中心未查到
	 * */
	followAdd(labelId){
		return this.setData('/label/follow/add', {
			data: {
				labelId
			}
		});
	}
	/**
	 * @summary 话题相关 - 取消关注专辑
	 * @param   {Number|String} labelId     专辑 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/label/follow/cancel]
	 * @todo    接口中心未查到
	 * */
	followCancel(labelId){
		return this.setData('/label/follow/cancel', {
			data: {
				labelId
			}
		});
	}

	/**
	 * @summary 举报试衣秀
	 * @param   {Number|String} buyerShowId
	 * @param   {Number|String} reasonId    原因 id
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showReport/addShowReport]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2447}
	 * */
	addReportShow(buyerShowId, reasonId){
		return this.setData('/showReport/addShowReport', {
			data: {
				buyerShowId
				, reasonId
			}
		});
	}
	/**
	 * @summary 举报评论
	 * @param   {Number|String} commentId   评论 id
	 * @param   {Number|String} reasonId    原因 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showReport/addCommentReport]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2449}
	 * */
	addReportComment(commentId, reasonId){
		return this.setData('/showReport/addCommentReport', {
			data: {
				commentId
				, reasonId
			}
		});
	}
	/**
	 * @summary 查询举报原因
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://show.test.66buy.com.cn/showReport/query/reasons]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2499}
	 * */
	queryReason(){
		return this.setData('/showReport/query/reasons');
	}
}

Model.register('show', ShowServiceModel);

export default ShowServiceModel;