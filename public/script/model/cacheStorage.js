'use strict';

import Model from './model.js';

/**
 * @class   CacheStorageModel
 * */
class CacheStorageModel extends Model{
	/**
	 * @constructor
	 * @param   {Object?}   config
	 * @param   {String?}   config.cacheName
	 * */
	constructor(config={}){
		super();

		this._config = Object.keys( CacheStorageModel._CONFIG ).reduce((all, d)=>{
			if( d in config ){
				all[d] = config[d];
			}
			else{
				all[d] = CacheStorageModel._CONFIG[d];
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
	 * @param   {String|Request}    key
	 * @param   {Response}          response
	 * @return  {Promise}           resolve 时传回 true
	 * */
	setData(key, response){
		this._setIndex( key );

		return this._store.then((caches)=>{
			return caches.open( this._config.cacheName );
		}).then(function(cache){
			return cache.put(key, response);
		}).then(function(){
			return true;
		});
	}
	/**
	 * @desc    获取缓存
	 * @param   {String|Request}    key
	 * @return  {Promise}           resolve 时传回查询到的缓存，reject 时传回 Error
	 * */
	getData(key){
		return this._store.then((caches)=>{
			let result
				;

			if( typeof key === 'string' ){

				this._setIndex( key );

				result = caches.match( new Request(key) );
			}
			else if( typeof key === 'object' && key instanceof Request ){

				this._setIndex( key.url );

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
				result = response;
			}
			else{
				if( typeof key === 'string' ){
					result = Promise.reject( new Error('不存在 '+ key +' 的缓存') );
				}
				else if( typeof key === 'object' && key instanceof Request ){
					result = Promise.reject( new Error('不存在 '+ key.url +' 的缓存') );
				}
				else{
					result = Promise.reject( new Error('不存在该缓存') );
				}
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
			return caches.delete( this._config.cacheName );
		}).then(function(){
			return true;
		});
	}

	/**
	 * @desc    基于 addAll 方法的封装
	 * @param   {Array} cacheArray
	 * */
	addAll(cacheArray){
		cacheArray.forEach( (d)=>this._setIndex(d) );

		return this._store.then((caches)=>{
			return caches.open( this._config.cacheName );
		}).then(function(cache){
			return cache.addAll( cacheArray );
		}).then(function(){
			return true;
		});
	}
}

CacheStorageModel._CONFIG = {
	cacheName: 'storage'
};

Model.register('cacheStorage', CacheStorageModel);

export default CacheStorageModel;