'use strict';

import Model from './model';

/**
 * @class   SessionStorageModel
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
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
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
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
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
		return this._store.then((store)=>{
			store.clear();

			return true;
		});
	}
}

Model.register('sessionStorage', SessionStorageModel);

export default SessionStorageModel;