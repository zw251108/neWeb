'use strict';

import Model from './model';

/**
 * @class
 * @extends Model
 * @classdesc   在 Model.factory 工厂方法注册为 cacheStorage，别名 cs，将可以使用工厂方法生成。主要提供给 Service Worker 调用，普通页面使用场景有限
 * @example
let cacheStorageModel = new CacheStorageModel()
	, storage = Model.factory('cacheStorage')
	, cs = Model.factory('cs')
	;
 * */
class CacheStorageModel extends Model{
	/**
	 * @constructor
	 * @param   {Object}    [config]
	 * @param   {String}    [config.cacheName]
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

		if( 'caches' in self ){ // 判断
			this._store = Promise.resolve( self.caches );
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 Service Worker') );
		}
	}

	/**
	 * 设置缓存
	 * @param   {String|Request}    topic
	 * @param   {Response}          response
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(topic, response){
		return this._store.then((caches)=>{
			return caches.open( this._config.cacheName );
		}).then(function(cache){
			console.log('缓存 '+ (typeof topic === 'string' ? topic : topic.url));
			return cache.put(topic, response);
		}).then(function(){
			return true;
		});
	}
	/**
	 * 获取缓存
	 * @param   {String|Request}    topic
	 * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回查询到的缓存，reject 时传回 Error
	 * */
	getData(topic){
		return this._store.then((caches)=>{
			let result
				;

			if( typeof topic === 'string' ){
				result = caches.match( new Request(topic) );
			}
			else if( typeof topic === 'object' && topic instanceof Request ){
				result = caches.match( topic );
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
				if( typeof topic === 'string' ){
					result = Promise.reject( new Error('不存在缓存 '+ topic) );
				}
				else if( typeof topic === 'object' && topic instanceof Request ){
					result = Promise.reject( new Error('不存在缓存 '+ topic.url) );
				}
				else{
					result = Promise.reject( new Error('不存在缓存 '+ topic) );
				}
			}

			return result;
		});
	}
	/**
	 * 将缓存删除
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(topic){
		return Promise.resolve( true );
	}
	/**
	 * 清空缓存
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		this._store.then((caches)=>{
			return caches.delete( this._config.cacheName );
		}).then(function(){
			return true;
		});
	}

	/**
	 * 基于 addAll 方法的封装
	 * @param   {Array} cacheArray
	 * */
	addAll(cacheArray){
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

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('cacheStorage', CacheStorageModel);

/**
 * 注册别名
 * */
Model.registerAlias('cacheStorage', 'cs');

export default CacheStorageModel;