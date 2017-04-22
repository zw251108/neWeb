'use strict';

import Model from './model.js';

/**
 * @class
 * @classdesc   对 sessionStorage 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 sessionStorage，别名 ss，将可以使用工厂方法生成
 * @extends     Model
 * @example
let sessionStorageModel = new SessionStorageModel()
	, storage = Model.factory('sessionStorage')
	, ss = Model.factory('ss')
	;
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
	 * @summary 设置数据
	 * @param   {String}    topic
	 * @param   {*}         value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(topic, value){
		return this._store.then((store)=>{
			store.setItem(topic, this._stringify(value));

			this._trigger(topic, value);

			return true;
		});
	}
	/**
	 * @summary 获取数据
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
	 * */
	getData(topic){
		return this._store.then((store)=>{
			let value = store.getItem( topic )
				;

			if( value === null ){
				value = Promise.reject( null );
			}
			else{
				try{
					value = JSON.parse( value );
				}
				catch(e){}
			}

			return value;
		});
	}
	/**
	 * @summary 将数据从缓存中删除
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(topic){
		return this._store.then((store)=>{
			store.removeItem(topic);

			this._trigger(topic, null);

			return true;
		});
	}
	/**
	 * @summary 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		return this._store.then((store)=>{
			store.clear();

			return true;
		});
	}
}

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('sessionStorage', SessionStorageModel);

/**
 * 注册别名
 * */
Model.registerAlias('sessionStorage', 'ss');

export default SessionStorageModel;