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

		this._eventList = {};
		this.localStorage = window.localStorage;

		// // todo 监控事件
		// window.addEventListener('storage', function(e){
		// 	var key = e.key
		// 		, newVal = e.newValue
		// 		, oldVal = e.oldValue
		// 		, rs = true
		// 		;
		//
		// 	if( key in this._eventList ){
		// 		rs = this._eventList[key].reduce((a, d)=>{
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
		this._setIndex( key );

		if( typeof value === 'object' ){
			value = JSON.stringify( value );
		}

		return Promise.resolve( this.localStorage.setItem(key, value) );
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		this._setIndex( key );

		return Promise.resolve( this.localStorage.getItem(key) );
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		this._removeIndex( key );

		return Promise.resolve( this.localStorage.removeItem(key) );
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );
		this.localStorage.clear();
	}

	/**
	 * @desc    绑定数据监视事件
	 * @param   {String}    key 数据键值
	 * @param   {Function}  callback    事件触发函数
	 * */
	on(key, callback){
		if( !(key in this._eventList) ){
			this._eventList[key] = [];
		}

		this._eventList[key].push( callback );
	}
}

// todo 全局 storage 事件监听
LocalStorageModel.eventListener = function(){

};

Model.register('localStorage', LocalStorageModel);

export default LocalStorageModel;