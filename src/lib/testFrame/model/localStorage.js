'use strict';

import Model from './model.js';

/**
 * @class
 * @classdesc   对 localStorage 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 localStorage，别名 ls，将可以使用工厂方法生成
 * @extends     Model
 * @example
let localStorageModel = new LocalStorageModel()
	, storage = Model.factory('localStorage')
	, ls = Model.factory('ls')
	;

storage.getData('fittingShow/index/first').then(function(value){
	console.log('获取到 ', value);
});
 * */
class LocalStorageModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();

		if( 'localStorage' in self ){
			this._store = Promise.resolve( self.localStorage );

			!LocalStorageModel._LISTENER_ON && LocalStorageModel._listen();
		}
		else{
			this._store = Promise.reject( new Error('此浏览器不支持 localStorage') );
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
			store.removeItem( topic );

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

	/**
	 * @summary 绑定数据监视事件
	 * @param   {ModelChangeEvent}  callback
	 * */
	on(callback){

		this._eventList.push( callback );

		LocalStorageModel._EVENT_LIST.push( callback );
	}
	/**
	 * @summary 解除绑定数据监控回调函数
	 * @param   {ModelChangeEvent}  callback
	 * */
	off(callback){
		let i = this._eventList.indexOf( callback )
			;

		if( i !== -1 ){
			this._eventList.splice(i, 1);
		}

		i = LocalStorageModel._EVENT_LIST.indexOf( callback );
		if( i !== -1 ){
			LocalStorageModel._EVENT_LIST.splice(i, 1);
		}
	}
}

/**
 * 保存的事件队列
 * @static
 * */
LocalStorageModel._EVENT_LIST = [];

/**
 * 全局 storage 监听事件是否开启
 * @static
 * */
LocalStorageModel._LISTENER_ON = false;

/**
 * @summary 全局 storage 事件监听
 * @static
 * @desc    只执行一次，执行后将 LocalStorageModel._LISTENER_ON 设为 true，该监听事件只能由其他页面修改 localStorage 的数据时触发
 * */
LocalStorageModel._listen = function(){
	self.addEventListener('storage', function(e){
		let topic = e.key
			, newVal = e.newValue
			, oldVal = e.oldValue
			;

		if( LocalStorageModel._EVENT_LIST.length ){

			LocalStorageModel._EVENT_LIST.forEach((d)=>d(topic, newVal, oldVal));
		}
	});

	LocalStorageModel._LISTENER_ON = true;
};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
Model.register('localStorage', LocalStorageModel);

/**
 * 注册别名
 * */
Model.registerAlias('localStorage', 'ls');

export default LocalStorageModel;