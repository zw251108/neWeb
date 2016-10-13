'use strict';

import Model from './model';

/**
 * @class   LocalStorageModel
 * */
class LocalStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		this.__eventList = {};
		this.localStorage = window.localStorage;

		// // todo 监控事件
		// window.addEventListener('storage', function(e){
		// 	var key = e.key
		// 		, newVal = e.newValue
		// 		, oldVal = e.oldValue
		// 		, rs = true
		// 		;
		//
		// 	if( key in this.__eventList ){
		// 		rs = this.__eventList[key].reduce((a, d)=>{
		// 			return a && d(newVal, oldVal);
		// 		}, rs);
		// 	}
		//
		// 	return rs;
		// });
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * */
	setData(key, value){
		this.__setIndex( key );

		return Promise.resolve( this.localStorage.setItem(key, value) );
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		this.__setIndex( key );

		return Promise.resolve( this.localStorage.getItem(key) );
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		return Promise.resolve( this.localStorage.removeItem(key) );
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		this.__index.forEach( d=>this.__removeIndex(d) );
		this.localStorage.clear();
	}

	/**
	 * @desc    绑定数据监视事件
	 * @param   {String}    key 数据键值
	 * @param   {Function}  callback    事件触发函数
	 * */
	on(key, callback){
		if( !(key in this.__eventList) ){
			this.__eventList[key] = [];
		}

		this.__eventList[key].push( callback );
	}
}

export default LocalStorageModel;