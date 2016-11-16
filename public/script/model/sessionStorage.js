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

		if( 'sessionStorage' in window ){
			this._store = Promise.resolve( window.sessionStorage );
		}
		else{
			this._store = Promise.reject(new Error('此浏览器不支持 sessionStorage'));
		}
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		this._setIndex( key );

		return this._store.then((store)=>{
			store.setItem(key, this._stringify(value));

			this._trigger(key, value);

			return true;
		});
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		this._setIndex( key );

		return this._store.then(function(store){
			var value = store.getItem(key)
				;

			if( value === null ){
				value = '';
			}

			try{
				value = JSON.parse( value );
			}
			catch(e){}

			return value;
		});
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		this._removeIndex( key );

		return this._store.then((store)=>{
			store.removeItem(key);

			this._trigger(key, null);

			return true;
		});
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		this._index.forEach( d=>this._removeIndex(d) );

		return this._store.then(function(store){
			store.clear();

			return true;
		});
	}
}

Model.register('sessionStorage', SessionStorageModel);

export default SessionStorageModel;