'use strict';

import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';
import domain       from 'domainConfig';

/**
 * @class
 * @classdesc   ticket 业务模块，二/三级域名 ticket，在 Model.factory 工厂方法注册为 ticket，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class TicketServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['ticket'];

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('');
	}

	/**
	 * @summary 在线咨询
	 * @param   {String}    content
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://ticket.test.66buy.com.cn/publics/ticket/online]
	 * @todo    接口中心未查到
	 * */
	online(content){
		return this.setData('/publics/ticket/online', {
			data: {
				content
			}
		});
	}
	/**
	 * @summary 加载历史信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/publics/ticket/getUnread]
	 * @todo    接口中心未查到
	 * */
	getUnread(){
		return this.getData('/publics/ticket/getUnread');
	}

	/**
	 * @summary 未知接口
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/privates/csQaCat/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=521}
	 * */
	csQaCatList(){
		return this.getData('/privates/csQaCat/list');
	}
	/**
	 * @summary 空导，问题详情
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/privates/csQaCat/list/air]{@link http://dev.51tiangou.com/interfaces/detail.html?id=559}
	 * */
	airQuestionCode(){
		return this.getData('/privates/csQaCat/list/air');
	}
	/**
	 * @summary 空导-首页问题列表、问题详情
	 * @param   {Object}        [data={}]
	 * @param   {Boolean}       [data.top4]         热门问题前 4 条
	 * @param   {Boolean}       [data.activityTop4] 活动问题前 4 条
	 * @param   {Number}        [data.csQaCatId]    问题分类 id
	 * @param   {Number|String} [data.id]           问题 id
	 * @param   {Number}        [data.startNum]
	 * @param   {Number}        [data.pageCount]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/privates/csQaDetail/list/air]{@link http://dev.51tiangou.com/interfaces/detail.html?id=557}
	 * */
	airQueryQuestion(data={}){
		return this.getData('/privates/csQaDetail/list/air', {
			data
		});
	}
	/**
	 * @summary 空导，热门问题前 4 条
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部调用 airQueryQuestion，传递参数 top4
	 * @see     [airQueryQuestion]{@link TicketServiceModel#airQueryQuestion}
	 * */
	airQuestionTop4(){
		return this.airQueryQuestion({
			top4: true
		});
	}
	/**
	 * @summary 空导，活动问题前 4 条
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部调用 airQueryQuestion，传递参数 activityTop4
	 * @see     [airQueryQuestion]{@link TicketServiceModel#airQueryQuestion}
	 * */
	airQuestionActivityTop4(){
		return this.airQueryQuestion({
			activityTop4: true
		});
	}
	/**
	 * @summary 空导，问题详情
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部调用 airQueryQuestion，传递参数 id
	 * @see     [airQueryQuestion]{@link TicketServiceModel#airQueryQuestion}
	 * */
	airQuestionDetail(id){
		return this.airQueryQuestion({
			id
		});
	}

	/**
	 * @summary 客服中心问题分类列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/publics/csQaCat/homePage]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3223}
	 * */
	csQaCatHome(){
		return this.getData('/pulbic/csQaCat/homePage');
	}
	/**
	 * @summary 问题分类
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/publics/csQaCat/list/front]
	 * @todo    接口中心未查到
	 * */
	questionCode(){
		return this.getData('/publics/csQaCat/list/front');
	}

	/**
	 * @summary 问题列表
	 * @param   {Object}        [data={}]
	 * @param   {Number}        [data.csQaCatId]    问题分类 id
	 * @param   {String}        [data.csQaCatCode]  分类编码
	 * @param   {Boolean}       [data.top4]         前 4 条
	 * @param   {Boolean}       [data.activityTop4] 热门活动前 4 条问题
	 * @param   {Number|String} [data.id]           问题 id，单独查询一个问题使用
	 * @param   {Number}        [data.startNum]
	 * @param   {Number}        [data.pageCount]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://ticket.test.66buy.com.cn/publics/scQaDetail/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=531}
	 * */
	queryQuestion(data={}){
		return this.getData('/publics/scQaDetail/list', {
			data
		});
	}
	/**
	 * @summary 热门活动问题前 4 条
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部为调用 queryQuestion，传递参数 top4
	 * @see     [queryQuestion]{@link TicketServiceModel#queryQuestion}
	 * */
	questionTop4(){
		return this.queryQuestion({
			top4: true
		});
	}
	/**
	 * @summary 热门活动问题前 4 条
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部为调用 queryQuestion，传递 activityTop4 参数
	 * @see     [queryQuestion]{@link TicketServiceModel#queryQuestion}
	 * */
	questionActivityTop4(){
		return this.queryQuestion({
			activityTop4: true
		});
	}
	/**
	 * @summary 问题详情
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    内部为调用 queryQuestion，传递参数 id
	 * @see     [queryQuestion]{@link TicketServiceModel#queryQuestion}
	 * */
	questionDetail(id){
		return this.queryQuestion({
			id
		});
	}
}

Model.register('ticket', TicketServiceModel);

export default TicketServiceModel;