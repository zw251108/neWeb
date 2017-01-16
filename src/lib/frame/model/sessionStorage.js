'use strict';

import Model from './model';

/**
 * @class
 * @extends Model
 * */
class SessionStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( 'sessionStorage' in self ){
			this._store = Promise.resolve( self.sessionStorage );
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 sessionStorage') );
		}
	}

	/**
	 * 设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(key, value){
		return this._store.then((store)=>{
			store.setItem(key, this._stringify(value));

			this._trigger(key, value);

			return true;
		});
	}
	/**
	 * 获取数据
	 * @param   {String}    key
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的 value
	 * */
	getData(key){
		return this._store.then((store)=>{
			let value = store.getItem(key)
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
	 * 将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(key){
		return this._store.then((store)=>{
			store.removeItem(key);

			this._trigger(key, null);

			return true;
		});
	}
	/**
	 * 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		return this._store.then((store)=>{
			store.clear();

			return true;
		});
	}
}

Model.register('sessionStorage', SessionStorageModel);

export default SessionStorageModel;