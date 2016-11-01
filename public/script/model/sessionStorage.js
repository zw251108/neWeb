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
	 * @return  {Promise}
	 * */
	setData(key, value){
		this._setIndex( key );

		if( typeof value === 'object' ){
			value = JSON.stringify( value );
		}

		return Promise.resolve( this.sessionStorage.setItem(key, value) );
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return
	 * */
	getData(key){
		this._setIndex( key );

		return Promise.resolve( this.sessionStorage.getItem(key) );
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		this._removeIndex( key );

		return Promise.resolve( this.sessionStorage.removeItem(key) );
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );
		this.sessionStorage.clear();
	}
}

Model.register('sessionStorage', SessionStorageModel);

export default SessionStorageModel;