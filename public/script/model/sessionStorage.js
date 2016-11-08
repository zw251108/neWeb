'use strict';

import Model from './model.js';

/**
 * @class   SessionStorageModel
 * */
class SessionStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		this.sessionStorage = window.sessionStorage;
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		this._setIndex( key );

		this.sessionStorage.setItem(key, this._stringify(value));

		return Promise.resolve(true);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		var value = this.sessionStorage.getItem(key)
			;

		this._setIndex( key );

		try{
			value = JSON.parse(value);
		}
		catch(e){}

		return Promise.resolve(value);
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		this._removeIndex( key );

		this.sessionStorage.removeItem(key);

		return Promise.resolve(true);
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );

		this.sessionStorage.clear();

		return Promise.resolve(true);
	}
}

Model.register('sessionStorage', SessionStorageModel);

export default SessionStorageModel;