'use strict';

import Model from './model.js';

/**
 * @class   CacheStorageModel
 * */
class CacheStorageModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}   config
	 * @param   {String?}   config.storeName
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( CacheStorageModel._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = CacheStorage._CONFIG[d];
			}

			return all;
		}, {});

		if( 'caches' in window ){
			this._store = Promise.resolve( window.caches );
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 Service Worker') );
		}
	}

	/**
	 * @desc    设置缓存
	 * @param   {String}    key
	 * @param   {Response}  response
	 * @return  {Promise}
	 * */
	setData(key, response){
		this._setIndex( key );

		return this._store.then((caches)=>{
			return caches.open( this._config.storeName )
		}).then(function(cache){
			return cache.put(key, value);
		}).then(function(){
			return true;
		});
	}
	/**
	 * @desc    获取缓存
	 * @param   {String|Request}    key
	 * @return  {Promise}
	 * */
	getData(key){
		typeof key === 'string' && this._setIndex( key );

		return this._store.then((caches)=>{
			let result
				;

			if( typeof key === 'string' ){
				result = caches.match( new Request(key) );
			}
			else if( typeof key === 'object' && key instanceof Request ){
				result = caches.match( key );
			}
			else{
				result = Promise.reject( new Error('参数错误') );
			}

			return result;
		}).then(function(response){
			let result
				;

			if( response ){
				result = response();
			}
			else{
				result = Promise.reject( new Error('不存在该缓存') );
			}

			return result;
		});
	}
	/**
	 * @desc    将缓存删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		return Promise.resolve( true );
	}
	/**
	 * @desc    情况缓存
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		this._store.then((caches)=>{
			return caches.delete( this._config.storeName );
		}).then(function(){
			return true;
		});
	}
}

CacheStorageModel._CONFIG = {
	storeName: 'storage'
};

Model.register('cacheStorage', CacheStorageModel);

export default CacheStorageModel;