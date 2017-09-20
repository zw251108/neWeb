'use strict';

/**
 * 2017-07-11
 * 将绑定 bindVM、makeArray 参数删除
 * 将中间件请求获取数据后将数据添加到 vm 中的逻辑去掉
 * */

import Vue          from 'vue';

import Model        from '../model/model.js';
import ServiceModel from 'ServiceModel';
import domain       from 'domainConfig';

// import merge        from '../util/merge.js';

/**
 * @class
 * @classdesc   中间件模块，二/三级域名 midway，在 Model.factory 工厂方法注册为 midway，别名 mid，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class MidwayServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}                [config={}]
	 * @param   {ViewModel|ViewModel[]} [config.bindVM]     绑定 ViewModel 对象，会将数据添加到 vm 中
	 * @param   {String[]}              [config.makeArray]  指定数据组装成数组
	 * */
	constructor(config={}){
		super( config );

		// todo 其它实现方式
		Object.keys( MidwayServiceModel._CONFIG ).forEach((d)=>{
			if( d in config ){
				this._config[d] = config[d];
			}
		});

		this._config.domainList = ['midway'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');

		// 定义借口缓存
		this.registAction = {};
	}

	// ---------- 私有方法 ----------
	// /**
	//  * @summary 将数据设置到绑定的 VM 中
	//  * @param   {Array} data
	//  * */
	// _setVMData(data){
	//
	// 	// if( this._config.bindVM instanceof Vue ){
	//
	// 	data.forEach((d)=>{
	// 		let key = d.key || d.name
	// 			;
	//
	// 		if( this._config.makeArray && this._config.makeArray.indexOf(key) >= 0 ){
	// 			if( key in this._config.bindVM ){
	// 				this._config.bindVM[key].push( d.data );
	// 			}
	// 			else{
	// 				this._config.bindVM.$set(key, [d.data]);
	// 			}
	// 		}
	// 		else{
	// 			this._config.bindVM.$set(key, d.data);
	// 		}
	// 	});
	// 	// }
	// 	// else if( typeof this._config.bindVM === 'object' ){
	// 	//
	// 	// }
	//
	// 	return data;
	// }

	// ---------- 公有方法 ----------
	/**
	 * @summary 定义接口
	 * @param   {String}                topic
	 * @param   {Function|Promise|*}    action
	 * @return  {Promise}
	 * */
	register(topic, action){
		let exec
			;

		if( topic in this.registAction ){
			console.log(topic, '借口已经定义，即将覆盖');
		}

		if( typeof action === 'function' ){
			exec = action;
		}
		else if( action instanceof Promise ){
			exec = ()=>{
				return action;
			};
		}
		else{
			exec = ()=>{
				return Promise.resolve( action );
			};
		}

		this.registAction[topic] = exec;
	}

	/**
	 * @summary 获取中间件数据
	 * @param   {String}    topic   中间件请求地址
	 * @param   {Object}    [options={}]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * */
	getMidData(topic, options={}){
		let result
			;

		if( topic in this.registAction ){
			result = this.registAction( options );
		}
		else{
			result = this.getData(topic, options);
		}

		// if( this._config.bindVM ){
		// 	result = result.then((data)=>{
		// 		// 数据整理，将数据添加到 VM 中
		// 		this._setVMData( data );
		//
		// 		return data;
		// 	});
		// }

		return result;
	}
	/**
	 * @summary 获取结算码
	 * @param   {Number|String} cityId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回处理过的返回结果
	 * */
	getMemberInfoToke(cityId){
		return this.setData('/index/index/memberInfoToken.node', {
			data: {
				cityId
			}
		});
	}
	/**
	 * @summary 获取有活动的门店列表
	 * @param   {Number|String} cityId
	 * @param   {String}        whichDay    YYYY-MM-DD 格式的日期
	 * @param   {Number}        lat
	 * @param   {Number}        lon
	 * @return  {Promise}
	 * */
	activityCalendarStoreList(cityId, whichDay, lat, lon){
		return this.getData('/index/activityCalendar/storeList.node', {
			data: {
				cityId
				, whichDay
				, lat
				, lon
			}
		});
	}
	/**
	 * @summary获取 sku 数据
	 * @param   {Number|String} id  商品 id
	 * @return  {Promise}
	 * */
	getSku(id){
		return this.getData('/product/listing/sku.node', {
			data: {
				id
			}
		});
	}
	/**
	 * @summary 获取跨境新人礼包
	 * @return  {Promise}
	 * @desc    目前为活动详情页面调用，获取数据后弹窗
	 * */
	overSeaPop(){
		return this.getData('/coupon/index/overseaPop.node');
	}
}
/**
 * 中间件模块默认配置
 * @static
 * @const
 * */
MidwayServiceModel._CONFIG = {
	// bindVM: null
	// , makeArray: null
};

Model.register('midway', MidwayServiceModel);

Model.registerAlias('midway', 'mid');

export default MidwayServiceModel;